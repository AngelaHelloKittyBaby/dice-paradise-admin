'use client';

import { ArrowDownOutlined, ArrowUpOutlined, MinusOutlined } from '@ant-design/icons';
import { ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, Space, Tag } from 'antd';
import { useAdminLeaderboard } from '@/modules/admin/hooks/useAdminData';
import type { AdminLeaderboardItem } from '@/modules/admin/types';
import { AdminDataError, adminEmptyText } from '@/modules/admin/components/AdminDataState';
import { formatAdminNumber } from '@/modules/admin/utils/adminFormat';

const categoryMap: Record<AdminLeaderboardItem['category'], string> = {
  wins: '胜场',
  games: '总对局',
};

const emptyValue = '未接入';

function DeltaView({ delta }: { delta: number | null }) {
  if (delta === null) return <Tag>{emptyValue}</Tag>;

  if (delta > 0) {
    return (
      <Space size={4}>
        <ArrowUpOutlined style={{ color: '#52c41a' }} />
        <span>{delta}</span>
      </Space>
    );
  }

  if (delta < 0) {
    return (
      <Space size={4}>
        <ArrowDownOutlined style={{ color: '#ff4d4f' }} />
        <span>{Math.abs(delta)}</span>
      </Space>
    );
  }

  return (
    <Space size={4}>
      <MinusOutlined />
      <span>持平</span>
    </Space>
  );
}

export default function AdminLeaderboardPage() {
  const { data: leaderboard, loading, error, refresh } = useAdminLeaderboard();

  const columns: ProColumns<AdminLeaderboardItem>[] = [
    { title: '排名', dataIndex: 'rank', width: 90, sorter: (a, b) => a.rank - b.rank },
    { title: '用户ID', dataIndex: 'userId', width: 120, copyable: true },
    { title: '昵称', dataIndex: 'nickname', width: 140 },
    {
      title: '榜单',
      dataIndex: 'category',
      width: 110,
      render: (_, record) => <Tag color="blue">{categoryMap[record.category]}</Tag>,
    },
    {
      title: '数值',
      dataIndex: 'value',
      width: 120,
      sorter: (a, b) => (a.value ?? -1) - (b.value ?? -1),
      renderText: value => (value === null ? emptyValue : formatAdminNumber(Number(value))),
    },
    {
      title: '排名变化',
      dataIndex: 'delta',
      width: 110,
      render: (_, record) => <DeltaView delta={record.delta} />,
    },
    {
      title: '异常',
      dataIndex: 'flagged',
      width: 100,
      render: (_, record) => {
        if (record.flagged === null) return <Tag>{emptyValue}</Tag>;

        return <Tag color={record.flagged ? 'red' : 'green'}>{record.flagged ? '待复核' : '正常'}</Tag>;
      },
    },
    { title: '更新时间', dataIndex: 'updatedAt', width: 150, renderText: value => value || emptyValue },
    {
      title: '操作',
      valueType: 'option',
      width: 160,
      render: () => [
        <Button key="user" type="link" size="small">
          查看用户
        </Button>,
        <Button key="flag" type="link" size="small">
          标记异常
        </Button>,
      ],
    },
  ];

  return (
    <>
      <AdminDataError error={error} onRetry={refresh} />
      <ProTable<AdminLeaderboardItem>
        rowKey={record => `${record.category}-${record.rank}`}
        columns={columns}
        dataSource={leaderboard}
        loading={loading}
        search={false}
        cardBordered
        pagination={false}
        options={{ density: true, fullScreen: true, reload: false }}
        locale={{ emptyText: adminEmptyText }}
        scroll={{ x: 1100 }}
        headerTitle="排行榜数据"
      />
    </>
  );
}
