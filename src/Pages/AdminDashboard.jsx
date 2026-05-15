import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar.jsx';
import PostCard from '../components/PostCard.jsx';
import api from '../utils/api.js';
import toast from 'react-hot-toast';

const EmptyState = ({ selected }) => (
  <div className="empty-state">
    <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
    <h3>{selected ? 'No posts found for this member' : 'Select a member'}</h3>
    <p>{selected ? 'They may not have any posts yet.' : 'Choose someone from the list to view their post'}</p>
  </div>
);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Fetch user list for sidebar
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/posts/users/list');
        setUsers(res.data);
      } catch { toast.error('Failed to load members'); }
      finally { setLoadingUsers(false); }
    };
    fetchUsers();
  }, []);

  // Fetch posts when user selected
  useEffect(() => {
    if (!selectedUserId) return;
    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        const res = await api.get('/posts');
        const userPosts = res.data.filter(p =>
          p.user?._id === selectedUserId || p.user === selectedUserId
        );
        setPosts(userPosts);
      } catch { toast.error('Failed to load posts'); }
      finally { setLoadingPosts(false); }
    };
    fetchPosts();
  }, [selectedUserId]);

  const selectedUser = users.find(u => u._id === selectedUserId);

  return (
    <div className="dashboard-layout">
      <Sidebar
        users={users}
        selectedUserId={selectedUserId}
        onSelect={(id) => { setSelectedUserId(id); setPosts([]); }}
        loading={loadingUsers}
      />

      <main className="main-content">
        <AnimatePresence mode="wait">
          {!selectedUserId ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EmptyState selected={false} />
            </motion.div>
          ) : loadingPosts ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display:'flex', justifyContent:'center', paddingTop:60 }}>
              <div className="spinner" style={{ width:36, height:36 }} />
            </motion.div>
          ) : posts.length === 0 ? (
            <motion.div key="no-posts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EmptyState selected={true} />
            </motion.div>
          ) : (
            <motion.div key={selectedUserId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display:'flex', flexDirection:'column', gap:24, maxWidth:680, margin:'0 auto' }}>
              {selectedUser && (
                <div style={{ marginBottom:8 }}>
                  <h2 style={{ fontFamily:'var(--font-display)', fontSize:24 }}>{selectedUser.name}</h2>
                  <div style={{ fontSize:13, color:'var(--text-muted)' }}>{selectedUser.email}</div>
                </div>
              )}
              {posts.map(post => (
                <PostCard key={post._id} post={post} onUpdate={() => {}} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;