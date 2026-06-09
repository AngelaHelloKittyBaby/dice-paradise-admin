'use client';

import { ProTable, StatisticCard, type ProColumns } from '@ant-design/pro-components';
import { Button, Space, Tag } from 'antd';
import { useAdminRewardFlows } from '@/hooks';
import type { AdminRewardFlow } from '@/types/admin';
import { AdminDataError, adminEmptyText } from '@/modules/admin/AdminDataState';
import { formatAdminNumber } from '@/modules/admin/adminFormat';

const rewardTypeMap: Record<AdminRewardFlow['type'], { label: string; color: string }> = {
  earn: { label: '获得', color: 'green' },
  spend: { label: '消耗', color: 'orange' },
  adjust: { label: '后台调整', color: 'red' },
};

const rewardSourceMap: Record<AdminRewardFlow['source'], string> = {
  task: '任务',
  activity: '活动',
  game: '对局',
  admin: '管理员',
};

export default function AdminRewardsPage() {
  const { data: flows, loading, error, refresh } = useAdminRewardFlows();
  const totalEarn = flows.filter(item => item.amount > 0).reduce((sum, item) => sum + item.amount, 0);
  const totalSpend = flows.filter(item => item.amount < 0).reduce((sum, item) => sum + Math.abs(item.amount), 0);
  const adjustCount = flows.filter(item => item.type === 'adjust').length;

  const columns: ProColumns<AdminRewardFlow>[] = [
    { title: '流水ID', dataIndex: 'id', width: 120, copyable: true },
    { title: '用户', dataIndex: 'user', width: 130 },
    {
      title: '类型',
      dataIndex: 'type',
      width: 110,
      render: (_, record) => {
        const type = rewardTypeMap[record.type];
        return <Tag color={type.color}>{type.label}</Tag>;
      },
    },
    {
      title: '数量',
      dataIndex: 'amount',
      width: 110,
      sorter: (a, b) => a.amount - b.amount,
      renderText: value => formatAdminNumber(Number(value)),
    },
    {
      title: '来源',
      dataIndex: 'source',
      width: 100,
      render: (_, record) => <Tag>{rewardSourceMap[record.source]}</Tag>,
    },
    {
      title: '变动前',
      dataIndex: 'beforeBalance',
      width: 120,
      renderText: value => formatAdminNumber(Number(value)),
    },
    {
      title: '变动后',
      dataIndex: 'afterBalance',
      width: 120,
      renderText: value => formatAdminNumber(Number(value)),
    },
    { title: '时间', dataIndex: 'createdAt', width: 150 },
    {
      title: '操作',
      valueType: 'option',
      width: 120,
      render: () => [
        <Button key="detail" type="link" size="small">
          详情
        </Button>,
      ],
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <AdminDataError error={error} onRetry={refresh} />
      <StatisticCard.Group direction="row">
        <StatisticCard statistic={{ title: '金币发放', value: formatAdminNumber(totalEarn), suffix: '枚' }} />
        <StatisticCard statistic={{ title: '金币消耗', value: formatAdminNumber(totalSpend), suffix: '枚' }} />
        <StatisticCard statistic={{ title: '后台调整', value: adjustCount, suffix: '笔' }} />
      </StatisticCard.Group>

      <ProTable<AdminRewardFlow>
        rowKey="id"
        columns={columns}
        dataSource={flows}
        loading={loading}
        search={false}
        cardBordered
        pagination={false}
        options={{ density: true, fullScreen: true, reload: false }}
        locale={{ emptyText: adminEmptyText }}
        scroll={{ x: 1100 }}
        headerTitle="金币流水"
        toolBarRender={() => [
          <Button key="manual" type="primary">
            手动补发奖励
          </Button>,
        ]}
      />
    </Space>
  );
}
