import React, { useEffect, useMemo, useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AppShell,
  Card,
  Button,
  PageHeader,
  Badge,
  ScoreRing } from
'../components/Shared';
import store from '../utils/realtime';
import {
  Trophy,
  Clock,
  Target,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Eye,
  MessageSquare,
  Mic,
  ThumbsUp,
  ArrowRight,
  Zap,
  BarChart2 } from
'lucide-react';
// 30. Summary
export const FeedbackSummary = () => {
  const [summary, setSummary] = useState<any>(null);
  const [userName, setUserName] = useState('there');
  const [percentileLabel, setPercentileLabel] = useState('Top 25%');
  const [trendDiff, setTrendDiff] = useState(0);
  const [improvementTip, setImprovementTip] = useState('Your latest results are ready.');

  useEffect(() => {
    const unsub = store.subscribe((s: any) => {
      const session = s?.lastSessionSummary || {
        score: s?.recentActivity?.[0]?.score ?? 0,
        avgScore: s?.avgScore ?? '0/100',
        title: s?.recentActivity?.[0]?.title || 'Latest interview',
        questionCount: (s?.recentActivity?.length || 5),
        durationSeconds: 0,
        improvementTip: s?.scoreboardTip || 'Review your last answer and focus on the recommended skill area.'
      };
      const ranks = s?.communityRanks || [];
      const youIndex = ranks.findIndex((rank: any) => rank.isYou || String(rank.name).includes('(You)'));
      const percentile = youIndex >= 0 && ranks.length > 0
        ? `Top ${Math.max(1, Math.min(100, Math.round(((ranks.length - youIndex) / ranks.length) * 100)))}%`
        : 'Top 25%';
      const diff = s?.scoreTrend?.length >= 2 ? Math.round(s.scoreTrend[s.scoreTrend.length - 1].score - s.scoreTrend[s.scoreTrend.length - 2].score) : 0;
      setSummary(session);
      setUserName(s?.name || localStorage.getItem('profileName') || 'there');
      setPercentileLabel(percentile);
      setTrendDiff(diff);
      setImprovementTip(session.improvementTip || s?.scoreboardTip || 'Review your latest answer and focus on the recommended skill area.');
    });
    return () => unsub();
  }, []);

  const score = typeof summary?.score === 'number'
    ? summary.score
    : Number(String(summary?.avgScore || '0').split('/')[0] || 0);
  const durationText = summary?.durationSeconds ? `${Math.round(summary.durationSeconds / 60)}m` : '—';
  const questionCount = summary?.questionCount ?? 5;
  const trendLabel = trendDiff >= 0 ? `+${trendDiff}%` : `${trendDiff}%`;

  const verdict = score >= 75
    ? { emoji: '🏆', label: 'Strong Performance', color: 'from-emerald-600 to-teal-700', msg: 'You demonstrated solid knowledge. Refine answers with specific examples and quantified results to nail the offer.' }
    : score >= 50
    ? { emoji: '📈', label: 'Getting There', color: 'from-amber-500 to-orange-600', msg: 'Good foundation! Focus on structuring answers with STAR and covering key concepts interviewers listen for.' }
    : { emoji: '💪', label: 'Keep Practicing', color: 'from-rose-600 to-pink-700', msg: "Every session builds skills. Study the ideal answers and use the hacks — improvement is guaranteed." };

  const IMPROVEMENTS = score >= 75
    ? [
        { icon: '🔢', title: 'Quantify your results', detail: 'Add numbers to every answer. "Cut load time by 40%" beats "improved performance" every time.' },
        { icon: '⏱️', title: 'Tighten answers to 90 seconds', detail: 'Time yourself out loud. 60-90 seconds per behavioral answer is the sweet spot.' },
        { icon: '👤', title: 'Say "I" not "we"', detail: 'Interviewers evaluate YOU. Always lead with what you specifically did, not the team.' },
      ]
    : score >= 50
    ? [
        { icon: '⭐', title: 'Use STAR consistently', detail: 'Every answer: Situation → Task → Action → Result. Missing "Result" is the #1 mistake candidates make.' },
        { icon: '🔑', title: 'Hit the key concepts', detail: 'Your answers missed some terms interviewers listen for. Study the ideal answers in your Full Report.' },
        { icon: '🎯', title: 'Pause 2 seconds before answering', detail: 'A brief pause shows confidence, not confusion. Never rush into an answer cold.' },
      ]
    : [
        { icon: '📚', title: 'Study the ideal answers', detail: 'Read the "Ideal Answer" shown after each question. Model your next attempt on that exact structure.' },
        { icon: '⭐', title: 'Use the STAR method', detail: 'Situation → Task → Action → Result. This single framework will lift your score 20+ points.' },
        { icon: '🎤', title: 'Practice speaking aloud', detail: 'Record yourself answering out loud. Hearing your own words reveals gaps you cannot see by reading.' },
      ];

  const HACKS = [
    { emoji: '🎯', title: 'Pause before answering', tip: "A 2-second pause signals confidence. Never rush into an answer — take a breath first." },
    { emoji: '🪞', title: 'Mirror their keywords', tip: "If the interviewer says \"scalability\", use that exact word back. Shows you're aligned." },
    { emoji: '💬', title: 'End with a question', tip: '"Does that answer what you were looking for?" — invites dialogue and shows confidence.' },
    { emoji: '🏆', title: 'Close every interview strong', tip: '"I\'m very excited about this role. What are the next steps?" — always ask this.' },
  ];

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Score + Header */}
        <div className="text-center mt-4">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="inline-block mb-4">
            <ScoreRing score={score} size={140} strokeWidth={12} label="Overall Score" />
          </motion.div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Great job, {userName}!</h1>
          <p className="text-slate-500">You completed the {summary?.title || 'latest interview'} session.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-4 text-center">
            <Clock className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
            <div className="text-xl font-bold text-slate-900">{durationText}</div>
            <div className="text-xs text-slate-500">Duration</div>
          </Card>
          <Card className="p-4 text-center">
            <MessageSquare className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
            <div className="text-xl font-bold text-slate-900">{questionCount}</div>
            <div className="text-xs text-slate-500">Questions</div>
          </Card>
          <Card className="p-4 text-center">
            <TrendingUp className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
            <div className="text-xl font-bold text-slate-900">{trendLabel}</div>
            <div className="text-xs text-slate-500">vs Last Session</div>
          </Card>
          <Card className="p-4 text-center">
            <Trophy className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <div className="text-xl font-bold text-slate-900">{percentileLabel}</div>
            <div className="text-xs text-slate-500">Percentile</div>
          </Card>
        </div>

        {/* Overall Feedback Verdict */}
        <div className={`rounded-2xl p-5 bg-gradient-to-br ${verdict.color} text-white`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{verdict.emoji}</span>
            <div>
              <div className="font-black text-lg">{verdict.label}</div>
              <div className="text-white/70 text-xs">Score: {score}/100</div>
            </div>
          </div>
          <p className="text-white/90 text-sm leading-relaxed">{verdict.msg}</p>
          {improvementTip && <div className="mt-3 text-white/70 text-xs italic border-t border-white/20 pt-2">{improvementTip}</div>}
        </div>

        {/* What to Improve */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> What You Need to Improve
          </h2>
          <div className="space-y-3">
            {IMPROVEMENTS.map((tip, i) => (
              <Card key={i} className="p-4 border-l-4 border-indigo-500">
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{tip.icon}</span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-0.5">{tip.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{tip.detail}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Job Hacks */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Interview Hacks to Get the Job
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {HACKS.map((h, i) => (
              <div key={i} className="p-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-white">
                <div className="text-2xl mb-2">{h.emoji}</div>
                <h4 className="font-bold text-sm mb-1">{h.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{h.tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Full Report CTA */}
        <Card className="p-5 bg-indigo-600 text-white border-0 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg mb-1">See Your Full Question-by-Question Report</h3>
            <p className="text-indigo-100 text-sm">Every answer reviewed with ideal responses and personalized coaching.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0 flex-wrap">
            <Link to="/feedback-detailed">
              <Button className="bg-white text-indigo-600 hover:bg-slate-50 whitespace-nowrap">View Full Report</Button>
            </Link>
            <Link to="/live-video">
              <Button className="bg-white/20 hover:bg-white/30 text-white whitespace-nowrap">Practice Again</Button>
            </Link>
          </div>
        </Card>

      </div>
    </AppShell>
  );
};

// 31. Detailed Report — Rich Personalized Post-Interview Feedback
export const FeedbackDetailed = () => {
  const [state, setState] = useState<any>(null);
  const [expandedQ, setExpandedQ] = useState<number | null>(null);
  useEffect(() => {
    const unsub = store.subscribe((s: any) => setState(s));
    return () => unsub();
  }, []);

  const session = state?.lastSessionSummary;
  const recentActivity: any[] = state?.recentActivity || [];
  const scoreboardTip: string = state?.scoreboardTip || '';
  const skillStats = state?.skillStats || {};
  const domain = session?.title?.toLowerCase().includes('technical') ? 'technical' : 'behavioral';

  // Build per-question data from recentActivity (most recent first)
  const sessionQuestions = recentActivity.slice(0, 5).reverse();
  const avgScore = session?.score ?? (sessionQuestions.length
    ? Math.round(sessionQuestions.reduce((s: number, q: any) => s + (q.score || 0), 0) / sessionQuestions.length)
    : 0);

  const IMPROVEMENT_TIPS: Record<string, { icon: string; title: string; detail: string }[]> = {
    behavioral: [
      { icon: '⭐', title: 'Use the STAR method consistently', detail: 'Every answer needs: Situation → Task → Action → Result. Without "Result", your answer feels incomplete.' },
      { icon: '🔢', title: 'Quantify every outcome', detail: '"We improved performance" is weak. "We reduced load time by 40%, saving $20K/month in server costs" is powerful.' },
      { icon: '👤', title: 'Say "I" not "we"', detail: 'Interviewers evaluate YOU. Describe your specific role and actions, not the team\'s actions collectively.' },
      { icon: '⏱️', title: 'Keep answers to 90 seconds', detail: 'Timed answers show discipline. Practice your STAR stories until they\'re tight at 60-90 seconds out loud.' },
    ],
    technical: [
      { icon: '🔍', title: 'Clarify before you answer', detail: 'Ask 1-2 clarifying questions first. "What scale are we designing for?" shows senior-level thinking.' },
      { icon: '🏗️', title: 'State your approach before coding', detail: 'Always explain your algorithm in plain English before writing any code. It shows thought process.' },
      { icon: '📊', title: 'Always state time and space complexity', detail: 'No technical answer is complete without Big-O. If you forget, it costs you the offer at FAANG-level.' },
      { icon: '🔄', title: 'Walk through edge cases', detail: 'After your solution, say "Let me check edge cases: empty input, single element, overflow..." — this impresses every interviewer.' },
    ],
  };

  const HACKS: { emoji: string; title: string; tip: string }[] = [
    { emoji: '🎯', title: 'Pause before answering', tip: 'A 2-second pause shows you\'re thinking, not panicking. Never rush into an answer.' },
    { emoji: '🪞', title: 'Mirror the interviewer\'s keywords', tip: 'If they say "scalability", use that word back. Shows you\'re aligned with what they value.' },
    { emoji: '💬', title: 'End with a question', tip: '"Does that answer what you were looking for?" invites dialogue and shows confidence.' },
    { emoji: '📌', title: 'Prepare 5 core STAR stories', tip: 'Leadership, failure, conflict, impact, collaboration. These 5 cover 90% of behavioral questions.' },
    { emoji: '🧊', title: 'Stay calm if you don\'t know', tip: '"I\'m not sure of the exact answer, but here\'s how I\'d approach finding it..." is a great response.' },
    { emoji: '🏆', title: 'Close strong', tip: '"I\'m very excited about this role. What are the next steps?" — always ask this at the end.' },
  ];

  const tips = IMPROVEMENT_TIPS[domain] || IMPROVEMENT_TIPS.behavioral;

  const scoreColor = avgScore >= 75 ? 'text-emerald-600' : avgScore >= 50 ? 'text-amber-600' : 'text-rose-600';
  const scoreBg = avgScore >= 75 ? 'bg-emerald-500' : avgScore >= 50 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <AppShell>
      <PageHeader title="Full Interview Report" subtitle="Your detailed performance review" backTo="/feedback-summary" />

      {/* Overall Score Banner */}
      <div className={`rounded-2xl p-6 mb-6 text-white text-center bg-gradient-to-br ${avgScore >= 75 ? 'from-emerald-600 to-teal-700' : avgScore >= 50 ? 'from-amber-500 to-orange-600' : 'from-rose-600 to-pink-700'}`}>
        <div className="text-6xl font-black mb-1">{avgScore}</div>
        <div className="text-white/80 text-sm font-medium mb-2">Overall Score / 100</div>
        <div className="w-full bg-white/20 rounded-full h-2 mb-4">
          <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${avgScore}%` }} />
        </div>
        <p className="text-white/90 text-sm max-w-md mx-auto">{scoreboardTip || 'Practice makes perfect. Review each answer below and apply the ideal response structure.'}</p>
      </div>

      {/* Question-by-Question Breakdown */}
      {sessionQuestions.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-500" /> Question-by-Question Review
          </h2>
          <div className="space-y-4">
            {sessionQuestions.map((item: any, i: number) => {
              const s = item.score ?? 0;
              const ok = s >= 50;
              return (
                <Card key={i} className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${ok ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {ok ? '✓' : '✗'}
                      </div>
                      <p className="font-semibold text-slate-900 text-sm leading-snug">{item.title || `Question ${i + 1}`}</p>
                    </div>
                    <span className={`text-2xl font-black flex-shrink-0 ${s >= 75 ? 'text-emerald-600' : s >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>{s}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
                    <div className={`h-2 rounded-full transition-all ${s >= 75 ? 'bg-emerald-500' : s >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${s}%` }} />
                  </div>
                  <div className={`text-xs px-3 py-2 rounded-xl font-medium ${ok ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {ok ? '✅ Good coverage of key concepts.' : '⚠️ Answer was too brief or missed key concepts. See hacks below to improve.'}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* What to Improve */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" /> What You Should Improve
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tips.map((tip, i) => (
            <Card key={i} className="p-5 border-l-4 border-indigo-500">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{tip.icon}</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{tip.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{tip.detail}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Interview Hacks */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" /> Interview Hacks for Next Time
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {HACKS.map((h, i) => (
            <div key={i} className="p-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-white">
              <div className="text-2xl mb-2">{h.emoji}</div>
              <h4 className="font-bold text-sm mb-1">{h.title}</h4>
              <p className="text-slate-400 text-xs leading-relaxed">{h.tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Next Steps */}
      <Card className="p-6 bg-indigo-600 text-white border-0">
        <h3 className="text-xl font-bold mb-2">Ready to improve? 🚀</h3>
        <p className="text-indigo-100 text-sm mb-4">Practice the same domain again with fresh questions. Your score improves an average of 18 points per session.</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/live-video">
            <button className="bg-white text-indigo-700 font-bold px-5 py-2.5 rounded-xl hover:bg-slate-100 transition text-sm">Practice Again</button>
          </Link>
          <Link to="/practice">
            <button className="bg-white/20 hover:bg-white/30 text-white font-medium px-5 py-2.5 rounded-xl transition text-sm">Question Bank</button>
          </Link>
          <Link to="/dashboard">
            <button className="bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-2.5 rounded-xl transition text-sm">Back to Dashboard</button>
          </Link>
        </div>
      </Card>
    </AppShell>
  );
};

// 32. Confidence Breakdown
export const FeedbackConfidence = () =>
<AppShell>
    <PageHeader title="Confidence Analysis" backTo="/feedback-detailed" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="p-8 flex flex-col items-center justify-center text-center lg:col-span-1">
        <ScoreRing score={78} size={180} strokeWidth={12} label="Confidence" />
        <p className="text-slate-500 mt-6 text-sm">
          Your confidence score is calculated based on voice steadiness, eye
          contact, and answer structure.
        </p>
      </Card>
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6">
          <h3 className="font-bold text-slate-900 mb-6">Confidence Factors</h3>
          {[
        {
          label: 'Voice Steadiness',
          val: 85
        },
        {
          label: 'Eye Contact',
          val: 90
        },
        {
          label: 'Posture',
          val: 88
        },
        {
          label: 'Hesitation/Pauses',
          val: 60
        }].
        map((f, i) =>
        <div key={i} className="mb-4 last:mb-0">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">{f.label}</span>
                <span className="text-slate-500">{f.val}/100</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
              className={`h-2 rounded-full ${f.val > 80 ? 'bg-emerald-500' : f.val > 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
              style={{
                width: `${f.val}%`
              }} />
            
              </div>
            </div>
        )}
        </Card>
      </div>
    </div>
  </AppShell>;

// 33. Speech Analysis
export const FeedbackSpeech = () =>
<AppShell>
    <PageHeader title="Speech & Delivery" backTo="/feedback-detailed" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="p-6 text-center">
        <div className="text-3xl font-bold text-slate-900 mb-1">142</div>
        <div className="text-sm text-slate-500">Words per minute</div>
        <Badge variant="emerald" className="mt-2">
          Perfect Pace
        </Badge>
      </Card>
      <Card className="p-6 text-center">
        <div className="text-3xl font-bold text-rose-600 mb-1">24</div>
        <div className="text-sm text-slate-500">Filler Words</div>
        <Badge variant="rose" className="mt-2">
          Needs Work
        </Badge>
      </Card>
      <Card className="p-6 text-center">
        <div className="text-3xl font-bold text-slate-900 mb-1">92%</div>
        <div className="text-sm text-slate-500">Clarity Score</div>
        <Badge variant="emerald" className="mt-2">
          Excellent
        </Badge>
      </Card>
    </div>
    <Card className="p-6">
      <h3 className="font-bold text-slate-900 mb-4">Filler Word Breakdown</h3>
      <div className="flex flex-wrap gap-3">
        {[
      {
        word: 'um',
        count: 12
      },
      {
        word: 'like',
        count: 8
      },
      {
        word: 'you know',
        count: 4
      }].
      map((w, i) =>
      <div
        key={i}
        className="px-4 py-2 bg-rose-50 border border-rose-100 rounded-lg flex items-center gap-3">
        
            <span className="font-medium text-rose-900">"{w.word}"</span>
            <span className="bg-rose-200 text-rose-800 text-xs px-2 py-0.5 rounded-full">
              {w.count}
            </span>
          </div>
      )}
      </div>
    </Card>
  </AppShell>;

// 34. Body Language
export const FeedbackBody = () =>
<AppShell>
    <PageHeader title="Body Language" backTo="/feedback-detailed" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden relative mb-4">
          <img
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
          alt="Replay"
          className="w-full h-full object-cover opacity-80" />
        
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <Play className="w-8 h-8 ml-1" />
            </button>
          </div>
          {/* Scrubber */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-indigo-500"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <Card className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Eye Contact</h4>
              <p className="text-sm text-slate-500">
                Maintained 85% of the time
              </p>
            </div>
          </div>
          <Badge variant="emerald">Great</Badge>
        </Card>
        <Card className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Posture</h4>
              <p className="text-sm text-slate-500">Upright and engaged</p>
            </div>
          </div>
          <Badge variant="emerald">Great</Badge>
        </Card>
      </div>
    </div>
  </AppShell>;

// 35. Answer Review
export const FeedbackAnswers = () =>
<AppShell>
    <PageHeader title="Answer Review" backTo="/feedback-detailed" />
    <div className="space-y-6">
      {[
    {
      q: 'Tell me about a time you optimized a React app.',
      score: 90,
      feedback: 'Excellent use of STAR method. Clear metrics provided.'
    },
    {
      q: 'How do you handle state management in large apps?',
      score: 75,
      feedback:
      'Good technical knowledge, but answer was slightly unstructured.'
    }].
    map((item, i) =>
    <Card key={i} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-slate-900 flex-1 pr-4">
              Q{i + 1}: {item.q}
            </h3>
            <ScoreRing score={item.score} size={48} strokeWidth={4} label="" />
          </div>
          <div className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-100">
            <p className="text-sm text-slate-700 italic">
              "So, um, at my last job we had this really slow dashboard. I used
              memo and useMemo to prevent unnecessary re-renders, which cut load
              time by 40%."
            </p>
          </div>
          <div className="flex items-start gap-3 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
            <Lightbulb className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-indigo-900 mb-1">
                AI Feedback
              </h4>
              <p className="text-sm text-indigo-800">{item.feedback}</p>
            </div>
          </div>
        </Card>
    )}
    </div>
  </AppShell>;

// 36. Suggested Improvements
export const FeedbackImprovements = () =>
<AppShell>
    <PageHeader
    title="Action Plan"
    subtitle="Prioritized steps to improve your score."
    backTo="/feedback-detailed" />
  
    <div className="space-y-4">
      {[
    {
      title: 'Eliminate Filler Words',
      desc: 'Practice pausing silently instead of saying "um".',
      type: 'Delivery',
      priority: 'High'
    },
    {
      title: 'Quantify Results',
      desc: 'Add specific numbers to your behavioral answers.',
      type: 'Content',
      priority: 'Medium'
    }].
    map((item, i) =>
    <Card
      key={i}
      className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      
          <div>
            <div className="flex gap-2 mb-2">
              <Badge variant={item.priority === 'High' ? 'rose' : 'amber'}>
                {item.priority} Priority
              </Badge>
              <Badge variant="gray">{item.type}</Badge>
            </div>
            <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
            <p className="text-slate-500 text-sm">{item.desc}</p>
          </div>
          <Button variant="outline">Practice This</Button>
        </Card>
    )}
    </div>
  </AppShell>;

// 37. AI vs Traditional
export const AIVsTraditional = () =>
<AppShell>
    <PageHeader
    title="The AI Advantage"
    subtitle="See how your prep compares to traditional methods." />
  
    <Card className="p-8 bg-gradient-to-br from-slate-900 to-indigo-900 text-white border-0 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>

      <div className="relative z-10">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Your Progress Accelerated
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
            <h3 className="text-indigo-200 font-medium mb-4 text-center">
              Traditional Prep
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Feedback Loop</span>{' '}
                <span className="font-bold">Days/Weeks</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Data Points</span>{' '}
                <span className="font-bold">Subjective</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Cost</span>{' '}
                <span className="font-bold">$150+/hr</span>
              </div>
            </div>
          </div>
          <div className="bg-indigo-600 p-6 rounded-2xl border border-indigo-400 shadow-2xl shadow-indigo-900/50 transform md:-translate-y-4">
            <div className="absolute -top-3 -right-3 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              AInterview
            </div>
            <h3 className="text-white font-bold mb-4 text-center text-lg">
              AI-Powered Prep
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-indigo-100 text-sm">Feedback Loop</span>{' '}
                <span className="font-bold text-white">Instant</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-indigo-100 text-sm">Data Points</span>{' '}
                <span className="font-bold text-white">100+ Metrics</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-indigo-100 text-sm">Cost</span>{' '}
                <span className="font-bold text-white">Fractional</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-indigo-200 mb-6 max-w-xl mx-auto">
            Users who practice with AInterview improve their interview
            performance scores by an average of 42% within the first two weeks.
          </p>
          <Link to="/dashboard">
            <Button className="bg-white text-indigo-900 hover:bg-slate-100">
              Continue Practicing
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  </AppShell>;