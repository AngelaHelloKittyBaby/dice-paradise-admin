'use client';

import { ProTable, type ProColumns } from '@ant-design/pro-components';
import { Tag } from 'antd';
import { useAdminAuditLogs } from '@/modules/admin/hooks/useAdminData';
import type { AdminAuditLog } from '@/modules/admin/types';
import { AdminDataError, adminEmptyText } from '@/modules/admin/components/AdminDataState';

export default function AdminAuditPage() {
  const { data: logs, loading, error, refresh } = useAdminAuditLogs();

  const columns: ProColumns<AdminAuditLog>[] = [
    { title: '日志ID', dataIndex: 'id', width: 120, copyable: true },
    { title: '操作人', dataIndex: 'operator', width: 130 },
    { title: '模块', dataIndex: 'module', width: 130 },
    { title: '操作', dataIndex: 'action', width: 150 },
    { title: '对象', dataIndex: 'target', ellipsis: true },
    {
      title: '结果',
      dataIndex: 'result',
      width: 100,
      render: (_, record) => <Tag color={record.result === 'success' ? 'green' : 'red'}>{record.result === 'success' ? '成功' : '失败'}</Tag>,
    },
    { title: '时间', dataIndex: 'createdAt', width: 150 },
  ];

  return (
    <>
      <AdminDataError error={error} onRetry={refresh} />
      <ProTable<AdminAuditLog>
        rowKey="id"
        columns={columns}
        dataSource={logs}
        loading={loading}
        search={false}
        cardBordered
        pagination={false}
        options={{ density: true, fullScreen: true, reload: false }}
        locale={{ emptyText: adminEmptyText }}
        scroll={{ x: 1000 }}
        headerTitle="后台操作日志"
      />
    </>
  );
}
