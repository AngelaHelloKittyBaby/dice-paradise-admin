import { API_BASE_URL } from '@/config/api';
import type {
  AdminAchievement,
  AdminActivity,
  AdminAuditLog,
  AdminChatMessage,
  AdminConfigItem,
  AdminDashboardData,
  AdminGameRecord,
  AdminGameStatus,
  AdminLeaderboardItem,
  AdminRewardFlow,
  AdminRiskEvent,
  AdminRoom,
  AdminRoomStatus,
  AdminUser,
} from '@/modules/admin/types';

type QueryValue = string | number | boolean | null | undefined;

interface ApiRequestOptions {
  params?: Record<string, QueryValue>;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
}

interface ApiEnvelope<T> {
  code?: number;
  msg?: string;
  message?: string;
  detail?: unknown;
  data?: T;
}

interface RoomListEntry {
  item: Record<string, unknown>;
  detail: Record<string, unknown> | null;
}

interface LeaderboardSources {
  wins: Record<string, unknown>[];
  games: Record<string, unknown>[];
}

interface UserSeed {
  id: string;
  nickname: string;
  wins: number | null;
  games: number | null;
}

const ADMIN_RANKING_LIMIT = 50;
const modeColors = ['#1677ff', '#52c41a', '#faad14', '#722ed1', '#13c2c2'];

export class AdminApiError extends Error {
  status?: number;
  code?: number;

  constructor(message: string, options: { status?: number; code?: number } = {}) {
    super(message);
    this.name = 'AdminApiError';
    this.status = options.status;
    this.code = options.code;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asRecordArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function getValue(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    if (record[key] !== null && record[key] !== undefined) return record[key];
  }

  return undefined;
}

function getString(record: Record<string, unknown>, ...keys: string[]) {
  const value = getValue(record, keys);

  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);

  return '';
}

function getNumber(record: Record<string, unknown>, ...keys: string[]) {
  const value = getValue(record, keys);

  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : null;
  }

  return null;
}

function getBoolean(record: Record<string, unknown>, ...keys: string[]) {
  const value = getValue(record, keys);

  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    const normalizedValue = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'public'].includes(normalizedValue)) return true;
    if (['false', '0', 'no', 'private'].includes(normalizedValue)) return false;
  }

  return null;
}

function getRecordArray(record: Record<string, unknown>, ...keys: string[]) {
  return asRecordArray(getValue(record, keys));
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '接口请求失败';
}

function getEnvelopeMessage(payload: unknown) {
  if (!isRecord(payload)) return '';

  const directMessage = getString(payload, 'msg', 'message');
  if (directMessage) return directMessage;

  const detail = payload.detail;
  return typeof detail === 'string' ? detail : '';
}

function isApiEnvelope<T>(value: unknown): value is ApiEnvelope<T> {
  return isRecord(value) && ('code' in value || 'msg' in value || 'data' in value);
}

function buildApiUrl(path: string, params?: Record<string, QueryValue>) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return;
    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();
  return `${API_BASE_URL}${normalizedPath}${queryString ? `?${queryString}` : ''}`;
}

async function readJsonResponse(response: Response) {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

async function requestApi<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const response = await fetch(buildApiUrl(path, options.params), {
    method: options.method ?? 'GET',
    headers: {
      Accept: 'application/json',
      ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: 'no-store',
  });
  const payload = await readJsonResponse(response);

  if (!response.ok) {
    throw new AdminApiError(getEnvelopeMessage(payload) || `接口请求失败 (${response.status})`, {
      status: response.status,
    });
  }

  if (isApiEnvelope<T>(payload)) {
    if (typeof payload.code === 'number' && payload.code !== 200) {
      throw new AdminApiError(payload.msg || payload.message || '接口返回失败', { code: payload.code });
    }

    return payload.data as T;
  }

  return payload as T;
}

function formatDateTime(value: string) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString('zh-CN', { hour12: false });
}

