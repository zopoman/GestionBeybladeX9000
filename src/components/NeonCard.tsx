import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../utils/cn';

interface NeonCardProps extends HTMLMotionProps<"div"> {
  variant?: 'blue' | 'purple' | 'pink' | 'orange';
}

const NeonCard = forwardRef<HTMLDivElement, NeonCardProps>(
  ({ className, variant = 'blue', children, ...props }, ref) => {
    const borderColors = {
      blue: 'border-neon-blue/30 hover:border-neon-blue/60',
      purple: 'border-neon-purple/30 hover:border-neon-purple/60',
      pink: 'border-neon-pink/30 hover:border-neon-pink/60',
      orange: 'border-neon-orange/30 hover:border-neon-orange/60',
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'bg-dark-card/80 backdrop-blur-sm border rounded-xl p-4 md:p-6 transition-colors duration-300',
          borderColors[variant],
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

NeonCard.displayName = 'NeonCard';

export default NeonCard;
