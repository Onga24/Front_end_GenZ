import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PostCard from '../components/PostCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/posts');
        setPosts(res.data);
      } catch { toast.error('Failed to load your post'); }
      finally { setLoading(false); }
    };
    fetchPosts();
  }, []);

  if (loading) return (
    <div className="main-content" style={{ display:'flex', justifyContent:'center', paddingTop:60 }}>
      <div className="spinner" style={{ width:36, height:36 }} />
    </div>
  );

  return (
    <motion.main
      className="main-content"
      style={{ marginTop:'var(--navbar-h)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:28 }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:28, marginBottom:4 }}>
            Hello, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color:'var(--text-muted)', fontSize:14 }}>Your personal message and media</p>
        </motion.div>

        {posts.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            <h3>No post yet</h3>
            <p>Your post will appear here once it has been added.</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
            {posts.map(post => <PostCard key={post._id} post={post} />)}
          </div>
        )}
      </div>
    </motion.main>
  );
};

export default UserDashboard;