function calculateDurationMinutes(startedAt: string, endedAt: string) {
  if (!startedAt || !endedAt) return null;

  const start = new Date(startedAt).getTime();
  const end = new Date(endedAt).getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) return null;

  return Math.max(0, Math.round((end - start) / 60_000));
}

function formatGameMode(value: string) {
  const normalizedValue = value.toLowerCase();

  if (normalizedValue === 'online') return '联机';
  if (normalizedValue === 'ai') return '人机';
  if (normalizedValue === 'local') return '本地';

  return value;
}

function normalizeRoomStatus(value: string): AdminRoomStatus {
  const status = value.toLowerCase();

  if (status.includes('waiting') || status.includes('wait') || status.includes('等待')) return 'waiting';
  if (status.includes('countdown') || status.includes('倒计时')) return 'countdown';
  if (status.includes('playing') || status.includes('in_game') || status.includes('游戏中')) return 'playing';
  if (status.includes('finished') || status.includes('completed') || status.includes('结束')) return 'finished';
  if (status.includes('closed') || status.includes('dismissed') || status.includes('关闭')) return 'closed';

  return 'unknown';
}

function normalizeGameStatus(value: string): AdminGameStatus {
  const status = value.toLowerCase();

  if (status.includes('playing') || status.includes('游戏中')) return 'playing';
  if (status.includes('finished') || status.includes('completed') || status.includes('结束')) return 'completed';
  if (status.includes('interrupted') || status.includes('error') || status.includes('异常')) return 'interrupted';

  return 'unknown';
}

function getRoomCode(record: Record<string, unknown>) {
  return getString(record, 'roomCode', 'room_code', 'roomId', 'room_id', 'id');
}

function getRoomPlayers(record: Record<string, unknown>) {
  return getRecordArray(record, 'players', 'members');
}

function getPlayerId(record: Record<string, unknown>) {
  return getString(record, 'playerId', 'player_id', 'userId', 'user_id', 'id');
}

function getPlayerName(record: Record<string, unknown>) {
  return getString(record, 'name', 'username', 'nickname');
}

function getRoomOwner(source: Record<string, unknown>) {
  const directOwner = getString(source, 'owner', 'ownerName', 'owner_name', 'hostName', 'host_name', 'creatorName');
  if (directOwner) return directOwner;

  const hostId = getString(source, 'hostId', 'host_id', 'ownerId', 'owner_id', 'creatorId', 'creator_id');
  const hostPlayer = getRoomPlayers(source).find(player => {
    const isHost = getBoolean(player, 'isHost', 'is_host');
    return isHost || (hostId && getPlayerId(player) === hostId);
  });

  return hostPlayer ? getPlayerName(hostPlayer) : '';
}

function normalizeRoom(entry: RoomListEntry, index: number): AdminRoom {
  const source = entry.detail ? { ...entry.item, ...entry.detail } : entry.item;
  const players = getRoomPlayers(source);
  const playerCount =
    getNumber(source, 'playerCount', 'player_count', 'currentPlayers', 'current_players') ?? players.length;
  const isPrivate = getBoolean(source, 'isPrivate', 'is_private', 'private');
  const isPublic = getBoolean(source, 'isPublic', 'is_public', 'public');

  return {
    id: getRoomCode(source) || `room-${index + 1}`,
    name: getString(source, 'roomName', 'room_name', 'name'),
    owner: getRoomOwner(source),
    mode: formatGameMode(getString(source, 'gameMode', 'game_mode', 'mode')),
    players: playerCount,
    capacity: getNumber(source, 'maxPlayers', 'max_players', 'capacity'),
    status: normalizeRoomStatus(getString(source, 'status')),
    isPublic: isPublic ?? (isPrivate === null ? null : !isPrivate),
    createdAt: formatDateTime(getString(source, 'createdAt', 'created_at', 'createdTime', 'created_time')),
    lastActiveAt: formatDateTime(
      getString(source, 'updatedAt', 'updated_at', 'lastActiveAt', 'last_active_at', 'lastPlayTime', 'last_play_time')
    ),
  };
}

