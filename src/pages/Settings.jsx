

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import Avatar from '../components/Avatar.jsx';
import api from '../utils/api.js';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '', avatar: user?.avatar || '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.patch('/users/profile', form);
      updateUser(res.data);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  return (
    <motion.div
      className="main-content"
      style={{ marginTop:'var(--navbar-h)' }}
      initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
    >
      <div className="settings-page">
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:30, marginBottom:32 }}>Settings</h1>

        {/* Profile */}
        <div className="settings-section">
          <div className="settings-section-title">Profile</div>
          <div className="card" style={{ padding:24 }}>
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
              <Avatar name={form.name} src={form.avatar} size={60} />
              <div>
                <div style={{ fontWeight:600 }}>{user?.name}</div>
                <div style={{ fontSize:13, color:'var(--text-muted)' }}>{user?.email}</div>
                <span className={'badge badge-' + user?.role} style={{ marginTop:4 }}>{user?.role}</span>
              </div>
            </div>
            <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div className="form-group">
                <label className="form-label">Full name</label>
                <input className="form-input" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <input className="form-input" value={form.bio} placeholder="Tell us a bit about yourself..."
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Avatar URL</label>
                <input className="form-input" value={form.avatar} placeholder="https://..."
                  onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))} />
              </div>
              <button className="btn btn-primary" type="submit" disabled={saving} style={{ alignSelf:'flex-start' }}>
                {saving ? <><span className="spinner" /> Saving...</> : 'Save changes'}
              </button>
            </form>
          </div>
        </div>

        {/* Appearance */}
        <div className="settings-section">
          <div className="settings-section-title">Appearance</div>
          <div className="card" style={{ padding:20 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <div style={{ fontWeight:500, marginBottom:2 }}>Theme</div>
                <div style={{ fontSize:13, color:'var(--text-muted)' }}>Currently {theme} mode</div>
              </div>
              <button className="btn btn-ghost" onClick={toggleTheme}>
                Switch to {theme === 'light' ? 'dark' : 'light'} mode
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;