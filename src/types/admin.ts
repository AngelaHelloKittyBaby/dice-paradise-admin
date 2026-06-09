export type AdminMetricTone = 'blue' | 'green' | 'orange' | 'red' | 'purple';

export interface AdminMetric {
  key: string;
  label: string;
  value: number;
  suffix?: string;
  trend?: number | null;
  tone: AdminMetricTone;
}

export interface AdminTrendPoint {
  label: string;
  onlineUsers: number;
  games: number;
  rewards: number;
}

export interface AdminModeStat {
  mode: string;
  value: number;
  color: string;
}

export type AdminUserStatus = 'normal' | 'muted' | 'disabled' | 'risk';

export interface AdminUser {
  id: string;
  nickname: string;
  accountType: 'guest' | 'registered' | 'admin' | null;
  level: number | null;
  coins: number | null;
  gems: number | null;
  games: number | null;
  wins: number | null;
  winRate: number | null;
  highestScore: number | null;
  status: AdminUserStatus | null;
  registeredAt: string;
  lastLoginAt: string;
}

export type AdminRoomStatus = 'waiting' | 'countdown' | 'playing' | 'finished' | 'closed' | 'unknown';

export interface AdminRoom {
  id: string;
  name: string;
  owner: string;
  mode: string;
  players: number;
  capacity: number | null;
  status: AdminRoomStatus;
  isPublic: boolean | null;
  createdAt: string;
  lastActiveAt: string;
}

export type AdminGameStatus = 'playing' | 'completed' | 'interrupted' | 'unknown';

export interface AdminGameRecord {
  id: string;
  roomId: string;
  mode: string;
  winner: string;
  playerCount: number;
  highestScore: number | null;
  durationMinutes: number | null;
  status: AdminGameStatus;
  startedAt: string;
  endedAt: string;
}

export type AdminActivityStatus = 'draft' | 'scheduled' | 'online' | 'offline';

export interface AdminActivity {
  id: string;
  title: string;
  type: 'dailyTask' | 'signIn' | 'event' | 'rewardPool';
  reward: string;
  participants: number;
  completionRate: number;
  status: AdminActivityStatus;
  startsAt: string;
  endsAt: string;
}

export interface AdminLeaderboardItem {
  rank: number;
  userId: string;
  nickname: string;
  category: 'wins' | 'games';
  value: number | null;
  delta: number | null;
  updatedAt: string;
  flagged: boolean | null;
}

export interface AdminAchievement {
  id: string;
  title: string;
  type: 'score' | 'match' | 'streak' | 'activity';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockCondition: string;
  rewards: string;
  unlockedUsers: number;
  enabled: boolean;
}

export type AdminChatStatus = 'normal' | 'hidden' | 'reported';

export interface AdminChatMessage {
  id: string;
  sender: string;
  source: 'lobby' | 'room' | 'system';
  content: string;
  status: AdminChatStatus;
  sentAt: string;
}

export interface AdminRewardFlow {
  id: string;
  user: string;
  type: 'earn' | 'spend' | 'adjust';
  amount: number;
  source: 'task' | 'activity' | 'game' | 'admin';
  beforeBalance: number;
  afterBalance: number;
  createdAt: string;
}

export type AdminRiskLevel = 'low' | 'medium' | 'high';
export type AdminRiskStatus = 'pending' | 'processing' | 'resolved';

export interface AdminRiskEvent {
  id: string;
  user: string;
  level: AdminRiskLevel;
  type: string;
  triggerRule: string;
  status: AdminRiskStatus;
  createdAt: string;
}

export interface AdminConfigItem {
  key: string;
  name: string;
  value: string;
  group: 'game' | 'reward' | 'feature' | 'system';
  description: string;
  editable: boolean;
}

export interface AdminAuditLog {
  id: string;
  operator: string;
  module: string;
  action: string;
  target: string;
  result: 'success' | 'failed';
  createdAt: string;
}

export interface AdminDashboardData {
  metrics: AdminMetric[];
  trends: AdminTrendPoint[];
  modeStats: AdminModeStat[];
  recentGames: AdminGameRecord[];
  risks: AdminRiskEvent[];
}
