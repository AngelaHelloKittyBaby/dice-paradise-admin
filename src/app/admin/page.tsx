'use client';

import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { ProCard, ProTable, StatisticCard, type ProColumns } from '@ant-design/pro-components';
import { Space, Tag, Typography } from 'antd';
import { useAdminDashboard } from '@/modules/admin/hooks/useAdminData';
import type { AdminGameRecord, AdminRiskEvent } from '@/modules/admin/types';
import { AdminDataError, adminEmptyText } from '@/modules/admin/components/AdminDataState';
import { formatAdminNumber, GameStatusTag, RiskLevelTag, RiskStatusTag } from '@/modules/admin/utils/adminFormat';
import styles from '@/modules/admin/styles/adminPages.module.css';

const emptyValue = '未接入';

const gameColumns: ProColumns<AdminGameRecord>[] = [
  { title: '对局ID', dataIndex: 'id', width: 120 },
  { title: '模式', dataIndex: 'mode', width: 110, renderText: value => value || emptyValue },
  { title: '赢家', dataIndex: 'winner', width: 120, renderText: value => value || emptyValue },
  { title: '最高分', dataIndex: 'highestScore', width: 90, renderText: value => (value === null ? emptyValue : value) },
  {
    title: '状态',
    dataIndex: 'status',
    width: 110,
    render: (_, record) => <GameStatusTag status={record.status} />,
  },
];

const riskColumns: ProColumns<AdminRiskEvent>[] = [
  { title: '用户', dataIndex: 'user', width: 120 },
  { title: '风险类型', dataIndex: 'type', width: 130 },
  {
    title: '等级',
    dataIndex: 'level',
    width: 80,
    render: (_, record) => <RiskLevelTag level={record.level} />,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    render: (_, record) => <RiskStatusTag status={record.status} />,
  },
];

export default function AdminDashboardPage() {
  const { data: dashboard, loading, error, refresh } = useAdminDashboard();
  const maxOnline = dashboard.trends.length > 0 ? Math.max(...dashboard.trends.map(item => item.onlineUsers)) : 0;

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <AdminDataError error={error} onRetry={refresh} />
      <StatisticCard.Group direction="row">
        {dashboard.metrics.map(metric => (
          <StatisticCard
            key={metric.key}
            statistic={{
              title: metric.label,
              value: formatAdminNumber(metric.value),
              suffix: metric.suffix,
              description:
                typeof metric.trend === 'number' ? (
                  <Space size={4}>
                    {metric.trend >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    <span>较昨日 {Math.abs(metric.trend)}%</span>
                  </Space>
                ) : undefined,
            }}
          />
        ))}
      </StatisticCard.Group>

      <div className={styles.grid}>
        <ProCard title="今日在线趋势" className={styles.span8} bordered>
          <div className={styles.chartPanel}>
            {dashboard.trends.length > 0 ? dashboard.trends.map(point => (
              <div className={styles.chartBarGroup} key={point.label}>
                <div
                  className={styles.chartBar}
                  style={{ height: `${Math.max(12, (point.onlineUsers / (maxOnline || 1)) * 100)}%` }}
                  title={`${point.label} 在线 ${point.onlineUsers}`}
                />
                <div className={styles.chartLabel}>{point.label}</div>
              </div>
            )) : <Typography.Text type="secondary">{adminEmptyText}</Typography.Text>}
          </div>
        </ProCard>

        <ProCard title="游戏模式占比" className={styles.span4} bordered>
          <div className={styles.modeList}>
            {dashboard.modeStats.length > 0 ? dashboard.modeStats.map(item => (
              <div className={styles.modeRow} key={item.mode}>
                <span className={styles.modeName}>{item.mode}</span>
                <span className={styles.modeTrack}>
                  <span className={styles.modeFill} style={{ width: `${item.value}%`, background: item.color }} />
                </span>
                <span className={styles.modeValue}>{item.value}%</span>
              </div>
            )) : <Typography.Text type="secondary">{adminEmptyText}</Typography.Text>}
          </div>
        </ProCard>

        <ProCard title="最近对局" className={styles.span6} bordered>
          <ProTable<AdminGameRecord>
            rowKey="id"
            columns={gameColumns}
            dataSource={dashboard.recentGames}
            loading={loading}
            search={false}
            options={false}
            pagination={false}
            locale={{ emptyText: adminEmptyText }}
            size="small"
          />
        </ProCard>

        <ProCard
          title="风险提醒"
          className={styles.span6}
          bordered
          extra={<Tag color="red">需运营处理</Tag>}
        >
          <Typography.Paragraph className={styles.quietText}>
            客户端当前暂无风控列表接口，接入管理端接口后会在这里展示真实待处理项。
          </Typography.Paragraph>
          <ProTable<AdminRiskEvent>
            rowKey="id"
            columns={riskColumns}
            dataSource={dashboard.risks}
            loading={loading}
            search={false}
            options={false}
            pagination={false}
            locale={{ emptyText: adminEmptyText }}
            size="small"
          />
        </ProCard>
      </div>
    </Space>
  );
}
