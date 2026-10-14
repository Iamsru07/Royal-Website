import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  UtensilsCrossed,
  Phone,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  ShieldCheck,
  Mail,
  KeyRound,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Modal } from '../../components/common/Modal';

export const LoginPage: React.FC = () => {
  const { authenticateUser, selectedTable, showToast } = useRestaurant();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Tab: 'customer' or 'admin'
  const initialMode = searchParams.get('mode') === 'admin' ? 'admin' : 'customer';
  const [loginMode, setLoginMode] = useState<'customer' | 'admin'>(initialMode);

  // Sync mode with query parameter if changed externally
  useEffect(() => {
    if (searchParams.get('mode') === 'admin') {
      setLoginMode('admin');
    }
  }, [searchParams]);

  // Customer Form State
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userNotFound, setUserNotFound] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotPhone, setForgotPhone] = useState('');

  // Admin Form State
  // Required: Email: skrehanumar07@gmail.com | Password: Iamsru@07 | Security Code: 823715
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminStep, setAdminStep] = useState<1 | 2>(1); // 1 = credentials, 2 = 6-digit code
  const [adminSecurityCode, setAdminSecurityCode] = useState('');
  const [adminError, setAdminError] = useState('');

  // ---------------- Customer Handlers ----------------
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(digits);
    setErrorMessage('');
    setUserNotFound(false);
  };

  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setUserNotFound(false);

    if (!phone || phone.length !== 10) {
      const msg =
        phone.length === 0
          ? 'Please enter your 10-digit mobile number'
          : `Invalid mobile number: Exactly 10 digits required (you entered ${phone.length} digits)`;
      setErrorMessage(msg);
      showToast(msg, 'error');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your password');
      showToast('Please enter your password', 'error');
      return;
    }

    const result = authenticateUser(phone, password);

    if (result.status === 'SUCCESS') {
      showToast(`Welcome back, ${result.customer?.name || 'Diner'}!`, 'success');
      navigate(`/menu?table=${selectedTable}`);
    } else if (result.status === 'USER_NOT_FOUND') {
      setUserNotFound(true);
      setErrorMessage(result.message);
      showToast('Account not found. Please create an account.', 'error');
    } else if (result.status === 'WRONG_PASSWORD') {
      setErrorMessage(result.message);
      showToast('Incorrect password for this mobile number.', 'error');
    }
  };

  // ---------------- Admin Handlers ----------------
  const handleAdminStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    const trimmedEmail = adminEmail.trim().toLowerCase();
    const targetEmail = 'skrehanumar07@gmail.com'.toLowerCase();
    const targetPassword = 'Iamsru@07';

    // Validate email and password exactly
    if (trimmedEmail !== targetEmail || adminPassword !== targetPassword) {
      const msg = 'Wrong password or invalid email address! Access denied.';
      setAdminError(msg);
      showToast('Wrong password or email. Access denied.', 'error');
      return;
    }

    // Credentials match! Move to Step 2 (Security Code)
    setAdminError('');
    setAdminStep(2);
    showToast('Credentials verified. Please enter the 6-digit Admin Security Code.', 'info');
  };

  const handleAdminStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    const targetCode = '823715';
    const cleanCode = adminSecurityCode.trim();

    if (cleanCode !== targetCode) {
      const msg = 'Wrong security code! Please enter the valid 6-digit admin code.';
      setAdminError(msg);
      showToast('Wrong security code! Access denied.', 'error');
      return;
    }

    // Security Code is valid! Authenticate admin
    try {
      sessionStorage.setItem('royal_taste_admin_authenticated', 'true');
      localStorage.setItem('royal_taste_admin_authenticated', 'true');
    } catch (err) {
      console.warn('Storage error:', err);
    }

    showToast('Admin verification successful! Opening Admin Portal...', 'success');
    navigate('/admin');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanForgot = forgotPhone.replace(/\D/g, '').slice(0, 10);
    if (cleanForgot.length !== 10) {
      showToast('Invalid mobile number: Exactly 10 digits required', 'error');
      return;
    }
    showToast(`Password reset OTP sent to +91 ${cleanForgot}`, 'info');
    setIsForgotModalOpen(false);
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-16 px-4">
      {/* Top Switcher: Customer vs Admin Portal */}
      <div className="flex items-center justify-center p-1 bg-neutral-100 rounded-2xl mb-6 shadow-2xs">
        <button
          type="button"
          onClick={() => {
            setLoginMode('customer');
            setSearchParams({});
            setErrorMessage('');
            setAdminError('');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            loginMode === 'customer'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4 text-amber-600" />
          <span>Customer Sign In</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setLoginMode('admin');
            setSearchParams({ mode: 'admin' });
            setErrorMessage('');
            setAdminError('');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            loginMode === 'admin'
              ? 'bg-neutral-900 text-white shadow-sm'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Admin Portal 🔐</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* CASE 1: CUSTOMER / DINER SIGN IN */}
      {/* ============================================================== */}
      {loginMode === 'customer' && (
        <div className="bg-white rounded-3xl border border-neutral-100 p-6 sm:p-8 shadow-xs animate-in fade-in duration-200">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 font-serif-brand">
              Welcome Back
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Sign in to track orders, save dietary preferences, and view dining history.
            </p>
          </div>

          {/* Account Not Found Banner with Create Account Option */}
          {userNotFound && (
            <div className="mb-4 p-3.5 bg-amber-50/90 border border-amber-200 rounded-2xl text-left space-y-2">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-amber-950">
                    Account Not Found! (अकाउंट नहीं मिला)
                  </p>
                  <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                    Mobile number <span className="font-mono font-bold">+91 {phone}</span> par koi account registered nahi hai.
                  </p>
                </div>
              </div>
              <div className="pt-1 flex items-center gap-2">
                <Link
                  to={`/register?phone=${phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Create Account Now (नया खाता बनाएं)</span>
                </Link>
              </div>
            </div>
          )}

          {/* Error message alert */}
          {errorMessage && !userNotFound && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-medium text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleCustomerLogin} className="space-y-4">
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-neutral-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-[11px] font-semibold text-amber-700 hover:text-amber-800"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 text-xs sm:text-sm text-neutral-900 rounded-xl border border-neutral-200 focus:border-amber-600 focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors mt-2 cursor-pointer"
            >
              <span>Sign In to Table</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-neutral-100 text-center">
            <p className="text-xs text-neutral-500">
              Don't have a dining account?{' '}
              <Link
                to={phone.length === 10 ? `/register?phone=${phone}` : '/register'}
                className="font-bold text-amber-700 hover:text-amber-800"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CASE 2: RESTAURANT ADMIN PORTAL LOGIN (WITH 2-STEP CODE) */}
      {/* ============================================================== */}
      {loginMode === 'admin' && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-lg animate-in fade-in duration-200 relative overflow-hidden">
          {/* Top Decorative Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-md border border-neutral-800">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Authorized Staff Only
            </span>
            <h1 className="text-2xl font-bold text-neutral-900 font-serif-brand mt-1.5">
              Admin Portal Login
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Secure restaurant dashboard, billing, orders & pre-booking controls.
            </p>
          </div>

          {/* Admin Error Alert */}
          {adminError && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs font-semibold text-red-700 animate-shake">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <div>
                <p className="font-bold text-red-900">Access Denied</p>
                <p className="text-[11px] font-normal text-red-700 mt-0.5">{adminError}</p>
              </div>
            </div>
          )}

          {/* STEP 1: Email & Password */}
          {adminStep === 1 && (
            <form onSubmit={handleAdminStep1} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => {
                      setAdminEmail(e.target.value);
                      setAdminError('');
                    }}
                    placeholder="skrehanumar07@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 text-xs sm:text-sm text-neutral-900 rounded-xl border border-neutral-200 focus:border-amber-600 focus:bg-white focus:outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      setAdminError('');
                    }}
                    placeholder="Enter admin password"
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 text-xs sm:text-sm text-neutral-900 rounded-xl border border-neutral-200 focus:border-amber-600 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors mt-2 cursor-pointer"
              >
                <span>Verify Credentials → Step 2</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </form>
          )}

          {/* STEP 2: 6-Digit Admin Security Code */}
          {adminStep === 2 && (
            <form onSubmit={handleAdminStep2} className="space-y-4">
              <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                    <span>2-Step Verification</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                    ✓ Email & Pass Verified
                  </span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Logged in as <strong className="font-mono">{adminEmail}</strong>. Please enter the 6-digit Secret Security Code to unlock the admin dashboard.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Enter 6-Digit Security Code *
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="password"
                    required
                    maxLength={6}
                    autoFocus
                    value={adminSecurityCode}
                    onChange={(e) => {
                      setAdminSecurityCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                      setAdminError('');
                    }}
                    placeholder="Enter 6-digit code (e.g. 823715)"
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 text-base font-mono font-bold tracking-widest text-neutral-900 rounded-xl border border-neutral-300 focus:border-amber-600 focus:bg-white focus:outline-none transition-all text-center"
                  />
                </div>
                <p className="text-[11px] text-neutral-400 mt-1 text-center font-mono">
                  {adminSecurityCode.length}/6 digits entered
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAdminStep(1);
                    setAdminSecurityCode('');
                    setAdminError('');
                  }}
                  className="px-3.5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Unlock Admin Portal</span>
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-neutral-100 text-center">
            <button
              type="button"
              onClick={() => {
                setLoginMode('customer');
                setSearchParams({});
                setAdminError('');
              }}
              className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              ← Return to Diner Customer Login
            </button>
          </div>
        </div>
      )}

      {/* Forgot Password Modal for Customers */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Reset Password"
        subtitle="Enter your 10-digit mobile number to receive a one-time OTP"
        maxWidth="sm"
      >
        <form onSubmit={handleForgotSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Registered Mobile Number (10 Digits)
            </label>
            <input
              type="tel"
              required
              maxLength={10}
              placeholder="Enter 10-digit mobile number"
              value={forgotPhone}
              onChange={(e) => setForgotPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 bg-neutral-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-xl cursor-pointer"
            >
              Send OTP
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
