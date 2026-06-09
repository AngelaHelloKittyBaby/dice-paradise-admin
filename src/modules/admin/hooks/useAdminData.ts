'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  getAdminAchievements,
  getAdminActivities,
  getAdminAuditLogs,
  getAdminChatMessages,
  getAdminConfig,
  getAdminDashboard,
  getAdminGameRecords,
  getAdminLeaderboard,
  getAdminRewardFlows,
  getAdminRiskEvents,
  getAdminRooms,
  getAdminUsers,
} from '@/modules/admin/api/adminApi';
import type {
  AdminAchievement,
  AdminActivity,
  AdminAuditLog,
  AdminChatMessage,
  AdminConfigItem,
  AdminDashboardData,
  AdminGameRecord,
  AdminLeaderboardItem,
  AdminRewardFlow,
  AdminRiskEvent,
  AdminRoom,
  AdminUser,
} from '@/modules/admin/types';

export interface AdminDataState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const emptyDashboard: AdminDashboardData = {
  metrics: [],
  trends: [],
  modeStats: [],
  recentGames: [],
  risks: [],
};
const emptyUsers: AdminUser[] = [];
const emptyRooms: AdminRoom[] = [];
const emptyGameRecords: AdminGameRecord[] = [];
const emptyActivities: AdminActivity[] = [];
const emptyLeaderboard: AdminLeaderboardItem[] = [];
const emptyAchievements: AdminAchievement[] = [];
const emptyChatMessages: AdminChatMessage[] = [];
const emptyRewardFlows: AdminRewardFlow[] = [];
const emptyRiskEvents: AdminRiskEvent[] = [];
const emptyConfig: AdminConfigItem[] = [];
const emptyAuditLogs: AdminAuditLog[] = [];

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '数据加载失败';
}

function useAdminResource<T>(initialData: T, loader: () => Promise<T>): AdminDataState<T> {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion(currentVersion => currentVersion + 1), []);

  useEffect(() => {
    let isActive = true;

    setLoading(true);
    setError(null);

    loader()
      .then(nextData => {
        if (!isActive) return;
        setData(nextData);
      })
      .catch(fetchError => {
        if (!isActive) return;
        setData(initialData);
        setError(getErrorMessage(fetchError));
      })
      .finally(() => {
        if (!isActive) return;
        setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [initialData, loader, version]);

  return { data, loading, error, refresh };
}

export function useAdminDashboard() {
  return useAdminResource<AdminDashboardData>(emptyDashboard, getAdminDashboard);
}

export function useAdminUsers() {
  return useAdminResource<AdminUser[]>(emptyUsers, getAdminUsers);
}

export function useAdminRooms() {
  return useAdminResource<AdminRoom[]>(emptyRooms, getAdminRooms);
}

export function useAdminGameRecords() {
  return useAdminResource<AdminGameRecord[]>(emptyGameRecords, getAdminGameRecords);
}

export function useAdminActivities() {
  return useAdminResource<AdminActivity[]>(emptyActivities, getAdminActivities);
}

export function useAdminLeaderboard() {
  return useAdminResource<AdminLeaderboardItem[]>(emptyLeaderboard, getAdminLeaderboard);
}

export function useAdminAchievements() {
  return useAdminResource<AdminAchievement[]>(emptyAchievements, getAdminAchievements);
}

export function useAdminChatMessages() {
  return useAdminResource<AdminChatMessage[]>(emptyChatMessages, getAdminChatMessages);
}

export function useAdminRewardFlows() {
  return useAdminResource<AdminRewardFlow[]>(emptyRewardFlows, getAdminRewardFlows);
}

export function useAdminRiskEvents() {
  return useAdminResource<AdminRiskEvent[]>(emptyRiskEvents, getAdminRiskEvents);
}

export function useAdminConfig() {
  return useAdminResource<AdminConfigItem[]>(emptyConfig, getAdminConfig);
}

export function useAdminAuditLogs() {
  return useAdminResource<AdminAuditLog[]>(emptyAuditLogs, getAdminAuditLogs);
}
