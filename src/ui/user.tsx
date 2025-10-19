import { UserInfo } from '@/types/entity';
import { cn } from '@/utils';
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';
import { RenderAvatar } from './render-avatar';

interface UserProps {
  user?: UserInfo;
  className?: string;
}

export const UserUI: React.FC<UserProps> = ({ user, className = '' }) => {
  if (!user) {
    return 'Không có người dùng';
  }

  return (
    <HoverCard openDelay={10}>
      <HoverCardTrigger asChild>
        <div className={cn(className, 'items-center flex gap-1 w-max')}>
          <RenderAvatar
            avatar={user.avatar}
            className="h-8 w-8 rounded-full"
            name={user.fullName}
          />
          <div className="ml-2 flex flex-col">
            <span className="text-sm">{user.fullName}</span>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent side={'top'} align="center">
        <div className="inline-block p-4 bg-white rounded-md shadow-md border border-gray-200 max-w-xs min-w-full ">
          <div className="flex items-center space-x-4 mb-3">
            <RenderAvatar
              avatar={user.avatar}
              className="h-12 w-12 rounded-full"
              name={user.fullName}
            />
            <div className="text-gray-900 font-semibold text-lg">
              {user.fullName}
            </div>
          </div>
          <div className="text-gray-600 text-sm space-y-1">
            <div>
              <span className="font-medium text-gray-800">Ngày sinh:</span>{' '}
              18/11/1998
            </div>
            <div>
              <span className="font-medium text-gray-800">Quê quán:</span> Hà
              Tĩnh
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
