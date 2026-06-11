import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppShell, Card, PageHeader, Badge, Button } from '../components/Shared';
import { BookOpen, ChevronRight, Zap, Target, CheckCircle2, Lightbulb, BarChart2, Search, Mic, MicOff } from 'lucide-react';

// ─── DATA ───────────────────────────────────────────────────────────────────
const MOCK_TESTS = [
  { company: 'Google', role: 'Frontend SWE', time: '45m', qs: 5, diff: 'Hard', color: 'from-blue-500 to-indigo-600', emoji: '🔵', topics: ['React', 'System Design', 'Algorithms'] },
  { company: 'Amazon', role: 'SDE-2', time: '60m', qs: 6, diff: 'Hard', color: 'from-orange-500 to-amber-600', emoji: '📦', topics: ['Leadership Principles', 'System Design', 'Behavioral'] },
  { company: 'Meta', role: 'Product Manager', time: '50m', qs: 5, diff: 'Medium', color: 'from-blue-600 to-cyan-500', emoji: '📘', topics: ['Metrics', 'Product Sense', 'Execution'] },
  { company: 'Startup', role: 'Full Stack', time: '30m', qs: 4, diff: 'Medium', color: 'from-emerald-500 to-teal-600', emoji: '🚀', topics: ['React', 'Node.js', 'Behavioral'] },
  { company: 'Microsoft', role: 'SWE', time: '45m', qs: 5, diff: 'Medium', color: 'from-sky-500 to-blue-600', emoji: '🪟', topics: ['OOP', 'Algorithms', 'Behavioral'] },
  { company: 'Netflix', role: 'Senior SWE', time: '60m', qs: 5, diff: 'Hard', color: 'from-red-500 to-rose-600', emoji: '🎬', topics: ['System Design', 'Culture Fit', 'Technical'] },
];

const HACKS = [
  { icon: '⭐', title: 'STAR Method', tip: 'Always structure behavioral answers: Situation → Task → Action → Result. Keeps answers clear and concise.' },
  { icon: '🔢', title: 'Quantify Everything', tip: 'Replace "I improved performance" with "I improved performance by 40%, reducing load time from 3s to 1.8s".' },
  { icon: '🪞', title: 'Mirror JD Keywords', tip: 'Copy exact words from the job description into your answers — ATS and interviewers both reward this.' },
  { icon: '❓', title: 'Clarify Before You Answer', tip: 'For any system design or vague question, ask 1-2 clarifying questions first. It shows seniority.' },
  { icon: '🎯', title: 'Prepare 5 Core Stories', tip: 'Have 5 strong STAR stories that cover: leadership, failure, conflict, impact, and collaboration. Reuse them.' },
  { icon: '🤝', title: 'Close with Questions', tip: 'Always end with 2-3 thoughtful questions. "What does success look like in 90 days?" is a killer.' },
];