async function getRoomListEntries(): Promise<RoomListEntry[]> {
  const data = await requestApi<unknown>('/room/list');
  const roomItems = Array.isArray(data) ? asRecordArray(data) : isRecord(data) ? getRecordArray(data, 'rooms') : [];
  const entries = await Promise.all(
    roomItems.map(async item => {
      const roomCode = getRoomCode(item);

      if (!roomCode) return { item, detail: null };

      try {
        const detail = await requestApi<unknown>(`/room/${encodeURIComponent(roomCode)}`);
        return { item, detail: isRecord(detail) ? detail : null };
      } catch (error) {
        console.warn('[adminApi] 获取房间详情失败，已保留房间列表数据:', getErrorMessage(error));
        return { item, detail: null };
      }
    })
  );

  return entries;
}

async function getLeaderboardItems(path: string, limit = ADMIN_RANKING_LIMIT) {
  const data = await requestApi<unknown>(path, { params: { limit } });

  if (Array.isArray(data)) return asRecordArray(data);
  if (isRecord(data)) return getRecordArray(data, 'leaderboard', 'items', 'list');

  return [];
}

async function getLeaderboardSources(limit = ADMIN_RANKING_LIMIT): Promise<LeaderboardSources> {
  const [winsResult, gamesResult] = await Promise.allSettled([
    getLeaderboardItems('/leaderboard/ranking', limit),
    getLeaderboardItems('/leaderboard/ranking-games', limit),
  ]);

  if (winsResult.status === 'rejected' && gamesResult.status === 'rejected') {
    throw new AdminApiError(
      `排行榜接口请求失败：${getErrorMessage(winsResult.reason)}；${getErrorMessage(gamesResult.reason)}`
    );
  }

  if (winsResult.status === 'rejected') {
    console.warn('[adminApi] 胜场排行榜接口不可用:', getErrorMessage(winsResult.reason));
  }

  if (gamesResult.status === 'rejected') {
    console.warn('[adminApi] 总对局排行榜接口不可用:', getErrorMessage(gamesResult.reason));
  }

  return {
    wins: winsResult.status === 'fulfilled' ? winsResult.value : [],
    games: gamesResult.status === 'fulfilled' ? gamesResult.value : [],
  };
}

function getLeaderboardUserId(item: Record<string, unknown>, category: AdminLeaderboardItem['category'], index: number) {
  return getString(item, 'user_id', 'userId', 'player_id', 'playerId', 'id') || `${category}-${index + 1}`;
}

function getRankingValue(item: Record<string, unknown>, category: AdminLeaderboardItem['category']) {
  if (category === 'wins') return getNumber(item, 'total_wins', 'totalWins', 'wins', 'value');

  return getNumber(item, 'total_games', 'totalGames', 'games', 'value');
}

function normalizeLeaderboardItem(
  item: Record<string, unknown>,
  category: AdminLeaderboardItem['category'],
  index: number
): AdminLeaderboardItem {
  const userId = getLeaderboardUserId(item, category, index);

  return {
    rank: getNumber(item, 'rank') ?? index + 1,
    userId,
    nickname: getString(item, 'nickname', 'username', 'name') || userId,
    category,
    value: getRankingValue(item, category),
    delta: getNumber(item, 'delta', 'rankDelta', 'rank_delta', 'rankChange', 'rank_change'),
    updatedAt: formatDateTime(getString(item, 'updatedAt', 'updated_at', 'lastPlayTime', 'last_play_time')),
    flagged: getBoolean(item, 'flagged', 'isFlagged', 'is_flagged'),
  };
}

