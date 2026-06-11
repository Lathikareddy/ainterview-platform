import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge } from '../components/Shared';
import store from '../utils/realtime';
import { Mic, MicOff, PhoneOff, Pause, Play, Clock, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

// 24. Waiting Room
export const LiveWaiting = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate('/live-video'), 3000);
    return () => clearTimeout(t);
  }, [navigate]);
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}
        className="w-32 h-32 rounded-full bg-indigo-600/20 flex items-center justify-center mb-8">
        <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center overflow-hidden border-4 border-slate-900">
          <span className="text-white text-3xl font-bold">AI</span>
        </div>
      </motion.div>
      <h2 className="text-2xl font-bold text-white mb-2">Preparing your session...</h2>
      <p className="text-slate-400">Setting up your AI interviewer.</p>
      <div className="mt-12 flex gap-2">
        {[0, 150, 300].map(d => (
          <div key={d} className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
        ))}
      </div>
    </div>
  );
};

const QUESTIONS: Record<string, { q: string; keywords: string[]; explanation: string; ideal: string }[]> = {
  behavioral: [
    { q: "Tell me about the hardest decision you've ever made at work. What was at stake and how did you decide?", keywords: ['decision', 'tradeoff', 'stake', 'result', 'impact', 'chose'], explanation: 'Describe the weight of the decision, your reasoning process, and the outcome.', ideal: 'Use STAR: explain the competing options, how you gathered information, why you chose what you did, and what happened after.' },
    { q: "Your team is about to miss a critical deadline. Half the team is burnt out. What do you do — push harder or reset?", keywords: ['prioritize', 'team', 'morale', 'communicate', 'scope', 'delivery'], explanation: 'Show leadership empathy AND delivery accountability.', ideal: 'Cut scope with stakeholder alignment, redistribute work, communicate proactively, and protect your team while hitting commitments.' },
    { q: "Describe a time you disagreed strongly with your manager's decision. How did you handle it — and what happened?", keywords: ['disagree', 'communicate', 'respect', 'data', 'outcome', 'trust'], explanation: 'Interviewers want to see you speak up diplomatically with data and commit gracefully.', ideal: 'Raise your concern with data privately, listen to their reasoning, commit to the final decision, and re-evaluate the result together.' },
    { q: "Tell me about a project that completely failed. Walk me through what went wrong and what you would do differently.", keywords: ['fail', 'learn', 'mistake', 'improve', 'differently', 'lesson'], explanation: 'Own the failure fully. Show you learned fast.', ideal: 'Describe your role, what assumptions were wrong, the real impact, what you changed in your process, and how you applied that learning.' },
    { q: "Describe a time you had to influence people without having authority over them. How did you do it?", keywords: ['influence', 'align', 'stakeholder', 'trust', 'data', 'relationship'], explanation: 'Show you can lead through persuasion and relationships, not just authority.', ideal: 'Build credibility through expertise, align on shared goals, use data to support your position, and give others credit for the outcome.' },
  ],
  technical: [
    { q: "You're debugging a production API that returns correct data for 999 out of 1000 requests. How do you find and fix the 1 in 1000 failure?", keywords: ['log', 'trace', 'reproduce', 'monitor', 'isolate', 'pattern'], explanation: 'Show structured debugging — not random trial and error.', ideal: 'Check error logs and distributed traces, look for patterns (user, time, payload size), reproduce in staging with matching data, then isolate and patch.' },
    { q: "Design a real-time notification system that delivers to 10 million users within 2 seconds of an event. Walk me through your architecture.", keywords: ['websocket', 'queue', 'pub sub', 'scale', 'fanout', 'push'], explanation: 'Cover the event pipeline, delivery protocol, and handling offline users.', ideal: 'Use a message queue (Kafka/SQS), fan-out workers per region, WebSockets or SSE for delivery, Firebase/APNs for mobile, and a fallback inbox for offline users.' },
    { q: "Given an array of integers, find the longest subarray where the difference between max and min is at most K. What's your approach?", keywords: ['sliding window', 'deque', 'monotonic', 'linear', 'max', 'min'], explanation: 'This tests sliding window + monotonic deque — a classic hard pattern.', ideal: 'Use two monotonic deques (one for max, one for min) in a sliding window. When max-min > K, shrink from the left. O(n) time, O(n) space.' },
    { q: "Your web application has a memory leak in production. CPU is 90% and requests are timing out. How do you diagnose and fix this?", keywords: ['heap', 'profiler', 'leak', 'gc', 'closure', 'monitor'], explanation: 'Show systematic production debugging under pressure.', ideal: 'Take a heap snapshot, compare before/after to find growing objects. Look for event listeners not cleaned up, closures holding large data, or unclosed DB connections.' },
    { q: "You need to store 500 million user events per day, queryable by user ID and time range. Design the data store.", keywords: ['partition', 'index', 'shard', 'time series', 'cassandra', 'query'], explanation: 'Cover partitioning strategy, write throughput, and read query patterns.', ideal: 'Use Cassandra or ClickHouse. Partition by userId + month, cluster by timestamp. Pre-aggregate for dashboards. Archive to cold storage after 90 days.' },
  ],
  react: [
    { q: "Explain the difference between useState and useReducer. When would you choose one over the other?", keywords: ['state', 'reducer', 'complex', 'dispatch', 'action', 'simple'], explanation: 'Show understanding of state complexity and when reducers add value.', ideal: 'useState for simple independent values; useReducer when state has multiple sub-values, transitions depend on previous state, or multiple actions update state differently.' },
    { q: "What is the React reconciliation algorithm and how do keys affect rendering performance?", keywords: ['virtual dom', 'diffing', 'key', 'reuse', 'fiber', 'update'], explanation: 'Keys help React reuse DOM nodes efficiently instead of re-creating them.', ideal: 'React diffs the virtual DOM tree. Keys tell React which items changed, added, or removed so it reuses existing DOM nodes instead of destroying and recreating them.' },
    { q: "How would you prevent unnecessary re-renders in a large React component tree?", keywords: ['memo', 'usememo', 'usecallback', 'context', 'split', 'stable'], explanation: 'Memoization prevents child re-renders when parent state changes unnecessarily.', ideal: 'Use React.memo on pure components, useMemo for expensive calculations, useCallback for stable function refs, split context to reduce consumer scope, and colocate state.' },
    { q: "Describe how you would implement code splitting and lazy loading in a React application.", keywords: ['lazy', 'suspense', 'dynamic import', 'bundle', 'chunk', 'loading'], explanation: 'Code splitting reduces initial bundle size and improves load times.', ideal: 'Use React.lazy with dynamic import() for route-level splits wrapped in Suspense. Add a loading fallback. Use bundle analyzer to find large chunks and split them.' },
    { q: "How does useEffect work and what are the common pitfalls around the dependency array?", keywords: ['effect', 'cleanup', 'dependency', 'stale closure', 'infinite loop', 'mount'], explanation: 'The dependency array controls when the effect runs — wrong deps cause bugs.', ideal: 'Effect runs after render. Missing deps cause stale closures; extra deps cause unnecessary runs. Cleanup prevents memory leaks. Use ESLint exhaustive-deps rule to catch mistakes.' },
  ],
  system_design: [
    { q: "Design a URL shortener like bit.ly that handles 1 billion requests per day. Walk through your full architecture.", keywords: ['hash', 'redirect', 'cache', 'database', 'cdn', 'scale'], explanation: 'Cover hashing, storage, caching layer, and handling redirects at scale.', ideal: 'Generate a short hash (base62). Store in a DB (id → long URL). Use Redis to cache hot URLs. CDN for global redirects. Load balancer + multiple app servers for scale.' },
    { q: "Design Twitter's news feed for 300 million daily active users. How do you handle celebrities with 50M+ followers?", keywords: ['fan-out', 'cache', 'celebrity', 'push', 'pull', 'redis'], explanation: 'Fan-out-on-write vs fan-out-on-read is the key tradeoff for celebrity accounts.', ideal: 'Fan-out-on-write for regular users (push to follower feeds). Fan-out-on-read for celebrities (pull and merge at read time). Use Redis sorted sets for feed storage.' },
    { q: "Design a distributed rate limiter that works across multiple servers without a central bottleneck.", keywords: ['token bucket', 'redis', 'sliding window', 'distributed', 'lua', 'atomicity'], explanation: 'Redis with Lua scripts provides atomic rate limiting across all servers.', ideal: 'Use Redis with a sliding window counter or token bucket. Lua scripts ensure atomic check-and-decrement. Shard Redis by user ID to distribute load. Add a local cache layer.' },
    { q: "Design a file storage system like Google Drive that supports upload, download, and real-time sync.", keywords: ['chunk', 'metadata', 'blob', 'sync', 'conflict', 'delta'], explanation: 'Chunking files enables resumable uploads, deduplication, and delta sync.', ideal: 'Split files into chunks. Store chunks in blob storage (S3). Store metadata + chunk map in a DB. Use CRDTs or operational transforms for conflict resolution on sync.' },
    { q: "How would you design a search autocomplete system that returns results in under 50ms for 100M users?", keywords: ['trie', 'cache', 'prefix', 'precompute', 'personalize', 'ranking'], explanation: 'Trie-based prefix matching + Redis caching is the standard approach.', ideal: 'Precompute top suggestions per prefix using a Trie. Cache top-k results per prefix in Redis. Personalize with user history. Return cached results in <50ms; update in background.' },
  ],
  algorithms: [
    { q: "Find two numbers in an array that add up to a target. What is the most efficient solution and why?", keywords: ['hash map', 'set', 'complement', 'linear', 'one pass', 'lookup'], explanation: 'Hash map gives O(n) by checking if the complement exists.', ideal: 'Use a hash map. For each number, compute target - number and check if it exists in the map. If yes, return the pair. If not, add the current number. O(n) time, O(n) space.' },
    { q: "Explain dynamic programming. How do you identify that a problem requires it and how do you approach solving it?", keywords: ['optimal substructure', 'overlapping', 'memoization', 'bottom-up', 'state', 'recurrence'], explanation: 'DP applies when subproblems overlap and solutions can be reused.', ideal: 'Look for overlapping subproblems and optimal substructure. Define state, write a recurrence relation, then implement top-down with memoization or bottom-up tabulation.' },
    { q: "How would you find the longest increasing subsequence in an array? What is the optimal time complexity?", keywords: ['patience', 'binary search', 'dp', 'subsequence', 'n log n', 'tails'], explanation: 'O(n log n) is achievable using patience sorting with binary search.', ideal: 'O(n log n): Maintain a tails array. For each element, binary search for the first tail >= it and replace. If not found, append. The length of tails is the answer.' },
    { q: "Describe BFS vs DFS. When would you use each and what are their space complexities?", keywords: ['queue', 'stack', 'level', 'shortest path', 'depth', 'space'], explanation: 'BFS uses a queue for level-by-level traversal; DFS uses a stack for depth-first.', ideal: 'BFS uses a queue, O(w) space (w=width), ideal for shortest path. DFS uses a stack, O(h) space (h=height), ideal for cycle detection, topological sort, and backtracking.' },
    { q: "Given a binary tree, check if it is a valid Binary Search Tree. Walk through your approach step by step.", keywords: ['inorder', 'min', 'max', 'recursive', 'range', 'bounds'], explanation: 'Each node must satisfy a min/max range constraint, not just its immediate children.', ideal: 'Recursively validate each node with a min and max bound. Left subtree nodes must be < current; right > current. Pass updated bounds down at each level. O(n) time.' },
  ],
  fullstack: [
    { q: "How do you handle authentication and authorization in a full-stack web application?", keywords: ['jwt', 'refresh token', 'https', 'hash', 'rbac', 'session'], explanation: 'Cover token lifecycle, secure storage, and permission checks on both ends.', ideal: 'JWT for stateless auth with short expiry + refresh tokens. Hash passwords with bcrypt. Store tokens in httpOnly cookies. Implement RBAC on the server. Always use HTTPS.' },
    { q: "Describe your approach to designing a REST API. What makes an API well-designed and easy to maintain?", keywords: ['resource', 'http verb', 'status code', 'versioning', 'pagination', 'idempotent'], explanation: 'REST APIs should be intuitive, consistent, and easy to evolve without breaking clients.', ideal: 'Use nouns for resources, correct HTTP verbs, proper status codes. Add pagination for lists, API versioning in URL or header, rate limiting, and consistent error response shapes.' },
    { q: "How would you make a web application load faster? Walk through both frontend and backend optimizations.", keywords: ['cache', 'cdn', 'lazy load', 'compress', 'database index', 'minify'], explanation: 'Performance is a full-stack concern — cover both client and server.', ideal: 'Frontend: minify bundles, lazy load routes, compress images, use a CDN, cache assets. Backend: add DB indexes, use Redis for hot data, paginate responses, compress API responses.' },
    { q: "Explain how you would implement real-time features like live notifications or a chat system in a web app.", keywords: ['websocket', 'sse', 'polling', 'pub sub', 'event', 'broadcast'], explanation: 'Choose the right real-time protocol based on the use case and scalability needs.', ideal: 'WebSockets for bidirectional (chat). Server-Sent Events for one-way (notifications). Redis Pub/Sub or message queues to broadcast events across server instances.' },
    { q: "How do you handle database migrations safely in a production application with zero downtime?", keywords: ['migration', 'rollback', 'backward compatible', 'zero downtime', 'schema', 'deploy'], explanation: 'Bad migrations can take down production — safety and reversibility are critical.', ideal: 'Write backward-compatible migrations. Deploy code that works with both old and new schema. Run migration. Deploy code that drops old columns. Always have a rollback script ready.' },
  ],
};

