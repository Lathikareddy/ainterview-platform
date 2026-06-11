import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppShell, Card, Button, PageHeader, Badge } from '../components/Shared';
import {
  Mic,
  Video,
  VideoOff,
  MessageSquare,
  Briefcase,
  Code,
  Users,
  Zap,
  CheckCircle2,
  AlertCircle,
  Wifi,
  ChevronRight } from
'lucide-react';
const SetupContainer = ({
  children,
  title,
  subtitle,
  step,
  total = 5,
  onNext,
  nextLabel = 'Continue',
  nextPath
}: any) => {
  const navigate = useNavigate();
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
            <span>
              Step {step} of {total}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${step / total * 100}%`
              }} />
            
          </div>
        </div>

        <PageHeader
          title={title}
          subtitle={subtitle}
          backTo={step > 1 ? -1 : undefined} />
        

        <div className="min-h-[400px] mb-8">{children}</div>

        <div className="flex justify-end pt-6 border-t border-slate-200">
          <Button
            size="lg"
            onClick={() => {
              if (onNext) onNext();
              if (nextPath) navigate(nextPath);
            }}>
            
            {nextLabel} <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </AppShell>);

};
// 19. Interview Type
export const InterviewType = () => {
  const [selected, setSelected] = useState('behavioral');
  const types = [
    {
      id: 'behavioral',
      title: 'Behavioral',
      emoji: '🤝',
      desc: 'Leadership, conflict, failure, and teamwork. Answer with real stories using the STAR method.',
      tag: 'STAR Method • Culture Fit • Soft Skills',
    },
    {
      id: 'technical',
      title: 'Technical',
      emoji: '💻',
      desc: 'Coding, algorithms, system design, and deep technical knowledge for engineering roles.',
      tag: 'Algorithms • System Design • Code',
    },
  ];

  return (
    <SetupContainer
      step={1}
      title="Select Interview Type"
      subtitle="What kind of interview do you want to practice?"
      nextPath="/interview-role">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {types.map((t) => (
          <Card
            key={t.id}
            onClick={() => setSelected(t.id)}
            className={`p-8 cursor-pointer border-2 transition-all flex flex-col gap-4 ${
              selected === t.id
                ? 'border-indigo-600 bg-indigo-50/50 shadow-lg -translate-y-1'
                : 'border-slate-200 hover:border-indigo-200'
            }`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl ${
              selected === t.id ? 'bg-indigo-600' : 'bg-slate-100'
            }`}>
              {t.emoji}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{t.title}</h3>
              <p className="text-sm text-slate-500 mb-3">{t.desc}</p>
              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{t.tag}</span>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 self-end flex items-center justify-center ${
              selected === t.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
            }`}>
              {selected === t.id && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
            </div>
          </Card>
        ))}
      </div>
    </SetupContainer>
  );
};
// 20. Job Role
export const InterviewRole = () => {
  return (
    <SetupContainer
      step={2}
      title="Target Role & Company"
      subtitle="Customize the AI persona and question context."
      nextPath="/interview-difficulty">
      
      <div className="space-y-6">
        <Card className="p-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Job Title
          </label>
          <input
            type="text"
            defaultValue="Frontend Engineer"
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-6" />
          

          <label className="block text-sm font-medium text-slate-700 mb-2">
            Target Company (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Google, Stripe, Startup"
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-2" />
          
          <p className="text-xs text-slate-500">
            We'll tailor the interview style to this company's known practices.
          </p>
        </Card>

        <Card className="p-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Job Description (Optional)
          </label>
          <textarea
            rows={4}
            placeholder="Paste the job description here for highly specific questions..."
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
          </textarea>
        </Card>
      </div>
    </SetupContainer>);

};
// 21. Difficulty
export const InterviewDifficulty = () => {
  const [selected, setSelected] = useState('intermediate');
  const levels = [
  {
    id: 'beginner',
    title: 'Beginner',
    desc: 'Standard questions, forgiving AI, hints available.',
    badge: 'Easy'
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    desc: 'Industry standard difficulty, moderate follow-ups.',
    badge: 'Medium'
  },
  {
    id: 'advanced',
    title: 'Advanced',
    desc: 'Complex scenarios, rigorous follow-up questions.',
    badge: 'Hard'
  },
  {
    id: 'expert',
    title: 'Expert (Stress Test)',
    desc: 'Hostile/skeptical AI persona, deep technical probing.',
    badge: 'Very Hard'
  }];

  return (
    <SetupContainer
      step={3}
      title="Select Difficulty"
      subtitle="How hard should the AI push you?"
      nextPath="/interview-format">
      
      <div className="space-y-4">
        {levels.map((l) =>
        <Card
          key={l.id}
          onClick={() => setSelected(l.id)}
          className={`p-5 cursor-pointer border-2 transition-all flex items-center justify-between ${selected === l.id ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}`}>
          
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3
                className={`text-lg font-bold ${selected === l.id ? 'text-indigo-900' : 'text-slate-900'}`}>
                
                  {l.title}
                </h3>
                <Badge
                variant={
                l.id === 'beginner' ?
                'emerald' :
                l.id === 'expert' ?
                'rose' :
                l.id === 'advanced' ?
                'amber' :
                'indigo'
                }>
                
                  {l.badge}
                </Badge>
              </div>
              <p
              className={`text-sm ${selected === l.id ? 'text-indigo-700' : 'text-slate-500'}`}>
              
                {l.desc}
              </p>
            </div>
            <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected === l.id ? 'border-indigo-600' : 'border-slate-300'}`}>
            
              {selected === l.id &&
            <div className="w-3 h-3 bg-indigo-600 rounded-full" />
            }
            </div>
          </Card>
        )}
      </div>
    </SetupContainer>);

};
// 22. Format
export const InterviewFormat = () => {
  const [selected, setSelected] = useState('video');
  const formats = [
    {
      id: 'video',
      title: 'Video Call',
      desc: 'Most realistic. See yourself, practice eye contact and body language alongside speech.',
      icon: Video,
      badge: '🎥 Most Realistic',
      color: 'from-violet-600 to-indigo-600',
    },
    {
      id: 'voice',
      title: 'Voice Only',
      desc: 'Like a phone screen. Speak your answers — real-time speech detection and evaluation.',
      icon: Mic,
      badge: '🎤 Recommended',
      color: 'from-indigo-600 to-blue-600',
    },
    {
      id: 'text',
      title: 'Text Chat',
      desc: 'Low pressure. Type your answers. Great for practicing structure and content.',
      icon: MessageSquare,
      badge: '⌨️ Beginner Friendly',
      color: 'from-emerald-600 to-teal-600',
    },
  ];

  return (
    <SetupContainer
      step={4}
      title="Interview Format"
      subtitle="Choose how you want to practice. You can switch anytime."
      nextPath="/interview-precheck">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {formats.map((f) => (
          <Card
            key={f.id}
            onClick={() => setSelected(f.id)}
            className={`p-6 cursor-pointer border-2 transition-all flex flex-col items-center text-center gap-4 ${
              selected === f.id ? 'border-indigo-600 bg-indigo-50/50 shadow-lg -translate-y-1' : 'border-slate-200 hover:border-indigo-200'
            }`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${f.color} text-white`}>
              <f.icon className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full mb-2 inline-block">{f.badge}</span>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              selected === f.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
            }`}>
              {selected === f.id && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
            </div>
          </Card>
        ))}
      </div>
    </SetupContainer>
  );
};
// 23. Pre-interview Check — tries camera+mic, gracefully falls back to mic-only
export const PreCheck = () => {
  const [checks, setChecks] = useState({ cam: false, mic: false, net: false, ping: 0, micLevel: 0 });
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;
    let currentStream: MediaStream | null = null;
    const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;

    const initMedia = async () => {
      if (!navigator.mediaDevices?.getUserMedia) return;

      // Try video + audio first; fall back to audio-only
      let mediaStream: MediaStream | null = null;
      let camOk = false;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        camOk = true;
      } catch {
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        } catch {
          if (mounted) setChecks(prev => ({ ...prev, mic: false, cam: false }));
          return;
        }
      }

      if (!mounted || !mediaStream) return;
      currentStream = mediaStream;
      setStream(mediaStream);
      setChecks(prev => ({ ...prev, cam: camOk, mic: true }));

      if (camOk && videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      if (AudioContextClass) {
        const audioCtx = new AudioContextClass();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(mediaStream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 128;
        source.connect(analyser);
        analyserRef.current = analyser;
        const data = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          if (!mounted || !analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(data);
          const max = Math.max(...data) / 255;
          setChecks(prev => ({ ...prev, micLevel: Math.round(max * 100) }));
          rafRef.current = requestAnimationFrame(tick);
        };
        tick();
      }
    };

    initMedia();
    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (audioContextRef.current) audioContextRef.current.close().catch(() => null);
      if (currentStream) currentStream.getTracks().forEach(t => t.stop());
    };
  }, []);

  useEffect(() => {
    let active = true;
    const updateNet = async () => {
      let ping = 0;
      try {
        const t = performance.now();
        await fetch(window.location.href, { method: 'HEAD', cache: 'no-store' });
        ping = Math.round(performance.now() - t);
      } catch { ping = 0; }
      if (!active) return;
      setChecks(prev => ({ ...prev, net: navigator.onLine, ping }));
    };
    updateNet();
    window.addEventListener('online', updateNet);
    window.addEventListener('offline', updateNet);
    const iv = window.setInterval(updateNet, 5000);
    return () => { active = false; window.removeEventListener('online', updateNet); window.removeEventListener('offline', updateNet); clearInterval(iv); };
  }, []);

  const bars = 12;

  return (
    <SetupContainer
      step={5}
      title="System Check"
      subtitle="We'll check your camera, mic, and connection."
      nextLabel="Start Interview"
      nextPath="/live-waiting">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* Left: Camera feed OR mic visualizer */}
        <div className="rounded-2xl overflow-hidden bg-slate-900 min-h-[220px] flex flex-col items-center justify-center relative">
          {checks.cam && stream ? (
            // Live camera feed
            <>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{ minHeight: 220 }}
              />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur">📹 Live Preview</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-1.5 rounded-full transition-all duration-100 ${
                      checks.micLevel / 100 > i / 5 ? 'bg-emerald-400 h-5' : 'bg-white/30 h-2'
                    }`} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            // Mic waveform fallback
            <div className="flex flex-col items-center gap-5 p-10">
              <div className="flex items-end gap-1.5 h-20">
                {[...Array(bars)].map((_, i) => {
                  const level = checks.micLevel;
                  const height = checks.mic
                    ? Math.max(8, Math.round((level / 100) * 80 * (0.4 + 0.6 * Math.abs(Math.sin(i * 0.8)))))
                    : 8;
                  return (
                    <div key={i}
                      className={`w-2.5 rounded-full transition-all duration-100 ${
                        checks.mic && level > 5 ? 'bg-indigo-400' : 'bg-slate-700'
                      }`}
                      style={{ height: `${height}px` }}
                    />
                  );
                })}
              </div>
              <div className="text-center">
                <p className="text-white font-semibold text-sm">🎤 Microphone Visualizer</p>
                <p className={`text-xs mt-1 ${checks.mic ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {checks.mic ? 'Speak to see levels' : 'Camera blocked — mic only mode'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Status cards */}
        <div className="space-y-4">
          {/* Camera */}
          <Card className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                checks.cam ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
              }`}>
                {checks.cam ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Camera</h4>
                <p className="text-xs text-slate-500">
                  {checks.cam ? '✅ Live — looking good!' : 'Not available or blocked (optional)'}
                </p>
              </div>
            </div>
            {checks.cam
              ? <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              : <AlertCircle className="w-6 h-6 text-amber-400" />}
          </Card>

          {/* Microphone */}
          <Card className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                checks.mic ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
              }`}>
                <Mic className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-900">Microphone</h4>
                <div className="flex gap-1 mt-1.5">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className={`h-1.5 w-3 rounded-full transition-all ${
                      checks.mic && checks.micLevel / 100 > i / 8 ? 'bg-emerald-500' : 'bg-slate-200'
                    }`} />
                  ))}
                </div>
              </div>
            </div>
            {checks.mic ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <AlertCircle className="w-6 h-6 text-rose-500" />}
          </Card>

          {/* Connection */}
          <Card className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                checks.net ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
              }`}>
                <Wifi className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Connection</h4>
                <p className="text-xs text-slate-500">
                  {checks.net ? `Excellent (${checks.ping}ms ping)` : 'Disconnected'}
                </p>
              </div>
            </div>
            {checks.net ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <AlertCircle className="w-6 h-6 text-rose-500" />}
          </Card>

          <div className={`p-4 rounded-xl border ${
            checks.mic ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'
          }`}>
            <p className={`text-sm font-semibold mb-1 ${
              checks.mic ? 'text-emerald-700' : 'text-amber-700'
            }`}>
              {checks.mic ? '✅ Ready to start!' : '⚠️ Microphone needed'}
            </p>
            <p className={`text-xs ${
              checks.mic ? 'text-emerald-600' : 'text-amber-600'
            }`}>
              {checks.cam
                ? 'Camera and mic detected. Your interview will include a live video preview.'
                : checks.mic
                  ? 'Mic detected. Camera is optional — you can still do a full voice interview.'
                  : 'Please allow microphone access in your browser to continue.'}
            </p>
          </div>
        </div>
      </div>
    </SetupContainer>
  );
};