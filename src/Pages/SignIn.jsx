import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';
import toast from 'react-hot-toast';

const SignIn = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email required';
    if (!form.password) e.password = 'Password required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      if (err.response?.data?.needsPasswordSetup) {
        toast.error('Please set your password first via "Forgot Password"');
        navigate('/forgot-password', { state: { email: form.email } });
      } else {
        toast.error(msg);
      }
    } finally { setLoading(false); }
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
        <div className="auth-subtitle">Sign in to your account</div>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              className={'form-input' + (errors.email ? ' error' : '')}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
            {errors.email && <span style={{ fontSize:12, color:'var(--heart)' }}>{errors.email}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className={'form-input' + (errors.password ? ' error' : '')}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            />
            {errors.password && <span style={{ fontSize:12, color:'var(--heart)' }}>{errors.password}</span>}
          </div>
          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? <><span className="spinner" /> Signing in...</> : 'Sign in'}
          </button>
        </form>

        <div className="auth-divider">or</div>
        <Link to="/forgot-password" style={{ display:'block', textAlign:'center', fontSize:14, color:'var(--accent)' }}>
          Forgot password / First time here?
        </Link>
      </motion.div>
    </div>
  );
};

export default SignIn;
