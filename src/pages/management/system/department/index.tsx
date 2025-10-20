import { DepartmentEntity } from '@/api/services/department';
import { departmentService } from '@/api/services/department/department.service';
import { Icon } from '@/components/icon';
import { usePathname, useRouter } from '@/routes/hooks';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader } from '@/ui/card';
import { UserUI } from '@/ui/user';
import { useQuery } from '@tanstack/react-query';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useRef } from 'react';
import DepartmentDetailModal, { DepartmentDetailModalRef } from './detail';

export const useDepartments = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => departmentService.getList(),
    staleTime: 10 * 60, // dữ liệu 10s không fetch lại
    refetchOnWindowFocus: false, // tránh fetch lại khi focus window
  });
};

export default function UserPage() {
  const { push } = useRouter();
  const pathname = usePathname();
  const { data, isLoading, isError } = useDepartments();
  const departmentDetailModalRef = useRef<DepartmentDetailModalRef>(null);

  const departments = data?.data || [];

  const handleAction = useCallback(() => {
    departmentDetailModalRef.current?.open();
  }, []);

  const columns: ColumnsType<DepartmentEntity> = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: 300,
      render: (name) => {
        return <div className="flex">{name}</div>;
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
        return <UserUI user={manager} />;
      },
    },
    {
      title: 'deputy',
      dataIndex: 'deputy',
      width: 300,
      render: (deputy) => {
        return <UserUI user={deputy} />;
      },
    },

    {
      title: 'Action',
      key: 'operation',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray-500">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              push(`${pathname}/${record.id}`);
            }}
          >
            <Icon icon="mdi:card-account-details" size={18} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => {}}>
            <Icon icon="solar:pen-bold-duotone" size={18} />
          </Button>
          <Button variant="ghost" size="icon">
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

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>Departments List</div>
            <Button
              onClick={() => {
                handleAction();
              }}
            >
              New
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : isError ? (
            <div>Error loading departments</div>
          ) : (
            <Table
              rowKey="id"
              size="small"
              scroll={{ x: 'max-content' }}
              pagination={false}
              columns={columns}
              dataSource={departments}
            />
          )}
        </CardContent>
      </Card>

      <DepartmentDetailModal ref={departmentDetailModalRef} />
    </>
  );
}
