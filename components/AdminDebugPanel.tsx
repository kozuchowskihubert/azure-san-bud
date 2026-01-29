'use client';

import { useState, useEffect } from 'react';

interface DebugInfo {
  hasToken: boolean;
  hasAdmin: boolean;
  tokenPreview: string;
  adminUsername: string;
  timestamp: string;
}

export default function AdminDebugPanel() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Update debug info every second
    const interval = setInterval(() => {
      const token = localStorage.getItem('adminToken');
      const admin = localStorage.getItem('admin');
      const adminData = admin ? JSON.parse(admin) : null;

      setDebugInfo({
        hasToken: !!token,
        hasAdmin: !!admin,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
        adminUsername: adminData?.username || 'No admin',
        timestamp: new Date().toISOString(),
      });
    }, 1000);

    // Intercept console logs
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      const message = args.join(' ');
      if (message.includes('[Login]') || message.includes('[Dashboard]') || message.includes('[Auth]')) {
        setLogs(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()} ${message}`]);
      }
      originalLog.apply(console, args);
    };

    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes('[Login]') || message.includes('[Dashboard]') || message.includes('[Auth]')) {
        setLogs(prev => [...prev.slice(-9), `❌ ${new Date().toLocaleTimeString()} ${message}`]);
      }
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      const message = args.join(' ');
      if (message.includes('[Login]') || message.includes('[Dashboard]') || message.includes('[Auth]')) {
        setLogs(prev => [...prev.slice(-9), `⚠️  ${new Date().toLocaleTimeString()} ${message}`]);
      }
      originalWarn.apply(console, args);
    };

    return () => {
      clearInterval(interval);
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  const testAuth = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert('No token found in localStorage!');
      return;
    }

    try {
      const response = await fetch('https://api.sanbud24.pl/admin/api/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('✅ Auth test successful!\n\n' + JSON.stringify(data, null, 2));
      } else {
        alert('❌ Auth test failed!\n\nStatus: ' + response.status + '\n\n' + JSON.stringify(data, null, 2));
      }
    } catch (err) {
      alert('❌ Network error: ' + err);
    }
  };

  if (!debugInfo) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-gray-900 text-white text-xs rounded-lg shadow-2xl border border-gray-700 z-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-2 rounded-t-lg font-bold flex items-center justify-between">
        <span>🔍 Admin Debug Panel</span>
        <button
          onClick={() => document.getElementById('debug-panel')?.remove()}
          className="text-white hover:text-red-300"
        >
          ✕
        </button>
      </div>
      
      <div className="p-3 space-y-2">
        {/* Status */}
        <div className="bg-gray-800 rounded p-2 space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-400">Token:</span>
            <span className={debugInfo.hasToken ? 'text-green-400' : 'text-red-400'}>
              {debugInfo.hasToken ? '✅ Present' : '❌ Missing'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Admin:</span>
            <span className={debugInfo.hasAdmin ? 'text-green-400' : 'text-red-400'}>
              {debugInfo.adminUsername}
            </span>
          </div>
          <div className="text-gray-500 text-[10px]">
            {debugInfo.tokenPreview}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={testAuth}
            className="flex-1 bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-white font-semibold"
          >
            Test Auth
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="flex-1 bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white font-semibold"
          >
            Clear & Reload
          </button>
        </div>

        {/* Logs */}
        <div className="bg-gray-800 rounded p-2 max-h-48 overflow-y-auto">
          <div className="text-gray-400 font-bold mb-1">Recent Logs:</div>
          {logs.length === 0 ? (
            <div className="text-gray-500 italic">No logs yet...</div>
          ) : (
            <div className="space-y-1 font-mono text-[10px]">
              {logs.map((log, i) => (
                <div key={i} className="text-gray-300 leading-tight">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className="text-gray-500 text-[10px] text-center">
          Updated: {new Date(debugInfo.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
