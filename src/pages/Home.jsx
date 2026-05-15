import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Home = () => {
  const { user, isAdmin } = useAuth();
  return (
    <motion.div
      style={{ marginTop:'var(--navbar-h)', minHeight:'calc(100vh - var(--navbar-h))' }}
      initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.5 }}
    >
      <div className="page-hero">
        <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
          Welcome to <span style={{ color:'var(--accent)' }}>MessageBoard</span>
        </motion.h1>
        <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
          A private space to share messages, photos, and videos — reviewed with care by your admin.
        </motion.p>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
          style={{ marginTop:32, display:'flex', gap:12, justifyContent:'center' }}>
          {user ? (
            <Link to={isAdmin ? '/admin' : '/dashboard'} className="btn btn-primary">
              Go to {isAdmin ? 'Admin Dashboard' : 'My Post'}
            </Link>
          ) : (
            <>
              <Link to="/signin" className="btn btn-primary">Sign in</Link>
              <Link to="/about" className="btn btn-ghost">Learn more</Link>
            </>
          )}
        </motion.div>
      </div>

      {/* Feature cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:20, maxWidth:800, margin:'0 auto', padding:'0 24px 60px' }}>
        {[
          { icon:'💬', title:'Personal messages', desc:'Each member sees only their own message and media.' },
          { icon:'🎥', title:'Auto media detection', desc:'Links to YouTube, images, and videos are automatically detected and displayed.' },
          { icon:'❤️', title:'Reactions', desc:'Heart messages and comments to show appreciation.' },
        ].map((f, i) => (
          <motion.div key={f.title} className="card" style={{ padding:24 }}
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 + i*0.1 }}>
            <div style={{ fontSize:28, marginBottom:10 }}>{f.icon}</div>
            <h3 style={{ fontSize:15, fontWeight:600, marginBottom:6 }}>{f.title}</h3>
            <p style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.6 }}>{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Home;