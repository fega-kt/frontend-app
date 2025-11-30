import { GroupEntity, groupService } from '@/api/services/group';
import { Icon } from '@/components/icon';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader } from '@/ui/card';
import DeleteModal, { DeleteModalRef } from '@/ui/DeleteModal';
import { PeoplePicker } from '@/ui/PeoplePicker';
import { defaultPanigate } from '@/utils/const';
import { getPermissionColor } from '@/utils/tag';
import { useQuery } from '@tanstack/react-query';
import { Flex, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useRef, useState } from 'react';

export const useGroups = (page: number, take: number) => {
  return useQuery({
    queryKey: ['groups', page, take],
    queryFn: () => groupService.getList({ page, take }),
    staleTime: 10 * 60, // dữ liệu 10s không fetch lại
    refetchOnWindowFocus: false, // tránh fetch lại khi focus window
  });
};

export default function GroupPage() {
  const deleteModalRef = useRef<DeleteModalRef>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, isError, refetch } = useGroups(page, pageSize);
  const groups = data?.data || [];
  const meta = data?.meta || defaultPanigate;

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
      title: 'User',
      dataIndex: 'users',
      width: 300,
      render: (_, record) => {
        return (
          <div className="flex">
            {(record.users || []).map((user) => (
              <PeoplePicker size={20} value={user} disabled />
            ))}
          </div>
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
        {isError ? (
          <div>Error loading groups</div>
        ) : (
          <Table
            rowKey="id"
            size="small"
            scroll={{ x: 'max-content', y: 'calc(100vh - 270px)' }}
            columns={columns}
            dataSource={groups}
            loading={isLoading}
            pagination={{
              current: meta.page,
              pageSize: meta.take,
              total: meta.itemCount,
              showSizeChanger: true,
              locale: {
                items_per_page: '/Trang',
              },
              onChange: (page, pageSize) => {
                setPage(page);
                setPageSize(pageSize);
              },
            }}
          />
        )}
      </CardContent>

      <DeleteModal ref={deleteModalRef} service={groupService} />
    </Card>
  );
}
