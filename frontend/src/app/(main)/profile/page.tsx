// src/app/(main)/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/lib/api';
import Link from 'next/link';

// Definisikan tipe data untuk profil
interface ProfileData {
  name: string;
  birthday: string;
  height: number;
  weight: number;
  interests: string[];
  zodiac?: string;
  horoscope?: string;
}

export default function ProfilePage() {
  const { state, logout } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Jalankan fetch data HANYA jika token sudah ada
    if (state.token) {
      const fetchProfile = async () => {
        try {
          const response = await apiClient.get('/profile', {
            headers: {
              // Kirim token untuk otorisasi!
              Authorization: `Bearer ${state.token}`,
            },
          });
          setProfile(response.data);
        } catch (error) {
          console.error('Failed to fetch profile', error);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [state.token]); // <-- Dependency array, effect ini berjalan saat token berubah

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">@{state.user?.username}</h1>
        <button onClick={logout} className="text-red-500">Logout</button>
      </header>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="font-semibold mb-2">About</h2>
        {profile ? (
          <div className="space-y-2">
            <p>Name: {profile.name}</p>
            <p>Birthday: {new Date(profile.birthday).toLocaleDateString()}</p>
            <p>Zodiac: {profile.zodiac}</p>
            <p>Horoscope: {profile.horoscope}</p>
            <p>Height: {profile.height} cm</p>
            <p>Weight: {profile.weight} kg</p>
          </div>
        ) : (
          <p className="text-gray-400">
            You haven't set up your profile yet.{' '}
            <Link href="/edit-profile" className="text-teal-400">Edit here.</Link>
          </p>
        )}
      </div>

      <div className="bg-gray-800 p-4 rounded-lg mt-4">
        <h2 className="font-semibold mb-2">Interests</h2>
        {profile && profile.interests.length > 0 ? (
           <div className="flex flex-wrap gap-2">
            {profile.interests.map(interest => (
              <span key={interest} className="bg-gray-700 px-2 py-1 rounded-full text-sm">
                {interest}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No interests added yet.</p>
        )}
      </div>
    </div>
  );
}