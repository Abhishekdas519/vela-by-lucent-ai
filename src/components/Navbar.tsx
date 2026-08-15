import React from 'react';
import { User, ClientProfile } from '../types';
import { 
  Radio, 
  Sparkles, 
  ShieldCheck, 
  User as UserIcon, 
  LogOut, 
  ChevronRight,
  PhoneCall,
  LayoutDashboard,
  Zap,
  Download
} from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'client_dashboard' | 'admin_dashboard';
  currentUser: User | null;
  activeClient: ClientProfile | null;
  onNavigate: (view: 'landing' | 'client_dashboard' | 'admin_dashboard') => void;
  onOpenLogin: () => void;
  onOpenSignUp: () => void;
  onLogout: () => void;
  onOpenBuyMinutes: () => void;
  }

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  currentUser,
  activeClient,
  onNavigate,
  onOpenLogin,
  onOpenSignUp,
  onLogout,
  onOpenBuyMinutes,
  }) => {
  const talktimeMinutesLeft = activeClient 
    ? Math.max(0, activeClient.talktimeMinutesTotal - activeClient.talktimeMinutesUsed)
    : 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-slate-50/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[1.5px] shadow-lg shadow-cyan-500/20">
            <div className="h-full w-full bg-slate-50 rounded-[10px] flex items-center justify-center">
              <Radio className="w-5 h-5 text-cyan-600 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 font-mono">
                VELA
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-600 border border-cyan-200">
                by Lucent AI
              </span>
            </div>
            <span className="text-[11px] text-slate-500 -mt-0.5 hidden sm:block">
              Autonomous B2B Voice Sales Force
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
          <button
            id="nav-landing-link"
            onClick={() => onNavigate('landing')}
            className={`transition hover:text-slate-900 font-medium ${
              currentView === 'landing' ? 'text-cyan-600 font-semibold' : ''
            }`}
          >
            Overview
          </button>
          <a
            href="#voice-demo-section"
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('voice-demo-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="transition hover:text-slate-900 flex items-center gap-1"
          >
            <PhoneCall className="w-3.5 h-3.5 text-cyan-600" />
            <span>Live Voice Demo</span>
          </a>
          <a
            href="#proof-section"
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('proof-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="transition hover:text-slate-900"
          >
            ROI Calculator
          </a>
          
        </nav>

        {/* User Account / Navigation CTA */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              {currentUser.role === 'client' && activeClient && (
                <div 
                  onClick={onOpenBuyMinutes}
                  className="hidden sm:flex items-center gap-2 bg-white/90 border border-slate-200/60 rounded-lg px-3 py-1.5 cursor-pointer hover:border-cyan-500/50 transition"
                  title="Click to buy more talktime minutes"
                >
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Talktime Left</span>
                    <span className="text-xs font-bold text-cyan-600 font-mono">{talktimeMinutesLeft.toLocaleString()} mins</span>
                  </div>
                  <button 
                    id="btn-nav-buy-minutes"
                    className="p-1 rounded bg-cyan-500/20 text-cyan-600 hover:bg-cyan-500/30 transition"
                  >
                    <Zap className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* View Switcher Button */}
              {currentUser.role === 'admin' ? (
                <button
                  id="btn-admin-portal-switch"
                  onClick={() => onNavigate(currentView === 'admin_dashboard' ? 'landing' : 'admin_dashboard')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-50 text-purple-700 border border-purple-500/40 hover:bg-purple-900/80 transition cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>{currentView === 'admin_dashboard' ? 'View Landing Page' : 'Admin Console'}</span>
                </button>
              ) : (
                <button
                  id="btn-client-portal-switch"
                  onClick={() => onNavigate(currentView === 'client_dashboard' ? 'landing' : 'client_dashboard')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-900/80 transition cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-cyan-600" />
                  <span>{currentView === 'client_dashboard' ? 'View Landing Page' : 'Client Dashboard'}</span>
                </button>
              )}

              {/* User Dropdown Pill */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-700 leading-tight">{currentUser.name}</span>
                  <span className="text-[10px] text-slate-500 capitalize">{currentUser.role === 'admin' ? 'Super Admin' : currentUser.companyName}</span>
                </div>
                <button
                  id="btn-nav-logout"
                  onClick={onLogout}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            
            <div className="flex items-center gap-2.5">
              <button
                onClick={onOpenLogin}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Sign In
              </button>
              <button
                id="btn-nav-signup"

                onClick={onOpenSignUp}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:from-cyan-400 hover:to-indigo-500 shadow-md shadow-cyan-500/20 transition active:scale-95 cursor-pointer"
              >
                <span>Join Now</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
