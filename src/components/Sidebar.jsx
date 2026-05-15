import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './Avatar.jsx';

const SearchIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const Sidebar = ({ users = [], selectedUserId, onSelect, loading }) => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(u =>
      u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }, [users, search]);

  return (
    <motion.aside
      className="sidebar"
      initial={{ x: -300 }} animate={{ x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="sidebar-header">
        <div className="sidebar-title">All members ({users.length})</div>
        <div className="sidebar-search">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="sidebar-list">
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:24 }}><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div style={{ padding:'24px 12px', textAlign:'center', color:'var(--text-muted)', fontSize:13 }}>
            No members found
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((u, i) => (
              <motion.div
                key={u._id}
                className={'sidebar-item' + (selectedUserId === u._id ? ' active' : '')}
                onClick={() => onSelect(u._id)}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ x: 3 }}
              >
                <Avatar name={u.name} src={u.avatar} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="sidebar-item-name">{u.name}</div>
                  <div className="sidebar-item-email">{u.email}</div>
                </div>
                <div className="sidebar-item-count">{u.postCount}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;