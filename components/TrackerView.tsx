import React from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Moon, Sun, Smartphone, BookOpen, CheckCircle, Circle, Target, PenTool, BrainCircuit } from 'lucide-react';
import { DailyLog, DEFAULT_HABITS, MoodRating } from '../types';

interface TrackerViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  log: DailyLog | undefined;
  onUpdateLog: (date: string, updates: Partial<DailyLog>) => void;
}

export const TrackerView: React.FC<TrackerViewProps> = ({ currentDate, onDateChange, log, onUpdateLog }) => {
  const dateKey = format(currentDate, 'yyyy-MM-dd');

  // Initialize defaults if log is undefined
  const currentLog: DailyLog = log || {
    date: dateKey,
    habits: {},
    mood: 3,
    energy: 3,
    bedTime: '23:00',
    wakeTime: '07:00',
    sleepQuality: 3,
    instagramMinutes: 0,
    studyMinutes: 0,
    studySessions: 0,
    dailyGoal: '',
    dailyGoalCompleted: false,
    reflection: '',
    waterIntake: 4
  };

  const handleHabitToggle = (habitId: string) => {
    onUpdateLog(dateKey, {
      habits: {
        ...currentLog.habits,
        [habitId]: !currentLog.habits[habitId]
      }
    });
  };

  const handleMetricChange = (field: keyof DailyLog, value: any) => {
    onUpdateLog(dateKey, { [field]: value });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Date Header */}
      <header className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <button onClick={() => onDateChange(subDays(currentDate, 1))} className="p-2 hover:bg-slate-100 rounded-full text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800">{format(currentDate, 'EEEE')}</h2>
            <p className="text-slate-500 text-sm">{format(currentDate, 'MMM d, yyyy')}</p>
        </div>
        <button onClick={() => onDateChange(addDays(currentDate, 1))} className="p-2 hover:bg-slate-100 rounded-full text-slate-600">
          <ChevronRight size={24} />
        </button>
      </header>

      {/* Main Daily Goal */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-2 opacity-90">
            <Target size={20} />
            <h3 className="font-semibold uppercase tracking-wider text-sm">One Big Goal for Today</h3>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex-1">
                 <input 
                    type="text"
                    value={currentLog.dailyGoal}
                    onChange={(e) => handleMetricChange('dailyGoal', e.target.value)}
                    placeholder="e.g. Finish Chapter 3 of Physics"
                    className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:bg-white/30 transition-all"
                />
            </div>
            <button 
                onClick={() => handleMetricChange('dailyGoalCompleted', !currentLog.dailyGoalCompleted)}
                className={`p-2 rounded-full border-2 transition-all ${currentLog.dailyGoalCompleted ? 'bg-white text-indigo-600 border-white' : 'border-white/50 text-white/50 hover:bg-white/10'}`}
            >
                {currentLog.dailyGoalCompleted ? <CheckCircle size={32} /> : <Circle size={32} />}
            </button>
        </div>
      </section>

      {/* The Battle: Study vs Instagram */}
      <section className="grid md:grid-cols-2 gap-6">
        {/* Study Zone */}
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
            <h3 className="font-bold text-emerald-800 flex items-center gap-2 mb-4">
                <BookOpen size={20} /> Study & Focus
            </h3>
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm text-emerald-700 mb-1">
                        <span>Time Studied</span>
                        <span className="font-bold">{Math.floor(currentLog.studyMinutes / 60)}h {currentLog.studyMinutes % 60}m</span>
                    </div>
                    <input 
                        type="range" min="0" max="600" step="15"
                        value={currentLog.studyMinutes}
                        onChange={(e) => handleMetricChange('studyMinutes', parseInt(e.target.value))}
                        className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                </div>
                <div>
                    <label className="text-sm text-emerald-700 block mb-1">Deep Work Sessions (Pomodoros)</label>
                    <div className="flex gap-2">
                        {[0, 1, 2, 3, 4, 5, 6].map(num => (
                            <button
                                key={num}
                                onClick={() => handleMetricChange('studySessions', num)}
                                className={`w-8 h-8 rounded-full font-medium text-sm transition-all ${currentLog.studySessions === num ? 'bg-emerald-600 text-white shadow-lg scale-110' : 'bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-100'}`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Distraction Zone */}
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl">
            <h3 className="font-bold text-rose-800 flex items-center gap-2 mb-4">
                <Smartphone size={20} /> Instagram & Distractions
            </h3>
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm text-rose-700 mb-1">
                        <span>Instagram Time</span>
                        <span className="font-bold">{Math.floor(currentLog.instagramMinutes / 60)}h {currentLog.instagramMinutes % 60}m</span>
                    </div>
                    <input 
                        type="range" min="0" max="300" step="5"
                        value={currentLog.instagramMinutes}
                        onChange={(e) => handleMetricChange('instagramMinutes', parseInt(e.target.value))}
                        className="w-full h-2 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                    />
                </div>
                <div className="p-3 bg-white/50 rounded-lg text-xs text-rose-600 italic border border-rose-100">
                    {currentLog.instagramMinutes > 30 ? "⚠️ You're losing valuable time. Put the phone down." : "✅ Keeping it under control. Good job."}
                </div>
            </div>
        </div>
      </section>

      {/* Habits Grid */}
      <section>
        <h3 className="text-lg font-semibold text-slate-700 mb-3 px-1">Daily Discipline</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {DEFAULT_HABITS.map((habit) => {
            const isCompleted = !!currentLog.habits[habit.id];
            return (
              <button
                key={habit.id}
                onClick={() => handleHabitToggle(habit.id)}
                className={`
                  flex items-center justify-between p-4 rounded-xl border transition-all duration-200 text-left
                  ${isCompleted 
                    ? 'bg-slate-800 border-slate-800 text-white shadow-md' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}
                `}
              >
                <span className="font-medium text-sm md:text-base">{habit.label}</span>
                {isCompleted ? <CheckCircle size={20} className="text-green-400" /> : <Circle size={20} className="text-slate-300" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Routine & Sleep */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                <Moon size={18} /> Sleep & Routine
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Wake Up</label>
                    <input 
                        type="time" 
                        value={currentLog.wakeTime}
                        onChange={(e) => handleMetricChange('wakeTime', e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Bedtime</label>
                    <input 
                        type="time" 
                        value={currentLog.bedTime}
                        onChange={(e) => handleMetricChange('bedTime', e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>
            
            <div>
                <label className="text-sm text-slate-500 block mb-2">Sleep Quality (1-5)</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(q => (
                        <button
                            key={q}
                            onClick={() => handleMetricChange('sleepQuality', q as MoodRating)}
                            className={`flex-1 h-8 rounded-md transition-colors ${currentLog.sleepQuality === q ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                        >
                            {q}
                        </button>
                    ))}
                </div>
            </div>
      </div>

        {/* Night Reflection */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                <PenTool size={18} /> Night Reflection
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm text-slate-500 block mb-2">Mood</label>
                    <div className="flex gap-1">
                         {[1, 2, 3, 4, 5].map((level) => (
                            <button
                                key={level}
                                onClick={() => handleMetricChange('mood', level as MoodRating)}
                                className={`flex-1 h-8 rounded-md text-lg flex items-center justify-center transition-all ${currentLog.mood === level ? 'bg-amber-100 text-amber-600 ring-2 ring-amber-400' : 'bg-slate-50 text-slate-300'}`}
                            >
                                {['😫', '😕', '😐', '🙂', '🤩'][level - 1]}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                     <label className="text-sm text-slate-500 block mb-2">Energy</label>
                     <div className="flex gap-1">
                         {[1, 2, 3, 4, 5].map((level) => (
                            <button
                                key={level}
                                onClick={() => handleMetricChange('energy', level as MoodRating)}
                                className={`flex-1 h-8 rounded-md transition-all ${currentLog.energy === level ? 'bg-green-500 text-white ring-2 ring-green-300' : 'bg-slate-100'}`}
                            >
                                ⚡
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-2">
                <label className="text-sm text-slate-500 block mb-2">What went well? What went wrong? Plan for tomorrow.</label>
                <textarea
                    value={currentLog.reflection}
                    onChange={(e) => handleMetricChange('reflection', e.target.value)}
                    placeholder="Be honest with yourself..."
                    className="w-full p-4 rounded-xl bg-yellow-50/50 border border-yellow-100 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none h-32"
                />
            </div>
        </div>
    </div>
  );
};