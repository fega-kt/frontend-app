import type { RoleType } from '#/entity';
import { UserItemList } from '@/api/services/user';
import { userService } from '@/api/services/user/user.service';
import { Icon } from '@/components/icon';
import { usePathname, useRouter } from '@/routes/hooks';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader } from '@/ui/card';
import { DepartmentPicker } from '@/ui/DepartmentPicker';
import { RenderAvatar } from '@/ui/render-avatar';
import { useQuery } from '@tanstack/react-query';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getList(),
    staleTime: 10 * 60, // dữ liệu 10s không fetch lại
    refetchOnWindowFocus: false, // tránh fetch lại khi focus window
  });
};

export default function UserPage() {
  const { push } = useRouter();
  const pathname = usePathname();
  const { data, isLoading, isError } = useUsers();
  const users = data?.data || [];

  const columns: ColumnsType<UserItemList> = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: 300,
      render: (_, record) => {
        return (
          <div className="flex">
            <RenderAvatar user={record} className="h-10 w-10 rounded-full" />
            <div className="ml-2 flex flex-col">
              <span className="text-sm">
                {record.firstName || ''} {record.lastName || ''}
              </span>

              <a
                href={`mailto:${record.email}`}
                className="text-xs hover:underline hover:text-blue-600"
              >
                {record.email}
              </a>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Role',
      dataIndex: 'role',
      align: 'center',
      width: 120,
      render: (role: RoleType) => <Badge variant="info">{role}</Badge>,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      align: 'center',
      width: 120,
      render: (isActive) => (
        <Badge variant={isActive ? 'success' : 'error'}>
          {isActive ? 'Enable' : 'Disable'}
        </Badge>
      ),
    },

    {
      title: 'Department',
      dataIndex: 'department',
      align: 'left',
      width: 120,
      render: (deparment) => <DepartmentPicker value={deparment} readonly />,
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>User List</div>
          <Button onClick={() => {}}>New</Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error loading users</div>
        ) : (
          <Table
            rowKey="id"
            size="small"
            scroll={{ x: 'max-content', y: 'calc(100vh - 270px)' }}
            pagination={false}
            columns={columns}
            dataSource={users}
          />
        )}
      </CardContent>
    </Card>
  );
}
