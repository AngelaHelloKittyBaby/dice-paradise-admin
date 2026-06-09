'use client';

import { useState } from 'react';
import { ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, Descriptions, Drawer, Space, Tag } from 'antd';
import { useAdminUsers } from '@/modules/admin/hooks/useAdminData';
import type { AdminUser } from '@/modules/admin/types';
import { AdminDataError, adminEmptyText } from '@/modules/admin/components/AdminDataState';
import { formatAdminNumber, UserStatusTag } from '@/modules/admin/utils/adminFormat';

const emptyValue = '未接入';
const accountTypeMap: Record<Exclude<AdminUser['accountType'], null>, string> = {
  guest: '游客',
  registered: '注册用户',
  admin: '管理员',
};

function formatNullableNumber(value: number | null) {
  return value === null ? emptyValue : formatAdminNumber(value);
}

function formatNullablePercent(value: number | null) {
  return value === null ? emptyValue : `${value}%`;
}

function compareNullableNumber(first: number | null, second: number | null) {
  return (first ?? -1) - (second ?? -1);
}

export default function AdminUsersPage() {
  const { data: users, loading, error, refresh } = useAdminUsers();
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const columns: ProColumns<AdminUser>[] = [
    { title: '用户ID', dataIndex: 'id', width: 110, copyable: true },
    { title: '昵称', dataIndex: 'nickname', width: 130 },
    {
      title: '账号类型',
      dataIndex: 'accountType',
      width: 110,
      filters: Object.entries(accountTypeMap).map(([value, text]) => ({ text, value })),
      onFilter: (value, record) => record.accountType === value,
      render: (_, record) => (record.accountType ? <Tag>{accountTypeMap[record.accountType]}</Tag> : <Tag>{emptyValue}</Tag>),
    },
    {
      title: '等级',
      dataIndex: 'level',
      width: 80,
      sorter: (a, b) => compareNullableNumber(a.level, b.level),
      renderText: value => formatNullableNumber(value as number | null),
    },
    {
      title: '金币',
      dataIndex: 'coins',
      width: 110,
      sorter: (a, b) => compareNullableNumber(a.coins, b.coins),
      renderText: value => formatNullableNumber(value as number | null),
    },
    {
      title: '胜场',
      dataIndex: 'wins',
      width: 90,
      sorter: (a, b) => compareNullableNumber(a.wins, b.wins),
      renderText: value => formatNullableNumber(value as number | null),
    },
    {
      title: '对局数',
      dataIndex: 'games',
      width: 90,
      sorter: (a, b) => compareNullableNumber(a.games, b.games),
      renderText: value => formatNullableNumber(value as number | null),
    },
    { title: '胜率', dataIndex: 'winRate', width: 90, renderText: value => formatNullablePercent(value as number | null) },
    {
      title: '最高分',
      dataIndex: 'highestScore',
      width: 90,
      sorter: (a, b) => compareNullableNumber(a.highestScore, b.highestScore),
      renderText: value => formatNullableNumber(value as number | null),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (_, record) => (record.status ? <UserStatusTag status={record.status} /> : <Tag>{emptyValue}</Tag>),
    },
    { title: '最近登录', dataIndex: 'lastLoginAt', width: 150 },
    {
      title: '操作',
      valueType: 'option',
      width: 180,
      render: (_, record) => [
        <Button key="detail" type="link" size="small" onClick={() => setSelectedUser(record)}>
          查看
        </Button>,
        <Button key="coins" type="link" size="small">
          调整金币
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
      <ProTable<AdminUser>
        rowKey="id"
        columns={columns}
        dataSource={users}
        loading={loading}
        search={false}
        cardBordered
        pagination={{ pageSize: 8 }}
        options={{ density: true, fullScreen: true, reload: false }}
        locale={{ emptyText: adminEmptyText }}
        scroll={{ x: 1200 }}
        headerTitle="玩家账号列表"
      />

      <Drawer
        title="用户详情"
        width={520}
        open={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        destroyOnClose
      >
        {selectedUser ? (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="用户ID">{selectedUser.id}</Descriptions.Item>
              <Descriptions.Item label="昵称">{selectedUser.nickname}</Descriptions.Item>
              <Descriptions.Item label="账号类型">
                {selectedUser.accountType ? accountTypeMap[selectedUser.accountType] : emptyValue}
              </Descriptions.Item>
              <Descriptions.Item label="等级">{formatNullableNumber(selectedUser.level)}</Descriptions.Item>
              <Descriptions.Item label="金币">{formatNullableNumber(selectedUser.coins)}</Descriptions.Item>
              <Descriptions.Item label="宝石">{formatNullableNumber(selectedUser.gems)}</Descriptions.Item>
              <Descriptions.Item label="胜场">{formatNullableNumber(selectedUser.wins)}</Descriptions.Item>
              <Descriptions.Item label="总对局">{formatNullableNumber(selectedUser.games)}</Descriptions.Item>
              <Descriptions.Item label="胜率">{formatNullablePercent(selectedUser.winRate)}</Descriptions.Item>
              <Descriptions.Item label="最高分">{formatNullableNumber(selectedUser.highestScore)}</Descriptions.Item>
              <Descriptions.Item label="状态">
                {selectedUser.status ? <UserStatusTag status={selectedUser.status} /> : <Tag>{emptyValue}</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="注册时间">{selectedUser.registeredAt || emptyValue}</Descriptions.Item>
              <Descriptions.Item label="最近登录">{selectedUser.lastLoginAt || emptyValue}</Descriptions.Item>
            </Descriptions>
            <Space>
              <Button type="primary">查看对局记录</Button>
              <Button>查看成就</Button>
              <Button danger>禁用账号</Button>
            </Space>
          </Space>
        ) : null}
      </Drawer>
    </>
  );
}
