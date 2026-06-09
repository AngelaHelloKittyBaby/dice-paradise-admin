'use client';

import { ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useAdminRiskEvents } from '@/modules/admin/hooks/useAdminData';
import type { AdminRiskEvent } from '@/modules/admin/types';
import { AdminDataError, adminEmptyText } from '@/modules/admin/components/AdminDataState';
import { RiskLevelTag, RiskStatusTag } from '@/modules/admin/utils/adminFormat';

export default function AdminRiskPage() {
  const { data: risks, loading, error, refresh } = useAdminRiskEvents();

  const columns: ProColumns<AdminRiskEvent>[] = [
    { title: '风险ID', dataIndex: 'id', width: 120, copyable: true },
    { title: '用户', dataIndex: 'user', width: 130 },
    { title: '类型', dataIndex: 'type', width: 120 },
    { title: '触发规则', dataIndex: 'triggerRule', ellipsis: true },
    {
      title: '等级',
      dataIndex: 'level',
      width: 90,
      render: (_, record) => <RiskLevelTag level={record.level} />,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 110,
      render: (_, record) => <RiskStatusTag status={record.status} />,
    },
    { title: '触发时间', dataIndex: 'createdAt', width: 150 },
    {
      title: '操作',
      valueType: 'option',
      width: 190,
      render: () => [
        <Button key="process" type="link" size="small">
          处理
        </Button>,
        <Button key="user" type="link" size="small">
          查看用户
        </Button>,
        <Button key="disable" type="link" danger size="small">
          禁用
        </Button>,
      ],
    },
  ];

  return (
    <>
      <AdminDataError error={error} onRetry={refresh} />
      <ProTable<AdminRiskEvent>
        rowKey="id"
        columns={columns}
        dataSource={risks}
        loading={loading}
        search={false}
        cardBordered
        pagination={false}
        options={{ density: true, fullScreen: true, reload: false }}
        locale={{ emptyText: adminEmptyText }}
        scroll={{ x: 1000 }}
        headerTitle="风控事件"
      />
    </>
  );
}
