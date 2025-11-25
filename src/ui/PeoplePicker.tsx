import { userService } from '@/api/services/user';
import { UserInfo } from '@/types/entity';
import { cn } from '@/utils';
import { Select, SelectProps } from 'antd';
import { compact, uniqBy } from 'lodash';
import React, { useCallback, useRef, useState } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';
import { RenderAvatar } from './render-avatar';

interface PeoplePickerProps
  extends Omit<SelectProps<string>, 'options' | 'onChange' | 'value' | 'size'> {
  className?: string;
  classNameTrigger?: string;
  disabled?: boolean;
  size: number;
  value?: UserInfo;
  onChange?: (value?: UserInfo) => void;
}

export const PeoplePicker: React.FC<PeoplePickerProps> = ({
  className = '',
  disabled,
  value,
  size,
  onChange,
  ...rest
}) => {
  const isLoaded = useRef<boolean>(false);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleOnFocus = useCallback(async () => {
    if (isLoaded.current) {
      return;
    }
    try {
      setLoading(true);
      const { data } = await userService.getList();
      setUsers(data);
      isLoaded.current = true;
    } catch (error) {
      console.error('error get users:: ', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const renderUser = useCallback(
    (data?: UserInfo) => {
      if (!data) return null;
      return (
        <HoverCard openDelay={10}>
          <HoverCardTrigger asChild>
            <div className={cn(className, 'items-center flex gap-1 w-max')}>
              <RenderAvatar
                avatar={data.avatar}
                className="h-8 w-8 rounded-full"
                name={data.fullName}
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
                  avatar={data.avatar}
                  size={size}
                  className="rounded-full"
                  name={data.fullName}
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

  if (disabled) {
    return renderUser(value);
  }

  return (
    <div className={cn(className, 'items-center')}>
      <Select
        placeholder="Inserted are removed"
        className="rounded-md"
        loading={loading}
        showSearch
        notFoundContent={loading ? <span>Đang tải...</span> : null}
        onFocus={handleOnFocus}
        value={value?.id}
        disabled={disabled}
        onChange={(selected: string) => {
          const selectedUser = users.find((u) => u.id === selected);
          onChange?.(selectedUser);
        }}
        style={{ width: '100%' }}
        options={uniqBy(compact([value, ...users]), 'id').map((user) => ({
          value: user.id,
          label: renderUser(user),
        }))}
        {...rest}
      />
    </div>
  );
};
