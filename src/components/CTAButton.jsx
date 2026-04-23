import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const CTAButton = ({
  text,
  href,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  onClick,
  className,
  ...props
}) => {
  const baseClasses = "relative inline-flex items-center justify-center font-bold rounded-full overflow-hidden transition-all duration-300 group";
  
  const sizeClasses = {
    sm: "px-6 py-2.5 text-sm",
    md: "px-8 py-3.5 text-base",
    lg: "px-10 py-4 text-lg md:px-12 md:py-5 md:text-xl"
  };

  const variantClasses = {
    primary: "bg-[hsl(var(--accent-cta))] text-white hover:bg-[hsl(24_100%_45%)] shadow-[0_0_15px_hsl(var(--accent-cta)/0.3)] hover-glow-cta",
    secondary: "bg-transparent text-[hsl(var(--accent-cta))] border-2 border-[hsl(var(--accent-cta))] hover:bg-[hsl(var(--accent-cta)/0.1)]",
  };

  const buttonContent = (
    <>
      <span className="relative z-10 flex items-center gap-2">
        {text}
        {Icon && (
          <Icon className={cn(
            "w-5 h-5 transition-transform duration-300", 
            variant === 'primary' ? "group-hover:translate-x-1" : ""
          )} />
        )}
      </span>
      {variant === 'primary' && (
        <div className="absolute inset-0 -translate-x-full bg-white/20 skew-x-12 group-hover:animate-[shine_1.5s_ease-in-out]" />
      )}
    </>
  );

  const MotionLink = motion(Link);
  const MotionButton = motion.button;

  if (href) {
    return (
      <MotionLink
        to={href}
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}
        {...props}
      >
        {buttonContent}
      </MotionLink>
    );
  }

  return (
    <MotionButton
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}
      {...props}
    >
      {buttonContent}
    </MotionButton>
  );
};

export default CTAButton;