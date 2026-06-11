import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppShell,
  Card,
  Button,
  Badge,
  PageHeader,
  StatCard } from
'../components/Shared';
import store from '../utils/realtime';
import {
  Play,
  Calendar,
  TrendingUp,
  Clock,
  Target,
  Search,
  Filter,
  Star,
  MessageSquare,
  Video,
  Mic,
  FileText,
  Zap,
  Users,
  Code,
  Bell,
  BarChart2,
  CheckCircle2 } from
'lucide-react';
// ---- Recommended Carousel ----
const SLIDES = [
  { label: '🎯 Mock Test', title: 'Google Frontend Engineer Mock', desc: '5 real questions from Google interviews. System design + React performance. 45 min timed session.', gradient: 'from-indigo-600 to-violet-700', action: { text: 'Start Mock', link: '/interview-setup' }, icon: '🧑‍💻' },
  { label: '⚡ Interview Hack', title: 'Use the STAR Method Every Time', desc: 'Situation → Task → Action → Result. Structure every behavioral answer this way and you\'ll never blank out again.', gradient: 'from-emerald-500 to-teal-600', action: { text: 'Practice Behavioral', link: '/practice' }, icon: '⭐' },
  { label: '📅 Today\'s Schedule', title: 'Day 1: Behavioral Foundations', desc: 'Morning: Tell me about yourself. Afternoon: Failure question. Evening: Conflict resolution. 3 questions = 30 min.', gradient: 'from-amber-500 to-orange-600', action: { text: 'Start Today\'s Plan', link: '/practice' }, icon: '📋' },
  { label: '🔥 Body Language Hack', title: 'Silence is a Superpower', desc: 'Top candidates pause 2-3 seconds before answering. It signals you\'re thoughtful, not nervous. Try it in your next mock — it changes everything.', gradient: 'from-rose-500 to-pink-600', action: { text: 'Do a Mock Now', link: '/live-video' }, icon: '🧠' },
  { label: '🧪 Mock Test', title: 'Amazon Leadership Principles Mock', desc: '14 LP questions randomized. "Customer Obsession", "Ownership", "Bias for Action" — know them all cold.', gradient: 'from-sky-500 to-blue-600', action: { text: 'Start Amazon Mock', link: '/interview-setup' }, icon: '🏆' },
  { label: '💰 Career Hack', title: 'Never Give a Salary Number First', desc: 'When asked "what are your expectations?", say: "I\'d love to hear your budget for this role first." This one line can earn you 20%+ more.', gradient: 'from-purple-600 to-indigo-700', action: { text: 'Practice Negotiation', link: '/live-video' }, icon: '💼' },
  { label: '📅 Weekly Schedule', title: 'Week 1 Interview Prep Plan', desc: 'Mon: Resume stories. Tue: Technical Q. Wed: System Design. Thu: Mock interview. Fri: Review feedback.', gradient: 'from-cyan-500 to-sky-600', action: { text: 'Start Practice', link: '/practice' }, icon: '🗓️' },
  { label: '🎭 Deep Dive', title: '5 Behavioral Questions That Eliminate 80% of Candidates', desc: '"Tell me your biggest failure", "Describe conflict with your manager", "A time you took ownership" — these 3 alone decide your offer. Master them now.', gradient: 'from-fuchsia-500 to-purple-700', action: { text: 'Practice These Now', link: '/live-video' }, icon: '🎯' },
  { label: '⚡ Interview Hack', title: 'End Every Answer with a Result', desc: '"...and as a result, we shipped 2 weeks early and reduced churn by 15%." Numbers win interviews. Always quantify.', gradient: 'from-green-500 to-emerald-700', action: { text: 'Practice Now', link: '/practice' }, icon: '📈' },
  { label: '🧑‍🏫 Daily Challenge', title: 'Today: System Design — Design WhatsApp', desc: 'Cover: real-time messaging, scalability to 2B users, message delivery guarantees, and end-to-end encryption.', gradient: 'from-slate-700 to-slate-900', action: { text: 'Start Challenge', link: '/interview-setup' }, icon: '💬' },
];

