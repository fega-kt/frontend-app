import { GroupEntity, groupService } from '@/api/services/group';
import { Icon } from '@/components/icon';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader } from '@/ui/card';
import DeleteModal, { DeleteModalRef } from '@/ui/DeleteModal';
import { getPermissionColor } from '@/utils/tag';
import { useQuery } from '@tanstack/react-query';
import { Flex, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useRef } from 'react';

export const useGroups = () => {
  return useQuery({
    queryKey: ['groups'],
    queryFn: () => groupService.getList(),
    staleTime: 10 * 60, // dữ liệu 10s không fetch lại
    refetchOnWindowFocus: false, // tránh fetch lại khi focus window
  });
};

export default function GroupPage() {
  const deleteModalRef = useRef<DeleteModalRef>(null);

  const { data, isLoading, isError, refetch } = useGroups();
  const groups = data?.data || [];

  const columns: ColumnsType<GroupEntity> = [
    {
      title: 'Code',
      dataIndex: 'code',
      width: 300,
      render: (_, record) => {
        return <div className="flex">{record.code}</div>;
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: 300,
      render: (_, record) => {
        return <div className="flex">{record.name}</div>;
      },
    },

    {
      title: 'Permissions',
      dataIndex: 'permissions',
      width: 320,
      render: (permissions) => {
        return (
          <Flex gap="small" align="center" wrap>
            {permissions.map((permission: string) => (
              <Tag key={permission} color={getPermissionColor(permission)}>
                {permission}
              </Tag>
            ))}
          </Flex>
        );
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
          <Button variant="ghost" size="icon" onClick={() => {}}>
            <Icon icon="solar:pen-bold-duotone" size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
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

  const handleDelete = useCallback(
    async (id: string) => {
      const res = await deleteModalRef.current?.open(id);
      if (res?.deleted) {
        refetch();
      }
    },
    [refetch]
  );
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>Group List</div>
          <Button onClick={() => {}}>New</Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error loading groups</div>
        ) : (
          <Table
            rowKey="id"
            size="small"
            scroll={{ x: 'max-content' }}
            pagination={false}
            columns={columns}
            dataSource={groups}
          />
        )}
      </CardContent>

      <DeleteModal ref={deleteModalRef} service={groupService} />
    </Card>
  );
}