function upsertUserSeed(users: Map<string, UserSeed>, item: Record<string, unknown>, category: 'wins' | 'games', index: number) {
  const id = getLeaderboardUserId(item, category, index);
  const value = getRankingValue(item, category);
  const nickname = getString(item, 'nickname', 'username', 'name') || id;
  const current = users.get(id) ?? {
    id,
    nickname,
    wins: null,
    games: null,
  };

  users.set(id, {
    ...current,
    nickname: current.nickname || nickname,
    [category]: value,
  });
}

function normalizeUser(seed: UserSeed): AdminUser {
  const winRate = seed.wins !== null && seed.games ? Number(((seed.wins / seed.games) * 100).toFixed(1)) : null;

  return {
    id: seed.id,
    nickname: seed.nickname,
    accountType: null,
    level: null,
    coins: null,
    gems: null,
    games: seed.games,
    wins: seed.wins,
    winRate,
    highestScore: null,
    status: null,
    registeredAt: '',
    lastLoginAt: '',
  };
}

function getGameId(record: Record<string, unknown>) {
  return getString(record, 'gameId', 'game_id');
}

function getGamePlayers(record: Record<string, unknown>) {
  return getRecordArray(record, 'players');
}

function normalizeGameRecord(
  game: Record<string, unknown>,
  roomEntry: RoomListEntry,
  index: number
): AdminGameRecord {
  const roomSource = roomEntry.detail ? { ...roomEntry.item, ...roomEntry.detail } : roomEntry.item;
  const players = getGamePlayers(game);
  const scores = players.map(player => getNumber(player, 'totalScore', 'total_score')).filter((score): score is number => score !== null);
  const highestScore = scores.length > 0 ? Math.max(...scores) : null;
  const status = normalizeGameStatus(getString(game, 'status'));
  const startedAt = getString(game, 'createdAt', 'created_at', 'startedAt', 'started_at');
  const endedAt = getString(game, 'finishedAt', 'finished_at', 'endedAt', 'ended_at');
  const winner =
    status === 'completed' && highestScore !== null
      ? getPlayerName(players.find(player => getNumber(player, 'totalScore', 'total_score') === highestScore) ?? {})
      : '';

  return {
    id: getGameId(game) || getGameId(roomSource) || `game-${index + 1}`,
    roomId: getRoomCode(roomSource),
    mode: formatGameMode(getString(game, 'gameMode', 'game_mode', 'mode') || getString(roomSource, 'gameMode', 'game_mode', 'mode')),
    winner,
    playerCount: getNumber(game, 'playerCount', 'player_count') ?? players.length,
    highestScore,
    durationMinutes: calculateDurationMinutes(startedAt, endedAt),
    status,
    startedAt: formatDateTime(startedAt),
    endedAt: formatDateTime(endedAt),
  };
}

function getModeStats(rooms: AdminRoom[]) {
  const counts = rooms.reduce<Map<string, number>>((result, room) => {
    const mode = room.mode || '未提供';
    result.set(mode, (result.get(mode) ?? 0) + 1);
    return result;
  }, new Map());
  const total = Array.from(counts.values()).reduce((sum, value) => sum + value, 0);

  if (total === 0) return [];

  return Array.from(counts.entries()).map(([mode, count], index) => ({
    mode,
    value: Math.round((count / total) * 100),
    color: modeColors[index % modeColors.length],
  }));
}

function getFulfilledValue<T>(result: PromiseSettledResult<T>, fallback: T) {
  return result.status === 'fulfilled' ? result.value : fallback;
}

function getFirstRejectedReason(results: PromiseSettledResult<unknown>[]) {
  const rejectedResult = results.find((result): result is PromiseRejectedResult => result.status === 'rejected');

  return rejectedResult?.reason;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const sources = await getLeaderboardSources();
  const users = new Map<string, UserSeed>();

  sources.wins.forEach((item, index) => upsertUserSeed(users, item, 'wins', index));
  sources.games.forEach((item, index) => upsertUserSeed(users, item, 'games', index));

  return Array.from(users.values())
    .map(normalizeUser)
    .sort((first, second) => (second.wins ?? 0) - (first.wins ?? 0) || (second.games ?? 0) - (first.games ?? 0));
}