const DOMAIN_OPTIONS = [
  { key: 'behavioral',     label: 'Behavioral',      icon: '🤝', desc: '5 workplace scenario questions — leadership, conflict, failure, teamwork' },
  { key: 'technical',     label: 'Technical',       icon: '💻', desc: '5 engineering questions — debugging, systems, performance' },
  { key: 'react',         label: 'React / Frontend', icon: '⚛️', desc: '5 React questions — hooks, performance, reconciliation' },
  { key: 'system_design', label: 'System Design',   icon: '🏗️', desc: '5 large-scale design questions — distributed systems, caching' },
  { key: 'algorithms',    label: 'Algorithms / DSA', icon: '🧮', desc: '5 DSA questions — arrays, DP, trees, graphs' },
  { key: 'fullstack',     label: 'Full Stack',      icon: '🚀', desc: '5 full-stack questions — auth, APIs, performance, real-time' },
];



// 25. Live Video / Interview Session
export const LiveVideo = () => {
  const navigate = useNavigate();
  const [domain, setDomain] = useState<string>('');
  const [selectedQuestions, setSelectedQuestions] = useState<typeof QUESTIONS.behavioral>([]);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [phase, setPhase] = useState<'answering' | 'evaluated'>('answering');
  const [result, setResult] = useState<{ ok: boolean; score: number; ideal: string; explanation: string; given: string } | null>(null);
  const [prevResult, setPrevResult] = useState<{ q: string; ok: boolean; ideal: string } | null>(null);
  const [scoreboardTip, setScoreboardTip] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [sessionElapsed, setSessionElapsed] = useState(0);
  const [sessionResults, setSessionResults] = useState<number[]>([]);
  const [sessionSummary, setSessionSummary] = useState<any>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [camStream, setCamStream] = useState<MediaStream | null>(null);
  const recRef = useRef<any>(null);
  const latestRef = useRef('');
  const manualStop = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const shuffle = <T,>(items: T[]) => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const getDateKey = (date: Date) => date.toISOString().slice(0, 10);
  const calculateStreak = (prevDateKey: string | undefined, todayKey: string, currentStreak: number) => {
    if (!prevDateKey) return 1;
    const prev = new Date(prevDateKey);
    const today = new Date(todayKey);
    const diff = Math.round((today.getTime() - prev.getTime()) / 86400000);
    if (diff === 0) return currentStreak || 1;
    if (diff === 1) return (currentStreak || 0) + 1;
    return 1;
  };

  const questions = selectedQuestions.length ? selectedQuestions : QUESTIONS[domain] || [];
  const currentQ = questions[qIndex];
  const mins = String(Math.floor(sessionElapsed / 60)).padStart(2, '0');
  const secs = String(sessionElapsed % 60).padStart(2, '0');

  useEffect(() => {
    let t: number | undefined;
    if (isRecording) t = window.setInterval(() => setSeconds(s => s + 1), 1000) as any;
    return () => { if (t) clearInterval(t); };
  }, [isRecording]);

  useEffect(() => {
    let timer: number | undefined;
    if (sessionStarted) {
      timer = window.setInterval(() => setSessionElapsed(seconds => seconds + 1), 1000) as any;
    }
    return () => { if (timer) clearInterval(timer); };
  }, [sessionStarted]);

  // Start camera when session begins, stop when unmounted
  useEffect(() => {
    if (!sessionStarted) return;
    let stream: MediaStream | null = null;
    const startCam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setCamStream(stream);
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        // Camera unavailable — continue mic-only
      }
    };
    startCam();
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
      setCamStream(null);
    };
  }, [sessionStarted]);

  // Attach stream to video element when both are ready
  useEffect(() => {
    if (videoRef.current && camStream) {
      videoRef.current.srcObject = camStream;
    }
  }, [camStream]);

  const speakFeedback = (message: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(message);
      utter.rate = 1;
      utter.pitch = 1.05;
      utter.lang = 'en-US';
      window.speechSynthesis.speak(utter);
    }
  };

  const evaluate = (text: string) => {
    if (!currentQ) return;
    const lower = text.toLowerCase();
    const found = currentQ.keywords.filter(k => lower.includes(k)).length;
    const ratio = currentQ.keywords.length ? found / currentQ.keywords.length : 0;
    const score = Math.round(Math.max(35, Math.min(98, ratio * 100 + (text.length > 30 ? 10 : 0))));
    const ok = ratio >= 0.35;
    const improvementMessage = ok
      ? 'Nice work! You covered the key concepts. Keep including examples and clear structure.'
      : `Try again with more focus on ${currentQ.keywords.join(', ')}. ${currentQ.explanation}`;
    setScoreboardTip(improvementMessage);
    setResult({ ok, score, ideal: currentQ.ideal, explanation: currentQ.explanation, given: text || '(No answer given)' });
    setPhase('evaluated');
    setSessionResults(prev => {
      const next = [...prev];
      next[qIndex] = score;
      const average = Math.round(next.reduce((sum, value) => sum + (value || 0), 0) / next.length);
      setSessionSummary({
        title: DOMAIN_OPTIONS.find(d => d.key === domain)?.label || 'Interview Session',
        questionCount: questions.length,
        durationSeconds: sessionElapsed,
        avgScore: `${average}/100`,
        score: average,
        improvementTip: improvementMessage
      });
      return next;
    });
    speakFeedback(improvementMessage);
    try {
      const cur = store.getState() || {};
      const prevCount = Number(cur.interviewsCompleted || 0) + 1;
      const prevAvg = Number(String(cur.avgScore || '0').split('/')[0] || 0);
      const newAvg = Math.round(((prevAvg * (prevCount - 1)) + score) / prevCount);
      const totalPracticeSeconds = Number(cur.totalPracticeSeconds || 0) + Math.max(seconds, 20);
      const todayKey = getDateKey(new Date());
      const streakDays = calculateStreak(cur.lastSessionDate, todayKey, Number(cur.streakDays || 0));
      const scoreTrend = [...(cur.scoreTrend || []), { name: `Session ${prevCount}`, score }].slice(-6);
      const skillStats = { ...(cur.skillStats || {}) };
      const domainToSkill: Record<string, string> = {
        behavioral: 'behavioral',
        technical: 'frontend',
        react: 'frontend',
        system_design: 'system',
        algorithms: 'backend',
        fullstack: 'backend',
      };
      const currentDomain = domainToSkill[domain] || 'frontend';
      const prevSkill = skillStats[currentDomain] || { total: 0, scoreSum: 0 };
      skillStats[currentDomain] = { total: prevSkill.total + 1, scoreSum: prevSkill.scoreSum + score };
      // Only real users — no fake seeded ranks
      const youName = String(cur.name || localStorage.getItem('profileName') || 'You');
      const baseRanks: any[] = cur.communityRanks || [];
      const updatedRanks = baseRanks.map((rank: any) => ({ ...rank }));
      const youIndex = updatedRanks.findIndex((item: any) => item.isYou);
      if (youIndex >= 0) {
        updatedRanks[youIndex].score = Math.max(updatedRanks[youIndex].score || 0, score);
        updatedRanks[youIndex].name = `${youName} (You)`;
        updatedRanks[youIndex].role = domain === 'technical' ? 'Technical' : 'Behavioral';
      } else {
        updatedRanks.push({ name: `${youName} (You)`, score, role: domain === 'technical' ? 'Technical' : 'Behavioral', isYou: true });
      }
      const sortedRanks = updatedRanks.sort((a: any, b: any) => Number(b.score) - Number(a.score));
      store.setState({
        interviewsCompleted: prevCount,
        avgScore: `${newAvg}/100`,
        totalPracticeSeconds,
        streakDays,
        lastSessionDate: todayKey,
        scoreTrend,
        skillStats,
        recentActivity: [{ title: currentQ.q, date: 'Just now', score, type: 'Voice' }, ...(cur.recentActivity || [])].slice(0, 10),
        communityRanks: sortedRanks,
        scoreboardTip: improvementMessage,
      });
    } catch (_) { }
  };

  const startRecording = async () => {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) { setMicError('Speech recognition not supported. Use Chrome or Edge, or type your answer below.'); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
    } catch {
      setMicError('Microphone access denied. Please allow microphone access and try again.');
      return;
    }
    setMicError(null);
    manualStop.current = false;
    latestRef.current = '';
    setTranscript('');
    setSeconds(0);
    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = true;
    rec.continuous = true;
    rec.onstart = () => setIsRecording(true);
    rec.onresult = (e: any) => {
      let newFinal = '';
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) newFinal += e.results[i][0].transcript + ' ';
        else interim += e.results[i][0].transcript;
      }
      if (newFinal) latestRef.current = (latestRef.current + ' ' + newFinal).trim();
      setTranscript((latestRef.current + ' ' + interim).trim());
    };
    rec.onend = () => {
      // If the user manually stopped → stop and keep the text for submission
      if (manualStop.current) {
        setIsRecording(false);
        manualStop.current = false;
        return;
      }
      // Chrome stops recognition after silence / network hiccup — restart automatically
      // so the mic keeps listening until the user taps the button themselves.
      try {
        rec.start();
      } catch (_) {
        setIsRecording(false);
      }
    };
    rec.onerror = (e: any) => {
      if (e.error === 'no-speech') {
        // No speech detected — just restart silently
        try { rec.start(); } catch (_) { setIsRecording(false); }
        return;
      }
      setMicError(
        e.error === 'not-allowed'
          ? 'Microphone blocked. Enable it in browser settings.'
          : e.error === 'network'
            ? 'Network error. Check your connection and try again.'
            : `Mic error: ${e.error}`
      );
      setIsRecording(false);
      manualStop.current = true;
    };
    recRef.current = rec;
    rec.start();
  };

  const stopRecording = () => {
    manualStop.current = true;
    try { recRef.current?.stop(); } catch (_) { }
    setIsRecording(false);
  };

  const handleMic = () => {
    if (isRecording) { stopRecording(); setTimeout(() => evaluate(latestRef.current || transcript), 200); }
    else startRecording();
  };

  const finishSession = () => {
    const summary = sessionSummary || {
      title: DOMAIN_OPTIONS.find(d => d.key === domain)?.label || 'Interview Session',
      questionCount: questions.length,
      durationSeconds: sessionElapsed,
      avgScore: `${result?.score ?? 0}/100`,
      score: result?.score ?? 0,
      improvementTip: scoreboardTip || 'Your session feedback is ready.'
    };
    // Build full Q&A log for personalized feedback
    const qaLog = questions.map((q, i) => {
      const score = sessionResults[i] ?? 0;
      const userAnswer = i === qIndex && transcript ? transcript : (i < qIndex ? '(Answered)' : '(Skipped)');
      const lowerAnswer = userAnswer.toLowerCase();
      const keywordsHit = q.keywords.filter(k => lowerAnswer.includes(k));
      const keywordsMissed = q.keywords.filter(k => !lowerAnswer.includes(k));
      return {
        question: q.q,
        userAnswer,
        score,
        keywordsHit,
        keywordsMissed,
        ideal: q.ideal,
        explanation: q.explanation,
        ok: score >= 50,
      };
    });
    store.setState({
      lastSessionSummary: summary,
      lastSessionQALog: qaLog,
      lastSessionDomain: domain,
    });
    navigate('/feedback-summary');
  };

  const handleNext = () => {
    if (isRecording) { stopRecording(); }
    const nextIndex = qIndex + 1;
    setPrevResult(result ? { q: currentQ.q, ok: result.ok, ideal: result.ideal } : null);
    if (nextIndex < questions.length) {
      setQIndex(nextIndex);
      setTranscript('');
      setPhase('answering');
      setResult(null);
      setSeconds(0);
      latestRef.current = '';
    } else {
      finishSession();
    }
  };

  // ---------------- Topic Picker ----------------------------------
  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Choose Your Topic</h1>
            <p className="text-slate-400">Select a topic and I'll ask you 5 focused interview questions.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DOMAIN_OPTIONS.map(opt => (
              <button key={opt.key} type="button"
                onClick={() => {
                  const pool = shuffle(QUESTIONS[opt.key] || []).slice(0, 5);
                  setDomain(opt.key);
                  setSelectedQuestions(pool);
                  setQIndex(0);
                  setSessionStarted(true);
                  setPhase('answering');
                  setResult(null);
                  setPrevResult(null);
                  setScoreboardTip('');
                  setTranscript('');
                }}
                className="flex items-center gap-4 p-5 rounded-2xl border border-slate-700 bg-slate-800 hover:border-indigo-500 hover:bg-slate-750 transition-all text-left group">
                <span className="text-3xl">{opt.icon}</span>
                <div className="flex-1">
                  <div className="text-white font-semibold text-base group-hover:text-indigo-300 transition-colors">{opt.label}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{opt.desc}</div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 ml-auto group-hover:text-indigo-400 transition-colors" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // ---------------- Interview Session ----------------------------------
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Badge variant="rose" className="animate-pulse">LIVE</Badge>
          <span className="text-white font-medium capitalize">{DOMAIN_OPTIONS.find(d => d.key === domain)?.label}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg text-white">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="font-mono text-sm">{mins}:{secs}</span>
          </div>
          <button onClick={finishSession} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium transition-colors">
            <PhoneOff className="w-4 h-4" /> End
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-4 gap-4">
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-sm">Q {qIndex + 1} / {questions.length}</span>
          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${((qIndex + 1) / questions.length) * 100}%` }} />
          </div>
        </div>

        {/* Camera + Question side by side */}
        <div className="grid grid-cols-5 gap-3">
          {/* Camera PiP */}
          <div className="col-span-2 relative rounded-2xl overflow-hidden bg-slate-800 min-h-[120px] flex items-center justify-center">
            {camStream ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{ minHeight: 120 }}
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <span className="text-3xl">📷</span>
              </div>
            )}
            {/* Mic level indicator overlay */}
            {isRecording && (
              <div className="absolute bottom-2 left-2 right-2 flex gap-0.5 justify-center">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-1.5 bg-emerald-400 rounded-full animate-pulse" style={{ height: `${8 + i * 4}px`, animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
            )}
            <div className="absolute top-2 left-2">
              <span className="bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">You</span>
            </div>
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div key={qIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="col-span-3 bg-slate-800 border border-slate-700 rounded-2xl p-4 flex flex-col justify-center">
              <p className="text-xs text-slate-400 mb-1 uppercase tracking-widest">AI Interviewer</p>
              <p className="text-white text-sm font-medium leading-relaxed">"{currentQ?.q}"</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Previous result strip */}
        <AnimatePresence>
          {prevResult && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`p-3 rounded-xl border text-xs ${prevResult.ok ? 'border-emerald-700 bg-emerald-950/40 text-emerald-300' : 'border-rose-700 bg-rose-950/40 text-rose-300'}`}>
              <strong>Previous:</strong> {prevResult.ok ? '✓ Correct' : '✗ Incorrect'} — {prevResult.ideal}
            </motion.div>
          )}
        </AnimatePresence>

        {/* VERDICT BANNER — shown immediately after evaluating — */}
        <AnimatePresence>
          {phase === 'evaluated' && result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-2xl p-5 ${result.ok ? 'bg-emerald-500' : 'bg-rose-600'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{result.ok ? '✅' : '❌'}</span>
                  <div>
                    <p className="text-white text-xl font-black">
                      {result.ok ? 'CORRECT!' : 'NEEDS IMPROVEMENT'}
                    </p>
                    <p className="text-white/80 text-sm">Score: {result.score}/100</p>
                  </div>
                </div>
                <div className={`text-3xl font-black text-white/90`}>{result.score}</div>
              </div>
              {!result.ok && (
                <div className="bg-black/20 rounded-xl p-3 mb-2">
                  <p className="text-white/90 text-xs font-semibold mb-1">What was missing:</p>
                  <p className="text-white text-sm">{result.explanation}</p>
                </div>
              )}
              <div className="bg-black/20 rounded-xl p-3">
                <p className="text-white/80 text-xs font-semibold mb-1">💡 Ideal answer:</p>
                <p className="text-white text-sm leading-relaxed">{result.ideal}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mic Button + status */}
        {phase === 'answering' && (
          <div className="flex flex-col items-center gap-2">
            <motion.button
              type="button"
              onClick={handleMic}
              whileTap={{ scale: 0.94 }}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${isRecording
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/40 shadow-2xl'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'
                }`}>
              {isRecording
                ? <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}><MicOff className="w-8 h-8 text-white" /></motion.div>
                : <Mic className="w-8 h-8 text-white" />}
            </motion.button>
            <p className="text-slate-400 text-sm text-center">
              {isRecording ? '🔴 Recording... tap to stop & get result' : 'Tap the mic to start speaking'}
            </p>
          </div>
        )}

        {/* Mic Error */}
        {micError && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-600 text-rose-300 text-sm">{micError}</div>
        )}

        {/* Live transcript */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Your Answer {isRecording && <span className="ml-2 text-rose-400 animate-pulse">● Live</span>}</p>
          <textarea
            value={transcript}
            onChange={e => setTranscript(e.target.value)}
            rows={4}
            placeholder={isRecording ? 'Speaking... your words appear here in real time' : 'Type your answer or use the mic above...'}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-100 placeholder-slate-500 resize-none outline-none text-sm"
          />
        </div>

        {/* Submit button — big, obvious */}
        {!isRecording && phase === 'answering' && transcript.trim() && (
          <button type="button" onClick={() => evaluate(transcript)}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-lg transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2">
            ✅ Submit Answer — Get Verdict
          </button>
        )}

        {/* Next Question button */}
        <button type="button" onClick={handleNext}
          className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-semibold text-base transition-all ${phase === 'evaluated'
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
            }`}>
          {qIndex + 1 < questions.length ? (
            <><span>Next Question</span><ChevronRight className="w-5 h-5" /></>
          ) : (
            <><span>Finish & See Results</span><ChevronRight className="w-5 h-5" /></>
          )}
        </button>
      </div>
    </div>
  );
};

// 26. Live Voice - redirect to main session
export const LiveVoice = () => {
  const navigate = useNavigate();
  useEffect(() => { navigate('/live-video'); }, [navigate]);
  return null;
};

// 27. Live Text Ã¢â‚¬â€ redirect to main session
export const LiveText = () => {
  const navigate = useNavigate();
  useEffect(() => { navigate('/live-video'); }, [navigate]);
  return null;
};

// 29. Pause / Break
export const LivePause = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen bg-indigo-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-8 backdrop-blur-md">
        <Pause className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-4">Interview Paused</h2>
      <p className="text-indigo-200 max-w-md mb-12 text-lg">Take a deep breath. You're doing great.</p>
      <div className="space-y-4 w-full max-w-xs">
        <button onClick={() => navigate(-1)} className="w-full py-4 rounded-2xl bg-white text-indigo-900 font-semibold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors">
          <Play className="w-5 h-5" /> Resume Session
        </button>
        <button onClick={() => navigate('/feedback-summary')} className="w-full py-4 rounded-2xl border border-indigo-400 text-indigo-100 font-semibold hover:bg-indigo-800 transition-colors">
          End & Get Feedback
        </button>
      </div>
    </div>
  );
};
