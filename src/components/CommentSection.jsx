
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './Avatar.jsx';
import HeartButton from './HeartButton.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { timeAgo, hasHearted } from '../utils/helper.js';
import api from '../utils/api.js';
import toast from 'react-hot-toast';

const SendIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const CommentSection = ({ postId }) => {
  const { user, isAdmin } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/comments/${postId}`);
        setComments(res.data);
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      const res = await api.post(`/comments/${postId}`, { text });
      setComments(c => [...c, res.data]);
      setText('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post comment');
    } finally { setSending(false); }
  };

  const handleHeartComment = async (commentId) => {
    const res = await api.post(`/comments/${commentId}/heart`);
    setComments(cs => cs.map(c => {
      if (c._id !== commentId) return c;
      return {
        ...c,
        hearts: res.data.hearted
          ? [...(c.hearts || []), user._id]
          : (c.hearts || []).filter(id => id !== user._id),
      };
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  if (loading) return <div style={{ height: 40, display:'flex', alignItems:'center', paddingTop:16 }}><div className="spinner" /></div>;

  return (
    <div className="comments-section">
      {comments.length > 0 && (
        <div className="comments-title">{comments.length} comment{comments.length !== 1 ? 's' : ''}</div>
      )}

      <AnimatePresence>
        {comments.map((comment, i) => (
          <motion.div
            key={comment._id}
            className="comment-item"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Avatar name={comment.author?.name} src={comment.author?.avatar} size={32} />
            <div style={{ flex: 1 }}>
              <div className="comment-bubble">
                <div className="comment-author">
                  {comment.author?.name}
                  {comment.author?.role === 'admin' && (
                    <span className="badge badge-admin" style={{ marginLeft: 6 }}>admin</span>
                  )}
                </div>
                <div className="comment-text">{comment.text}</div>
              </div>
              <div className="comment-footer">
                <span className="comment-time">{timeAgo(comment.createdAt)}</span>
                <HeartButton
                  count={comment.hearts?.length || 0}
                  hearted={hasHearted(comment.hearts, user?._id)}
                  onToggle={() => handleHeartComment(comment._id)}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Comment input — admin always, user only on their own post */}
      <div className="comment-input-area">
        <Avatar name={user?.name} src={user?.avatar} size={32} />
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isAdmin ? 'Write a comment...' : 'Reply to admin...'}
          rows={1}
        />
        <motion.button
          className="btn btn-primary btn-sm"
          onClick={handleSubmit}
          disabled={sending || !text.trim()}
          whileTap={{ scale: 0.95 }}
          style={{ alignSelf:'flex-end', height:40, width:40, padding:0, borderRadius:'50%' }}
        >
          {sending ? <span className="spinner" style={{ width:16, height:16 }} /> : <SendIcon />}
        </motion.button>
      </div>
    </div>
  );
};

export default CommentSection;



