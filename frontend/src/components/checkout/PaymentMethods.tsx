'use client';

import { useState } from 'react';

export type PaymentMethod = 'mobile_money' | 'card' | 'bank_transfer';
export type MobileMoneyProvider = 'mtn' | 'vodafone' | 'airteltigo';

// Simple card component
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`border rounded-lg p-4 ${className}`}>
    {children}
  </div>
);

// Simple select component
const Select = ({
  value,
  onChange,
  children,
  className = '',
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm ${className}`}
  >
    {children}
  </select>
);

const SelectItem = ({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) => (
  <option value={value}>
    {children}
  </option>
);

// Simple radio group
const RadioGroup = ({
  value,
  onValueChange,
  children,
  className = '',
}: {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <div 
    className={`space-y-2 ${className}`}
    role="radiogroup"
    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onValueChange(e.target.value)}
  >
    {children}
  </div>
);

const RadioGroupItem = ({
  id,
  value,
  checked,
  onChange,
  children,
}: {
  id: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) => (
  <div className="flex items-center space-x-2">
    <input
      type="radio"
      id={id}
      name="payment-method"
      value={value}
      checked={checked}
      onChange={() => onChange(value)}
      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
    />
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700"
    >
      {children}
    </label>
  </div>
);

// Simple input component
const Input = ({
  id,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  className = '',
  ...props
}: {
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  [key: string]: any;
}) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${className}`}
    {...props}
  />
);

// Simple label component
const Label = ({
  htmlFor,
  children,
  className = '',
}: {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <label
    htmlFor={htmlFor}
    className={`block text-sm font-medium text-gray-700 ${className}`}
  >
    {children}
  </label>
);

interface PaymentMethodsProps {
  selectedMethod: PaymentMethod | null;
  onMethodChange: (method: PaymentMethod) => void;
  mobileMoneyProvider: MobileMoneyProvider;
  onMobileMoneyProviderChange: (provider: MobileMoneyProvider) => void;
  mobileMoneyNumber: string;
  onMobileMoneyNumberChange: (number: string) => void;
  cardNumber: string;
  onCardNumberChange: (number: string) => void;
  cardExpiry: string;
  onCardExpiryChange: (expiry: string) => void;
  cardCvc: string;
  onCardCvcChange: (cvc: string) => void;
  bankAccountNumber: string;
  onBankAccountNumberChange: (number: string) => void;
  bankCode: string;
  onBankCodeChange: (code: string) => void;
  errors?: {
    mobileMoneyNumber?: string;
    cardNumber?: string;
    cardExpiry?: string;
    cardCvc?: string;
    bankAccountNumber?: string;
    bankCode?: string;
  };
}

export function PaymentMethods({
  selectedMethod,
  onMethodChange,
  mobileMoneyProvider,
  onMobileMoneyProviderChange,
  mobileMoneyNumber,
  onMobileMoneyNumberChange,
  cardNumber,
  onCardNumberChange,
  cardExpiry,
  onCardExpiryChange,
  cardCvc,
  onCardCvcChange,
  bankAccountNumber,
  onBankAccountNumberChange,
  bankCode,
  onBankCodeChange,
  errors = {}
}: PaymentMethodsProps) {
  // Format card number to add spaces every 4 digits
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
    onCardNumberChange(formatted);
  };

  // Format expiry date as MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    onCardExpiryChange(value);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Payment Method</h3>
      <RadioGroup
        value={selectedMethod || ''}
        onValueChange={(value) => onMethodChange(value as PaymentMethod)}
      >
        {/* Mobile Money Option */}
        <div className="flex items-center space-x-3">
            <RadioGroupItem 
              id="mobile-money" 
              value="mobile_money" 
              checked={selectedMethod === 'mobile_money'}
              onChange={() => onMethodChange('mobile_money')}
            >
              <div className="font-medium">Mobile Money</div>
              <p className="text-sm text-gray-500">
                Pay with MTN, Vodafone, or AirtelTigo
              </p>
            </RadioGroupItem>
        </div>

        {selectedMethod === 'mobile_money' && (
          <Card className="ml-6 border-l-2 border-blue-500">
            <div className="space-y-4">
              <div>
                <Label htmlFor="mobile-provider">Mobile Network</Label>
                <Select
                  value={mobileMoneyProvider}
                  onChange={(value) => onMobileMoneyProviderChange(value as MobileMoneyProvider)}
                >
                  <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                  <SelectItem value="vodafone">Vodafone Cash</SelectItem>
                  <SelectItem value="airteltigo">AirtelTigo Money</SelectItem>
                </Select>
              </div>
              <div>
                <Label htmlFor="mobile-number">Phone Number</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm text-gray-500">+233</span>
                  <Input
                    id="mobile-number"
                    type="tel"
                    placeholder="24 123 4567"
                    className="pl-12"
                    value={mobileMoneyNumber}
                    onChange={(e) => onMobileMoneyNumberChange(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                {errors.mobileMoneyNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.mobileMoneyNumber}</p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Card Option */}
     <RadioGroupItem 
  id="card" 
  value="card" 
  checked={selectedMethod === 'card'}
  onChange={() => onMethodChange('card')}
>
  <div className="font-medium">Credit/Debit Card</div>
  <p className="text-sm text-gray-500">
    Pay with Visa, Mastercard, or other cards
  </p>
</RadioGroupItem>
     

        {selectedMethod === 'card' && (
          <Card className="ml-6 border-l-2 border-blue-500">
            <div className="space-y-4">
              <div>
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                />
                {errors.cardNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                  />
                  {errors.cardExpiry && (
                    <p className="mt-1 text-sm text-red-600">{errors.cardExpiry}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) => onCardCvcChange(e.target.value.replace(/\D/g, ''))}
                    maxLength={4}
                  />
                  {errors.cardCvc && (
                    <p className="mt-1 text-sm text-red-600">{errors.cardCvc}</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Bank Transfer Option */}
        <div className="flex items-center space-x-3 mt-4">
                  <RadioGroupItem 
                    id="bank-transfer" 
                    value="bank_transfer" 
                    checked={selectedMethod === 'bank_transfer'}
                    onChange={() => onMethodChange('bank_transfer')}
                  >
                    <div className="font-medium">Bank Transfer</div>
                    <p className="text-sm text-gray-500">
                      Make a direct bank transfer
                    </p>
                  </RadioGroupItem>
          </div>

        {selectedMethod === 'bank_transfer' && (
          <Card className="ml-6 border-l-2 border-blue-500">
            <div className="space-y-4">
              <div>
                <Label htmlFor="bank-account">Account Number</Label>
                <Input
                  id="bank-account"
                  placeholder="Enter account number"
                  value={bankAccountNumber}
                  onChange={(e) => onBankAccountNumberChange(e.target.value)}
                />
                {errors.bankAccountNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.bankAccountNumber}</p>
                )}
              </div>
              <div>
                <Label htmlFor="bank">Bank</Label>
                <Select
                  value={bankCode}
                  onChange={onBankCodeChange}
                >
                  <SelectItem value="">Select bank</SelectItem>
                  <SelectItem value="gcb">GCB Bank</SelectItem>
                  <SelectItem value="ecobank">Ecobank</SelectItem>
                  <SelectItem value="fidelity">Fidelity Bank</SelectItem>
                  <SelectItem value="cal">CAL Bank</SelectItem>
                </Select>
                {errors.bankCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.bankCode}</p>
                )}
              </div>
            </div>
          </Card>
        )}
      </RadioGroup>
    </div>
  );
}

export default PaymentMethods;