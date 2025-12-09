import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../utils/cn';

interface NeonButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: 'primary' | 'secondary' | 'danger';
  glow?: boolean;
  children: React.ReactNode;
}

const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant = 'primary', glow = true, children, ...props }, ref) => {
    const variants = {
      primary: 'border-neon-blue text-neon-blue hover:bg-neon-blue/10',
      secondary: 'border-neon-purple text-neon-purple hover:bg-neon-purple/10',
      danger: 'border-neon-pink text-neon-pink hover:bg-neon-pink/10',
    };

    const glowStyles = {
      primary: 'shadow-[0_0_10px_#00f3ff] hover:shadow-[0_0_20px_#00f3ff]',
      secondary: 'shadow-[0_0_10px_#bc13fe] hover:shadow-[0_0_20px_#bc13fe]',
      danger: 'shadow-[0_0_10px_#ff00ff] hover:shadow-[0_0_20px_#ff00ff]',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'relative px-6 py-2 border-2 rounded-md font-orbitron font-bold uppercase tracking-wider transition-all duration-300',
          variants[variant],
          glow && glowStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

NeonButton.displayName = 'NeonButton';

export default NeonButton;
