import { userService } from '@/api/services/user';
import { UserInfo } from '@/types/entity';
import { cn } from '@/utils';
import { Select, SelectProps } from 'antd';
import { compact, uniqBy } from 'lodash';
import React, { useCallback, useRef, useState } from 'react';
import { RenderUser } from './RenderUser';

interface PeoplePickerProps
  extends Omit<
    SelectProps<string>,
    'options' | 'onChange' | 'value' | 'size' | 'mode' | 'defaultValue'
  > {
  className?: string;
  classNameTrigger?: string;
  disabled?: boolean;
  size?: number;
  value?: UserInfo[];
  onChange?: (value?: UserInfo[]) => void;
}

export const MultiPeoplePicker: React.FC<PeoplePickerProps> = ({
  className = '',
  disabled,
  value = [],
  size = 22,
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
      const { data } = await userService.getList({ page: 1, take: 10 });
      setUsers(data);
      isLoaded.current = true;
    } catch (error) {
      console.error('error get users:: ', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  if (disabled) {
    return <RenderUser size={size} users={compact([...(value || [])])} />;
  }

  return (
    <div className={cn(className, 'items-center')}>
      <Select
        placeholder="Please select user(s)"
        className="rounded-md"
        mode="multiple"
        loading={loading}
        showSearch
        notFoundContent={loading ? <span>Đang tải...</span> : null}
        onFocus={handleOnFocus}
        value={value.map((u) => u.id)}
        disabled={disabled}
        onChange={(ids: string[]) => {
          const selectedUsers = users.filter((u) => ids.includes(u.id));
          onChange?.(selectedUsers);
        }}
        style={{ width: '100%' }}
        options={uniqBy(compact([...(value || []), ...users]), 'id').map(
          (user) => ({
            value: user.id,
            label: <RenderUser size={size} users={compact([user])} />,
          })
        )}
        {...rest}
      />
    </div>
  );
};
