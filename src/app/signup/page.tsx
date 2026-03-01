'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { isValidCameroonPhone, isValidUsername } from '@/lib/utils';

export default function SignupPage() {
  const [step, setStep] = useState<'info' | 'otp'>('info');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    whatsappNumber: '',
    username: '',
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name required';
    if (!formData.whatsappNumber) {
      newErrors.whatsappNumber = 'WhatsApp number required';
    } else if (!isValidCameroonPhone(formData.whatsappNumber)) {
      newErrors.whatsappNumber = 'Use format: +237XXXXXXXXX';
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Username required';
    } else if (!isValidUsername(formData.username)) {
      newErrors.username = 'Letters, numbers, - and _ only';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatsapp_number: formData.whatsappNumber,
          action: 'signup',
        }),
      });

      const result = await response.json();
      if (!result.success) {
        setErrors({ submit: result.error || 'An error occurred' });
        return;
      }

      if (result.dev_otp && process.env.NODE_ENV === 'development') {
        console.log('Dev OTP:', result.dev_otp);
      }
      
      setStep('otp');
      setErrors({});
    } catch (error) {
      setErrors({ submit: 'Connection error. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return;

    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatsapp_number: formData.whatsappNumber,
          code: otpCode,
          username: formData.username,
          full_name: formData.fullName,
        }),
      });

      const result = await response.json();
      if (!result.success) {
        setErrors({ otp: result.error || 'Invalid code' });
        return;
      }
      
      window.location.href = '/dashboard';
    } catch (error) {
      setErrors({ otp: 'Connection error. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.cdnfonts.com/css/cal-sans');
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #FAFAFA;
        }
        .font-display {
          font-family: 'Cal Sans', -apple-system, sans-serif;
          letter-spacing: -0.02em;
        }
      `}</style>

      <div className="min-h-screen flex flex-col">
        <header className="px-6 py-6">
          <Link href="/" className="flex items-center gap-2.5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            <span className="text-[15px] font-semibold">LinkPro</span>
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-sm">
            <div className="flex gap-2 mb-8">
              <div className={`h-1 flex-1 rounded-full ${step === 'info' ? 'bg-neutral-900' : 'bg-neutral-200'}`} />
              <div className={`h-1 flex-1 rounded-full ${step === 'otp' ? 'bg-neutral-900' : 'bg-neutral-200'}`} />
            </div>

            {step === 'info' ? (
              <>
                <div className="mb-8">
                  <h1 className="font-display text-[32px] text-neutral-900 mb-2">Create your store</h1>
                  <p className="text-[15px] text-neutral-600">Start selling in under 2 minutes.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">Full name</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`w-full h-10 px-3 rounded-md border ${errors.fullName ? 'border-red-300' : 'border-neutral-200'} focus:border-neutral-900 focus:outline-none text-[15px]`}
                      placeholder="Marie Fotso"
                    />
                    {errors.fullName && <p className="mt-1.5 text-[13px] text-red-600">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">WhatsApp number</label>
                    <input
                      type="tel"
                      value={formData.whatsappNumber}
                      onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                      className={`w-full h-10 px-3 rounded-md border ${errors.whatsappNumber ? 'border-red-300' : 'border-neutral-200'} focus:border-neutral-900 focus:outline-none text-[15px]`}
                      placeholder="+237671234567"
                    />
                    {errors.whatsappNumber && <p className="mt-1.5 text-[13px] text-red-600">{errors.whatsappNumber}</p>}
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">Username</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-neutral-500">linkpro.cm/</span>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value.toLowerCase())}
                        className={`w-full h-10 pl-[100px] pr-3 rounded-md border ${errors.username ? 'border-red-300' : 'border-neutral-200'} focus:border-neutral-900 focus:outline-none text-[15px]`}
                        placeholder="marie_shop"
                      />
                    </div>
                    {errors.username && <p className="mt-1.5 text-[13px] text-red-600">{errors.username}</p>}
                  </div>

                  {errors.submit && (
                    <div className="p-3 rounded-md bg-red-50 border border-red-200">
                      <p className="text-[13px] text-red-700">{errors.submit}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-10 bg-neutral-900 text-white text-[14px] font-medium rounded-md hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-[13px] text-neutral-600">
                  Have an account? <Link href="/login" className="font-medium text-neutral-900 hover:underline">Sign in</Link>
                </p>
              </>
            ) : (
              <>
                <div className="mb-8">
                  <h1 className="font-display text-[32px] text-neutral-900 mb-2">Verify your number</h1>
                  <p className="text-[15px] text-neutral-600">Code sent to {formData.whatsappNumber}</p>
                </div>

                <div className="mb-6">
                  <div className="flex gap-2 mb-4">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value.replace(/\D/g, ''))}
                        className="w-full h-12 text-center text-[20px] font-semibold rounded-md border border-neutral-200 focus:border-neutral-900 focus:outline-none"
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>

                  {errors.otp && (
                    <div className="p-3 rounded-md bg-red-50 border border-red-200 mb-4">
                      <p className="text-[13px] text-red-700 text-center">{errors.otp}</p>
                    </div>
                  )}

                  <div className="text-center">
                    <button onClick={() => handleSubmit(new Event('submit') as any)} className="text-[13px] text-neutral-600 hover:text-neutral-900 font-medium">
                      Resend code
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.join('').length !== 6}
                  className="w-full h-10 bg-neutral-900 text-white text-[14px] font-medium rounded-md hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Create account
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="mt-6 text-center">
                  <button onClick={() => { setStep('info'); setOtp(['', '', '', '', '', '']); setErrors({}); }} className="text-[13px] text-neutral-600 hover:text-neutral-900">
                    ← Change number
                  </button>
                </p>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
