import type { Metadata } from 'next';
import { AdminShell } from '@/modules/admin/AdminShell';

export const metadata: Metadata = {
  title: '投骰乐园后台 - Dice Paradise Admin',
  description: '投骰乐园运营管理后台',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
