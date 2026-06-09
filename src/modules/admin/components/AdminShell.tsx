'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AlertOutlined,
  AuditOutlined,
  BarChartOutlined,
  CommentOutlined,
  ControlOutlined,
  CrownOutlined,
  DashboardOutlined,
  GiftOutlined,
  NotificationOutlined,
  PlayCircleOutlined,
  SettingOutlined,
  TableOutlined,
  TeamOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { PageContainer, ProLayout, type MenuDataItem } from '@ant-design/pro-components';
import { App as AntApp, Button, ConfigProvider, Space, Tag, Typography } from 'antd';
import styles from '../styles/AdminShell.module.css';

const adminRoutes: MenuDataItem[] = [
  { path: '/admin', name: '运营概览', icon: <DashboardOutlined /> },
  { path: '/admin/users', name: '用户管理', icon: <TeamOutlined /> },
  { path: '/admin/rooms', name: '房间管理', icon: <TableOutlined /> },
  { path: '/admin/games', name: '对局管理', icon: <PlayCircleOutlined /> },
  { path: '/admin/leaderboard', name: '排行榜管理', icon: <TrophyOutlined /> },
  {
    name: '运营内容',
    icon: <NotificationOutlined />,
    children: [
      { path: '/admin/activities', name: '活动与任务', icon: <GiftOutlined /> },
      { path: '/admin/achievements', name: '成就管理', icon: <CrownOutlined /> },
      { path: '/admin/chat', name: '聊天与公告', icon: <CommentOutlined /> },
    ],
  },
  { path: '/admin/rewards', name: '金币与奖励', icon: <BarChartOutlined /> },
  { path: '/admin/risk', name: '风控与审核', icon: <AlertOutlined /> },
  {
    name: '系统管理',
    icon: <ControlOutlined />,
    children: [
      { path: '/admin/settings', name: '系统设置', icon: <SettingOutlined /> },
      { path: '/admin/audit', name: '操作日志', icon: <AuditOutlined /> },
    ],
  },
];

function getPageTitle(pathname: string) {
  const flatRoutes = adminRoutes.flatMap(route => [route, ...(route.children ?? [])]);
  return flatRoutes.find(route => route.path === pathname)?.name ?? '运营概览';
}

function reloadAdminData() {
  window.location.reload();
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '/admin';

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          colorInfo: '#1677ff',
          colorBgLayout: '#f5f7fb',
          borderRadius: 8,
          fontSize: 14,
        },
        components: {
          Card: {
            borderRadiusLG: 8,
          },
          Table: {
            headerBg: '#f8fafc',
            rowHoverBg: '#f8fbff',
          },
        },
      }}
    >
      <AntApp>
        <div className={styles.adminFrame}>
          <ProLayout
            title="投骰乐园后台"
            logo={<span className={styles.brandMark}>D</span>}
            route={{ path: '/admin', children: adminRoutes }}
            location={{ pathname }}
            layout="mix"
            navTheme="light"
            siderWidth={224}
            fixedHeader
            fixSiderbar
            colorWeak={false}
            contentStyle={{ padding: 0 }}
            menuItemRender={(item, dom) => (item.path ? <Link href={item.path}>{dom}</Link> : dom)}
            actionsRender={() => [
              <div className={styles.topActions} key="env">
                <Tag color="blue">真实接口</Tag>
                <Tag color="green">运营后台</Tag>
              </div>,
            ]}
            avatarProps={{
              title: '运营管理员',
              src: undefined,
              render: (_, dom) => (
                <Space size={12}>
                  {dom}
                  <Button size="small" type="text">
                    退出
                  </Button>
                </Space>
              ),
            }}
            token={{
              header: {
                colorBgHeader: '#ffffff',
                colorHeaderTitle: '#0f172a',
                colorTextMenu: '#334155',
              },
              sider: {
                colorMenuBackground: '#ffffff',
                colorTextMenu: '#475569',
                colorTextMenuSelected: '#1677ff',
                colorBgMenuItemSelected: '#eaf3ff',
              },
              pageContainer: {
                paddingBlockPageContainerContent: 24,
                paddingInlinePageContainerContent: 24,
              },
            }}
          >
            <main className={styles.contentWrap}>
              <PageContainer
                title={getPageTitle(pathname)}
                subTitle="清晰、克制、面向运营管理的后台控制台"
                extra={[
                  <Button key="refresh" onClick={reloadAdminData}>
                    刷新数据
                  </Button>,
                  <Button key="export" type="primary">
                    导出报表
                  </Button>,
                ]}
              >
                <Typography.Paragraph className={styles.pageIntro}>
                  数据优先来自玩家端已接入的真实接口；尚未提供管理端接口的模块会保持空状态。
                </Typography.Paragraph>
                {children}
              </PageContainer>
            </main>
          </ProLayout>
        </div>
      </AntApp>
    </ConfigProvider>
  );
}
