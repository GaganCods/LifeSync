import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Quote, AlertCircle, Save, Check, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { DailyLog } from '../types';
import { generateMentorInsight } from '../services/geminiService';
import { format } from 'date-fns';

interface MentorViewProps {
  logs: Record<string, DailyLog>;
  currentDate: Date;
  onSaveInsight: (insight: string) => void;
}

export const MentorView: React.FC<MentorViewProps> = ({ logs, currentDate, onSaveInsight }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const dateKey = format(currentDate, 'yyyy-MM-dd');
  const savedInsight = logs[dateKey]?.aiMentorInsight;

  // Sync state with saved insight when date changes
  useEffect(() => {
    if (savedInsight) {
        setInsight(savedInsight);
        setIsSaved(true);
    } else {
        setInsight(null);
        setIsSaved(false);
    }
  }, [dateKey, savedInsight]);

  const handleGenerateInsight = async () => {
    setLoading(true);
    setError(null);
    setIsSaved(false); // Reset saved state for new generation
    try {
      const recentLogs = Object.values(logs).slice(-7) as DailyLog[]; // Last 7 entries
      
      if (recentLogs.length === 0) {
        setInsight("I don't have enough data yet! Please track your habits for a day or two first.");
        return;
      }

      const response = await generateMentorInsight(recentLogs);
      setInsight(response);
    } catch (err) {
      setError("Failed to connect to your AI Mentor. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (insight) {
        onSaveInsight(insight);
        setIsSaved(true);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-6">
        <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4">
            <Sparkles className="text-indigo-600 w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">AI Lifestyle Mentor</h2>
        <div className="flex items-center justify-center gap-2 text-slate-500">
            <Calendar size={16} />
            <span>Insight for {format(currentDate, 'MMMM d, yyyy')}</span>
        </div>
      </div>

      {!insight && !loading && (
        <div className="flex justify-center">
            <button 
                onClick={handleGenerateInsight}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-full shadow-lg shadow-indigo-200 transition-all transform hover:scale-105 flex items-center gap-2"
            >
                <Sparkles size={20} />
                Generate Daily Insight
            </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 text-indigo-600">
            <Loader2 className="animate-spin w-10 h-10 mb-4" />
            <p className="font-medium animate-pulse">Analyzing your patterns...</p>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-start gap-3 text-rose-700">
            <AlertCircle className="mt-1" size={20} />
            <p>{error}</p>
        </div>
      )}

      {insight && !loading && (
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200 overflow-hidden border border-indigo-50">
            <div className={`h-2 w-full ${isSaved ? 'bg-emerald-500' : 'bg-indigo-600'}`}></div>
            <div className="p-8">
                <div className="prose prose-indigo prose-lg max-w-none text-slate-700">
                    <ReactMarkdown>{insight}</ReactMarkdown>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                    <div className="flex gap-3">
                         {!isSaved ? (
                            <button 
                                onClick={handleSave}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-medium transition-colors"
                            >
                                <Save size={18} /> Save to Journal
                            </button>
                         ) : (
                            <span className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-medium">
                                <Check size={18} /> Saved
                            </span>
                         )}
                         {savedInsight && (
                             <button
                                onClick={handleGenerateInsight}
                                className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                             >
                                <Sparkles size={18} /> Regenerate
                             </button>
                         )}
                    </div>

                    <button 
                        onClick={() => setInsight(null)} 
                        className="text-sm text-slate-400 hover:text-slate-600 font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Static Tip when idle */}
      {!insight && !loading && (
        <div className="mt-12 bg-slate-100 rounded-xl p-6 text-slate-600 relative">
            <Quote className="absolute top-4 left-4 text-slate-300 w-8 h-8" />
            <p className="pl-10 italic">
                "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
                <span className="block mt-2 font-semibold not-italic text-slate-800">- Aristotle</span>
            </p>
        </div>
      )}
    </div>
  );
};