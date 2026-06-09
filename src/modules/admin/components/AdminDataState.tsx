'use client';

import { Alert, Button } from 'antd';

export const adminEmptyText = '暂无接口数据';

export function AdminDataError({ error, onRetry }: { error: string | null; onRetry: () => void }) {
  if (!error) return null;

  return (
    <Alert
      type="warning"
      showIcon
      message="数据加载失败"
      description={error}
      action={
        <Button size="small" onClick={onRetry}>
          重试
        </Button>
      }
      style={{ marginBottom: 16 }}
    />
  );
}
