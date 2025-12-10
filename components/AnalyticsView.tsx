import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, AreaChart, Area, ComposedChart
} from 'recharts';
import { format, subDays } from 'date-fns';
import { DailyLog, DEFAULT_HABITS } from '../types';

interface AnalyticsViewProps {
  logs: Record<string, DailyLog>;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ logs }) => {
  // Prepare data for last 14 days
  const data = Array.from({ length: 14 }).map((_, i) => {
    const date = subDays(new Date(), 13 - i);
    const dateKey = format(date, 'yyyy-MM-dd');
    const log = logs[dateKey];
    
    // Calculate habit completion percentage
    let completedCount = 0;
    if (log && log.habits) {
        completedCount = Object.values(log.habits).filter(Boolean).length;
    }
    const completionRate = (completedCount / DEFAULT_HABITS.length) * 100;

    return {
      date: format(date, 'MM/dd'),
      mood: log?.mood || 0,
      energy: log?.energy || 0,
      sleepQuality: log?.sleepQuality || 0,
      instagramMinutes: log?.instagramMinutes || 0,
      studyMinutes: log?.studyMinutes || 0,
      completionRate: completionRate,
      rawLog: log
    };
  });

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <h2 className="text-2xl font-bold text-slate-800">Your Progress</h2>

      {/* The Battle Chart: Study vs Instagram */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-700 mb-2">Focus vs Distraction (Minutes)</h3>
        <p className="text-sm text-slate-400 mb-6">Are you studying more than you scroll?</p>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Bar dataKey="studyMinutes" name="Study Time" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
              <Bar dataKey="instagramMinutes" name="Instagram" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mood & Sleep Quality */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-700 mb-6">Mood & Sleep Quality Trend</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="mood" stroke="#f59e0b" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} name="Mood" />
              <Line type="monotone" dataKey="sleepQuality" stroke="#6366f1" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} name="Sleep Quality" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Habit Consistency */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-700 mb-6">Overall Habit Consistency (%)</h3>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                         <defs>
                            <linearGradient id="colorConsistency" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '12px' }} />
                        <Area type="monotone" dataKey="completionRate" stroke="#6366f1" fillOpacity={1} fill="url(#colorConsistency)" strokeWidth={2} name="Completion %" />
                    </AreaChart>
                </ResponsiveContainer>
             </div>
        </div>
    </div>
  );
};