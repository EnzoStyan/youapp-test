// src/app/(main)/layout.tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  // Semua halaman di dalam (main) akan otomatis dilindungi oleh komponen ini
  return <ProtectedRoute>{children}</ProtectedRoute>;
}