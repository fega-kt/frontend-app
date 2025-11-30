import { UserInfo } from '@/types/entity';
import { cn } from '@/utils';
import React, { useMemo } from 'react';

interface AvatarProps {
  size?: number; // chiều rộng/cao của avatar
  className?: string;
  user?: UserInfo;
}

export const RenderAvatar: React.FC<AvatarProps> = ({
  user,
  size = 40,
  className,
}) => {
  const { id, fullName, avatar } = user || {};
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
    let hash = 0;
    const str = String(id);

    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }, [id]);

  // tạo data URL SVG fallback
  const fallbackSrc = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <rect width="${size}" height="${size}" fill="${randomColor}"/>
      <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle"
            font-size="${size / 2}" fill="white" font-family="sans-serif">
        ${fullName?.[0]?.toUpperCase() || '?'}
      </text>
    </svg>
  `)}`;

  return (
    <div
      className={cn('rounded-full overflow-hidden flex-shrink-0', className)}
      style={{ width: size, height: size }}
    >
      <img
        src={avatar || fallbackSrc}
        alt={fullName || 'Avatar'}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = fallbackSrc;
        }}
      />
    </div>
  );
};
