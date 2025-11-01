import { cn } from '@/utils';
import { Input } from 'antd';
import React from 'react';

export type InputProps = React.ComponentProps<typeof Input>;

export function InputText({ className, disabled, ...props }: InputProps) {
  if (disabled) {
    return <div>{props.value}</div>;
  }
  return (
    <Input
      className={cn(
        // giữ lại các style gần tương đương từ bản gốc
        'h-9 rounded-md text-base md:text-sm transition-all',
        'focus:border-primary focus:ring-2 focus:ring-primary/30',
        'hover:border-ring/60 hover:shadow-sm',
        className
      )}
      {...props}
    />
  );
}
