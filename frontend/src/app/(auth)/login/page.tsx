// src/app/(auth)/login/page.tsx

'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import apiClient from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); // <-- 2. Ambil fungsi login dari context
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { email, password } = formData;
      const response = await apiClient.post('/auth/login', { email, password });
      
      const { access_token } = response.data;
      
      // 3. Panggil fungsi login dari context!
      login(access_token);
      
      alert('Login successful!');
      router.push('/profile'); // Redirect ke profil

    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred';
      alert(`Login failed: ${errorMessage}`);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="email" type="email" placeholder="Enter Email" onChange={handleChange} required />
        <Input name="password" type="password" placeholder="Enter Password" onChange={handleChange} required />
        <Button type="submit">Login</Button>
      </form>
      <p className="text-center text-gray-400">
        No account?{' '}
        <Link href="/register" className="text-teal-400 hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}