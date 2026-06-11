import React, { useEffect, useState } from 'react';
import {
  AppShell,
  Card,
  PageHeader,
  StatCard,
  Badge
} from '../components/Shared';
import store from '../utils/realtime';
import {
  BarChart2,
  TrendingUp,
  Target,
  Award,
  Clock,
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';


const SKILL_DOMAINS = [
  { label: 'Technical', key: 'frontend' },
  { label: 'Backend', key: 'backend' },
  { label: 'System Design', key: 'system' },
  { label: 'Behavioral', key: 'behavioral' }
];

const formatPracticeHours = (seconds: number) => `${(seconds / 3600).toFixed(1)}h`;

export const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<any>({
    interviewsCompleted: 0,
    avgScore: '0/100',
    totalPracticeSeconds: 0,
    streakDays: 0,
    scoreTrend: [],
    skillStats: {}
  });

  useEffect(() => {
    const unsub = store.subscribe((s: any) => {
      setAnalytics({
        interviewsCompleted: s?.interviewsCompleted ?? 0,
        avgScore: s?.avgScore ?? '0/100',
        totalPracticeSeconds: s?.totalPracticeSeconds ?? 0,
        streakDays: s?.streakDays ?? 0,
        scoreTrend: s?.scoreTrend ?? [],
        skillStats: s?.skillStats ?? {}
      });
    });
    return () => unsub();
  }, []);

  // Only real data — no fake fallback
  const trendData = analytics.scoreTrend;
  const hasData = trendData.length > 0;

  const skillDistribution = SKILL_DOMAINS.map((domain) => {
    const stat = analytics.skillStats?.[domain.key] || { total: 0, scoreSum: 0 };
    return { label: domain.label, val: stat.total ? Math.round(stat.scoreSum / stat.total) : 0 };
  });

  return (
    <AppShell>
      <div className="mb-6 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 p-7 text-white relative overflow-hidden shadow-xl shadow-emerald-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-20 translate-x-20 pointer-events-none" />
        <h1 className="text-3xl font-bold mb-1">📊 Your Analytics</h1>
        <p className="text-emerald-100">Track your growth and performance over time.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Interviews"
          value={String(analytics.interviewsCompleted)}
          icon={Target}
          color="indigo"
        />

        <StatCard
          title="Avg Score"
          value={analytics.avgScore}
          trend={0}
          icon={TrendingUp}
          color="emerald"
        />

        <StatCard
          title="Hours Practiced"
          value={formatPracticeHours(analytics.totalPracticeSeconds)}
          icon={Clock}
          color="amber"
        />

        <StatCard
          title="Current Streak"
          value={`${analytics.streakDays} Days`}
          icon={Award}
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-bold text-slate-900 mb-6">Overall Performance Trend</h3>
          {hasData ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} domain={[0, 100]} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex flex-col items-center justify-center text-center gap-3">
              <BarChart2 className="w-12 h-12 text-slate-200" />
              <p className="font-semibold text-slate-400">No data yet</p>
              <p className="text-sm text-slate-400">Complete your first interview to see your performance trend here.</p>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-slate-900 mb-6">Skill Distribution</h3>
          {skillDistribution.some(s => s.val > 0) ? (
            <div className="space-y-6">
              {skillDistribution.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700">{skill.label}</span>
                    <span className="text-slate-500">{skill.val}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${skill.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-center gap-2">
              <Target className="w-10 h-10 text-slate-200" />
              <p className="text-sm text-slate-400">Practice different domains to see your skill breakdown.</p>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
};

export const AnalyticsTrends = () => {
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    const unsub = store.subscribe((s: any) => {
      if (s?.scoreTrend?.length) {
        setTrendData(s.scoreTrend.map((item: any, index: number) => ({
          name: item.name || `Session ${index + 1}`,
          score: item.score
        })));
      } else {
        setTrendData([]);
      }
    });
    return () => unsub();
  }, []);

  return (
    <AppShell>
      <PageHeader title="Detailed Trends" backTo="/analytics" />
      <Card className="p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-900">Metrics over time</h3>
        </div>
        {trendData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex flex-col items-center justify-center text-center gap-3">
            <BarChart2 className="w-12 h-12 text-slate-200" />
            <p className="font-semibold text-slate-400">No sessions yet</p>
            <p className="text-sm text-slate-400">Complete an interview to see your trend chart here.</p>
          </div>
        )}
      </Card>
    </AppShell>
  );
};

export const AnalyticsHeatmap = () => {
  const [skillStats, setSkillStats] = useState<any>({});
  const [scoreTrend, setScoreTrend] = useState<any[]>([]);

  useEffect(() => {
    const unsub = store.subscribe((s: any) => {
      setSkillStats(s?.skillStats || {});
      setScoreTrend(s?.scoreTrend || []);
    });
    return () => unsub();
  }, []);

  const getColor = (score: number) => {
    if (score === 0) return 'bg-slate-100';
    if (score < 50) return 'bg-indigo-100';
    if (score < 75) return 'bg-indigo-300';
    if (score < 90) return 'bg-indigo-500';
    return 'bg-indigo-700';
  };

  const skills = [
    { label: 'Technical', key: 'frontend' },
    { label: 'Backend', key: 'backend' },
    { label: 'System Design', key: 'system' },
    { label: 'Behavioral', key: 'behavioral' }
  ];

  // Build weekly scores from scoreTrend — distribute last N sessions across weeks
  const weeks = ['W1', 'W2', 'W3', 'W4', 'W5'];
  const getWeeklyScore = (domainKey: string, weekIndex: number): number => {
    const stat = skillStats[domainKey];
    if (!stat || !stat.total) return 0;
    const avgScore = Math.round(stat.scoreSum / stat.total);
    // Vary the score per week slightly based on available session count
    // Earlier weeks show 0 if not enough sessions, recent weeks show actual score
    const sessionsNeeded = weekIndex + 1;
    if (stat.total < sessionsNeeded) return 0;
    // Add slight variation per week using trend data if available
    const trendEntry = scoreTrend[weekIndex];
    return trendEntry ? trendEntry.score : avgScore;
  };

  return (
    <AppShell>
      <PageHeader title="Skill Heatmap" backTo="/analytics" />
      <Card className="p-6 overflow-x-auto">
        <div className="min-w-[520px]">
          <div className="flex mb-3">
            <div className="w-32"></div>
            {weeks.map((week) => (
              <div key={week} className="flex-1 text-center text-sm text-slate-500">
                {week}
              </div>
            ))}
          </div>

          {skills.map((skill) => (
            <div key={skill.key} className="flex items-center mb-3">
              <div className="w-32 text-sm font-medium text-slate-700">{skill.label}</div>
              {weeks.map((week, index) => {
                const score = getWeeklyScore(skill.key, index);
                return (
                  <div key={week} className="flex-1 px-1">
                    <div
                      className={`h-10 rounded-md w-full ${getColor(score)} transition-colors`}
                      title={score > 0 ? `${skill.label} W${index+1}: ${score}/100` : 'No data yet'}
                    />
                  </div>
                );
              })}
            </div>
          ))}

          <div className="flex items-center justify-end gap-2 mt-6 text-xs text-slate-500">
            <span>Needs Work</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded bg-slate-100"></div>
              <div className="w-4 h-4 rounded bg-indigo-100"></div>
              <div className="w-4 h-4 rounded bg-indigo-300"></div>
              <div className="w-4 h-4 rounded bg-indigo-500"></div>
              <div className="w-4 h-4 rounded bg-indigo-700"></div>
            </div>
            <span>Mastered</span>
          </div>
        </div>
      </Card>
    </AppShell>
  );
};

export const AnalyticsAchievements = () => {
  const [analytics, setAnalytics] = useState<any>({ interviewsCompleted: 0, avgScore: '0/100', totalPracticeSeconds: 0, streakDays: 0 });

  useEffect(() => {
    const unsub = store.subscribe((s: any) => {
      setAnalytics({
        interviewsCompleted: s?.interviewsCompleted ?? 0,
        avgScore: s?.avgScore ?? '0/100',
        totalPracticeSeconds: s?.totalPracticeSeconds ?? 0,
        streakDays: s?.streakDays ?? 0
      });
    });
    return () => unsub();
  }, []);

  const achievements = [
    { title: 'First Steps', desc: 'Complete 1 interview', icon: CheckCircle2, earned: analytics.interviewsCompleted >= 1 },
    { title: 'On Fire', desc: '3 day streak', icon: TrendingUp, earned: analytics.streakDays >= 3 },
    { title: 'Perfectionist', desc: 'Score 90+ overall', icon: Target, earned: Number(analytics.avgScore.split('/')[0]) >= 90 },
    { title: 'Marathon', desc: '10 hours practiced', icon: Clock, earned: analytics.totalPracticeSeconds >= 36000 }
  ];

  return (
    <AppShell>
      <PageHeader title="Achievements" backTo="/analytics" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievements.map((badge, i) => (
          <Card
            key={i}
            className={`p-6 text-center flex flex-col items-center ${badge.earned ? 'border-indigo-200 bg-indigo-50/30' : 'opacity-60 grayscale'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${badge.earned ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
              {badge.earned ? <badge.icon className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
            </div>
            <h4 className="font-bold text-slate-900 mb-1">{badge.title}</h4>
            <p className="text-xs text-slate-500">{badge.desc}</p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
};

export const AnalyticsHistory = () => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const unsub = store.subscribe((s: any) => {
      setHistory(s?.recentActivity || []);
    });
    return () => unsub();
  }, []);

  return (
    <AppShell>
      <PageHeader title="Interview History" backTo="/analytics" />
      <Card className="divide-y divide-slate-100">
        {history.length ? history.map((item, i) => (
          <div
            key={`${item.title}-${i}`}
            className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-slate-900">{item.title}</h4>
                <Badge variant="indigo">{item.type || 'Voice'}</Badge>
              </div>
              <p className="text-sm text-slate-500">{item.date} • {Math.max(1, Math.round((item.durationSeconds || 45) / 60))} mins</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xl font-bold text-slate-900">{item.score}</div>
                <div className="text-xs text-slate-500">Score</div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        )) : (
          <div className="p-6 text-center text-slate-500">
            No interview history available yet. Start a session to build your analytics.
          </div>
        )}
      </Card>
    </AppShell>
  );
};
