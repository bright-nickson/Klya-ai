'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { PaymentMethods } from './PaymentMethods';
import type { PaymentMethod as PaymentMethodType, MobileMoneyProvider } from './PaymentMethods';

interface CheckoutFormProps {
  plan: {
    name: string;
    price: number;
    features: string[];
  };
  onSuccess?: () => void;
}

export function CheckoutForm({ plan, onSuccess }: CheckoutFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  
  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType | null>(null);
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState<MobileMoneyProvider>('mtn');
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankCode, setBankCode] = useState('');
  
  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [termsAccepted, setTermsAccepted] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Basic info validation
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Payment method validation
    if (!paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    } else {
      // Mobile money validation
      if (paymentMethod === 'mobile_money') {
        if (!mobileMoneyNumber) {
          newErrors.mobileMoneyNumber = 'Mobile money number is required';
        } else if (!/^0[0-9]{9}$/.test(mobileMoneyNumber)) {
          newErrors.mobileMoneyNumber = 'Please enter a valid Ghanaian phone number';
        }
      }
      
      // Card validation
      if (paymentMethod === 'card') {
        if (!cardNumber.replace(/\s/g, '')) newErrors.cardNumber = 'Card number is required';
        if (!cardExpiry) newErrors.cardExpiry = 'Expiry date is required';
        if (!cardCvc) newErrors.cardCvc = 'CVC is required';
      }
      
      // Bank transfer validation
      if (paymentMethod === 'bank_transfer') {
        if (!bankAccountNumber) newErrors.bankAccountNumber = 'Account number is required';
        if (!bankCode) newErrors.bankCode = 'Please select a bank';
      }
    }
    
    // Terms and conditions
    if (!termsAccepted) {
      newErrors.terms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Prepare payment data based on selected method
      const paymentData = {
        plan: plan.name,
        amount: plan.price,
        paymentMethod,
        ...(paymentMethod === 'mobile_money' && {
          provider: mobileMoneyProvider,
          phoneNumber: `+233${mobileMoneyNumber.substring(1)}`,
        }),
        ...(paymentMethod === 'card' && {
          cardNumber: cardNumber.replace(/\s/g, ''),
          expiry: cardExpiry,
          cvc: cardCvc,
        }),
        ...(paymentMethod === 'bank_transfer' && {
          bankCode,
          accountNumber: bankAccountNumber,
        }),
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Use the success method directly from useToast
      toast.success("Your payment has been processed successfully!");
      
      onSuccess?.();
      router.push('/dashboard');
    } catch (error) {
      console.error('Payment error:', error);
      // Use the error method directly from useToast
      toast.error("There was an error processing your payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Contact Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName" 
              type="text" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={errors.firstName ? 'border-destructive' : ''}
            />
            {errors.firstName && (
              <p className="text-sm text-destructive mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName" 
              type="text" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={errors.lastName ? 'border-destructive' : ''}
            />
            {errors.lastName && (
              <p className="text-sm text-destructive mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <PaymentMethods
          selectedMethod={paymentMethod}
          onMethodChange={setPaymentMethod}
          mobileMoneyProvider={mobileMoneyProvider}
          onMobileMoneyProviderChange={setMobileMoneyProvider}
          mobileMoneyNumber={mobileMoneyNumber}
          onMobileMoneyNumberChange={setMobileMoneyNumber}
          cardNumber={cardNumber}
          onCardNumberChange={setCardNumber}
          cardExpiry={cardExpiry}
          onCardExpiryChange={setCardExpiry}
          cardCvc={cardCvc}
          onCardCvcChange={setCardCvc}
          bankAccountNumber={bankAccountNumber}
          onBankAccountNumberChange={setBankAccountNumber}
          bankCode={bankCode}
          onBankCodeChange={setBankCode}
          errors={{
            mobileMoneyNumber: errors.mobileMoneyNumber,
            cardNumber: errors.cardNumber,
            cardExpiry: errors.cardExpiry,
            cardCvc: errors.cardCvc,
            bankAccountNumber: errors.bankAccountNumber,
            bankCode: errors.bankCode,
          }}
        />
        {errors.paymentMethod && (
          <p className="text-sm text-destructive">{errors.paymentMethod}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the{' '}
              <a href="/terms" className="text-primary hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </label>
            <p className="text-sm text-muted-foreground">
              You'll be charged {plan.price} GHS per month. Cancel anytime.
            </p>
          </div>
        </div>
        {errors.terms && (
          <p className="text-sm text-destructive">{errors.terms}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ${plan.price} GHS / month`
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        You'll be redirected to complete your payment securely
      </p>
    </form>
  )
}

export default CheckoutForm