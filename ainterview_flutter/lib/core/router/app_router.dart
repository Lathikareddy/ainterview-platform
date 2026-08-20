// lib/core/router/app_router.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../features/auth/providers/auth_provider.dart';
import '../../features/auth/screens/splash_screen.dart';
import '../../features/auth/screens/login_screen.dart';
import '../../features/auth/screens/signup_screen.dart';
import '../../features/auth/screens/forgot_password_screen.dart';
import '../../features/setup/screens/setup_basic_screen.dart';
import '../../features/setup/screens/setup_career_screen.dart';
import '../../features/setup/screens/setup_experience_screen.dart';
import '../../features/setup/screens/setup_skills_screen.dart';
import '../../features/home/screens/dashboard_screen.dart';
import '../../features/home/screens/notifications_screen.dart';
import '../../features/interview/screens/interview_type_screen.dart';
import '../../features/interview/screens/interview_role_screen.dart';
import '../../features/interview/screens/interview_difficulty_screen.dart';
import '../../features/interview/screens/interview_format_screen.dart';
import '../../features/interview/screens/precheck_screen.dart';
import '../../features/live/screens/live_waiting_screen.dart';
import '../../features/live/screens/live_text_screen.dart';
import '../../features/live/screens/live_voice_screen.dart';
import '../../features/feedback/screens/feedback_summary_screen.dart';
import '../../features/analytics/screens/analytics_screen.dart';
import '../../features/practice/screens/practice_screen.dart';
import '../../features/community/screens/leaderboard_screen.dart';
import '../../features/settings/screens/settings_screen.dart';

class AppRouter {
  final AuthProvider authProvider;
  AppRouter(this.authProvider);

  late final GoRouter router = GoRouter(
    initialLocation: '/splash',
    refreshListenable: authProvider,
    redirect: (context, state) {
      final isLoggedIn = authProvider.isAuthenticated;
      final isSetupDone = authProvider.isSetupComplete;
      final loc = state.matchedLocation;

      if (loc == '/splash') return null;

      final authRoutes = ['/login', '/signup', '/forgot-password'];
      final setupRoutes = ['/setup-basic', '/setup-career', '/setup-experience', '/setup-skills'];

      if (!isLoggedIn && !authRoutes.contains(loc)) return '/login';
      if (isLoggedIn && !isSetupDone && !setupRoutes.contains(loc)) return '/setup-basic';
      if (isLoggedIn && isSetupDone && authRoutes.contains(loc)) return '/dashboard';
      return null;
    },
    routes: [
      GoRoute(path: '/splash', builder: (c, s) => const SplashScreen()),
      GoRoute(path: '/login', builder: (c, s) => const LoginScreen()),
      GoRoute(path: '/signup', builder: (c, s) => const SignUpScreen()),
      GoRoute(path: '/forgot-password', builder: (c, s) => const ForgotPasswordScreen()),
      GoRoute(path: '/setup-basic', builder: (c, s) => const SetupBasicScreen()),
      GoRoute(path: '/setup-career', builder: (c, s) => const SetupCareerScreen()),
      GoRoute(path: '/setup-experience', builder: (c, s) => const SetupExperienceScreen()),
      GoRoute(path: '/setup-skills', builder: (c, s) => const SetupSkillsScreen()),
      GoRoute(path: '/dashboard', builder: (c, s) => const DashboardScreen()),
      GoRoute(path: '/notifications', builder: (c, s) => const NotificationsScreen()),
      GoRoute(path: '/interview-type', builder: (c, s) => const InterviewTypeScreen()),
      GoRoute(path: '/interview-role', builder: (c, s) => const InterviewRoleScreen()),
      GoRoute(path: '/interview-difficulty', builder: (c, s) => const InterviewDifficultyScreen()),
      GoRoute(path: '/interview-format', builder: (c, s) => const InterviewFormatScreen()),
      GoRoute(path: '/precheck', builder: (c, s) => const PreCheckScreen()),
      GoRoute(path: '/live-waiting', builder: (c, s) => const LiveWaitingScreen()),
      GoRoute(path: '/live-text', builder: (c, s) => const LiveTextScreen()),
      GoRoute(path: '/live-voice', builder: (c, s) => const LiveVoiceScreen()),
      GoRoute(path: '/feedback-summary', builder: (c, s) => const FeedbackSummaryScreen()),
      GoRoute(path: '/analytics', builder: (c, s) => const AnalyticsScreen()),
      GoRoute(path: '/practice', builder: (c, s) => const PracticeScreen()),
      GoRoute(path: '/community', builder: (c, s) => const LeaderboardScreen()),
      GoRoute(path: '/settings', builder: (c, s) => const SettingsScreen()),
    ],
  );
}
