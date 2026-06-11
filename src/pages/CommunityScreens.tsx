import React, { useEffect, useState } from 'react';
import { AppShell, Card, PageHeader, Button, Badge } from '../components/Shared';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Trophy, Star, Video, Settings as SettingsIcon,
  LogOut, Bell, User, Lock, Volume2, ChevronRight,
  Moon, Globe, Mic, BarChart2
} from 'lucide-react';
import store from '../utils/realtime';

// 48. Leaderboard
export const CommunityLeaderboard = () => {
  const [ranks, setRanks] = useState<any[]>([]);
  const [improvementTip, setImprovementTip] = useState('Keep practicing to climb the leaderboard!');
  const [rankLabel, setRankLabel] = useState('');

  useEffect(() => {
    const unsub = store.subscribe((s: any) => {
      const currentRanks = s?.communityRanks || [];
      setRanks(currentRanks);
      if (currentRanks.length > 0) {
        const youIndex = currentRanks.findIndex((u: any) => u.isYou || String(u.name).includes('(You)'));
        if (youIndex >= 0) {
          const percentile = Math.max(1, Math.min(100, Math.round(((currentRanks.length - youIndex) / currentRanks.length) * 100)));
          setRankLabel(`You are currently ranked #${youIndex + 1} (${percentile}th percentile)`);
        } else {
          setRankLabel('Your ranking will appear as you complete interviews.');
        }
      } else {
        setRankLabel('No leaderboard data yet. Complete interviews to see rankings!');
      }
      if (s?.scoreboardTip) setImprovementTip(s.scoreboardTip);
    });
    return () => unsub();
  }, []);

  return (
    <AppShell>
      <PageHeader title="Live Leaderboard" subtitle="Real-time rankings from community members." />
      <Card className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900">Community Rankings</h3>
            <p className="text-sm text-slate-500">Updated instantly after every interview.</p>
          </div>
          <Badge variant="indigo">Real-time</Badge>
        </div>
        {rankLabel && <p className="mt-4 text-sm text-slate-600">{rankLabel}</p>}
      </Card>

      {ranks.length === 0 ? (
        <Card className="p-12 text-center">
          <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Data Yet</h3>
          <p className="text-slate-600 mb-6">Complete your first interview to get started!</p>
        </Card>
      ) : (
        <>
          <Card className="p-6 mb-6 bg-slate-900 border-slate-800">
            <h4 className="text-sm text-slate-300 uppercase tracking-[0.2em] mb-3">Pro Tip</h4>
            <p className="text-slate-100 text-sm leading-relaxed">{improvementTip}</p>
          </Card>
          <Card className="divide-y divide-slate-100">
            {ranks.map((u, index) => (
              <div key={u.name + index} className={`p-4 flex items-center gap-4 ${u.isYou ? 'bg-indigo-50/50' : ''}`}>
                <div className={`w-8 font-bold text-center ${index < 3 ? 'text-amber-500' : 'text-slate-400'}`}>#{index + 1}</div>
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                  <img src={u.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.email || index}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold ${u.isYou ? 'text-indigo-900' : 'text-slate-900'}`}>{u.name}</h4>
                  <p className="text-xs text-slate-500">{u.role || 'Community member'}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">{u.score}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Score</div>
                </div>
              </div>
            ))}
          </Card>
        </>
      )}
    </AppShell>
  );
};

// 49. Mentor Connect
export const CommunityMentor = () => (
  <AppShell>
    <PageHeader title="Human Coaches" subtitle="Book a 1-on-1 session with industry experts." />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { name: 'Elena R.', role: 'Ex-Google Eng Manager', rating: 4.9, price: '$120/hr' },
        { name: 'James K.', role: 'Senior PM at Stripe', rating: 5.0, price: '$150/hr' },
        { name: 'Anita S.', role: 'Tech Recruiter', rating: 4.8, price: '$90/hr' },
      ].map((mentor, i) => (
        <Card key={i} className="p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
          <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.name}`} alt="Mentor" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{mentor.name}</h3>
                <p className="text-sm text-slate-500">{mentor.role}</p>
              </div>
              <Badge variant="amber" className="mt-2 sm:mt-0 self-center sm:self-auto">
                <Star className="w-3 h-3 mr-1 fill-current" /> {mentor.rating}
              </Badge>
            </div>
            <p className="text-sm text-slate-600 mb-4">Specializes in system design and behavioral interviews for FAANG companies.</p>
            <div className="flex items-center justify-between w-full">
              <span className="font-bold text-slate-900">{mentor.price}</span>
              <Button size="sm"><Video className="w-4 h-4 mr-2" /> Book</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </AppShell>
);

// ─── Switch Account Modal ─────────────────────────────────────────────
const SwitchAccountModal = ({ onClose }: { onClose: () => void }) => {
  const { loginWithPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password.trim()) { setError('Please enter both email and password.'); return; }
    setLoading(true);
    const result = await loginWithPassword(email.trim(), password);
    setLoading(false);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => { onClose(); navigate('/dashboard'); }, 1200);
    } else {
      setError(result.error || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-xl font-bold transition-colors">×</button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <User className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Switch Account</h2>
            <p className="text-xs text-slate-400">Sign in to a different account</p>
          </div>
        </div>

        {success ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">✅</div>
            <p className="font-bold text-emerald-600">Signed in successfully!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm outline-none"
                  placeholder="you@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-xl transition-colors text-sm">
              {loading ? 'Signing in…' : 'Sign In to Account'}
            </button>
            <p className="text-center text-xs text-slate-400">
              Don't have an account?{' '}
              <button onClick={() => { onClose(); navigate('/'); }} className="text-indigo-600 font-semibold hover:underline">Create one</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// 50. Settings
export const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showSwitchAccount, setShowSwitchAccount] = useState(false);

  // Individual settings state
  const [notifEnabled, setNotifEnabled] = useState(() => localStorage.getItem('pref_notif') !== 'false');
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('pref_sound') !== 'false');
  const [voiceEnabled, setVoiceEnabled] = useState(() => localStorage.getItem('pref_voice') !== 'false');
  const [difficulty, setDifficulty] = useState(() => localStorage.getItem('pref_difficulty') || 'Medium');

  const [diffOpen, setDiffOpen] = useState(false);
  const [saveFlash, setSaveFlash] = useState('');

  const displayName = user?.name || 'User';
  const displayEmail = user?.email || 'Not signed in';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  const savePref = (key: string, val: string) => {
    localStorage.setItem(key, val);
    setSaveFlash('Saved!');
    setTimeout(() => setSaveFlash(''), 1500);
  };

  const handleSignOut = () => { logout(); navigate('/'); };

  return (
    <AppShell>
      <PageHeader title="Settings" />
      {showSwitchAccount && <SwitchAccountModal onClose={() => setShowSwitchAccount(false)} />}

      <div className="max-w-2xl space-y-5">

        {/* ── Account Card ── */}
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-lg font-bold">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 text-base truncate">{displayName}</h3>
              <p className="text-sm text-slate-400 truncate">{displayEmail}</p>
            </div>
            <button
              onClick={() => setShowSwitchAccount(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap">
              <User className="w-4 h-4" /> Switch Account
            </button>
          </div>
        </Card>

        {/* ── Interview Settings ── */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Interview Settings</p>
          <Card className="divide-y divide-slate-100">

            {/* Difficulty */}
            <div>
              <button
                onClick={() => { setDiffOpen(o => !o); }}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <BarChart2 className="w-5 h-5 text-slate-400" />
                  <div className="text-left">
                    <p className="font-medium text-slate-700">Interview Difficulty</p>
                    <p className="text-xs text-slate-400">Current: <span className="font-semibold text-indigo-600">{difficulty}</span></p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${diffOpen ? 'rotate-90' : ''}`} />
              </button>
              {diffOpen && (
                <div className="px-4 pb-4 bg-slate-50 flex gap-2 flex-wrap">
                  {['Easy', 'Medium', 'Hard'].map(d => (
                    <button
                      key={d}
                      onClick={() => { setDifficulty(d); savePref('pref_difficulty', d); }}
                      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border-2 ${difficulty === d
                        ? d === 'Easy' ? 'bg-emerald-600 border-emerald-600 text-white'
                          : d === 'Medium' ? 'bg-amber-500 border-amber-500 text-white'
                            : 'bg-rose-600 border-rose-600 text-white'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mic / Voice */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-700">Voice Answers</p>
                  <p className="text-xs text-slate-400">{voiceEnabled ? 'Mic enabled — speak your answers' : 'Text-only mode'}</p>
                </div>
              </div>
              <button
                onClick={() => { const next = !voiceEnabled; setVoiceEnabled(next); savePref('pref_voice', String(next)); }}
                className={`relative w-11 h-6 rounded-full transition-colors ${voiceEnabled ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${voiceEnabled ? 'translate-x-5' : ''}`} />
              </button>
            </div>

          </Card>
        </div>

        {/* ── App Settings ── */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">App Settings</p>
          <Card className="divide-y divide-slate-100">

            {/* Notifications */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-700">Notifications</p>
                  <p className="text-xs text-slate-400">{notifEnabled ? 'Practice reminders on' : 'All notifications off'}</p>
                </div>
              </div>
              <button
                onClick={() => { const next = !notifEnabled; setNotifEnabled(next); savePref('pref_notif', String(next)); }}
                className={`relative w-11 h-6 rounded-full transition-colors ${notifEnabled ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifEnabled ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            {/* Sound Effects */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-700">Sound Effects</p>
                  <p className="text-xs text-slate-400">{soundEnabled ? 'Feedback chimes on' : 'Silent mode'}</p>
                </div>
              </div>
              <button
                onClick={() => { const next = !soundEnabled; setSoundEnabled(next); savePref('pref_sound', String(next)); }}
                className={`relative w-11 h-6 rounded-full transition-colors ${soundEnabled ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${soundEnabled ? 'translate-x-5' : ''}`} />
              </button>
            </div>

          </Card>
        </div>

        {/* Save flash */}
        {saveFlash && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg z-50">
            ✓ {saveFlash}
          </div>
        )}

        {/* ── Danger Zone ── */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Account</p>
          <Button
            variant="ghost"
            className="w-full text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            onClick={handleSignOut}>
            <LogOut className="w-5 h-5 mr-2" /> Sign Out
          </Button>
        </div>

      </div>
    </AppShell>
  );
};