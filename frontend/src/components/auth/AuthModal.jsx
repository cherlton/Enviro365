import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('0821234567');
  const [regAddress, setRegAddress] = useState('123 Sandton Drive, Johannesburg');
  const [regDob, setRegDob] = useState('1980-01-01');
  const [regRole, setRegRole] = useState('INVESTOR');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const data = await login(email, password);
      toast.success('Welcome back', `Logged in as ${data.name} (${data.role})`);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials');
      toast.error('Authentication Failed', err.message || 'Check email and password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const payload = {
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: regPhone,
        address: regAddress,
        dateOfBirth: regDob,
        role: regRole,
      };
      const data = await register(payload);
      toast.success('Account Created', `Registered & logged in as ${data.name} (${data.role})`);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed');
      toast.error('Registration Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const data = await login(demoEmail, demoPass);
      toast.success('Demo Login Success', `Logged in as ${data.name} (${data.role})`);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Quick login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Card */}
      <div className="relative bg-[#FFFDF9] border border-[#E8E3DB] rounded-[16px] shadow-2xl max-w-md w-full p-6 sm:p-7 z-10 font-sans my-auto animate-modal-pop max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E3DB]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-[#1A7A6D] text-white flex items-center justify-center font-bold text-[14px]">
              E365
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-[#1C1917]">Enviro365 Portal Login</h2>
              <p className="text-[12px] text-[#78716C]">Role Authentication & Access</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-[#78716C] hover:text-[#1C1917] p-1 rounded-full hover:bg-[#F5F1EC] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E8E3DB] mb-4">
          <button
            onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-[13px] font-semibold transition-colors border-b-2 ${
              activeTab === 'login'
                ? 'border-[#1A7A6D] text-[#1A7A6D]'
                : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-[13px] font-semibold transition-colors border-b-2 ${
              activeTab === 'register'
                ? 'border-[#1A7A6D] text-[#1A7A6D]'
                : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-[8px] text-[12px] text-[#991B1B]">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-[#57534E] mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. sipho.ndlovu@example.com"
                className="w-full px-3 py-2 border border-[#E8E3DB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#1A7A6D]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#57534E] mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-[#E8E3DB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#1A7A6D]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-[#1A7A6D] hover:bg-[#13655A] text-white font-medium text-[13px] rounded-[8px] transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Authenticating...' : 'Log In to Dashboard'}
            </button>
          </form>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            <div>
              <label className="block text-[12px] font-medium text-[#57534E] mb-1">Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRegRole('INVESTOR')}
                  className={`py-1.5 text-[12px] font-medium rounded-[6px] border ${
                    regRole === 'INVESTOR'
                      ? 'bg-[#E8F5F2] border-[#1A7A6D] text-[#13655A]'
                      : 'border-[#E8E3DB] text-[#57534E]'
                  }`}
                >
                  Investor
                </button>
                <button
                  type="button"
                  onClick={() => setRegRole('ADMIN')}
                  className={`py-1.5 text-[12px] font-medium rounded-[6px] border ${
                    regRole === 'ADMIN'
                      ? 'bg-[#E8F5F2] border-[#1A7A6D] text-[#13655A]'
                      : 'border-[#E8E3DB] text-[#57534E]'
                  }`}
                >
                  Admin User
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#57534E] mb-1">Full Name</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Nomvula Khumalo"
                className="w-full px-3 py-1.5 border border-[#E8E3DB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#1A7A6D]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#57534E] mb-1">Email Address</label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="nomvula@example.com"
                className="w-full px-3 py-1.5 border border-[#E8E3DB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#1A7A6D]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#57534E] mb-1">Password</label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-1.5 border border-[#E8E3DB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#1A7A6D]"
              />
            </div>

            {regRole === 'INVESTOR' && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[12px] font-medium text-[#57534E] mb-1">Phone (SA)</label>
                    <input
                      type="text"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="0821234567"
                      className="w-full px-3 py-1.5 border border-[#E8E3DB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#1A7A6D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#57534E] mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={regDob}
                      onChange={(e) => setRegDob(e.target.value)}
                      className="w-full px-3 py-1.5 border border-[#E8E3DB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#1A7A6D]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#57534E] mb-1">Physical Address</label>
                  <input
                    type="text"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="123 Street Name, City"
                    className="w-full px-3 py-1.5 border border-[#E8E3DB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#1A7A6D]"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-[#1A7A6D] hover:bg-[#13655A] text-white font-medium text-[13px] rounded-[8px] transition-colors shadow-sm disabled:opacity-50 cursor-pointer mt-2"
            >
              {isSubmitting ? 'Creating Account...' : 'Register Account'}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
