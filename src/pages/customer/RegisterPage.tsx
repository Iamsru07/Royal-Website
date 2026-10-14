import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { UtensilsCrossed, User, Phone, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export const RegisterPage: React.FC = () => {
  const { registerUser, selectedTable, showToast } = useRestaurant();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(digits);
    setErrorMessage('');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name');
      showToast('Please enter your full name', 'error');
      return;
    }

    // 10-digit strict check
    if (phone.length !== 10) {
      const msg = phone.length === 0
        ? 'Please enter your 10-digit mobile number'
        : `Invalid mobile number: Exactly 10 digits required (you entered ${phone.length} digits)`;
      setErrorMessage(msg);
      showToast(msg, 'error');
      return;
    }

    if (!password || password.length < 4) {
      setErrorMessage('Password must be at least 4 characters long');
      showToast('Password must be at least 4 characters long', 'error');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      showToast('Passwords do not match', 'error');
      return;
    }

    // Register user & save to Admin Panel User Details
    const result = registerUser(name, phone, password);

    if (result.success) {
      navigate(`/menu?table=${selectedTable}`);
    } else {
      setErrorMessage(result.message);
      showToast(result.message, 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-14">
      <div className="bg-white rounded-3xl border border-neutral-100 p-6 sm:p-8 shadow-xs">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 font-serif-brand">
            Create Dining Account
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Enjoy seamless table reordering, priority seating, and order history.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-medium text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 text-xs sm:text-sm text-neutral-900 rounded-xl border border-neutral-200 focus:border-amber-600 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-neutral-700">
                Mobile Number (10 Digits)
              </label>
              {phone.length === 10 && (
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>10 Digits Valid</span>
                </span>
              )}
            </div>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Enter 10-digit mobile number"
                className={`w-full pl-10 pr-4 py-2.5 bg-neutral-50 text-xs sm:text-sm text-neutral-900 rounded-xl border transition-all focus:bg-white focus:outline-none ${
                  phone.length > 0 && phone.length < 10
                    ? 'border-red-400 focus:border-red-500'
                    : phone.length === 10
                    ? 'border-emerald-400 focus:border-emerald-500'
                    : 'border-neutral-200 focus:border-amber-600'
                }`}
              />
            </div>
            {phone.length > 0 && phone.length < 10 && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                <span>⚠️ Invalid: Please enter exactly 10 digits ({phone.length}/10 entered)</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create secure password"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 text-xs sm:text-sm text-neutral-900 rounded-xl border border-neutral-200 focus:border-amber-600 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 text-xs sm:text-sm text-neutral-900 rounded-xl border border-neutral-200 focus:border-amber-600 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors mt-2 cursor-pointer"
          >
            <span>Create Account & Continue</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-neutral-100 text-center">
          <p className="text-xs text-neutral-500">
            Already have an account?{' '}
            <Link
              to={phone.length === 10 ? `/login?phone=${phone}` : '/login'}
              className="font-bold text-amber-700 hover:text-amber-800"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
