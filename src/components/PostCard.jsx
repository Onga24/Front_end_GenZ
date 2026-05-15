import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './Avatar.jsx';
import HeartButton from './HeartButton.jsx';
import CommentSection from './CommentSection.jsx';
import { timeAgo, getYouTubeEmbed, hasHearted } from '../utils/helpers.js';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';
import toast from 'react-hot-toast';

// const getDirectDriveUrl = (url) => {
//   if (!url.includes('drive.google.com')) return url;
  
//   // Extract the File ID between /d/ and /view
//   const match = url.match(/\/d\/(.+?)\/(view|edit)/);
//   if (match && match[1]) {
//     const fileId = match[1];
//     // Return the direct link format that works in <img> and <video> tags
//     return `https://drive.google.com/uc?export=view&id=${fileId}`;
//   }
//   return url;
// };
// const getDirectDriveUrl = (url) => {
//   if (!url || !url.includes('drive.google.com')) return url;

//   // This regex is more aggressive to find the ID regardless of /file/d/ or /uc?id=
//   const idMatch = url.match(/(?:\/d\/|id=)([\w-]+)/);
  
//   if (idMatch && idMatch[1]) {
//     const fileId = idMatch[1];
//     // We use &format=png or &size=l to force Google to render it as an image
//     return `https://drive.google.com/uc?export=view&id=${fileId}`;
//   }
  
//   return url;
// };
const getDirectDriveUrl = (url) => {
  if (!url || !url.includes('drive.google.com')) return url;

  // Extract File ID
  const idMatch = url.match(/(?:\/d\/|id=)([\w-]+)/);
  if (!idMatch || !idMatch[1]) return url;
  
  const fileId = idMatch[1];

  // For Videos: We use the /preview link because Google Drive videos 
  // often require a specific player to handle streaming/buffering.
 if (url.toLowerCase().includes('pdf') || url.includes('/file/d/')) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  // For Images: We use the uc (user content) link
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
};
const EditIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);


// const MediaRenderer = ({ url, type }) => {
//   if (!url || type === 'none') return null;

//   if (type === 'youtube') {
//     const embedUrl = getYouTubeEmbed(url);
//     if (!embedUrl) return null;
//     return (
//       <div className="post-media">
//         <iframe
//           src={embedUrl}
//           title="YouTube video"
//           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//           allowFullScreen
//         />
//       </div>
//     );
//   }

//   if (type === 'video') {
//     return (
//       <div className="post-media">
//         <video controls style={{ width: '100%', maxHeight: 400 }}>
//           <source src={url} />
//           Your browser does not support video.
//         </video>
//       </div>
//     );
//   }

