import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';
import toast from 'react-hot-toast';

const STEPS = ['email', 'otp', 'password'];

const ForgotPassword = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef([]);

  // Step 1: send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error('Enter your email');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('Check your email for the OTP code!');
      setStep(1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  // OTP digit input handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pasted.split('').forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  // Step 2: verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) return toast.error('Enter the full 6-digit code');
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email, code });
      setResetToken(res.data.resetToken);
      toast.success('OTP verified!');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  // Step 3: set new password
  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) return toast.error('Password must be at least 8 characters');
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', { resetToken, newPassword });
      login(res.data.token, res.data.user);
      toast.success('Password set! Welcome 🎉');
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to set password');
    } finally { setLoading(false); }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-logo">Message<span>Board</span></div>

        {/* Step indicators */}
        <div style={{ display:'flex', gap:6, marginBottom:28 }}>
          {STEPS.map((s, i) => (
            <div
              key={s}
              style={{
                flex: 1, height: 4, borderRadius: 2,
                background: i <= step ? 'var(--accent)' : 'var(--border)',
                transition: 'background 0.3s',
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.form key="email-step" onSubmit={handleSendOTP} style={{ display:'flex', flexDirection:'column', gap:16 }}
              variants={stepVariants} initial="hidden" animate="visible" exit="exit">
              <div>
                <div className="auth-logo" style={{ fontSize:20 }}>Enter your email</div>
                <div className="auth-subtitle">We'll send a verification code if your email is registered</div>
              </div>
              <div className="form-group">
                <label className="form-label">Email address</label>
                <input className="form-input" type="email" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
                {loading ? <><span className="spinner" /> Sending...</> : 'Send verification code'}
              </button>
            </motion.form>
          )}

          {step === 1 && (
            <motion.form key="otp-step" onSubmit={handleVerifyOTP} style={{ display:'flex', flexDirection:'column', gap:20 }}
              variants={stepVariants} initial="hidden" animate="visible" exit="exit">
              <div>
                <div className="auth-logo" style={{ fontSize:20 }}>Check your email</div>
                <div className="auth-subtitle">Enter the 6-digit code sent to {email}</div>
              </div>
              <div className="otp-inputs" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    className="otp-input"
                    type="text" inputMode="numeric" maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    ref={el => otpRefs.current[i] = el}
                  />
                ))}
              </div>
              <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
                {loading ? <><span className="spinner" /> Verifying...</> : 'Verify code'}
              </button>
              <button type="button" className="btn btn-ghost btn-full" onClick={() => { setStep(0); setOtp(['','','','','','']); }}>
                ← Back
              </button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form key="password-step" onSubmit={handleSetPassword} style={{ display:'flex', flexDirection:'column', gap:16 }}
              variants={stepVariants} initial="hidden" animate="visible" exit="exit">
              <div>
                <div className="auth-logo" style={{ fontSize:20 }}>Set your password</div>
                <div className="auth-subtitle">Choose a strong password (min. 8 characters)</div>
              </div>
              <div className="form-group">
                <label className="form-label">New password</label>
                <input className="form-input" type="password" placeholder="••••••••"
                  value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm password</label>
                <input className="form-input" type="password" placeholder="••••••••"
                  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </div>
              <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
                {loading ? <><span className="spinner" /> Saving...</> : 'Set password & sign in'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;