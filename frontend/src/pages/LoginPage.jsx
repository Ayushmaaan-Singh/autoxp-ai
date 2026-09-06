import React, { useState } from 'react';
import { loginUser, registerUser } from '../utils/auth';

export default function LoginPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (isRegister && !form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (isRegister && form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      const data = isRegister
        ? await registerUser(form.name, form.email, form.password)
        : await loginUser(form.email, form.password);
      onLogin(data.user);
    } catch (err) {
      setErrors({ form: err.message || 'Authentication failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050505]">
      {/* ── Animated Background ── */}
      <div className="absolute inset-0 bg-grid-lux opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-transparent to-[#0A0A0A]"></div>

      {/* ── Floating glow orbs ── */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lux/5 rounded-full blur-3xl login-float-1"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-lux/3 rounded-full blur-3xl login-float-2"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lux/[0.02] rounded-full blur-3xl"></div>

      {/* ── Decorative lines ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-40 bg-gradient-to-b from-transparent via-lux/20 to-transparent"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-40 bg-gradient-to-t from-transparent via-lux/20 to-transparent"></div>

      {/* ── Main Card ── */}
      <div className="relative z-10 w-full max-w-md mx-4 anim-fade">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-lux/10 border border-lux/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-lux" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 00-.879-2.121l-1.44-1.44A2.999 2.999 0 0016.35 9H14.25m3 9H6.75m0-12H5.625c-.621 0-1.125.504-1.125 1.125v6m0 0H14.25m0 0v-3.375c0-.621.504-1.125 1.125-1.125h1.975" />
              </svg>
            </div>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white tracking-tight">
            AUTO<span className="text-lux">XP</span>
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mt-2">
            Premium AI Car Marketplace
          </p>
        </div>

        {/* Glass Card */}
        <div className="glass-panel gold-border p-8 login-card-glow">
          <div className="text-center mb-8">
            <h2 className="font-serif text-xl font-semibold text-white mb-1">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-gray-400">
              {isRegister ? 'Join the premium marketplace' : 'Sign in to continue'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.form && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center">
                {errors.form}
              </div>
            )}
            
            {/* Name — Register only */}
            {isRegister && (
              <div className="anim-fade">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <input
                    id="login-name"
                    type="text"
                    placeholder="Alexander Pierce"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    className={`inp-lux w-full pl-11 pr-4 py-3 rounded-lg text-sm ${errors.name ? 'border-red-500/70 focus:border-red-500 focus:shadow-[0_0_0_1px_#ef4444]' : ''}`}
                  />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.name}</p>}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  className={`inp-lux w-full pl-11 pr-4 py-3 rounded-lg text-sm ${errors.email ? 'border-red-500/70 focus:border-red-500 focus:shadow-[0_0_0_1px_#ef4444]' : ''}`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  className={`inp-lux w-full pl-11 pr-12 py-3 rounded-lg text-sm ${errors.password ? 'border-red-500/70 focus:border-red-500 focus:shadow-[0_0_0_1px_#ef4444]' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password}</p>}
            </div>

            {/* Confirm Password — Register only */}
            {isRegister && (
              <div className="anim-fade">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Confirm Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    id="login-confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={e => set('confirmPassword', e.target.value)}
                    className={`inp-lux w-full pl-11 pr-4 py-3 rounded-lg text-sm ${errors.confirmPassword ? 'border-red-500/70 focus:border-red-500 focus:shadow-[0_0_0_1px_#ef4444]' : ''}`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.confirmPassword}</p>}
              </div>
            )}

            {/* Remember me / Forgot password */}
            {!isRegister && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-4 h-4 rounded border border-gray-700 bg-gray-900 peer-checked:bg-lux peer-checked:border-lux transition-all flex items-center justify-center">
                    </div>
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
                </label>
                <button type="button" className="text-lux/80 hover:text-lux transition-colors text-xs font-medium tracking-wide">
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3.5 rounded-lg text-sm tracking-wide font-serif relative overflow-hidden group"
            >
              <span className={`transition-all duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                {isRegister ? 'Create Account' : 'Sign In'}
              </span>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
            <span className="text-xs text-gray-500 uppercase tracking-widest font-medium">or continue with</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button
              id="login-google"
              type="button"
              onClick={() => onLogin({ name: 'Alexander Pierce', email: 'alexander@example.com', location: 'Mumbai, India', phone: '+91 9876543210' })}
              className="btn-outline py-3 rounded-lg text-sm flex items-center justify-center gap-2 group"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="group-hover:text-lux transition-colors">Google</span>
            </button>
            <button
              id="login-github"
              type="button"
              onClick={() => onLogin({ name: 'Alexander Pierce', email: 'alexander@example.com', location: 'Mumbai, India', phone: '+91 9876543210' })}
              className="btn-outline py-3 rounded-lg text-sm flex items-center justify-center gap-2 group"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              <span className="group-hover:text-lux transition-colors">GitHub</span>
            </button>
          </div>
        </div>

        {/* Toggle Login / Register */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              id="login-toggle"
              type="button"
              onClick={() => { setIsRegister(p => !p); setErrors({}); }}
              className="text-lux font-medium hover:text-lux-dim transition-colors"
            >
              {isRegister ? 'Sign In' : 'Create one'}
            </button>
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mt-8 text-gray-600">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm4.768 9.14a1 1 0 10-1.536-1.28l-4.3 5.159-2.225-2.226a1 1 0 00-1.414 1.414l3 3a1 1 0 001.475-.067l5-6z"/>
            </svg>
            <span className="text-[10px] uppercase tracking-widest">256-bit SSL</span>
          </div>
          <div className="w-px h-3 bg-gray-800"></div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm4.768 9.14a1 1 0 10-1.536-1.28l-4.3 5.159-2.225-2.226a1 1 0 00-1.414 1.414l3 3a1 1 0 001.475-.067l5-6z"/>
            </svg>
            <span className="text-[10px] uppercase tracking-widest">GDPR Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
