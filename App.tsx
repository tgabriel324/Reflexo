
import React, { useState, useEffect, useCallback } from 'react';
import { AppTab, DayLogEntry, LogType } from './types';
import Dashboard from './components/Dashboard';
import Library from './components/Library';
import Recorder from './components/Recorder';
import Auth from './components/Auth';
import { DashboardIcon, RecordIcon, LibraryIcon } from './components/Icons';
import * as db from './services/db';
import { supabase } from './services/supabase';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [logs, setLogs] = useState<DayLogEntry[]>([]);
  const [activeRecordingType, setActiveRecordingType] = useState<LogType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchLogs = useCallback(async () => {
    if (!session) return;
    try {
      const allLogs = await db.getAllLogs();
      setLogs(allLogs);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) fetchLogs();
  }, [session, fetchLogs]);

  const handleQuickRecord = (type: LogType) => {
    setActiveRecordingType(type);
    setActiveTab('record');
  };

  const handleRecordComplete = async (blob: Blob) => {
    setIsUploading(true);
    const dateStr = new Date().toISOString().split('T')[0];
    const type = activeRecordingType || 'morning';

    try {
      await db.saveLog(blob, type, dateStr);
      await fetchLogs();
      setActiveRecordingType(null);
      setActiveTab('dashboard');
    } catch (err) {
      alert('Error uploading video: ' + (err as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteLog = async (id: string) => {
    const log = logs.find(l => l.id === id);
    if (!log) return;
    try {
      await db.deleteLog(id, log.video_url);
      await fetchLogs();
    } catch (err) {
      alert('Failed to delete: ' + (err as Error).message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-zinc-800 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen pb-24 bg-black overflow-x-hidden selection:bg-zinc-700">
      
      {/* Uploading Overlay */}
      {isUploading && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
           <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
           <p className="font-bold text-white">Saving to Cloud...</p>
        </div>
      )}

      {/* Content */}
      <main className="max-w-md mx-auto relative min-h-screen">
        <div className="absolute top-6 right-6 z-10">
            <button onClick={handleSignOut} className="apple-glass text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full text-zinc-500 uppercase">Sign Out</button>
        </div>

        {activeTab === 'dashboard' && <Dashboard logs={logs} onQuickRecord={handleQuickRecord} />}
        {activeTab === 'library' && <Library logs={logs} onDelete={handleDeleteLog} />}
        {activeTab === 'record' && !activeRecordingType && (
            <div className="p-6 pt-32 flex flex-col gap-6 h-screen justify-center text-center">
                <h1 className="text-3xl font-bold">New Log</h1>
                <p className="text-zinc-500">Choose your current session</p>
                <div className="flex flex-col gap-4">
                    <button onClick={() => setActiveRecordingType('morning')} className="h-20 bg-white text-black rounded-3xl font-bold text-xl active:scale-95 transition-transform">Morning Routine</button>
                    <button onClick={() => setActiveRecordingType('night')} className="h-20 apple-glass rounded-3xl font-bold text-xl active:scale-95 transition-transform">Evening Reflection</button>
                </div>
            </div>
        )}
      </main>

      {/* Tab Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 apple-glass border-t-0 rounded-t-[2.5rem] safe-bottom px-4">
        <div className="max-w-md mx-auto flex justify-around items-center h-20">
          <button 
            onClick={() => { setActiveTab('dashboard'); setActiveRecordingType(null); }}
            className="flex flex-col items-center gap-1 flex-1 py-2 active:scale-90 transition-transform"
          >
            <DashboardIcon active={activeTab === 'dashboard'} />
            <span className={`text-[10px] font-bold ${activeTab === 'dashboard' ? 'text-white' : 'text-zinc-500'}`}>DASHBOARD</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('record')}
            className="relative -top-6 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform shadow-white/20"
          >
            <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center">
                <div className={`w-10 h-10 rounded-full ${activeTab === 'record' ? 'bg-red-500 scale-90' : 'bg-white scale-75'} transition-all`} />
            </div>
          </button>

          <button 
            onClick={() => { setActiveTab('library'); setActiveRecordingType(null); }}
            className="flex flex-col items-center gap-1 flex-1 py-2 active:scale-90 transition-transform"
          >
            <LibraryIcon active={activeTab === 'library'} />
            <span className={`text-[10px] font-bold ${activeTab === 'library' ? 'text-white' : 'text-zinc-500'}`}>TIMELINE</span>
          </button>
        </div>
      </nav>

      {/* Fullscreen Recording Overlay */}
      {activeRecordingType && (
        <Recorder 
          type={activeRecordingType} 
          onComplete={handleRecordComplete} 
          onCancel={() => { setActiveRecordingType(null); setActiveTab('dashboard'); }} 
        />
      )}
    </div>
  );
};

export default App;
