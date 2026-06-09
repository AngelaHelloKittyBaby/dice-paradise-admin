'use client';

import { ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, Tag } from 'antd';
import { useAdminGameRecords } from '@/modules/admin/hooks/useAdminData';
import type { AdminGameRecord } from '@/modules/admin/types';
import { AdminDataError, adminEmptyText } from '@/modules/admin/components/AdminDataState';
import { formatAdminNumber, GameStatusTag } from '@/modules/admin/utils/adminFormat';

const emptyValue = '未接入';

function compareNullableNumber(first: number | null, second: number | null) {
  return (first ?? -1) - (second ?? -1);
}

function formatNullableNumber(value: number | null) {
  return value === null ? emptyValue : formatAdminNumber(value);
}

export default function AdminGamesPage() {
  const { data: games, loading, error, refresh } = useAdminGameRecords();

  const columns: ProColumns<AdminGameRecord>[] = [
    { title: '对局ID', dataIndex: 'id', width: 120, copyable: true },
    { title: '房间ID', dataIndex: 'roomId', width: 120, renderText: value => value || emptyValue },
    { title: '模式', dataIndex: 'mode', width: 120, renderText: value => value || emptyValue },
    { title: '玩家数', dataIndex: 'playerCount', width: 90 },
    {
      title: '赢家',
      dataIndex: 'winner',
      width: 120,
      render: (_, record) => <Tag color={record.winner ? 'blue' : 'default'}>{record.winner || emptyValue}</Tag>,
    },
    {
      title: '最高分',
      dataIndex: 'highestScore',
      width: 100,
      sorter: (a, b) => compareNullableNumber(a.highestScore, b.highestScore),
      renderText: value => formatNullableNumber(value as number | null),
    },
    {
      title: '时长',
      dataIndex: 'durationMinutes',
      width: 90,
      renderText: value => (value === null ? emptyValue : `${value} 分钟`),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 110,
      render: (_, record) => <GameStatusTag status={record.status} />,
    },
    { title: '开始时间', dataIndex: 'startedAt', width: 150, renderText: value => value || emptyValue },
    { title: '结束时间', dataIndex: 'endedAt', width: 150, renderText: value => value || emptyValue },
    {
      title: '操作',
      valueType: 'option',
      width: 170,
      render: () => [
        <Button key="detail" type="link" size="small">
          分数明细
        </Button>,
        <Button key="events" type="link" size="small">
          投骰记录
        </Button>,
      ],
    },
  ];

  return (
    <>
      <AdminDataError error={error} onRetry={refresh} />
      <ProTable<AdminGameRecord>
        rowKey="id"
        columns={columns}
        dataSource={games}
        loading={loading}
        search={false}
        cardBordered
        pagination={false}
        options={{ density: true, fullScreen: true, reload: false }}
        locale={{ emptyText: adminEmptyText }}
        scroll={{ x: 1200 }}
        headerTitle="对局记录"
      />
    </>
  );
}