export async function getAdminRooms(): Promise<AdminRoom[]> {
  const roomEntries = await getRoomListEntries();

  return roomEntries.map(normalizeRoom);
}

export async function getAdminGameRecords(): Promise<AdminGameRecord[]> {
  const roomEntries = await getRoomListEntries();
  const gameEntries = roomEntries
    .map(entry => {
      const source = entry.detail ? { ...entry.item, ...entry.detail } : entry.item;
      const gameId = getGameId(source);

      return gameId ? { entry, gameId } : null;
    })
    .filter((entry): entry is { entry: RoomListEntry; gameId: string } => Boolean(entry));
  const gameResults = await Promise.allSettled(
    gameEntries.map(async ({ entry, gameId }, index) => {
      const game = await requestApi<unknown>(`/game/${encodeURIComponent(gameId)}`);

      return normalizeGameRecord(isRecord(game) ? game : {}, entry, index);
    })
  );

  return gameResults
    .filter((result): result is PromiseFulfilledResult<AdminGameRecord> => result.status === 'fulfilled')
    .map(result => result.value);
}

export async function getAdminLeaderboard(): Promise<AdminLeaderboardItem[]> {
  const sources = await getLeaderboardSources();

  return [
    ...sources.wins.map((item, index) => normalizeLeaderboardItem(item, 'wins', index)),
    ...sources.games.map((item, index) => normalizeLeaderboardItem(item, 'games', index)),
  ];
}

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  const [roomsResult, usersResult, leaderboardResult, gamesResult] = await Promise.allSettled([
    getAdminRooms(),
    getAdminUsers(),
    getAdminLeaderboard(),
    getAdminGameRecords(),
  ]);
  const results: PromiseSettledResult<unknown>[] = [roomsResult, usersResult, leaderboardResult, gamesResult];

  if (results.every(result => result.status === 'rejected')) {
    throw new AdminApiError(getErrorMessage(getFirstRejectedReason(results)));
  }

  const rooms = getFulfilledValue(roomsResult, []);
  const users = getFulfilledValue(usersResult, []);
  const leaderboard = getFulfilledValue(leaderboardResult, []);
  const gameRecords = getFulfilledValue(gamesResult, []);
  const roomPlayers = rooms.reduce((sum, room) => sum + room.players, 0);
  const leaderboardGames = leaderboard
    .filter(item => item.category === 'games')
    .reduce((sum, item) => sum + (item.value ?? 0), 0);

  return {
    metrics: [
      { key: 'rooms', label: '当前房间', value: rooms.length, suffix: '间', trend: null, tone: 'blue' },
      { key: 'roomPlayers', label: '房间内玩家', value: roomPlayers, suffix: '人', trend: null, tone: 'green' },
      { key: 'rankingUsers', label: '榜单用户', value: users.length, suffix: '人', trend: null, tone: 'purple' },
      { key: 'rankingGames', label: '榜单对局数', value: leaderboardGames, suffix: '局', trend: null, tone: 'orange' },
    ],
    trends: [],
    modeStats: getModeStats(rooms),
    recentGames: gameRecords.slice(0, 3),
    risks: [],
  };
}

export async function getAdminActivities(): Promise<AdminActivity[]> {
  return [];
}

export async function getAdminAchievements(): Promise<AdminAchievement[]> {
  return [];
}

export async function getAdminChatMessages(): Promise<AdminChatMessage[]> {
  return [];
}

export async function getAdminRewardFlows(): Promise<AdminRewardFlow[]> {
  return [];
}

export async function getAdminRiskEvents(): Promise<AdminRiskEvent[]> {
  return [];
}

export async function getAdminConfig(): Promise<AdminConfigItem[]> {
  return [];
}

export async function getAdminAuditLogs(): Promise<AdminAuditLog[]> {
  return [];
}
