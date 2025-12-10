import React from 'react';
import { LayoutDashboard, BarChart2, BrainCircuit } from 'lucide-react';
import { View } from '../types';

interface LayoutProps {
  currentView: View;
  onNavigate: (view: View) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, children }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 shadow-sm flex justify-between items-center z-10 sticky top-0">
        <div className="font-bold text-xl text-indigo-600 flex items-center gap-2">
            <BrainCircuit size={24} />
            LifeSync
        </div>
      </div>

      {/* Sidebar (Desktop) / Bottom Nav (Mobile) */}
      <nav className="
        fixed bottom-0 w-full bg-white border-t border-slate-200 p-2 z-20
        md:relative md:w-64 md:h-screen md:flex-col md:border-t-0 md:border-r md:p-6
        flex justify-around md:justify-start gap-2 md:gap-4
      ">
        <div className="hidden md:flex items-center gap-2 font-bold text-2xl text-indigo-600 mb-8 px-4">
          <BrainCircuit size={32} />
          LifeSync
        </div>

        <NavButton 
          active={currentView === View.TRACKER} 
          onClick={() => onNavigate(View.TRACKER)} 
          icon={<LayoutDashboard size={20} />} 
          label="Tracker" 
        />
        <NavButton 
          active={currentView === View.ANALYTICS} 
          onClick={() => onNavigate(View.ANALYTICS)} 
          icon={<BarChart2 size={20} />} 
          label="Analytics" 
        />
        <NavButton 
          active={currentView === View.MENTOR} 
          onClick={() => onNavigate(View.MENTOR)} 
          icon={<BrainCircuit size={20} />} 
          label="AI Mentor" 
        />
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto mb-16 md:mb-0">
        <div className="max-w-4xl mx-auto">
            {children}
        </div>
      </main>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ 
  active, onClick, icon, label 
}) => (
  <button
    onClick={onClick}
    className={`
      flex flex-col md:flex-row items-center md:gap-3 p-2 md:px-4 md:py-3 rounded-xl transition-all
      ${active 
        ? 'text-indigo-600 bg-indigo-50 font-medium' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}
    `}
  >
    {icon}
    <span className="text-xs md:text-sm">{label}</span>
  </button>
);
