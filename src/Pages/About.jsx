import { motion } from 'framer-motion';

const About = () => (
  <motion.div
    style={{ marginTop:'var(--navbar-h)', minHeight:'calc(100vh - var(--navbar-h))', padding:'60px 24px' }}
    initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.5 }}
  >
    <div style={{ maxWidth:640, margin:'0 auto' }}>
      <h1 style={{ fontFamily:'var(--font-display)', fontSize:40, marginBottom:16 }}>About us</h1>
      <p style={{ fontSize:16, color:'var(--text-secondary)', lineHeight:1.8, marginBottom:24 }}>
        MessageBoard is a private platform designed to deliver personal messages, photos, and videos to individuals — with a direct line of feedback from the admin team.
      </p>
      <p style={{ fontSize:16, color:'var(--text-secondary)', lineHeight:1.8, marginBottom:24 }}>
        Each member has access to their own dedicated space where they can view their content, edit their message, and engage with comments from the admin.
      </p>
      <p style={{ fontSize:16, color:'var(--text-secondary)', lineHeight:1.8 }}>
        Built with privacy in mind — your content is only visible to you and the admin team.
      </p>
    </div>
  </motion.div>
);

export default About;