const QUESTIONS = [
  { q: 'Tell me about a time you failed. What did you learn from it?', tag: 'Behavioral', diff: 'Medium', modelAnswer: 'Use STAR. Pick a real failure, own it fully, focus 60% on what you learned and changed afterward.' },
  { q: 'Describe a time you led a team through a major challenge. What was your approach?', tag: 'Behavioral', diff: 'Hard', modelAnswer: 'Show how you set vision, communicated transparently, handled pushback, and drove the team to a successful result.' },
  { q: 'How do you handle disagreement with your manager? Give me a specific example.', tag: 'Behavioral', diff: 'Medium', modelAnswer: 'Raise your concern with data privately. Listen to their reasoning. Commit to the final decision. Re-evaluate the outcome together.' },
  { q: 'Explain useState vs useReducer in React. When do you choose each?', tag: 'React', diff: 'Medium', modelAnswer: 'useState for simple independent values. useReducer when state has multiple sub-values or transitions depend on previous state.' },
  { q: 'How would you prevent unnecessary re-renders in a large React component tree?', tag: 'React', diff: 'Hard', modelAnswer: 'React.memo for pure components, useMemo for expensive values, useCallback for stable refs, split context, colocate state.' },
  { q: 'What are common pitfalls of the useEffect dependency array?', tag: 'React', diff: 'Medium', modelAnswer: 'Missing deps cause stale closures. Extra deps cause unnecessary runs. Always clean up subscriptions to prevent memory leaks.' },
  { q: 'Design a URL shortener like bit.ly at scale.', tag: 'System Design', diff: 'Hard', modelAnswer: 'Hash function (base62) + DB (id→URL). Redis cache for hot URLs. CDN for redirects. Load balancer for scale.' },
  { q: 'Design Twitter\'s feed for 300M daily users. How do you handle celebrities with 50M+ followers?', tag: 'System Design', diff: 'Hard', modelAnswer: 'Fan-out-on-write for normal users. Fan-out-on-read for celebrities. Redis sorted sets for feed storage.' },
  { q: 'How would you design a distributed rate limiter across multiple servers?', tag: 'System Design', diff: 'Hard', modelAnswer: 'Redis with sliding window counter + Lua scripts for atomic check-and-decrement. Shard by user ID.' },
  { q: 'Find all pairs in an array that sum to a target value. What is the optimal approach?', tag: 'Algorithms', diff: 'Medium', modelAnswer: 'Hash set: for each num, check if (target - num) exists. O(n) time, O(n) space. Only one pass needed.' },
  { q: 'Explain dynamic programming and how you recognize when to use it.', tag: 'Algorithms', diff: 'Hard', modelAnswer: 'Look for overlapping subproblems + optimal substructure. Define state, write recurrence, implement memoization or tabulation.' },
  { q: 'How do you handle auth and authorization in a full-stack web app?', tag: 'Full Stack', diff: 'Medium', modelAnswer: 'JWT for stateless auth + refresh tokens. Hash passwords (bcrypt). httpOnly cookies. RBAC on the server. Always HTTPS.' },
  { q: 'Describe your approach to designing a well-structured REST API.', tag: 'Full Stack', diff: 'Medium', modelAnswer: 'Nouns for resources. Correct HTTP verbs. Proper status codes. Pagination. API versioning. Rate limiting. Consistent error shapes.' },
  { q: 'How would you implement real-time features like live notifications in a web app?', tag: 'Full Stack', diff: 'Hard', modelAnswer: 'WebSockets for bidirectional (chat). SSE for one-way (notifications). Redis Pub/Sub to broadcast across server instances.' },
];

function scoreFeedback(answer: string, modelAnswer: string) {
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  const hasNumbers = /\d/.test(answer);
  const hasStructure = /because|therefore|result|so|then|first|second|finally/i.test(answer);
  let score = 0;
  const tips: string[] = [];
  if (words >= 60) { score += 35; } else { score += Math.round(words / 60 * 35); tips.push('Write at least 60 words — interviewers expect substance.'); }
  if (hasNumbers) { score += 25; } else { tips.push('Add specific numbers or percentages to make your answer concrete.'); }
  if (hasStructure) { score += 25; } else { tips.push('Use structured language: "First...", "As a result...", "Finally..." to show clarity.'); }
  if (words >= 30) score += 15;
  if (tips.length === 0) tips.push('Great answer! You used numbers, structure, and sufficient detail.');
  tips.push(`💡 Model hint: ${modelAnswer}`);
  return { score: Math.min(score, 100), tips };
}

