import { DepartmentEntity } from '@/api/services/department';
import { cn } from '@/utils';
import React from 'react';

interface DepartmentProps {
  deparment?: DepartmentEntity;
  className?: string;
}

export const DepartmentUI: React.FC<DepartmentProps> = ({
  deparment,
  className = '',
}) => {
  if (!deparment) {
    return 'Không có phòng ban';
  }
  return <div className={cn(className, 'items-center')}>{deparment.name}</div>;
};
