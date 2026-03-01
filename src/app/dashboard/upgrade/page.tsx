'use client';

import { useState } from 'react';
import { Check, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

type Plan = 'pro' | 'business';
type PaymentMethod = 'mtn' | 'orange';

export default function UpgradePage() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<Plan>('pro');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mtn');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');

  const plans = {
    pro: {
      name: 'Pro',
      price: 5000,
      features: [
        'Unlimited products',
        'Advanced analytics',
        'Auto reminders',
        'Priority support',
      ],
    },
    business: {
      name: 'Business',
      price: 15000,
      features: [
        'Everything in Pro',
        'Team access (up to 5)',
        'Custom branding',
        'API access',
        'Dedicated support',
      ],
    },
  };

  const handlePayment = async () => {
    if (!phoneNumber) {
      setError('Phone number required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const endpoint = paymentMethod === 'mtn' 
        ? '/api/payments/mtn-momo'
        : '/api/payments/orange-money';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: plans[selectedPlan].price,
          plan: selectedPlan,
          phone_number: phoneNumber,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || 'Payment failed');
        return;
      }

      setPaymentId(result.payment_id);
      setStatus('pending');

      // Poll for payment status
      const pollInterval = setInterval(async () => {
        const statusResponse = await fetch(
          `/api/payments/status?payment_id=${result.payment_id}`
        );
        const statusResult = await statusResponse.json();

        if (statusResult.success && statusResult.status !== 'pending') {
          clearInterval(pollInterval);
          setStatus(statusResult.status);
          setLoading(false);
        }
      }, 3000);

      // Stop polling after 5 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        if (status === 'pending') {
          setError('Payment timeout. Please check status manually.');
          setLoading(false);
        }
      }, 300000);

    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      if (status !== 'pending') {
        setLoading(false);
      }
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
          <Check className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="font-display text-[32px] text-neutral-900 mb-3">Payment successful</h1>
        <p className="text-[15px] text-neutral-600 mb-8">
          Your account has been upgraded to {plans[selectedPlan].name}.
        </p>
        <a href="/dashboard">
          <button className="px-6 h-10 bg-neutral-900 text-white text-[14px] font-medium rounded-md hover:bg-neutral-800">
            Go to dashboard
          </button>
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-[28px] text-neutral-900">Upgrade</h1>
        <p className="text-[14px] text-neutral-600 mt-1">Choose a plan and payment method</p>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(plans).map(([key, plan]) => (
          <button
            key={key}
            onClick={() => setSelectedPlan(key as Plan)}
            className={`p-6 rounded-lg border-2 text-left transition-all ${
              selectedPlan === key
                ? 'border-neutral-900 bg-neutral-50'
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[17px] font-semibold text-neutral-900">{plan.name}</h3>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPlan === key ? 'border-neutral-900' : 'border-neutral-300'
              }`}>
                {selectedPlan === key && (
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
                )}
              </div>
            </div>
            <p className="text-[28px] font-display text-neutral-900 mb-4">
              {plan.price.toLocaleString()} FCFA<span className="text-[15px] text-neutral-600">/mo</span>
            </p>
            <ul className="space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-[13px] text-neutral-600">
                  <Check className="w-4 h-4 text-emerald-600" />
                  {feature}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      {/* Payment Method */}
      <div className="p-6 rounded-lg bg-white border border-neutral-200">
        <h2 className="text-[17px] font-semibold text-neutral-900 mb-4">Payment method</h2>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => setPaymentMethod('mtn')}
            className={`p-4 rounded-lg border-2 transition-all ${
              paymentMethod === 'mtn'
                ? 'border-neutral-900 bg-neutral-50'
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className="text-[14px] font-medium text-neutral-900">MTN Mobile Money</div>
          </button>

          <button
            onClick={() => setPaymentMethod('orange')}
            className={`p-4 rounded-lg border-2 transition-all ${
              paymentMethod === 'orange'
                ? 'border-neutral-900 bg-neutral-50'
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className="text-[14px] font-medium text-neutral-900">Orange Money</div>
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">
            {paymentMethod === 'mtn' ? 'MTN' : 'Orange'} number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-neutral-200 focus:border-neutral-900 focus:outline-none text-[15px]"
            placeholder="+237671234567"
          />
        </div>

        {error && (
          <div className="p-3 rounded-md bg-red-50 border border-red-200 mb-4">
            <p className="text-[13px] text-red-700">{error}</p>
          </div>
        )}

        {status === 'pending' && (
          <div className="p-4 rounded-md bg-blue-50 border border-blue-200 mb-4">
            <p className="text-[13px] text-blue-900 font-medium mb-1">Waiting for confirmation</p>
            <p className="text-[13px] text-blue-700">
              Please approve the payment on your phone ({phoneNumber})
            </p>
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading || !phoneNumber}
          className="w-full h-10 bg-neutral-900 text-white text-[14px] font-medium rounded-md hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Pay {plans[selectedPlan].price.toLocaleString()} FCFA
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
