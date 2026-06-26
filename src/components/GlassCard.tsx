import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glowColor?: 'purple' | 'red' | 'none';
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  glowColor = 'none',
  delay = 0,
}) => {
  const glowClasses = {
    purple: 'shadow-[0_0_15px_rgba(168,85,247,0.1)] border-glass-border-purple',
    red: 'shadow-[0_0_20px_rgba(244,63,94,0.15)] border-glass-border',
    none: 'border-white/8',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hoverEffect ? { y: -3, scale: 1.01, transition: { duration: 0.2 } } : undefined}
      className={`glass-card rounded-2xl p-6 ${glowClasses[glowColor]} ${
        hoverEffect ? 'hover:border-brand-purple/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]' : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  );
};
export default GlassCard;
