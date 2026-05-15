import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HeartIcon = ({ filled }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);

const HeartButton = ({ count = 0, hearted = false, onToggle, disabled = false }) => {
  const [localHearted, setLocalHearted] = useState(hearted);
  const [localCount, setLocalCount] = useState(count);
  const [animating, setAnimating] = useState(false);

  const handleClick = async () => {
    if (disabled || animating) return;
    setAnimating(true);
    const newHearted = !localHearted;
    setLocalHearted(newHearted);
    setLocalCount(c => newHearted ? c + 1 : c - 1);
    try { await onToggle?.(); } catch { setLocalHearted(!newHearted); setLocalCount(c => newHearted ? c - 1 : c + 1); }
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <motion.button
      className={"heart-btn" + (localHearted ? " hearted" : "")}
      onClick={handleClick}
      disabled={disabled}
      whileTap={{ scale: 0.9 }}
    >
      <motion.span
        animate={animating ? { scale: [1, 1.4, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <HeartIcon filled={localHearted} />
      </motion.span>
      <AnimatePresence mode="wait">
        <motion.span
          key={localCount}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {localCount}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
};

export default HeartButton;




