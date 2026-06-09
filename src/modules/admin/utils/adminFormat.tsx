import { Tag } from 'antd';
import type {
  AdminActivityStatus,
  AdminChatStatus,
  AdminGameStatus,
  AdminRiskLevel,
  AdminRiskStatus,
  AdminRoomStatus,
  AdminUserStatus,
} from '@/modules/admin/types';

const numberFormatter = new Intl.NumberFormat('zh-CN');

export function formatAdminNumber(value: number) {
  return numberFormatter.format(value);
}

const userStatusMap: Record<AdminUserStatus, { label: string; color: string }> = {
  normal: { label: '正常', color: 'green' },
  muted: { label: '禁言', color: 'orange' },
  disabled: { label: '禁用', color: 'red' },
  risk: { label: '风控', color: 'volcano' },
};

const roomStatusMap: Record<AdminRoomStatus, { label: string; color: string }> = {
  waiting: { label: '等待中', color: 'blue' },
  countdown: { label: '倒计时', color: 'purple' },
  playing: { label: '游戏中', color: 'green' },
  finished: { label: '已结束', color: 'default' },
  closed: { label: '已关闭', color: 'red' },
  unknown: { label: '未知', color: 'default' },
};

const gameStatusMap: Record<AdminGameStatus, { label: string; color: string }> = {
  playing: { label: '进行中', color: 'green' },
  completed: { label: '已完成', color: 'blue' },
  interrupted: { label: '异常中断', color: 'red' },
  unknown: { label: '未知', color: 'default' },
};

const activityStatusMap: Record<AdminActivityStatus, { label: string; color: string }> = {
  draft: { label: '草稿', color: 'default' },
  scheduled: { label: '待上线', color: 'blue' },
  online: { label: '已上线', color: 'green' },
  offline: { label: '已下线', color: 'red' },
};

const chatStatusMap: Record<AdminChatStatus, { label: string; color: string }> = {
  normal: { label: '正常', color: 'green' },
  hidden: { label: '已屏蔽', color: 'red' },
  reported: { label: '已举报', color: 'orange' },
};

const riskLevelMap: Record<AdminRiskLevel, { label: string; color: string }> = {
  low: { label: '低', color: 'blue' },
  medium: { label: '中', color: 'orange' },
  high: { label: '高', color: 'red' },
};

const riskStatusMap: Record<AdminRiskStatus, { label: string; color: string }> = {
  pending: { label: '待处理', color: 'red' },
  processing: { label: '处理中', color: 'orange' },
  resolved: { label: '已处理', color: 'green' },
};

function StatusTag({ item }: { item: { label: string; color: string } }) {
  return <Tag color={item.color}>{item.label}</Tag>;
}

export function UserStatusTag({ status }: { status: AdminUserStatus }) {
  return <StatusTag item={userStatusMap[status]} />;
}

export function RoomStatusTag({ status }: { status: AdminRoomStatus }) {
  return <StatusTag item={roomStatusMap[status]} />;
}

export function GameStatusTag({ status }: { status: AdminGameStatus }) {
  return <StatusTag item={gameStatusMap[status]} />;
}

export function ActivityStatusTag({ status }: { status: AdminActivityStatus }) {
  return <StatusTag item={activityStatusMap[status]} />;
}

export function ChatStatusTag({ status }: { status: AdminChatStatus }) {
  return <StatusTag item={chatStatusMap[status]} />;
}

export function RiskLevelTag({ level }: { level: AdminRiskLevel }) {
  return <StatusTag item={riskLevelMap[level]} />;
}

export function RiskStatusTag({ status }: { status: AdminRiskStatus }) {
  return <StatusTag item={riskStatusMap[status]} />;
}
