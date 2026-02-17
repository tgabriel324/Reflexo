
import React, { useMemo } from 'react';
import { DayLogEntry, Statistics } from '../types';
import { SunIcon, MoonIcon } from './Icons';

interface DashboardProps {
  logs: DayLogEntry[];
  onQuickRecord: (type: 'morning' | 'night') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ logs, onQuickRecord }) => {
  const stats: Statistics = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const logsInMonth = logs.filter(l => {
      const d = new Date(l.timestamp);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    // Simple streak calculation (mocked for demo simplicity, could be complex)
    const uniqueDays = new Set(logs.map(l => l.dateStr)).size;
    
    return {
      streak: uniqueDays, // In a real app, calculate consecutive days
      totalVideosThisMonth: logsInMonth.length
    };
  }, [logs]);

  const calendarDays = useMemo(() => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayLogs = logs.filter(l => l.dateStr === dateStr);
      days.push({
        day: i,
        dateStr,
        hasMorning: dayLogs.some(l => l.type === 'morning'),
        hasNight: dayLogs.some(l => l.type === 'night'),
        isToday: i === now.getDate()
      });
    }
    return days;
  }, [logs]);

  return (
    <div className="flex flex-col gap-8 pb-32 animate-in fade-in duration-500">
      <header className="px-6 pt-12">
        <h1 className="text-4xl font-bold tracking-tight">DayLog</h1>
        <p className="text-zinc-500 mt-1 font-medium">Your life, archived daily.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 px-6">
        <div className="apple-glass rounded-3xl p-5 flex flex-col justify-between h-32">
          <span className="text-zinc-400 text-sm font-semibold uppercase tracking-wider">Streak</span>
          <span className="text-4xl font-bold">{stats.streak} <span className="text-lg font-medium text-zinc-500">days</span></span>
        </div>
        <div className="apple-glass rounded-3xl p-5 flex flex-col justify-between h-32">
          <span className="text-zinc-400 text-sm font-semibold uppercase tracking-wider">This Month</span>
          <span className="text-4xl font-bold">{stats.totalVideosThisMonth} <span className="text-lg font-medium text-zinc-500">logs</span></span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 flex gap-4">
        <button 
          onClick={() => onQuickRecord('morning')}
          className="flex-1 bg-white text-black h-14 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <SunIcon />
          Morning
        </button>
        <button 
          onClick={() => onQuickRecord('night')}
          className="flex-1 apple-glass text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <MoonIcon />
          Night
        </button>
      </div>

      {/* Calendar */}
      <div className="px-6">
        <div className="apple-glass rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-lg">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
          </div>
          <div className="grid grid-cols-7 gap-y-4 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
              <span key={d} className="text-xs font-bold text-zinc-600">{d}</span>
            ))}
            {calendarDays.map(d => (
              <div key={d.dateStr} className="flex flex-col items-center gap-1.5 py-1">
                <span className={`text-sm font-medium h-8 w-8 flex items-center justify-center rounded-full ${d.isToday ? 'bg-zinc-800 text-white' : 'text-zinc-300'}`}>
                  {d.day}
                </span>
                <div className="flex gap-1 h-1.5">
                  {d.hasMorning && <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />}
                  {d.hasNight && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
