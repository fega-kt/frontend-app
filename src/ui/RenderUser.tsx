import { UserInfo } from '@/types/entity';
import { cn } from '@/utils';
import React, { useCallback } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';
import { RenderAvatar } from './render-avatar';

interface PeoplePickerProps {
  users?: UserInfo[];
  className?: string;
  size: number;
}

export const RenderUser: React.FC<PeoplePickerProps> = ({
  users,
  className,
  size,
}) => {
  const renderUser = useCallback(
    (data?: UserInfo) => {
      if (!data) return null;
      return (
        <HoverCard openDelay={10}>
          <HoverCardTrigger asChild>
            <div className={cn(className, 'items-center flex gap-1 w-max')}>
              <RenderAvatar
                user={data}
                className="h-8 w-8 rounded-full"
                size={size}
              />
              <div className="ml-2 flex flex-col">
                <span className="text-sm">{data.fullName}</span>
              </div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent side={'top'} align="center">
            <div className="inline-block p-4 bg-white dark:bg-gray-900 rounded-md shadow-md border max-w-xs min-w-full ">
              <div className="flex items-center space-x-4 mb-3">
                <RenderAvatar
                  size={size}
                  className="rounded-full"
                  user={data}
                />
                <div className="text-gray-500 dark:text-gray-400font-semibold text-lg">
                  {data.fullName}
                </div>
              </div>
              <div className="text-gray-600 text-sm space-y-1">
                <div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Ngày sinh:
                  </span>{' '}
                  <span className="text-gray-500 dark:text-gray-400">
                    {' '}
                    18/11/1998
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Quê quán:
                  </span>{' '}
                  <span className="text-gray-500 dark:text-gray-400">
                    {' '}
                    Hà Tĩnh
                  </span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
    [className, size]
  );

  return (
    <div className={cn(className, 'items-center')}>
      {users && Array.isArray(users) && users.length ? (
        <div className="flex gap-3">
          {users.map((user) => renderUser(user))}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};
