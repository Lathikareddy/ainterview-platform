import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  Home,
  BookOpen,
  BarChart2,
  Users,
  Settings,
  ChevronLeft,
  Bell,
  Menu,
  X } from 'lucide-react';

// --- UI COMPONENTS ---
export const Button = ({
  children,
  variant = 'primary',
  className = '',
  size = 'md',
  type = 'button',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?: 'primary' | 'secondary' | 'outline' | 'ghost';size?: 'sm' | 'md' | 'lg';}) => {
  const base =
  'inline-flex items-center justify-center rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-200',
    secondary: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
    outline: 'border-2 border-slate-200 bg-transparent hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}>
      {children}
    </button>);
};

export const Card = ({
  children,
  className = '',
  hover = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {hover?: boolean;}) =>
<div
  className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${hover ? 'hover:shadow-lg hover:border-indigo-200 hover:-translate-y-0.5 transition-all cursor-pointer' : ''} ${className}`}
  {...props}>
  {children}
</div>;

export const Badge = ({
  children,
  variant = 'gray',
  className = ''
}: {children: React.ReactNode;variant?: 'gray' | 'indigo' | 'amber' | 'emerald' | 'rose';className?: string;}) => {
  const variants = {
    gray: 'bg-slate-100 text-slate-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    amber: 'bg-amber-100 text-amber-800',
    emerald: 'bg-emerald-100 text-emerald-700',
    rose: 'bg-rose-100 text-rose-700'
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>);
};

export const PageHeader = ({
  title,
  subtitle,
  backTo,
  action
}: {title: string;subtitle?: string;backTo?: string | number;action?: React.ReactNode;}) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-4">
        {backTo &&
        <button
          onClick={() => navigate(backTo as any)}
          className="p-2 -ml-2 rounded-full hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        }
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>);
};

export const StatCard = ({
  title,
  value,
  trend,
  icon: Icon,
  color = 'indigo'
}: any) => {
  const colors: Record<string, { bg: string; icon: string; grad: string }> = {
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', grad: 'from-indigo-500 to-violet-500' },
    amber:  { bg: 'bg-amber-50',  icon: 'text-amber-600',  grad: 'from-amber-400 to-orange-500' },
    emerald:{ bg: 'bg-emerald-50',icon: 'text-emerald-600',grad: 'from-emerald-500 to-teal-500' },
    rose:   { bg: 'bg-rose-50',   icon: 'text-rose-600',   grad: 'from-rose-500 to-pink-500' }
  };
  const c = colors[color] || colors.indigo;
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 relative overflow-hidden`}>
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${c.grad} opacity-10 rounded-full translate-x-6 -translate-y-6`} />
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl ${c.bg}`}>
          <Icon className={`w-6 h-6 ${c.icon}`} />
        </div>
        {trend != null &&
        <Badge variant={trend > 0 ? 'emerald' : trend < 0 ? 'rose' : 'gray'}>
          {trend > 0 ? '+' : ''}{trend}%
        </Badge>
        }
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
      </div>
    </div>);
};

export const ScoreRing = ({
  score,
  size = 120,
  strokeWidth = 8,
  label = 'Score'
}: {score: number;size?: number;strokeWidth?: number;label?: string;}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - score / 100 * circumference;
  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-slate-100" />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          cx={size / 2} cy={size / 2} r={radius}
          stroke="currentColor" strokeWidth={strokeWidth} fill="transparent"
          strokeDasharray={circumference} strokeLinecap="round"
          className={score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-amber-500' : 'text-rose-500'} />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-900">{score}</span>
        <span className="text-xs text-slate-500 font-medium">{label}</span>
      </div>
    </div>);
};

// --- LAYOUT COMPONENTS ---
const NAV_ITEMS = [
  { path: '/dashboard', icon: Home,     label: 'Home',      gradient: 'from-indigo-500 to-violet-500' },
  { path: '/practice',  icon: BookOpen, label: 'Practice',  gradient: 'from-emerald-500 to-teal-500' },
  { path: '/analytics', icon: BarChart2,label: 'Analytics', gradient: 'from-amber-500 to-orange-500' },
  { path: '/community', icon: Users,    label: 'Community', gradient: 'from-rose-500 to-pink-500' },
];

export const AppShell = ({ children }: {children: React.ReactNode;}) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const displayName = user?.name || 'User';
  const displayEmail = user?.email || '';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed h-full z-10 bg-white/90 backdrop-blur-xl border-r border-slate-200/80 shadow-xl shadow-slate-200/50">
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">AInterview</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${isActive
                  ? 'text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                style={isActive ? { background: `linear-gradient(135deg, var(--tw-gradient-stops))` } : {}}>
                <div className={isActive
                  ? `w-8 h-8 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-sm`
                  : 'w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center'}>
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                </div>
                <span className={isActive ? 'text-slate-800 font-semibold' : ''}>{item.label}</span>
                {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-indigo-500" />}
              </Link>);
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <Link
            to="/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${location.pathname === '/settings' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <Settings className="w-4 h-4 text-slate-500" />
            </div>
            Settings
          </Link>
          <div className="mt-4 flex items-center gap-3 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-white text-sm font-bold">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{displayName}</p>
              <p className="text-xs text-slate-400 truncate">{displayEmail || 'Signed in'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent">AInterview</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0 min-h-screen">
        <div className="max-w-5xl mx-auto p-4 md:p-8">{children}</div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 flex justify-around items-center pb-safe z-20 shadow-2xl">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-3 px-2 min-w-[64px] transition-all ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1 transition-all ${isActive ? `bg-gradient-to-br ${item.gradient} shadow-md` : ''}`}>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
              </div>
              <span className={`text-[10px] font-semibold ${isActive ? 'text-indigo-600' : ''}`}>{item.label}</span>
            </Link>);
        })}
      </nav>
    </div>);
};