'use client';

import { forwardRef, ImgHTMLAttributes } from 'react';
import { cn, getInitials } from '@/lib/utils';

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, name, size = 'md', isOnline, ...props }, ref) => {
    const sizes = {
      xs: 'h-6 w-6 text-xs',
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-14 w-14 text-lg',
      xl: 'h-20 w-20 text-2xl',
    };

    const onlineSizes = {
      xs: 'h-1.5 w-1.5',
      sm: 'h-2 w-2',
      md: 'h-2.5 w-2.5',
      lg: 'h-3 w-3',
      xl: 'h-4 w-4',
    };

    const initials = name ? getInitials(name) : '?';

    return (
      <div ref={ref} className={cn('relative inline-block', className)}>
        {src ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className={cn(
              'rounded-full object-cover bg-savanna-cream-200',
              sizes[size]
            )}
            {...props}
          />
        ) : (
          <div
            className={cn(
              'rounded-full flex items-center justify-center',
              'bg-gradient-to-br from-savanna-gold-400 to-savanna-teal-500',
              'text-white font-medium',
              sizes[size]
            )}
          >
            {initials}
          </div>
        )}
        {isOnline !== undefined && (
          <span
            className={cn(
              'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
              onlineSizes[size],
              isOnline ? 'bg-green-500' : 'bg-gray-400'
            )}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export { Avatar };