const RecommendedCarousel = () => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<number | null>(null);
  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 10000);
  };
  useEffect(() => { resetTimer(); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);
  const goTo = (idx: number) => { setCurrent(idx); resetTimer(); };
  const slide = SLIDES[current];
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900">Recommended for you</h2>
        <span className="text-sm text-slate-400">{current + 1} / {SLIDES.length}</span>
      </div>
      <div className={`relative rounded-2xl p-6 bg-gradient-to-br ${slide.gradient} text-white overflow-hidden`} style={{transition:'background 0.5s'}}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-10 translate-x-10 pointer-events-none" />
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">{slide.label}</span>
          <span className="text-4xl select-none">{slide.icon}</span>
        </div>
        <h3 className="text-2xl font-bold mb-2 leading-tight">{slide.title}</h3>
        <p className="text-white/80 text-sm mb-6 max-w-lg">{slide.desc}</p>
        <div className="flex items-center gap-3 flex-wrap">
          <Link to={slide.action.link}>
            <button className="bg-white text-slate-900 font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-100 transition text-sm">{slide.action.text}</button>
          </Link>
          <button onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)} className="bg-white/20 hover:bg-white/30 transition px-3 py-2.5 rounded-xl text-sm font-medium">‹ Prev</button>
          <button onClick={() => goTo((current + 1) % SLIDES.length)} className="bg-white/20 hover:bg-white/30 transition px-3 py-2.5 rounded-xl text-sm font-medium">Next ›</button>
        </div>
        <div className="flex gap-1.5 mt-5">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} className={`h-1.5 rounded-full transition-all ${i === current ? 'bg-white w-6' : 'bg-white/40 w-1.5'}`} />
          ))}
        </div>
      </div>
    </section>
  );
};

