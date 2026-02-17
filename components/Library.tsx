
import React, { useState, useMemo } from 'react';
import { DayLogEntry, LogType } from '../types';
import { PlayIcon, SunIcon, MoonIcon } from './Icons';

interface LibraryProps {
  logs: DayLogEntry[];
  onDelete: (id: string) => void;
}

const Library: React.FC<LibraryProps> = ({ logs, onDelete }) => {
  const [filterType, setFilterType] = useState<LogType | 'all'>('all');
  const [selectedLog, setSelectedLog] = useState<DayLogEntry | null>(null);

  const filteredLogs = useMemo(() => {
    let sorted = [...logs].sort((a, b) => b.timestamp - a.timestamp);
    if (filterType !== 'all') {
      sorted = sorted.filter(l => l.type === filterType);
    }
    return sorted;
  }, [logs, filterType]);

  const groupedLogs = useMemo(() => {
    const groups: { [key: string]: DayLogEntry[] } = {};
    filteredLogs.forEach(log => {
      const date = new Date(log.timestamp).toLocaleDateString('default', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(log);
    });
    return Object.entries(groups);
  }, [filteredLogs]);

  return (
    <div className="flex flex-col gap-6 pb-32 pt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="px-6">
        <h1 className="text-4xl font-bold tracking-tight">Timeline</h1>
        <div className="flex gap-2 mt-6 overflow-x-auto no-scrollbar">
          {(['all', 'morning', 'night'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold capitalize transition-all ${filterType === type ? 'bg-white text-black scale-105' : 'apple-glass text-zinc-400'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </header>

      <div className="px-6 flex flex-col gap-8">
        {groupedLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <PlayIcon />
            <p className="mt-4 font-medium">No logs recorded yet.</p>
          </div>
        ) : (
          groupedLogs.map(([date, dayLogs]) => (
            <div key={date} className="flex flex-col gap-4">
              <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest px-1">{date}</h3>
              <div className="grid grid-cols-2 gap-4">
                {dayLogs.map(log => (
                  <div 
                    key={log.id} 
                    onClick={() => setSelectedLog(log)}
                    className="apple-glass rounded-2xl aspect-[3/4] relative overflow-hidden active:scale-95 transition-transform cursor-pointer group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                    
                    {/* Visual representation of a video item */}
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                       <PlayIcon />
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-col">
                      <div className="flex items-center gap-1.5 mb-1">
                        {log.type === 'morning' ? <SunIcon /> : <MoonIcon />}
                        <span className="text-xs font-bold uppercase tracking-tighter opacity-70">
                          {log.type}
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Video Modal Player */}
      {selectedLog && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center p-6">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase text-zinc-500 tracking-widest">{selectedLog.dateStr}</span>
              <span className="text-xl font-bold capitalize">{selectedLog.type} Entry</span>
            </div>
            <button 
              onClick={() => setSelectedLog(null)}
              className="w-10 h-10 apple-glass rounded-full flex items-center justify-center font-bold"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <video 
              key={selectedLog.id}
              src={selectedLog.video_url} 
              controls 
              autoPlay 
              className="max-h-full max-w-full rounded-2xl shadow-2xl"
            />
          </div>
          <div className="p-10 flex justify-center">
             <button 
              onClick={() => {
                if(confirm('Delete this entry?')) {
                    onDelete(selectedLog.id);
                    setSelectedLog(null);
                }
              }}
              className="text-red-500 font-bold bg-red-500/10 px-6 py-3 rounded-full active:bg-red-500/20"
             >
                Delete Log
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
