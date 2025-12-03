'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { buildApiUrl } from '@/utils/api';

interface Message {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  message_type: string;
  is_read: boolean;
  replied: boolean;
  priority: string;
  notes?: string;
  created_at: string;
  read_at?: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRead, setFilterRead] = useState<string>('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [viewMode, setViewMode] = useState(false);

  useEffect(() => {
    loadMessages();
  }, [filterRead]);

  const loadMessages = async () => {
    try {
      const url = filterRead 
        ? `${buildApiUrl('admin/api/messages')}?is_read=${filterRead}`
        : buildApiUrl('admin/api/messages');
      
      const response = await fetch(url, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      } else if (response.status === 401) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (message: Message) => {
    try {
      const response = await fetch(buildApiUrl(`admin/api/messages/${message.id}`), {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedMessage(data.message);
        setViewMode(true);
        loadMessages(); // Refresh list to update read status
      }
    } catch (error) {
      console.error('Failed to load message:', error);
    }
  };

  const handleMarkAsReplied = async (messageId: number, replied: boolean) => {
    try {
      const response = await fetch(buildApiUrl(`admin/api/messages/${messageId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ replied }),
      });

      if (response.ok) {
        loadMessages();
        if (selectedMessage && selectedMessage.id === messageId) {
          setSelectedMessage({ ...selectedMessage, replied });
        }
      }
    } catch (error) {
      console.error('Failed to update message:', error);
    }
  };

  const handleDelete = async (messageId: number) => {
    if (!confirm('Czy na pewno chcesz usunąć tę wiadomość?')) return;

    try {
      const response = await fetch(buildApiUrl(`admin/api/messages/${messageId}`), {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setViewMode(false);
        setSelectedMessage(null);
        loadMessages();
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const getPriorityBadge = (priority: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      low: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-300', label: 'Niska' },
      normal: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300', label: 'Normalna' },
      high: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-800 dark:text-orange-300', label: 'Wysoka' },
      urgent: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-300', label: 'Pilna' },
    };
    const badge = badges[priority] || badges.normal;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const badges: Record<string, string> = {
      contact: 'Kontakt',
      booking: 'Rezerwacja',
      inquiry: 'Zapytanie',
    };
    return badges[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/dashboard" className="text-green-600 dark:text-green-400 hover:underline mb-4 inline-block">
            ← Powrót do panelu
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wiadomości</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Zarządzaj wiadomościami od klientów</p>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <div className="flex gap-4 items-center">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filtruj:</label>
            <select
              value={filterRead}
              onChange={(e) => setFilterRead(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">Wszystkie</option>
              <option value="false">Nieprzeczytane</option>
              <option value="true">Przeczytane</option>
            </select>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Znaleziono: {messages.length} | Nieprzeczytane: {messages.filter(m => !m.is_read).length}
            </span>
          </div>
        </div>

        {/* Messages List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Od</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Temat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Priorytet</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Akcje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {messages.map((message) => (
                  <tr 
                    key={message.id} 
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${!message.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {!message.is_read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-1"></span>
                        )}
                        {message.replied && (
                          <span className="text-green-600 dark:text-green-400">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                            </svg>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{message.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{message.email}</div>
                      {message.phone && <div className="text-sm text-gray-500 dark:text-gray-400">{message.phone}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white font-medium">
                        {message.subject || 'Brak tematu'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{getTypeBadge(message.message_type)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(message.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(message.created_at).toLocaleString('pl-PL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleView(message)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3"
                      >
                        Zobacz
                      </button>
                      <button
                        onClick={() => handleDelete(message.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        Usuń
                      </button>
                    </td>
                  </tr>
                ))}
                {messages.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      Brak wiadomości do wyświetlenia
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Message Modal */}
        {viewMode && selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedMessage.subject || 'Wiadomość'}
                </h2>
                <button
                  onClick={() => setViewMode(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Od:</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{selectedMessage.name}</div>
                  </div>
                  <div className="flex gap-2">
                    {getPriorityBadge(selectedMessage.priority)}
                    {selectedMessage.replied && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        Odpowiedziano
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Email:</div>
                    <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {selectedMessage.email}
                    </a>
                  </div>
                  {selectedMessage.phone && (
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Telefon:</div>
                      <a href={`tel:${selectedMessage.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                        {selectedMessage.phone}
                      </a>
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Data:</div>
                  <div className="text-gray-900 dark:text-white">
                    {new Date(selectedMessage.created_at).toLocaleString('pl-PL')}
                  </div>
                </div>

                <div className="border-t dark:border-gray-700 pt-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Wiadomość:</div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-gray-900 dark:text-white whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>

                {selectedMessage.notes && (
                  <div className="border-t dark:border-gray-700 pt-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Notatki administratora:</div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-gray-900 dark:text-white">
                      {selectedMessage.notes}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                {!selectedMessage.replied ? (
                  <button
                    onClick={() => handleMarkAsReplied(selectedMessage.id, true)}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700"
                  >
                    Oznacz jako odpowiedziane
                  </button>
                ) : (
                  <button
                    onClick={() => handleMarkAsReplied(selectedMessage.id, false)}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Cofnij status odpowiedzi
                  </button>
                )}
                <button
                  onClick={() => setViewMode(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Zamknij
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
