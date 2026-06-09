'use client';

import { ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, Tag } from 'antd';
import { useAdminAchievements } from '@/modules/admin/hooks/useAdminData';
import type { AdminAchievement } from '@/modules/admin/types';
import { AdminDataError, adminEmptyText } from '@/modules/admin/components/AdminDataState';
import { formatAdminNumber } from '@/modules/admin/utils/adminFormat';

const achievementTypeMap: Record<AdminAchievement['type'], string> = {
  score: '分数',
  match: '对局',
  streak: '连胜',
  activity: '活动',
};

const rarityMap: Record<AdminAchievement['rarity'], { label: string; color: string }> = {
  common: { label: '普通', color: 'default' },
  rare: { label: '稀有', color: 'blue' },
  epic: { label: '史诗', color: 'purple' },
  legendary: { label: '传说', color: 'gold' },
};

export default function AdminAchievementsPage() {
  const { data: achievements, loading, error, refresh } = useAdminAchievements();

  const columns: ProColumns<AdminAchievement>[] = [
    { title: '成就ID', dataIndex: 'id', width: 110, copyable: true },
    { title: '名称', dataIndex: 'title', width: 140 },
    {
      title: '类型',
      dataIndex: 'type',
      width: 90,
      render: (_, record) => <Tag>{achievementTypeMap[record.type]}</Tag>,
    },
    {
      title: '稀有度',
      dataIndex: 'rarity',
      width: 100,
      render: (_, record) => {
        const rarity = rarityMap[record.rarity];
        return <Tag color={rarity.color}>{rarity.label}</Tag>;
      },
    },
    { title: '解锁条件', dataIndex: 'unlockCondition', width: 220 },
    { title: '奖励', dataIndex: 'rewards', width: 130 },
    {
      title: '解锁人数',
      dataIndex: 'unlockedUsers',
      width: 110,
      sorter: (a, b) => a.unlockedUsers - b.unlockedUsers,
      renderText: value => formatAdminNumber(Number(value)),
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      width: 100,
      render: (_, record) => <Tag color={record.enabled ? 'green' : 'default'}>{record.enabled ? '启用' : '停用'}</Tag>,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 160,
      render: () => [
        <Button key="edit" type="link" size="small">
          编辑
        </Button>,
        <Button key="users" type="link" size="small">
          解锁用户
        </Button>,
      ],
    },
  ];

  return (
    <>
      <AdminDataError error={error} onRetry={refresh} />
      <ProTable<AdminAchievement>
        rowKey="id"
        columns={columns}
        dataSource={achievements}
        loading={loading}
        search={false}
        cardBordered
        pagination={false}
        options={{ density: true, fullScreen: true, reload: false }}
        locale={{ emptyText: adminEmptyText }}
        scroll={{ x: 1100 }}
        headerTitle="成就徽章配置"
        toolBarRender={() => [
          <Button key="new" type="primary">
            新建成就
          </Button>,
        ]}
      />
    </>
  );
}
