import axios from 'axios'
import crypto from 'crypto'
import { logger } from '../utils/logger'

export interface PaymentResult {
  success: boolean
  transactionId?: string
  reference?: string
  status?: 'pending' | 'success' | 'failed'
  message?: string
  authorizationUrl?: string
}

export interface MomoPaymentData {
  amount: number
  phoneNumber: string
  network: 'mtn' | 'airteltigo'
  description?: string
  reference?: string
}

export interface PaystackPaymentData {
  amount: number
  email: string
  reference?: string
  callback_url?: string
}

class PaymentService {
  private paystackSecretKey: string
  private paystackPublicKey: string
  private mtnApiKey: string
  private mtnApiSecret: string
  private airteltigoApiKey: string
  private airteltigoApiSecret: string

  constructor() {
    this.paystackSecretKey = process.env.PAYSTACK_SECRET_KEY || ''
    this.paystackPublicKey = process.env.PAYSTACK_PUBLIC_KEY || ''
    this.mtnApiKey = process.env.MTN_API_KEY || ''
    this.mtnApiSecret = process.env.MTN_API_SECRET || ''
    this.airteltigoApiKey = process.env.AIRTELTIGO_API_KEY || ''
    this.airteltigoApiSecret = process.env.AIRTELTIGO_API_SECRET || ''
  }

  // Generate unique reference
  private generateReference(): string {
    return `ag_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`
  }

