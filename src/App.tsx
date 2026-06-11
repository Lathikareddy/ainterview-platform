import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
// Import all screens
import {
  Splash,
  Onboarding1,
  Onboarding2,
  Onboarding3,
  SignIn,
  SignUp,
  ForgotPassword,
  VerifyOTP } from
'./pages/AuthScreens';
import { GoogleAuthScreen } from './pages/GoogleAuth';
import {
  SetupBasicInfo,
  SetupCareerGoal,
  SetupExperience,
  SetupIndustry,
  SetupSkills } from
'./pages/SetupScreens';
import {
  Dashboard,
  SearchBrowse,
  Categories,
  Recommended,
  Notifications } from
'./pages/HomeScreens';
import {
  InterviewType,
  InterviewRole,
  InterviewDifficulty,
  InterviewFormat,
  PreCheck } from
'./pages/InterviewScreens';
import {
  LiveWaiting,
  LiveVideo,
  LiveVoice,
  LiveText,
  LivePause } from
'./pages/LiveScreens';
import {
  FeedbackSummary,
  FeedbackDetailed,
  FeedbackConfidence,
  FeedbackSpeech,
  FeedbackBody,
  FeedbackAnswers,
  FeedbackImprovements,
  AIVsTraditional } from
'./pages/FeedbackScreens';
import {
  AnalyticsDashboard,
  AnalyticsTrends,
  AnalyticsHeatmap,
  AnalyticsAchievements,
  AnalyticsHistory } from
'./pages/AnalyticsScreens';
import {
  PracticeQBank,
  PracticeAnswer,
  PracticeMockLib,
  PracticeDaily,
  PracticeResources } from
'./pages/PracticeScreens';
import {
  CommunityLeaderboard,
  CommunityMentor,
  Settings } from
'./pages/CommunityScreens';
import { ScreenIndex } from './pages/ScreenIndex';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
      <Routes>
        {/* Directory */}
        <Route path="/screens" element={<ScreenIndex />} />

        {/* Auth & Onboarding */}
        <Route path="/" element={<GoogleAuthScreen />} />
        <Route path="/splash" element={<Splash />} />
        <Route path="/onboarding-1" element={<Onboarding1 />} />
        <Route path="/onboarding-2" element={<Onboarding2 />} />
        <Route path="/onboarding-3" element={<Onboarding3 />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        

        {/* Setup */}
        <Route path="/setup-basic" element={<SetupBasicInfo />} />
        <Route path="/setup-career" element={<SetupCareerGoal />} />
        <Route path="/setup-experience" element={<SetupExperience />} />
        <Route path="/setup-industry" element={<SetupIndustry />} />
        <Route path="/setup-skills" element={<SetupSkills />} />

        {/* Home */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/search" element={<SearchBrowse />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/recommended" element={<Recommended />} />
        <Route path="/notifications" element={<Notifications />} />

        {/* Interview Setup */}
        <Route path="/interview-setup" element={<InterviewType />} />
        <Route path="/interview-role" element={<InterviewRole />} />
        <Route path="/interview-difficulty" element={<InterviewDifficulty />} />
        <Route path="/interview-format" element={<InterviewFormat />} />
        <Route path="/interview-precheck" element={<PreCheck />} />

        {/* Live */}
        <Route path="/live-waiting" element={<LiveWaiting />} />
        <Route path="/live-video" element={<LiveVideo />} />
        <Route path="/live-voice" element={<LiveVoice />} />
        <Route path="/live-text" element={<LiveText />} />
        <Route path="/live-pause" element={<LivePause />} />

        {/* Feedback */}
        <Route path="/feedback-summary" element={<FeedbackSummary />} />
        <Route path="/feedback-detailed" element={<FeedbackDetailed />} />
        <Route path="/feedback-confidence" element={<FeedbackConfidence />} />
        <Route path="/feedback-speech" element={<FeedbackSpeech />} />
        <Route path="/feedback-body" element={<FeedbackBody />} />
        <Route path="/feedback-answers" element={<FeedbackAnswers />} />
        <Route
          path="/feedback-improvements"
          element={<FeedbackImprovements />} />
        
        <Route path="/ai-vs-traditional" element={<AIVsTraditional />} />

        {/* Analytics */}
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/analytics-trends" element={<AnalyticsTrends />} />
        <Route path="/analytics-heatmap" element={<AnalyticsHeatmap />} />
        <Route
          path="/analytics-achievements"
          element={<AnalyticsAchievements />} />
        
        <Route path="/history" element={<AnalyticsHistory />} />

        {/* Practice */}
        <Route path="/practice" element={<PracticeQBank />} />
        <Route path="/practice-answer" element={<PracticeAnswer />} />
        <Route path="/practice-mocks" element={<PracticeMockLib />} />
        <Route path="/practice-daily" element={<PracticeDaily />} />
        <Route path="/practice-resources" element={<PracticeResources />} />

        {/* Community & Settings */}
        <Route path="/community" element={<CommunityLeaderboard />} />
        <Route path="/community-mentor" element={<CommunityMentor />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>

      {/* Floating Directory Button for easy navigation during review */}
      <div className="fixed bottom-20 md:bottom-4 right-4 z-50">
        <a
          href="/screens"
          className="bg-slate-900 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2">
          
          Screen Index
        </a>
      </div>
    </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}