'use client';

import { ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, Tag } from 'antd';
import { useAdminChatMessages } from '@/hooks';
import type { AdminChatMessage } from '@/types/admin';
import { AdminDataError, adminEmptyText } from '@/modules/admin/AdminDataState';
import { ChatStatusTag } from '@/modules/admin/adminFormat';

const sourceMap: Record<AdminChatMessage['source'], { label: string; color: string }> = {
  lobby: { label: '大厅', color: 'blue' },
  room: { label: '房间', color: 'purple' },
  system: { label: '系统', color: 'green' },
};

export default function AdminChatPage() {
  const { data: messages, loading, error, refresh } = useAdminChatMessages();

  const columns: ProColumns<AdminChatMessage>[] = [
    { title: '消息ID', dataIndex: 'id', width: 120, copyable: true },
    { title: '发送人', dataIndex: 'sender', width: 120 },
    {
      title: '来源',
      dataIndex: 'source',
      width: 90,
      render: (_, record) => {
        const source = sourceMap[record.source];
        return <Tag color={source.color}>{source.label}</Tag>;
      },
    },
    { title: '内容', dataIndex: 'content', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (_, record) => <ChatStatusTag status={record.status} />,
    },
    { title: '发送时间', dataIndex: 'sentAt', width: 150 },
    {
      title: '操作',
      valueType: 'option',
      width: 190,
      render: () => [
        <Button key="hide" type="link" size="small">
          屏蔽
        </Button>,
        <Button key="restore" type="link" size="small">
          恢复
        </Button>,
        <Button key="mute" type="link" danger size="small">
          禁言
        </Button>,
      ],
    },
  ];

  return (
    <>
      <AdminDataError error={error} onRetry={refresh} />
      <ProTable<AdminChatMessage>
        rowKey="id"
        columns={columns}
        dataSource={messages}
        loading={loading}
        search={false}
        cardBordered
        pagination={false}
        options={{ density: true, fullScreen: true, reload: false }}
        locale={{ emptyText: adminEmptyText }}
        scroll={{ x: 1000 }}
        headerTitle="聊天与系统公告"
        toolBarRender={() => [
          <Button key="notice" type="primary">
            发布公告
          </Button>,
        ]}
      />
    </>
  );
}
