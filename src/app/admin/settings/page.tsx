'use client';

import { ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, Tag } from 'antd';
import { useAdminConfig } from '@/hooks';
import type { AdminConfigItem } from '@/types/admin';
import { AdminDataError, adminEmptyText } from '@/modules/admin/AdminDataState';

const groupMap: Record<AdminConfigItem['group'], { label: string; color: string }> = {
  game: { label: '游戏', color: 'blue' },
  reward: { label: '奖励', color: 'green' },
  feature: { label: '功能', color: 'purple' },
  system: { label: '系统', color: 'default' },
};

export default function AdminSettingsPage() {
  const { data: config, loading, error, refresh } = useAdminConfig();

  const columns: ProColumns<AdminConfigItem>[] = [
    { title: '配置键', dataIndex: 'key', width: 180, copyable: true },
    { title: '名称', dataIndex: 'name', width: 140 },
    {
      title: '分组',
      dataIndex: 'group',
      width: 100,
      render: (_, record) => {
        const group = groupMap[record.group];
        return <Tag color={group.color}>{group.label}</Tag>;
      },
    },
    { title: '当前值', dataIndex: 'value', width: 120 },
    { title: '说明', dataIndex: 'description', ellipsis: true },
    {
      title: '可编辑',
      dataIndex: 'editable',
      width: 100,
      render: (_, record) => <Tag color={record.editable ? 'green' : 'default'}>{record.editable ? '是' : '只读'}</Tag>,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 120,
      render: (_, record) => [
        <Button key="edit" type="link" size="small" disabled={!record.editable}>
          编辑
        </Button>,
      ],
    },
  ];

  return (
    <>
      <AdminDataError error={error} onRetry={refresh} />
      <ProTable<AdminConfigItem>
        rowKey="key"
        columns={columns}
        dataSource={config}
        loading={loading}
        search={false}
        cardBordered
        pagination={false}
        options={{ density: true, fullScreen: true, reload: false }}
        locale={{ emptyText: adminEmptyText }}
        scroll={{ x: 1000 }}
        headerTitle="系统配置"
      />
    </>
  );
}
