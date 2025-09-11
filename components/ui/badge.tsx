import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          {
            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': variant === 'default',
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200': variant === 'secondary',
            'border border-gray-300 bg-transparent text-gray-700 dark:border-gray-600 dark:text-gray-300': variant === 'outline',
            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': variant === 'destructive',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
