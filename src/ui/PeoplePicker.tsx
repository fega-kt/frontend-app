import { userService } from '@/api/services/user';
import { UserInfo } from '@/types/entity';
import { cn } from '@/utils';
import { Select, SelectProps } from 'antd';
import { compact, uniqBy } from 'lodash';
import React, { useCallback, useRef, useState } from 'react';
import { RenderAvatar } from './render-avatar';

interface PeoplePickerProps
  extends Omit<SelectProps<string>, 'options' | 'onChange' | 'value'> {
  className?: string;
  classNameTrigger?: string;
  readonly?: boolean;
  value?: UserInfo;
  onChange?: (value?: UserInfo) => void;
}

export const PeoplePicker: React.FC<PeoplePickerProps> = ({
  className = '',
  readonly,
  value,
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
        disabled={readonly}
        onChange={(selected: string) => {
          const selectedUser = users.find((u) => u.id === selected);
          onChange?.(selectedUser);
        }}
        style={{ width: '100%' }}
        getPopupContainer={(triggerNode) => {
          const container =
            triggerNode.closest('[role="dialog"]') || triggerNode.parentNode;

          return container;
        }}
        options={uniqBy(compact([value, ...users]), 'id').map((user) => ({
          value: user.id,
          label: (
            <div className="flex items-center gap-2">
              <RenderAvatar
                size={24}
                name={user.fullName}
                avatar={user.avatar}
              />
              <div className="ml-2 flex flex-col">
                <span className="text-sm">{user.fullName}</span>
              </div>
            </div>
          ),
        }))}
        {...rest}
      />
    </div>
  );
};