  // Paystack Integration
  async initiatePaystackPayment(data: PaystackPaymentData): Promise<PaymentResult> {
    try {
      if (!this.paystackSecretKey) {
        throw new Error('Paystack secret key not configured')
      }

      const reference = data.reference || this.generateReference()
      
      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email: data.email,
          amount: data.amount * 100, // Convert to kobo
          reference,
          callback_url: data.callback_url || `${process.env.FRONTEND_URL}/payment/callback`,
          currency: 'GHS',
          channels: ['card', 'bank', 'mobile_money']
        },
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data.status) {
        return {
          success: true,
          reference,
          authorizationUrl: response.data.data.authorization_url,
          status: 'pending'
        }
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to initialize payment'
        }
      }
    } catch (error: any) {
      logger.error('Paystack payment initialization error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Payment initialization failed'
      }
    }
  }

  async verifyPaystackPayment(reference: string): Promise<PaymentResult> {
    try {
      if (!this.paystackSecretKey) {
        throw new Error('Paystack secret key not configured')
      }

      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`
          }
        }
      )

      if (response.data.status && response.data.data.status === 'success') {
        return {
          success: true,
          reference,
          transactionId: response.data.data.id.toString(),
          status: 'success'
        }
      } else {
        return {
          success: false,
          reference,
          status: response.data.data.status === 'failed' ? 'failed' : 'pending',
          message: response.data.data.gateway_response || 'Payment verification failed'
        }
      }
    } catch (error: any) {
      logger.error('Paystack payment verification error:', error)
      return {
        success: false,
        reference,
        status: 'failed',
        message: error.response?.data?.message || 'Payment verification failed'
      }
    }
  }

  // MTN Mobile Money Integration
  async initiateMTNMomoPayment(data: MomoPaymentData): Promise<PaymentResult> {
    try {
      if (!this.mtnApiKey || !this.mtnApiSecret) {
        throw new Error('MTN MoMo API credentials not configured')
      }

      const reference = data.reference || this.generateReference()
      
      // MTN MoMo API endpoint (sandbox)
      const endpoint = process.env.NODE_ENV === 'production' 
        ? 'https://api.mtn.com/v1/requesttopay'
        : 'https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay'

      // Generate UUID for transaction
      const transactionId = crypto.randomUUID()

      const response = await axios.post(
        endpoint,
        {
          amount: data.amount.toString(),
          currency: 'GHS',
          externalId: reference,
          payer: {
            partyIdType: 'MSISDN',
            partyId: data.phoneNumber.replace('+233', '233')
          },
          payerMessage: data.description || 'KLYA AI Payment',
          payeeNote: 'KLYA AI Subscription'
        },
        {
          headers: {
            'X-Reference-Id': transactionId,
            'X-Target-Environment': process.env.NODE_ENV === 'production' ? 'live' : 'sandbox',
            'Ocp-Apim-Subscription-Key': this.mtnApiKey,
            'Authorization': `Bearer ${await this.getMTNAccessToken()}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.status === 202) {
        return {
          success: true,
          transactionId,
          reference,
          status: 'pending'
        }
      } else {
        return {
          success: false,
          message: 'Failed to initiate MTN MoMo payment'
        }
      }
    } catch (error: any) {
      logger.error('MTN MoMo payment error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'MTN MoMo payment failed'
      }
    }
  }

  async verifyMTNMomoPayment(transactionId: string): Promise<PaymentResult> {
    try {
      if (!this.mtnApiKey) {
        throw new Error('MTN MoMo API key not configured')
      }

      const endpoint = process.env.NODE_ENV === 'production'
        ? `https://api.mtn.com/v1/requesttopay/${transactionId}`
        : `https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay/${transactionId}`

      const response = await axios.get(endpoint, {
        headers: {
          'X-Target-Environment': process.env.NODE_ENV === 'production' ? 'live' : 'sandbox',
          'Ocp-Apim-Subscription-Key': this.mtnApiKey,
          'Authorization': `Bearer ${await this.getMTNAccessToken()}`
        }
      })

      const status = response.data.status
      return {
        success: status === 'SUCCESSFUL',
        transactionId,
        status: status === 'SUCCESSFUL' ? 'success' : status === 'FAILED' ? 'failed' : 'pending'
      }
    } catch (error: any) {
      logger.error('MTN MoMo verification error:', error)
      return {
        success: false,
        transactionId,
        status: 'failed',
        message: 'Verification failed'
      }
    }
  }

  // AirtelTigo Money Integration
  async initiateAirtelTigoPayment(data: MomoPaymentData): Promise<PaymentResult> {
    try {
      if (!this.airteltigoApiKey || !this.airteltigoApiSecret) {
        throw new Error('AirtelTigo API credentials not configured')
      }

      const reference = data.reference || this.generateReference()
      
      // AirtelTigo API endpoint (this is a placeholder - actual endpoint may vary)
      const endpoint = process.env.NODE_ENV === 'production'
        ? 'https://api.airteltigo.com.gh/v1/payments/request'
        : 'https://sandbox.airteltigo.com.gh/v1/payments/request'

      const response = await axios.post(
        endpoint,
        {
          amount: data.amount,
          currency: 'GHS',
          reference,
          phoneNumber: data.phoneNumber,
          description: data.description || 'KLYA AI Payment'
        },
        {
          headers: {
            'Authorization': `Bearer ${await this.getAirtelTigoAccessToken()}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data.success) {
        return {
          success: true,
          transactionId: response.data.transactionId,
          reference,
          status: 'pending'
        }
      } else {
        return {
          success: false,
          message: response.data.message || 'AirtelTigo payment failed'
        }
      }
    } catch (error: any) {
      logger.error('AirtelTigo payment error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'AirtelTigo payment failed'
      }
    }
  }

  async verifyAirtelTigoPayment(transactionId: string): Promise<PaymentResult> {
    try {
      if (!this.airteltigoApiKey) {
        throw new Error('AirtelTigo API key not configured')
      }

      const endpoint = process.env.NODE_ENV === 'production'
        ? `https://api.airteltigo.com.gh/v1/payments/status/${transactionId}`
        : `https://sandbox.airteltigo.com.gh/v1/payments/status/${transactionId}`

      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${await this.getAirtelTigoAccessToken()}`
        }
      })

      return {
        success: response.data.status === 'success',
        transactionId,
        status: response.data.status === 'success' ? 'success' : 
                response.data.status === 'failed' ? 'failed' : 'pending'
      }
    } catch (error: any) {
      logger.error('AirtelTigo verification error:', error)
      return {
        success: false,
        transactionId,
        status: 'failed',
        message: 'Verification failed'
      }
    }
  }

  // Helper methods for getting access tokens
  private async getMTNAccessToken(): Promise<string> {
    try {
      const endpoint = process.env.NODE_ENV === 'production'
        ? 'https://api.mtn.com/v1/oauth/token'
        : 'https://sandbox.momodeveloper.mtn.com/collection/token/'

      const response = await axios.post(endpoint, {}, {
        headers: {
          'Ocp-Apim-Subscription-Key': this.mtnApiKey,
          'Authorization': `Basic ${Buffer.from(`${this.mtnApiKey}:${this.mtnApiSecret}`).toString('base64')}`
        }
      })

      return response.data.access_token
    } catch (error) {
      logger.error('MTN access token error:', error)
      throw new Error('Failed to get MTN access token')
    }
  }

  private async getAirtelTigoAccessToken(): Promise<string> {
    try {
      const endpoint = process.env.NODE_ENV === 'production'
        ? 'https://api.airteltigo.com.gh/v1/oauth/token'
        : 'https://sandbox.airteltigo.com.gh/v1/oauth/token'

      const response = await axios.post(endpoint, {
        grant_type: 'client_credentials'
      }, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.airteltigoApiKey}:${this.airteltigoApiSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      return response.data.access_token
    } catch (error) {
      logger.error('AirtelTigo access token error:', error)
      throw new Error('Failed to get AirtelTigo access token')
    }
  }

  // Unified payment method
  async initiatePayment(
    method: 'paystack' | 'mtn_momo' | 'airteltigo_money',
    data: PaystackPaymentData | MomoPaymentData
  ): Promise<PaymentResult> {
    switch (method) {
      case 'paystack':
        return this.initiatePaystackPayment(data as PaystackPaymentData)
      case 'mtn_momo':
        return this.initiateMTNMomoPayment(data as MomoPaymentData)
      case 'airteltigo_money':
        return this.initiateAirtelTigoPayment(data as MomoPaymentData)
      default:
        return {
          success: false,
          message: 'Unsupported payment method'
        }
    }
  }

  async verifyPayment(
    method: 'paystack' | 'mtn_momo' | 'airteltigo_money',
    identifier: string
  ): Promise<PaymentResult> {
    switch (method) {
      case 'paystack':
        return this.verifyPaystackPayment(identifier)
      case 'mtn_momo':
        return this.verifyMTNMomoPayment(identifier)
      case 'airteltigo_money':
        return this.verifyAirtelTigoPayment(identifier)
      default:
        return {
          success: false,
          message: 'Unsupported payment method'
        }
    }
  }
}

export const paymentService = new PaymentService()
