import { cn } from '@/utils';
import React, { useMemo } from 'react';

interface AvatarProps {
  name?: string;
  avatar?: string;
  size?: number; // chiều rộng/cao của avatar
  className?: string;
}

export const RenderAvatar: React.FC<AvatarProps> = ({
  name,
  avatar,
  size = 40,
  className,
}) => {
  const randomColor = useMemo(() => {
    const colors = [
      '#EF4444', // red-500
      '#F59E0B', // amber-500
      '#10B981', // emerald-500
      '#3B82F6', // blue-500
      '#8B5CF6', // violet-500
      '#EC4899', // pink-500
      '#14B8A6', // teal-500
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  // tạo data URL SVG fallback
  const fallbackSrc = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <rect width="${size}" height="${size}" fill="${randomColor}"/>
      <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle"
            font-size="${size / 2}" fill="white" font-family="sans-serif">
        ${name?.[0]?.toUpperCase() || '?'}
      </text>
    </svg>
  `)}`;

  return (
    <img
      src={avatar || fallbackSrc}
      alt={name || 'Avatar'}
      className={cn(className, 'rounded-full object-cover')}
      width={size}
      height={size}
      onError={(e) => {
        const target = e.currentTarget;
        target.onerror = null; // tránh loop
        target.src = fallbackSrc;
      }}
    />
  );
};
