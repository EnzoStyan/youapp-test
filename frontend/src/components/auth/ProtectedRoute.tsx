// src/components/auth/ProtectedRoute.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { state } = useAuth();
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Cek jika token tidak ada di state DAN tidak ada di local storage
    if (!state.isAuthenticated && !localStorage.getItem('token')) {
      router.push('/login');
    } else {
      // Jika ada, anggap terverifikasi dan izinkan konten tampil
      setIsVerified(true);
    }
  }, [state.isAuthenticated, router]);

  // Tampilkan loading saat verifikasi, lalu tampilkan konten jika lolos
  if (!isVerified) {
    return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  return <>{children}</>;
}