// ─── QUESTION BANK ──────────────────────────────────────────────────────────
export const PracticeQBank = () => {
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('All');
  const tags = ['All', 'Behavioral', 'React', 'System Design', 'Algorithms', 'Full Stack'];
  const filtered = QUESTIONS.filter(q =>
    (tag === 'All' || q.tag === tag) && q.q.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <AppShell>
      <div className="mb-6 rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 p-7 text-white relative overflow-hidden shadow-xl shadow-violet-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-20 translate-x-20 pointer-events-none" />
        <h1 className="text-3xl font-bold mb-1">🎯 Practice Hub</h1>
        <p className="text-violet-200">Mock tests, interview hacks, and real-time voice feedback.</p>
      </div>

      {/* Interview Hacks */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" /> Interview Hacks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {HACKS.map((h, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{h.icon}</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{h.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{h.tip}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Mock Tests */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2"><Target className="w-5 h-5 text-indigo-500" /> Mock Tests</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_TESTS.map((m, i) => (
            <Card key={i} className="p-5 flex flex-col gap-3">
              <div className={`h-2 rounded-full bg-gradient-to-r ${m.color}`} />
              <div className="flex items-center gap-2">
                <span className="text-2xl">{m.emoji}</span>
                <div>
                  <h4 className="font-bold text-slate-900">{m.company} — {m.role}</h4>
                  <p className="text-xs text-slate-500">{m.time} · {m.qs} questions</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {m.topics.map(t => <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{t}</span>)}
              </div>
              <div className="flex items-center justify-between mt-auto">
                <Badge variant={m.diff === 'Hard' ? 'rose' : 'amber'}>{m.diff}</Badge>
                <Link to="/interview-setup">
                  <Button size="sm">Start Mock</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Question Bank */}
      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2"><BookOpen className="w-5 h-5 text-emerald-500" /> Question Bank</h2>
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions..." className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm" />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
          {tags.map(t => <button key={t} onClick={() => setTag(t)} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${tag === t ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{t}</button>)}
        </div>
        <div className="space-y-3">
          {filtered.map((item, i) => (
            <Link key={i} to="/practice-answer" state={{ question: item }}>
              <Card className="p-4 flex justify-between items-center" hover>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 mb-2 text-sm">{item.q}</p>
                  <div className="flex gap-2">
                    <Badge variant="gray">{item.tag}</Badge>
                    <Badge variant={item.diff === 'Hard' ? 'rose' : 'amber'}>{item.diff}</Badge>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 ml-4 flex-shrink-0" />
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
};

// ─── VOICE-ONLY MOCK PRACTICE WITH REAL-TIME SPEECH + FEEDBACK ──────────────
const VOICE_QUESTIONS = [
  { q: 'Tell me about a time you failed at work. What did you learn and how did it change you?', tag: 'Behavioral', diff: 'Medium', keywords: ['learn', 'mistake', 'failed', 'improve', 'lesson', 'result'], explanation: 'Describe the failure clearly, own it, and focus heavily on what you learned.', ideal: 'Use STAR: describe the failure, your role, the impact, and the concrete lesson you applied afterward.' },
  { q: 'How do you handle a situation where you strongly disagree with your manager\'s decision?', tag: 'Behavioral', diff: 'Hard', keywords: ['disagree', 'communicate', 'data', 'respect', 'commit', 'outcome'], explanation: 'Show you speak up diplomatically and commit gracefully.', ideal: 'Raise concern with data privately, listen to reasoning, commit to the decision, and re-evaluate the result together.' },
  { q: 'How do you optimize React rendering performance in a large application?', tag: 'React', diff: 'Hard', keywords: ['memo', 'usememo', 'usecallback', 'virtualize', 'debounce', 'rerender'], explanation: 'Mention memoization, virtualization, and debouncing for inputs.', ideal: 'Use React.memo, useMemo, useCallback, virtualization for long lists, debounce inputs, and colocate state to minimize re-renders.' },
  { q: 'What are the common pitfalls of the useEffect dependency array in React?', tag: 'React', diff: 'Medium', keywords: ['dependency', 'stale', 'closure', 'cleanup', 'infinite', 'effect'], explanation: 'Cover stale closures from missing deps and infinite loops from extra deps.', ideal: 'Missing deps cause stale closures. Extra deps cause unnecessary runs. Always clean up subscriptions. Use eslint-plugin-react-hooks.' },
  { q: 'Design a URL shortener like bit.ly for 1 billion requests per day.', tag: 'System Design', diff: 'Hard', keywords: ['hash', 'redirect', 'cache', 'database', 'scale', 'redis'], explanation: 'Cover hashing, DB storage, caching, and scaling.', ideal: 'Hash IDs (base62) stored in DB, Redis cache for hot URLs, CDN for redirects, load balancer for scale.' },
  { q: 'How would you design a distributed rate limiter that works across multiple servers?', tag: 'System Design', diff: 'Hard', keywords: ['token bucket', 'redis', 'sliding window', 'distributed', 'atomic', 'shard'], explanation: 'Redis + Lua scripts for atomic rate limiting across all servers.', ideal: 'Redis sliding window counter with Lua scripts for atomicity. Shard Redis by user ID. Add local cache layer to reduce Redis load.' },
  { q: 'How do you handle authentication and authorization in a full-stack web app?', tag: 'Full Stack', diff: 'Medium', keywords: ['jwt', 'oauth', 'token', 'refresh', 'https', 'password', 'hash'], explanation: 'Cover JWT, OAuth, secure storage, and HTTPS.', ideal: 'Use JWT for stateless auth, OAuth for third-party, refresh tokens for longevity, HTTPS always, and hash passwords with bcrypt.' },
  { q: 'Find two numbers in an array that add up to a target. Walk through the most efficient solution.', tag: 'Algorithms', diff: 'Easy', keywords: ['hash', 'set', 'map', 'complement', 'linear', 'one pass'], explanation: 'Hash map gives O(n) solution with one pass.', ideal: 'Use a hash map: for each number, compute target - number and check if it exists. If yes, return pair. O(n) time and space.' },
  { q: 'Explain dynamic programming. How do you know when to use it and how do you approach it?', tag: 'Algorithms', diff: 'Hard', keywords: ['subproblem', 'overlapping', 'memoization', 'bottom-up', 'recurrence', 'optimal'], explanation: 'DP applies when subproblems overlap and solutions can be reused.', ideal: 'Look for overlapping subproblems and optimal substructure. Define state, write recurrence, implement memoization or bottom-up tabulation.' },
];

function speakText(text: string) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = 1; u.pitch = 1.05;
    window.speechSynthesis.speak(u);
  }
}

function evaluateVoice(text: string, q: typeof VOICE_QUESTIONS[0]) {
  const lower = text.toLowerCase();
  const found = q.keywords.filter(k => lower.includes(k));
  const ratio = found.length / q.keywords.length;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const score = Math.min(100, Math.round(ratio * 70 + (wordCount > 40 ? 20 : wordCount > 20 ? 10 : 0) + (wordCount > 60 ? 10 : 0)));
  const ok = ratio >= 0.35 && wordCount >= 20;
  const missing = q.keywords.filter(k => !lower.includes(k)).slice(0, 4);
  const tips: string[] = [];
  if (!ok) tips.push(`Your answer was ${ok ? 'good' : 'incomplete'}. Try mentioning: ${missing.join(', ')}.`);
  if (wordCount < 30) tips.push('Speak more — aim for at least 30-60 words per answer.');
  if (ratio < 0.5) tips.push(`Key concepts missed: ${missing.join(', ')}.`);
  if (ok && wordCount >= 30) tips.push('Good job! You covered the key points clearly.');
  tips.push(`💡 Ideal answer: ${q.ideal}`);
  return { score, ok, found, missing, tips, wordCount };
}

export const PracticeAnswer = () => {
  const [qIndex, setQIndex] = useState(() => Math.floor(Math.random() * VOICE_QUESTIONS.length));
  const [phase, setPhase] = useState<'ready' | 'recording' | 'evaluated' | 'summary'>('ready');
  const [transcript, setTranscript] = useState('');
  const [liveText, setLiveText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [micError, setMicError] = useState('');
  const [result, setResult] = useState<ReturnType<typeof evaluateVoice> | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [allResults, setAllResults] = useState<{ q: string; score: number; ok: boolean; tips: string[] }[]>([]);
  const recRef = useRef<any>(null);
  const latestRef = useRef('');
  const manualStop = useRef(false);
  const timerRef = useRef<number | null>(null);

  const q = VOICE_QUESTIONS[qIndex];
  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  const isLastQ = qIndex >= VOICE_QUESTIONS.length - 1;

  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  const startMic = async () => {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) { setMicError('Speech recognition needs Chrome or Edge browser.'); return; }
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      s.getTracks().forEach(t => t.stop());
    } catch { setMicError('Microphone blocked — please allow mic access in browser settings.'); return; }

    setMicError('');
    manualStop.current = false;
    latestRef.current = '';
    setTranscript('');
    setLiveText('');
    setSeconds(0);

    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = true;
    rec.continuous = true;
    rec.onstart = () => { setIsRecording(true); setPhase('recording'); };
    rec.onresult = (e: any) => {
      let final = '', interim = '';
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + ' ';
        else interim += e.results[i][0].transcript;
      }
      const combined = (latestRef.current + ' ' + final + interim).trim();
      latestRef.current = final.trim() || latestRef.current;
      setLiveText(combined);
    };
    rec.onend = () => {
      setIsRecording(false);
      const text = latestRef.current || liveText;
      setTranscript(text);
      if (!manualStop.current) doEvaluate(text);
    };
    rec.onerror = (e: any) => {
      setMicError(e.error === 'not-allowed' ? 'Mic blocked. Enable it in browser settings.' : `Error: ${e.error}`);
      setIsRecording(false);
      manualStop.current = true;
    };
    recRef.current = rec;
    rec.start();
  };

  const stopMic = () => {
    manualStop.current = true;
    try { recRef.current?.stop(); } catch (_) { }
    setIsRecording(false);
    const text = latestRef.current || liveText;
    setTranscript(text);
    setTimeout(() => doEvaluate(text), 200);
  };

  const doEvaluate = (text: string) => {
    const res = evaluateVoice(text, q);
    setResult(res);
    setPhase('evaluated');
    setAllResults(prev => [...prev, { q: q.q, score: res.score, ok: res.ok, tips: res.tips }]);
    const msg = res.ok
      ? `Correct! Great answer. Your score is ${res.score} out of 100.`
      : `Needs improvement. Your score is ${res.score} out of 100. Try mentioning ${res.missing.slice(0, 2).join(' and ')}.`;
    speakText(msg);
  };

  const nextQuestion = () => {
    if (isLastQ) { setPhase('summary'); speakText('Session complete! Here is your full feedback.'); return; }
    setQIndex(i => i + 1);
    setPhase('ready');
    setTranscript('');
    setLiveText('');
    setResult(null);
    setSeconds(0);
    latestRef.current = '';
  };

  const avgScore = allResults.length ? Math.round(allResults.reduce((s, r) => s + r.score, 0) / allResults.length) : 0;

  // ── Summary Screen ────────────────────────────────────────────────────────
  if (phase === 'summary') {
    return (
      <AppShell>
        <PageHeader title="Session Complete 🎉" backTo="/practice" />
        <Card className="p-6 mb-6 text-center bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-0">
          <div className="text-5xl mb-3">🏆</div>
          <h2 className="text-2xl font-bold mb-1">Overall Score: {avgScore}/100</h2>
          <p className="text-indigo-100">{allResults.length} questions answered</p>
          <div className="w-full bg-white/20 rounded-full h-3 mt-4">
            <div className="bg-white h-3 rounded-full" style={{ width: `${avgScore}%` }} />
          </div>
        </Card>
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-indigo-500" /> Question-by-Question Feedback</h3>
        <div className="space-y-4">
          {allResults.map((r, i) => (
            <Card key={i} className="p-5">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-slate-900 text-sm flex-1 mr-4">Q{i + 1}: {r.q}</p>
                <span className={`font-bold text-lg flex-shrink-0 ${r.score >= 75 ? 'text-emerald-600' : r.score >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>{r.score}/100</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
                <div className={`h-2 rounded-full ${r.score >= 75 ? 'bg-emerald-500' : r.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${r.score}%` }} />
              </div>
              <ul className="space-y-1">
                {r.tips.map((tip, j) => (
                  <li key={j} className={`text-xs px-3 py-2 rounded-lg ${tip.startsWith('💡') ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-800'}`}>{tip}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => { setQIndex(0); setAllResults([]); setPhase('ready'); setResult(null); setTranscript(''); }}>Retry Session</Button>
          <Link to="/practice" className="flex-1"><Button className="w-full">Back to Practice</Button></Link>
        </div>
      </AppShell>
    );
  }

  // ── Practice Screen ───────────────────────────────────────────────────────
  return (
    <AppShell>
      <PageHeader title="Voice Mock Practice 🎤" backTo="/practice" />

      {/* Progress */}
      <div className="flex justify-between text-xs text-slate-500 mb-2">
        <span>Question {qIndex + 1} of {VOICE_QUESTIONS.length}</span>
        <span>{allResults.filter(r => r.ok).length} correct so far</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-6">
        <div className="bg-indigo-600 h-1.5 rounded-full transition-all" style={{ width: `${((qIndex) / VOICE_QUESTIONS.length) * 100}%` }} />
      </div>

      {/* Question Card */}
      <Card className="p-6 mb-5">
        <div className="flex gap-2 mb-3">
          <Badge variant="gray">{q.tag}</Badge>
          <Badge variant={q.diff === 'Hard' ? 'rose' : q.diff === 'Medium' ? 'amber' : 'emerald'}>{q.diff}</Badge>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-3">"{q.q}"</h2>
        <div className="p-3 bg-indigo-50 rounded-xl text-sm text-indigo-700">
          💡 Tap the mic, speak your answer clearly, then tap again to stop and get feedback.
        </div>
      </Card>

      {/* Mic error */}
      {micError && <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">{micError}</div>}

      {/* Mic Button */}
      {phase !== 'evaluated' && (
        <div className="flex flex-col items-center gap-4 py-6">
          <button
            onClick={isRecording ? stopMic : startMic}
            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all ${isRecording ? 'bg-rose-600 shadow-rose-400/40 scale-110 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-400/30'}`}>
            {isRecording ? <MicOff className="w-10 h-10 text-white" /> : <Mic className="w-10 h-10 text-white" />}
          </button>
          <p className="text-sm text-slate-500 text-center">
            {isRecording ? `🔴 Listening… ${fmt(seconds)}  — tap to stop` : 'Tap the mic to start speaking'}
          </p>
          {/* Live transcript */}
          {isRecording && liveText && (
            <div className="w-full p-4 bg-slate-900 rounded-2xl text-emerald-400 text-sm font-mono leading-relaxed">
              <span className="text-slate-500 text-xs block mb-1">Live transcript:</span>
              {liveText}
            </div>
          )}
        </div>
      )}

      {/* Result */}
      {phase === 'evaluated' && result && (
        <div className="space-y-4">
          {/* Verdict Banner */}
          <div className={`p-5 rounded-2xl text-center ${result.ok ? 'bg-emerald-50 border-2 border-emerald-200' : 'bg-amber-50 border-2 border-amber-200'}`}>
            <div className="text-4xl mb-2">{result.ok ? '✅' : '⚠️'}</div>
            <h3 className={`text-xl font-bold ${result.ok ? 'text-emerald-700' : 'text-amber-700'}`}>
              {result.ok ? 'Correct! Well done.' : 'Needs Improvement'}
            </h3>
            <p className={`text-sm mt-1 ${result.ok ? 'text-emerald-600' : 'text-amber-600'}`}>
              Score: <strong>{result.score}/100</strong> · {result.wordCount} words spoken
            </p>
          </div>

          {/* Score Bar */}
          <Card className="p-5">
            <div className="flex justify-between mb-2 text-sm">
              <span className="font-medium text-slate-700">Answer Score</span>
              <span className={`font-bold ${result.score >= 75 ? 'text-emerald-600' : result.score >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>{result.score}/100</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 mb-4">
              <div className={`h-3 rounded-full transition-all ${result.score >= 75 ? 'bg-emerald-500' : result.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${result.score}%` }} />
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1"><Lightbulb className="w-4 h-4 text-amber-400" /> What to Improve</h4>
            <ul className="space-y-2">
              {result.tips.map((tip, i) => (
                <li key={i} className={`text-sm px-3 py-2 rounded-xl ${tip.startsWith('💡') ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-800'}`}>{tip}</li>
              ))}
            </ul>
          </Card>

          {/* Your transcript */}
          {transcript && (
            <Card className="p-5">
              <h4 className="font-bold text-slate-700 text-sm mb-2">🎤 You said:</h4>
              <p className="text-sm text-slate-600 leading-relaxed italic">"{transcript}"</p>
            </Card>
          )}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => { setPhase('ready'); setTranscript(''); setLiveText(''); setResult(null); setSeconds(0); latestRef.current = ''; }}>
              Retry This Q
            </Button>
            <Button className="flex-1" onClick={nextQuestion}>
              {isLastQ ? 'See Full Feedback' : 'Next Question →'}
            </Button>
          </div>
        </div>
      )}
    </AppShell>
  );
};

// ─── MOCK LIBRARY ────────────────────────────────────────────────────────────
export const PracticeMockLib = () => <AppShell>
  <PageHeader title="Mock Tests" subtitle="Full interview loops by company." />
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
    {MOCK_TESTS.map((m, i) => (
      <Card key={i} className="p-5">
        <div className={`h-1.5 rounded-full bg-gradient-to-r ${m.color} mb-4`} />
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{m.emoji}</span>
          <div>
            <h3 className="font-bold text-slate-900">{m.company} — {m.role}</h3>
            <p className="text-xs text-slate-500">{m.time} · {m.qs} questions</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mb-4">{m.topics.map(t => <span key={t} className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">{t}</span>)}</div>
        <div className="flex justify-between items-center">
          <Badge variant={m.diff === 'Hard' ? 'rose' : 'amber'}>{m.diff}</Badge>
          <Link to="/interview-setup"><Button size="sm">Start Mock</Button></Link>
        </div>
      </Card>
    ))}
  </div>
</AppShell>;

// ─── DAILY PRACTICE ──────────────────────────────────────────────────────────
export const PracticeDaily = () => {
  const [done, setDone] = useState<number[]>([]);
  const today = new Date().getDay();
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const challenges = [
    { day: 'Mon', task: 'Tell me about yourself (2 min answer)', link: '/practice-answer' },
    { day: 'Tue', task: 'Explain a technical project you\'re proud of', link: '/practice-answer' },
    { day: 'Wed', task: 'System Design: Design a chat app', link: '/interview-setup' },
    { day: 'Thu', task: 'Behavioral: A time you led without authority', link: '/practice-answer' },
    { day: 'Fri', task: 'Full mock interview — 45 minutes', link: '/interview-setup' },
  ];
  return (
    <AppShell>
      <PageHeader title="Daily Challenge" subtitle="Keep your skills sharp every day." />
      <Card className="p-8 bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-0 text-center mb-6">
        <span className="text-5xl mb-4 block">🏆</span>
        <h2 className="text-2xl font-bold mb-2">Today's Challenge</h2>
        <p className="text-indigo-100 mb-6">{challenges[Math.min(today - 1, 4)]?.task || 'System Design: Design a chat app'}</p>
        <Link to="/practice-answer"><button className="bg-white text-indigo-700 font-bold px-8 py-3 rounded-xl hover:bg-slate-100 transition">Start Now</button></Link>
      </Card>
      <h3 className="font-bold text-slate-900 mb-3">This Week's Schedule</h3>
      <div className="space-y-3">
        {challenges.map((c, i) => (
          <Card key={i} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setDone(d => d.includes(i) ? d.filter(x => x !== i) : [...d, i])}
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${done.includes(i) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                {done.includes(i) && <CheckCircle2 className="w-4 h-4" />}
              </button>
              <div>
                <span className="font-bold text-slate-900 text-sm">{c.day}</span>
                <p className="text-xs text-slate-500">{c.task}</p>
              </div>
            </div>
            <Link to={c.link}><Button size="sm" variant="outline">Go</Button></Link>
          </Card>
        ))}
      </div>
    </AppShell>
  );
};

// ─── RESOURCES ────────────────────────────────────────────────────────────────
export const PracticeResources = () => {
  const resources = [
    { title: 'Master the STAR Method', type: 'Guide', icon: '⭐', desc: '5-step framework to answer any behavioral question perfectly every time.' },
    { title: 'System Design Cheat Sheet', type: 'Article', icon: '🏗️', desc: 'CAP theorem, load balancing, caching, sharding — all you need in one page.' },
    { title: 'Negotiating Your Offer', type: 'Guide', icon: '💰', desc: 'Scripts and tactics to negotiate 15-30% higher salary at any company.' },
    { title: 'Top 50 Interview Questions', type: 'List', icon: '📋', desc: 'The 50 most common questions across behavioral, technical, and system design.' },
  ];
  return (
    <AppShell>
      <PageHeader title="Resources & Guides" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {resources.map((r, i) => (
          <Card key={i} className="p-5" hover>
            <div className="flex items-start gap-4">
              <span className="text-4xl">{r.icon}</span>
              <div>
                <Badge variant="indigo" className="mb-2">{r.type}</Badge>
                <h3 className="font-bold text-slate-900 mb-1">{r.title}</h3>
                <p className="text-sm text-slate-500 mb-3">{r.desc}</p>
                <Link to="/practice-answer"><Button size="sm">Read & Practice</Button></Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
};