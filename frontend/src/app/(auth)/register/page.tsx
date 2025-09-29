// src/app/(auth)/register/page.tsx

'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import apiClient from '@/lib/api'; // <-- 1. Impor apiClient
import { useRouter } from 'next/navigation'; // <-- 2. Impor useRouter untuk redirect

export default function RegisterPage() {
  const router = useRouter(); // <-- 3. Inisialisasi router
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. Ubah handleSubmit menjadi async
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi password sederhana
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    
    try {
      const { email, username, password } = formData;
      // 5. Kirim data ke backend
      await apiClient.post('/auth/register', { email, username, password });
      
      alert('Registration successful! Please login.');
      router.push('/login'); // Redirect ke halaman login
      
    } catch (error: any) {
      // 6. Tangani error dari backend
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred';
      alert(`Registration failed: ${errorMessage}`);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input fields tidak berubah */}
        <Input name="email" type="email" placeholder="Enter Email" onChange={handleChange} required />
        <Input name="username" type="text" placeholder="Create Username" onChange={handleChange} required />
        <Input name="password" type="password" placeholder="Create Password" minLength={6} onChange={handleChange} required />
        <Input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required />
        <Button type="submit">Register</Button>
      </form>
      <p className="text-center text-gray-400">
        Have an account?{' '}
        <Link href="/login" className="text-teal-400 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
}