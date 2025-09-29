// src/components/chat/ChatClient.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/lib/api';
import { io, Socket } from 'socket.io-client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

// Definisikan tipe data agar kode kita lebih aman
interface User {
  _id: string;
  username: string;
}

interface Message {
  _id: string;
  sender: User;
  text: string;
  createdAt: string;
}

export default function ChatClient() {
  const { state: authState } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef<Socket | null>(null);

  // 1. Fetch daftar pengguna saat komponen dimuat
  useEffect(() => {
    if (authState.token) {
      apiClient.get('/users', {
        headers: { Authorization: `Bearer ${authState.token}` },
      }).then(response => {
        setUsers(response.data);
      }).catch(error => console.error('Failed to fetch users', error));
    }
  }, [authState.token]);

  // 2. Setup koneksi dan listener WebSocket
  useEffect(() => {
    if (!authState.token) return;

    socketRef.current = io('http://localhost:3000', {
      auth: { token: authState.token },
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socketRef.current.on('newMessage', (message: Message) => {
      // Hanya tambahkan pesan jika berasal dari user yang sedang dipilih
      if (message.sender._id === selectedUser?._id || message.sender._id === authState.user?.userId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [authState.token, selectedUser, authState.user]); // Re-run effect if selectedUser changes

  // 3. Fungsi untuk memilih user dan mengambil riwayat chat
  const handleSelectUser = async (user: User) => {
    setSelectedUser(user);
    try {
      const response = await apiClient.get(`/chat/${user._id}`, {
        headers: { Authorization: `Bearer ${authState.token}` },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages', error);
      setMessages([]);
    }
  };

  // 4. Fungsi untuk mengirim pesan
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedUser && socketRef.current) {
      socketRef.current.emit('sendMessage', {
        recipientId: selectedUser._id,
        text: newMessage,
      });
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar Daftar Pengguna */}
      <aside className="w-1/4 bg-gray-800 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              <button
                onClick={() => handleSelectUser(user)}
                className={`w-full text-left p-2 rounded ${selectedUser?._id === user._id ? 'bg-teal-500' : 'hover:bg-gray-700'}`}
              >
                {user.username}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Panel Chat Utama */}
      <main className="w-3/4 flex flex-col">
        {selectedUser ? (
          <>
            <header className="bg-gray-800 p-4 border-b border-gray-700">
              <h2 className="font-bold text-xl">Chat with {selectedUser.username}</h2>
            </header>

            <div className="flex-grow p-4 overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  // Gunakan Optional Chaining (?.) untuk mencegah error jika msg.sender null
                  className={`flex mb-2 ${msg.sender?._id === authState.user?.userId ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`rounded-lg px-3 py-2 max-w-lg ${msg.sender?._id === authState.user?.userId ? 'bg-blue-600' : 'bg-gray-700'}`}>
                    {/* Tambahkan ini untuk menampilkan username pengirim dengan aman */}
                    {msg.sender?._id !== authState.user?.userId && (
                        <p className="text-xs font-bold text-teal-300">{msg.sender?.username || 'Unknown'}</p>
                    )}
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-gray-800 flex gap-2">
              <Input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow"
              />
              <Button type="submit" className="w-auto px-6">Send</Button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-xl">Select a user to start chatting</p>
          </div>
        )}
      </main>
    </div>
  );
}