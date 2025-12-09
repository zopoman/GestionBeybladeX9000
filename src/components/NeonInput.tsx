import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../utils/cn';

interface NeonInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const NeonInput = forwardRef<HTMLInputElement, NeonInputProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={id} className="text-sm font-orbitron text-gray-400 uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'bg-dark-surface border border-gray-700 rounded-md px-4 py-2 text-white outline-none transition-all duration-300',
            'focus:border-neon-blue focus:shadow-[0_0_10px_#00f3ff]',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

NeonInput.displayName = 'NeonInput';

export default NeonInput;
