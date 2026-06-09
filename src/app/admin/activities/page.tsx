'use client';

import { ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, Progress, Tag } from 'antd';
import { useAdminActivities } from '@/modules/admin/hooks/useAdminData';
import type { AdminActivity } from '@/modules/admin/types';
import { AdminDataError, adminEmptyText } from '@/modules/admin/components/AdminDataState';
import { ActivityStatusTag, formatAdminNumber } from '@/modules/admin/utils/adminFormat';

const activityTypeMap: Record<AdminActivity['type'], string> = {
  dailyTask: '每日任务',
  signIn: '每日签到',
  event: '限时活动',
  rewardPool: '奖励池',
};

export default function AdminActivitiesPage() {
  const { data: activities, loading, error, refresh } = useAdminActivities();

  const columns: ProColumns<AdminActivity>[] = [
    { title: '活动ID', dataIndex: 'id', width: 150, copyable: true },
    { title: '名称', dataIndex: 'title', width: 170 },
    {
      title: '类型',
      dataIndex: 'type',
      width: 110,
      render: (_, record) => <Tag>{activityTypeMap[record.type]}</Tag>,
    },
    { title: '奖励', dataIndex: 'reward', width: 140 },
    {
      title: '参与人数',
      dataIndex: 'participants',
      width: 110,
      sorter: (a, b) => a.participants - b.participants,
      renderText: value => formatAdminNumber(Number(value)),
    },
    {
      title: '完成率',
      dataIndex: 'completionRate',
      width: 150,
      render: (_, record) => <Progress percent={record.completionRate} size="small" />,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 110,
      render: (_, record) => <ActivityStatusTag status={record.status} />,
    },
    { title: '开始时间', dataIndex: 'startsAt', width: 150 },
    { title: '结束时间', dataIndex: 'endsAt', width: 150 },
    {
      title: '操作',
      valueType: 'option',
      width: 180,
      render: () => [
        <Button key="edit" type="link" size="small">
          编辑
        </Button>,
        <Button key="copy" type="link" size="small">
          复制
        </Button>,
        <Button key="online" type="link" size="small">
          上下线
        </Button>,
      ],
    },
  ];

  return (
    <>
      <AdminDataError error={error} onRetry={refresh} />
      <ProTable<AdminActivity>
        rowKey="id"
        columns={columns}
        dataSource={activities}
        loading={loading}
        search={false}
        cardBordered
        pagination={false}
        options={{ density: true, fullScreen: true, reload: false }}
        locale={{ emptyText: adminEmptyText }}
        scroll={{ x: 1300 }}
        headerTitle="活动与任务配置"
        toolBarRender={() => [
          <Button key="new" type="primary">
            新建活动
          </Button>,
        ]}
      />
    </>
  );
}
