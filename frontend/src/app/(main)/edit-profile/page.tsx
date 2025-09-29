// src/app/(main)/edit-profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function EditProfilePage() {
  const router = useRouter();
  const { state } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    birthday: '',
    height: '',
    weight: '',
    interests: '', // Kita akan handle interests sebagai string dipisah koma
  });
  const [loading, setLoading] = useState(true);

  // 1. Ambil data profil saat halaman dimuat untuk mengisi form
  useEffect(() => {
    if (state.token) {
      const fetchCurrentProfile = async () => {
        try {
          const { data } = await apiClient.get('/profile', {
            headers: { Authorization: `Bearer ${state.token}` },
          });

          if (data) {
            setFormData({
              name: data.name || '',
              // Format tanggal agar sesuai dengan input type="date" (YYYY-MM-DD)
              birthday: data.birthday ? new Date(data.birthday).toISOString().split('T')[0] : '',
              height: data.height || '',
              weight: data.weight || '',
              interests: data.interests?.join(', ') || '',
            });
          }
        } catch (error) {
          console.error('Failed to fetch profile for editing', error);
        } finally {
          setLoading(false);
        }
      };
      fetchCurrentProfile();
    }
  }, [state.token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Kirim data yang sudah diubah ke backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Ubah string interests menjadi array
      const interestsArray = formData.interests.split(',').map(item => item.trim()).filter(Boolean);

      const payload = {
        name: formData.name,
        birthday: formData.birthday,
        height: Number(formData.height),
        weight: Number(formData.weight),
        interests: interestsArray,
      };

      await apiClient.put('/profile', payload, {
        headers: { Authorization: `Bearer ${state.token}` },
      });

      alert('Profile updated successfully!');
      router.push('/profile'); // Kembali ke halaman profil untuk melihat perubahan

    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Loading editor...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="mb-6">
        <Link href="/profile" className="text-teal-400 hover:underline">
          &larr; Back to Profile
        </Link>
        <h1 className="text-2xl font-bold mt-2">Edit Profile</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
        <div>
          <label className="block text-sm font-medium mb-1">Display Name</label>
          <Input name="name" type="text" value={formData.name} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Birthday</label>
          <Input name="birthday" type="date" value={formData.birthday} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Height (cm)</label>
          <Input name="height" type="number" value={formData.height} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Weight (kg)</label>
          <Input name="weight" type="number" value={formData.weight} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Interests (comma separated)</label>
          <Input name="interests" type="text" value={formData.interests} onChange={handleChange} placeholder="e.g. Music, Gaming, Sports" />
        </div>
        <Button type="submit">Save & Update</Button>
      </form>
    </div>
  );
}