//   // image (default)
//   return (
//     <div className="post-media">
//       <img src={url} alt="Post media" loading="lazy" />
//     </div>
//   );
// };
const MediaRenderer = ({ url, type }) => {
  if (!url || type === 'none') return null;

  // Transform Google Drive links if necessary
  const processedUrl = getDirectDriveUrl(url);

  if (type === 'youtube') {
    const embedUrl = getYouTubeEmbed(url); // YouTube logic remains the same
    if (!embedUrl) return null;
    return (
      <div className="post-media">
        <iframe
          src={embedUrl}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  // if (type === 'video') {
  //   if (url.includes('drive.google.com')) {
  //     const drivePreview = getDirectDriveUrl(url);
  //     return (
  //       <div className="post-media">
  //         <iframe
  //           src={drivePreview}
  //           width="100%"
  //           height="350"
  //           allow="autoplay"
  //           title="Drive Video"
  //         />
  //       </div>
  //     );
  //   }
  //   return (
  //     <div className="post-media">
  //       <video controls style={{ width: '100%', maxHeight: 400 }}>
  //         <source src={url} />
  //         Your browser does not support video.
  //       </video>
  //     </div>
  //   );
  // }

  if (type === 'video' && url.includes('drive.google.com')) {
  const drivePreview = getDirectDriveUrl(url);
  return (
    <div className="post-media">
      <iframe
        src={drivePreview}
        width="100%"
        height="350"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="Drive Video"
        style={{ border: 'none', borderRadius: '8px' }}
      />
    </div>
  );
}
if (type === 'pdf') {
    // If it's a Drive link, use the preview mode
    const pdfUrl = url.includes('drive.google.com') 
      ? processedUrl.replace('/uc?export=view&id=', '/file/d/') + '/preview'
      : processedUrl;

    return (
      <div className="post-media pdf-container">
        <iframe
          src={pdfUrl}
          width="100%"
          height="500px"
          title="PDF Document"
          style={{ border: 'none', borderRadius: '8px' }}
        />
        <div style={{ marginTop: '8px' }}>
          <a href={url} target="_blank" rel="noreferrer" className="download-btn">
            view / Download PDF
          </a>
        </div>
      </div>
    );
  }

  // default to image
  return (
    <div className="post-media">
      <img src={processedUrl} alt="Post" referrerPolicy="no-referrer" />
    </div>
  );
  // 4. Handle Image (Google Drive or direct)
  const imageUrl = getDirectDriveUrl(url);
  return (
    <div className="post-media">
      <img 
        src={imageUrl} 
        alt="Post media" 
        loading="lazy" 
        referrerPolicy="no-referrer"
        onError={(e) => {
          // If the direct link fails, hide the broken image icon
          e.target.style.display = 'none';
        }}
      />
    </div>
  );

//   if (type === 'video') {
//     return (
//       <div className="post-media">
//         <video controls style={{ width: '100%', maxHeight: 400 }}>
//           <source src={processedUrl} />
//           Your browser does not support video.
//         </video>
//       </div>
//     );
//   }
// return (
//   <div className="post-media">
//     <img 
//       src={processedUrl} 
//       alt="Post media" 
//       loading="lazy" 
//       referrerPolicy="no-referrer" 
//     />
//   </div>
// );
  // image (default)
  // return (
  //   <div className="post-media">
  //     <img src={processedUrl} alt="Post media" loading="lazy" />
  //   </div>
  // );
};
const PostCard = ({ post: initialPost, onUpdate }) => {
  const { user } = useAuth();
  const [post, setPost] = useState(initialPost);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(post.message);
  const [saving, setSaving] = useState(false);

  const canEdit = user?.role === 'admin' || post.user?._id === user?._id || post.user === user?._id;
  const hearted = hasHearted(post.hearts, user?._id);

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;
    setSaving(true);
    try {
      const res = await api.patch(`/posts/${post._id}`, { message: editText });
      setPost(p => ({ ...p, message: res.data.message }));
      setEditing(false);
      toast.success('Post updated');
      onUpdate?.();
    } catch {
      toast.error('Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  const handleHeartPost = async () => {
    const res = await api.post(`/posts/${post._id}/heart`);
    setPost(p => ({
      ...p,
      hearts: res.data.hearted
        ? [...(p.hearts || []), user._id]
        : (p.hearts || []).filter(id => id !== user._id),
    }));
  };

  return (
    <motion.div
      className="card post-card animate-fade-up"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="post-header">
        <Avatar name={post.user?.name} src={post.user?.avatar} size={44} />
        <div className="post-author-info">
          <div className="post-author-name">{post.user?.name || 'User'}</div>
          <div className="post-time">{timeAgo(post.createdAt)}</div>
        </div>
        {canEdit && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => { setEditing(!editing); setEditText(post.message); }}
          >
            <EditIcon /> {editing ? 'Cancel' : 'Edit'}
          </button>
        )}
      </div>

      {/* Message */}
      <AnimatePresence mode="wait">
        {editing ? (
          <motion.div
            key="edit"
            className="post-edit-area"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <textarea
              value={editText}
              onChange={e => setEditText(e.target.value)}
              placeholder="Edit your message..."
            />
            <div className="edit-actions">
              <button className="btn btn-primary btn-sm" onClick={handleSaveEdit} disabled={saving}>
                {saving ? <span className="spinner" /> : 'Save'}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </motion.div>
        ) : (
          <motion.p key="msg" className="post-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {post.message}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Media */}
      <MediaRenderer url={post.mediaUrl} type={post.mediaType} />

      {/* Actions */}
      <div className="post-actions">
        <HeartButton
          count={post.hearts?.length || 0}
          hearted={hearted}
          onToggle={handleHeartPost}
        />
      </div>

      {/* Comments */}
      <CommentSection postId={post._id} />
    </motion.div>
  );
};

export default PostCard;