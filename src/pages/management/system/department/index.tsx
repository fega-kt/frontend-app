import { DepartmentEntity } from '@/api/services/department';
import { departmentService } from '@/api/services/department/department.service';
import { Icon } from '@/components/icon';
import { iconCollapsed, iconExpanded } from '@/components/icon/icon';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader } from '@/ui/card';
import { PeoplePicker } from '@/ui/PeoplePicker';
import { convertFlatToTree } from '@/utils/tree';
import { useQuery } from '@tanstack/react-query';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useMemo, useRef } from 'react';
import DepartmentDetailModal, { DepartmentDetailModalRef } from './detail';

import { AdvancedTable } from '@/ui/AdvancedTable';
import DeleteModal, { DeleteModalRef } from '@/ui/DeleteModal';
import { cn } from '@/utils';
import style from './department.module.scss';
export const useDepartments = () => {
  return useQuery({
    queryKey: ['organizational_structure'],
    queryFn: () => departmentService.dataTree(),
    staleTime: 10 * 60, // dữ liệu 10s không fetch lại
    refetchOnWindowFocus: false, // tránh fetch lại khi focus window
  });
};

interface DepartmentTree extends DepartmentEntity {
  children?: DepartmentTree[];
  parentId: string;
}
export default function DepartmentPage() {
  const { data: departments, isLoading, isError, refetch } = useDepartments();
  const departmentDetailModalRef = useRef<DepartmentDetailModalRef>(null);
  const deleteModalRef = useRef<DeleteModalRef>(null);

  const handleAction = useCallback(
    async (id?: string) => {
      const res = await departmentDetailModalRef.current?.open(id);
      if (res?.hasChange) {
        refetch();
      }
    },
    [refetch]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const res = await deleteModalRef.current?.open(id);
      if (res?.deleted) {
        refetch();
      }
    },
    [refetch]
  );

  const columns: ColumnsType<DepartmentTree> = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: 300,
      ellipsis: true,

      render: (name) => {
        return <span>{name}</span>;
      },
    },
    {
      title: 'Code',
      dataIndex: 'code',
      width: 300,
      render: (code) => {
        return <div className="flex">{code}</div>;
      },
    },

    {
      title: 'manager',
      dataIndex: 'manager',
      width: 300,
      render: (manager) => {
        return <PeoplePicker value={manager} disabled size={24} />;
      },
    },
    {
      title: 'deputy',
      dataIndex: 'deputy',
      width: 300,
      render: (deputy) => {
        return <PeoplePicker value={deputy} disabled size={24} />;
      },
    },

    {
      title: 'Action',
      key: 'operation',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray-500">
          <Button
            variant="ghost"
            size="icon"
            disabled={isLoading}
            onClick={() => {
              handleAction(record.id);
            }}
          >
            <Icon icon="solar:pen-bold-duotone" size={18} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            disabled={isLoading}
            onClick={() => {
              handleDelete(record.id);
            }}
          >
            <Icon
              icon="mingcute:delete-2-fill"
              size={18}
              className="text-error!"
            />
          </Button>
        </div>
      ),
    },
  ];

  const treeData = useMemo(() => {
    const data = (departments || []).map((it) => {
      return {
        ...it,
        parentId: it.parent?.id || '',
      };
    });
    return convertFlatToTree<DepartmentTree>(data);
  }, [departments]);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>Organizational structure</div>
            <Button
              onClick={() => {
                handleAction();
              }}
            >
              New
            </Button>
          </div>
        </CardHeader>
        <CardContent className={style.customDepartmentList}>
          <AdvancedTable
            columns={columns}
            dataSource={treeData}
            isError={isError}
            isLoading={isLoading}
            pagination={false}
            expandable={{
              defaultExpandAllRows: true,
              expandIcon: ({ expanded, onExpand, record }) => (
                <span
                  className={cn(
                    `align-middle cursor-pointer flex items-center justify-center`,
                    record.children?.length ? 'visible' : 'invisible'
                  )}
                  onClick={(e) => {
                    onExpand(record, e);
                  }}
                >
                  {expanded ? iconExpanded : iconCollapsed}
                </span>
              ),
            }}
          />
        </CardContent>
      </Card>

      <DepartmentDetailModal ref={departmentDetailModalRef} />
      <DeleteModal ref={deleteModalRef} service={departmentService} />
    </>
  );
}