// 14. Dashboard
export const Dashboard = () => {
  const navigate = useNavigate();
  const [rtState, setRtState] = useState<any>({});
  const [recent, setRecent] = useState<any[]>([]);
  const [ranks, setRanks] = useState<any[]>([]);
  const [stats, setStats] = useState({ interviewsCompleted: 0, avgScore: '0/100', practiceHours: '0.0h', streakDays: 0, trendDiff: 0 });
  const [recommended, setRecommended] = useState({ title: 'Keep building momentum with your next session.', caption: 'Your latest results will personalize this recommendation.', label: 'Recommended' });

  useEffect(() => {
    const unsub = store.subscribe((s: any) => {
      const skillLabels: Record<string, string> = {
        frontend: 'Frontend',
        backend: 'Backend',
        system: 'System Design',
        behavioral: 'Behavioral'
      };
      const statsBySkill = s?.skillStats || {};
      const weakest = Object.entries(statsBySkill).reduce<any>((best, [key, value]) => {
        const average = value.total ? value.scoreSum / value.total : 0;
        if (!best || average < best.avg) return { key, avg: average };
        return best;
      }, null);
      const recommendation = weakest ? {
        title: `${skillLabels[weakest.key] || 'Technical'} practice will boost your score`,
        caption: `Your current average in ${skillLabels[weakest.key] || 'this area'} is ${Math.round(weakest.avg)}/100. Focus on this domain next.`,
        label: `${skillLabels[weakest.key] || 'Skill'} Focus`
      } : {
        title: 'Keep building momentum with your next session.',
        caption: 'Your latest results will personalize this recommendation.',
        label: 'Recommended'
      };
      const scoreTrend = s?.scoreTrend || [];
      const trendDiff = scoreTrend.length >= 2 ? Math.round(scoreTrend[scoreTrend.length - 1].score - scoreTrend[scoreTrend.length - 2].score) : 0;
      setRtState(s || {});
      setRecent(s?.recentActivity || []);
      setRanks(s?.communityRanks || []);
      setStats({
        interviewsCompleted: s?.interviewsCompleted ?? 0,
        avgScore: s?.avgScore ?? '0/100',
        practiceHours: s?.totalPracticeSeconds ? `${(s.totalPracticeSeconds / 3600).toFixed(1)}h` : '0.0h',
        streakDays: s?.streakDays ?? 0,
        trendDiff
      });
      setRecommended(recommendation);
    });
    return () => unsub();
  }, []);
  useEffect(() => {
    try {
      const done = localStorage.getItem('setupComplete');
      if (!done) navigate('/setup-basic');
    } catch (e) {
      // ignore storage errors
    }
  }, [navigate]);
  return (
    <AppShell>
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 p-7 text-white relative overflow-hidden shadow-xl shadow-indigo-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-20 translate-x-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-10 -translate-x-10 pointer-events-none" />
        <h1 className="text-3xl font-bold mb-1">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {rtState?.name || localStorage.getItem('profileName') || 'there'} 👋
        </h1>
        <p className="text-indigo-200 mt-1">
          {stats.streakDays > 0 ? `🔥 You're on a ${stats.streakDays}-day practice streak. Keep it going!` : 'Start your first session to build your practice streak!'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Interviews Completed"
          value={String(stats.interviewsCompleted)}
          trend={stats.trendDiff}
          icon={Target}
          color="indigo" />
        
        <StatCard
          title="Average Score"
          value={stats.avgScore}
          trend={stats.trendDiff}
          icon={TrendingUp}
          color="emerald" />
        
        <StatCard
          title="Practice Hours"
          value={stats.practiceHours}
          icon={Clock}
          color="amber" />
        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Recommended Carousel */}
          <RecommendedCarousel />

          {/* Recent Activity */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                Recent Activity
              </h2>
              <Link
                to="/history"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {recent.map((item, i) => (
                <Link to="/feedback-detailed" key={i} className="block">
                  <Card className="p-4 flex items-center justify-between hover" hover>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        {item.type === 'Video' ? (
                          <Video className="w-5 h-5 text-slate-500" />
                        ) : item.type === 'Voice' ? (
                          <Mic className="w-5 h-5 text-slate-500" />
                        ) : (
                          <MessageSquare className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{item.title}</h4>
                        <p className="text-sm text-slate-500">{item.date} • {item.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-900">{item.score}</div>
                      <div className="text-xs text-slate-500">Score</div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
            {/* (Community ranks removed as requested) */}
          {/* Weekly Goal */}
          <Card className="p-6">
            <h3 className="font-bold text-slate-900 mb-4">Weekly Goal</h3>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500">{Math.min(stats.interviewsCompleted, 5)} of 5 sessions</span>
              <span className="font-medium text-slate-900">{Math.round(Math.min(stats.interviewsCompleted, 5) / 5 * 100)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{
                  width: `${Math.min(stats.interviewsCompleted, 5) / 5 * 100}%`
                }}>
              </div>
            </div>
            <div className="flex justify-between">
              {['M', 'T', 'W', 'T', 'F'].map((day, i) =>
              <div key={i} className="flex flex-col items-center gap-2">
                  <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${i < Math.min(stats.interviewsCompleted, 5) ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                    {i < Math.min(stats.interviewsCompleted, 5) ? <CheckCircle2 className="w-4 h-4" /> : day}
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900">Live Leaderboard</h3>
                <p className="text-sm text-slate-500">Real-time rankings from community.</p>
              </div>
              <Badge variant="indigo">Live</Badge>
            </div>
            {ranks.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-slate-500 mb-3">No leaderboard data yet</p>
                <Link to="/community">
                  <Button size="sm" variant="outline">View Community</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {ranks.slice(0, 5).map((entry, i) => (
                  <div key={i} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-700">
                        {entry.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{entry.name}</p>
                        <p className="text-xs text-slate-500">{entry.role || 'Member'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-900">{entry.score}</div>
                      {entry.isYou && <div className="text-[10px] uppercase tracking-wide text-indigo-600">You</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Upcoming Events — only shown when user has real scheduled events */}
          {rtState.upcomingEvents && rtState.upcomingEvents.length > 0 && (
          <Card className="p-6">
            <h3 className="font-bold text-slate-900 mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              {rtState.upcomingEvents.map((ev: any, i: number) => (
                <Link to={ev.link || '/live-video'} key={i} className="block group">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex flex-col items-center justify-center text-indigo-700 flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                      <span className="text-xs font-bold uppercase">{ev.dateLabel}</span>
                      <span className="text-lg font-bold leading-none">{ev.dateDay}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{ev.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{ev.time}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
          )}
        </div>
      </div>
    </AppShell>);

};
// 15. Search & Browse
export const SearchBrowse = () => {
  return (
    <AppShell>
      <PageHeader
        title="Browse Interviews"
        subtitle="Find the perfect practice scenario." />
      
      <div className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search roles, companies, or skills..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          
        </div>
        <Button variant="outline" className="flex-shrink-0">
          <Filter className="w-4 h-4 mr-2" /> Filters
        </Button>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900">Trending Scenarios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) =>
          <Card key={i} className="p-5" hover>
              <div className="flex justify-between items-start mb-4">
                <Badge variant="indigo">Technical</Badge>
                <div className="flex items-center text-amber-500 text-sm font-medium">
                  <Star className="w-4 h-4 fill-current mr-1" /> 4.8
                </div>
              </div>
              <h4 className="font-bold text-slate-900 mb-1">
                Frontend Engineer at Stripe
              </h4>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                Focus on React performance, state management, and component
                architecture.
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs font-medium text-slate-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" /> 45 mins
                </span>
                <Link to="/interview-setup">
                  <Button size="sm">Practice</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>
    </AppShell>);

};
// 16. Interview Categories
export const Categories = () => {
  const cats = [
  {
    name: 'Behavioral',
    icon: Users,
    color: 'bg-blue-50 text-blue-600',
    count: 124
  },
  {
    name: 'Technical',
    icon: Code,
    color: 'bg-indigo-50 text-indigo-600',
    count: 342
  },
  {
    name: 'Case Study',
    icon: FileText,
    color: 'bg-emerald-50 text-emerald-600',
    count: 89
  },
  {
    name: 'System Design',
    icon: Zap,
    color: 'bg-amber-50 text-amber-600',
    count: 56
  },
  {
    name: 'HR Screening',
    icon: MessageSquare,
    color: 'bg-rose-50 text-rose-600',
    count: 210
  },
  {
    name: 'Leadership',
    icon: Target,
    color: 'bg-purple-50 text-purple-600',
    count: 75
  }];

  return (
    <AppShell>
      <PageHeader title="Categories" subtitle="Explore interviews by type." />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {cats.map((cat, i) =>
        <Card
          key={i}
          className="p-6 flex flex-col items-center text-center"
          hover>
          
            <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${cat.color}`}>
            
              <cat.icon className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{cat.name}</h3>
            <p className="text-sm text-slate-500">{cat.count} scenarios</p>
          </Card>
        )}
      </div>
    </AppShell>);

};
// 17. Recommended
export const Recommended = () =>
<AppShell>
    <PageHeader
    title="For You"
    subtitle="Personalized recommendations based on your goals." />
  
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) =>
    <Card
      key={i}
      className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center"
      hover>
      
          <div className="w-full sm:w-48 h-32 bg-slate-100 rounded-xl flex-shrink-0 flex items-center justify-center">
            <img
          src={`https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=400&q=80`}
          alt="Cover"
          className="w-full h-full object-cover rounded-xl opacity-80" />
        
          </div>
          <div className="flex-1">
            <div className="flex gap-2 mb-2">
              <Badge variant="amber">Highly Recommended</Badge>
              <Badge variant="gray">Mid-Level</Badge>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Product Sense & Strategy
            </h3>
            <p className="text-slate-500 mb-4">
              Master the art of answering ambiguous product questions. Perfect
              for your upcoming PM interviews.
            </p>
            <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" /> 1.2k practiced
              </span>
              <span className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-amber-500" /> 4.9
              </span>
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <Link to="/interview-setup">
              <Button className="w-full sm:w-auto">Start</Button>
            </Link>
          </div>
        </Card>
    )}
    </div>
  </AppShell>;

// 18. Notifications
export const Notifications = () =>
<AppShell>
    <PageHeader
    title="Notifications"
    action={
    <Button variant="ghost" size="sm">
          Mark all as read
        </Button>
    } />
  
    <Card className="divide-y divide-slate-100">
      {[
    {
      title: 'Weekly Report Ready',
      desc: 'Your performance report for this week is generated. You improved by 12%!',
      time: '2 hours ago',
      icon: BarChart2,
      unread: true
    },
    {
      title: 'New Scenarios Added',
      desc: 'We just added 50 new System Design questions to the library.',
      time: 'Yesterday',
      icon: Zap,
      unread: false
    },
    {
      title: 'Streak Saved!',
      desc: 'You completed a session just in time to save your 3-day streak.',
      time: '2 days ago',
      icon: Target,
      unread: false
    }].
    map((notif, i) =>
    <div
      key={i}
      className={`p-5 flex gap-4 ${notif.unread ? 'bg-indigo-50/50' : ''}`}>
      
          <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notif.unread ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
        
            <notif.icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h4
            className={`font-medium ${notif.unread ? 'text-slate-900' : 'text-slate-700'}`}>
            
                {notif.title}
              </h4>
              <span className="text-xs text-slate-400">{notif.time}</span>
            </div>
            <p className="text-sm text-slate-500">{notif.desc}</p>
          </div>
          {notif.unread &&
      <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
      }
        </div>
    )}
    </Card>
  </AppShell>;