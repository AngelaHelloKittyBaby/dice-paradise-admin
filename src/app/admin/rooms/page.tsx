'use client';

import { ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, Progress, Tag } from 'antd';
import { useAdminRooms } from '@/modules/admin/hooks/useAdminData';
import type { AdminRoom } from '@/modules/admin/types';
import { AdminDataError, adminEmptyText } from '@/modules/admin/components/AdminDataState';
import { RoomStatusTag } from '@/modules/admin/utils/adminFormat';

const emptyValue = '未接入';

export default function AdminRoomsPage() {
  const { data: rooms, loading, error, refresh } = useAdminRooms();

  const columns: ProColumns<AdminRoom>[] = [
    { title: '房间ID', dataIndex: 'id', width: 110, copyable: true },
    { title: '房间名称', dataIndex: 'name', width: 150, renderText: value => value || emptyValue },
    { title: '房主', dataIndex: 'owner', width: 120, renderText: value => value || emptyValue },
    { title: '模式', dataIndex: 'mode', width: 120, renderText: value => value || emptyValue },
    {
      title: '人数',
      dataIndex: 'players',
      width: 150,
      render: (_, record) => {
        if (!record.capacity) return <Tag>{record.players}</Tag>;

        return (
          <Progress
            percent={Math.round((record.players / record.capacity) * 100)}
            size="small"
            format={() => `${record.players}/${record.capacity}`}
          />
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 110,
      render: (_, record) => <RoomStatusTag status={record.status} />,
    },
    {
      title: '公开',
      dataIndex: 'isPublic',
      width: 90,
      render: (_, record) => {
        if (record.isPublic === null) return <Tag>{emptyValue}</Tag>;

        return <Tag color={record.isPublic ? 'blue' : 'default'}>{record.isPublic ? '公开' : '私密'}</Tag>;
      },
    },
    { title: '创建时间', dataIndex: 'createdAt', width: 150, renderText: value => value || emptyValue },
    { title: '最后活跃', dataIndex: 'lastActiveAt', width: 150, renderText: value => value || emptyValue },
    {
      title: '操作',
      valueType: 'option',
      width: 180,
      render: () => [
        <Button key="detail" type="link" size="small">
          详情
        </Button>,
        <Button key="chat" type="link" size="small">
          房间聊天
        </Button>,
        <Button key="close" type="link" danger size="small">
          关闭
        </Button>,
      ],
    },
  ];

  return (
    <>
      <AdminDataError error={error} onRetry={refresh} />
      <ProTable<AdminRoom>
        rowKey="id"
        columns={columns}
        dataSource={rooms}
        loading={loading}
        search={false}
        cardBordered
        pagination={false}
        options={{ density: true, fullScreen: true, reload: false }}
        locale={{ emptyText: adminEmptyText }}
        scroll={{ x: 1200 }}
        headerTitle="当前房间状态"
      />
    </>
  );
}
