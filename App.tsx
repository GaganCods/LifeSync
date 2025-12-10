import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { TrackerView } from './components/TrackerView';
import { AnalyticsView } from './components/AnalyticsView';
import { MentorView } from './components/MentorView';
import { DailyLog, View } from './types';
import { format } from 'date-fns';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.TRACKER);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  // State for all logs
  const [logs, setLogs] = useState<Record<string, DailyLog>>({});

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('lifeSync_logs');
    if (saved) {
      try {
        setLogs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse logs", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (Object.keys(logs).length > 0) {
        localStorage.setItem('lifeSync_logs', JSON.stringify(logs));
    }
  }, [logs]);

  const updateLog = (dateKey: string, updates: Partial<DailyLog>) => {
    setLogs(prev => {
        const existing = prev[dateKey] || {
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
            waterIntake: 4,
        };
        return {
            ...prev,
            [dateKey]: { ...existing, ...updates }
        };
    });
  };

  const handleSaveInsight = (insight: string) => {
    const dateKey = format(currentDate, 'yyyy-MM-dd');
    updateLog(dateKey, { aiMentorInsight: insight });
  };

  const renderContent = () => {
    const dateKey = format(currentDate, 'yyyy-MM-dd');

    switch (currentView) {
      case View.TRACKER:
        return (
          <TrackerView 
            currentDate={currentDate} 
            onDateChange={setCurrentDate}
            log={logs[dateKey]}
            onUpdateLog={updateLog}
          />
        );
      case View.ANALYTICS:
        return <AnalyticsView logs={logs} />;
      case View.MENTOR:
        return (
          <MentorView 
            logs={logs} 
            currentDate={currentDate}
            onSaveInsight={handleSaveInsight}
          />
        );
      default:
        return <div>Not Found</div>;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {renderContent()}
    </Layout>
  );
};

export default App;