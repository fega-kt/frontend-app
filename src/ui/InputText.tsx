import { cn } from '@/utils';
import { Input } from 'antd';
import React from 'react';

export type InputProps = React.ComponentProps<typeof Input>;

export function InputText({ className, disabled, ...props }: InputProps) {
  if (disabled) {
    return <div>{props.value}</div>;
  }
  return <Input className={cn(className)} {...props} />;
}
