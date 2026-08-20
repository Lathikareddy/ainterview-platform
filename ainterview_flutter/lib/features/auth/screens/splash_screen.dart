// lib/features/auth/screens/splash_screen.dart
// Matches website Splash — indigo-600 background, white logo, auto-navigates to login/dashboard
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});
  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _scale;
  late Animation<double> _fade;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 800));
    _scale = Tween<double>(begin: 0.8, end: 1.0).animate(
      CurvedAnimation(parent: _ctrl, curve: Curves.easeOut),
    );
    _fade = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _ctrl, curve: Curves.easeOut),
    );
    _ctrl.forward();

    // Auto-navigate after splash delay
    _timer = Timer(const Duration(milliseconds: 1800), _navigateNext);
  }

  void _navigateNext() {
    if (!mounted) return;
    final auth = context.read<AuthProvider>();
    if (auth.isAuthenticated) {
      if (auth.isSetupComplete) {
        context.go('/dashboard');
      } else {
        context.go('/setup-basic');
      }
    } else {
      context.go('/login');
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          color: Color(0xFF4F46E5), // indigo-600 exactly like website
        ),
        child: SafeArea(
          child: Center(
            child: FadeTransition(
              opacity: _fade,
              child: ScaleTransition(
                scale: _scale,
                child: Column(mainAxisSize: MainAxisSize.min, children: [
                  // White logo box — matches website w-24 h-24 bg-white rounded-2xl
                  Container(
                    width: 96, height: 96,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(18),
                      boxShadow: const [BoxShadow(color: Color(0x40000000), blurRadius: 32, spreadRadius: 0)],
                    ),
                    child: const Center(
                      child: Text('A', style: TextStyle(
                        fontFamily: 'Inter',
                        color: Color(0xFF4F46E5), // text-indigo-600
                        fontSize: 48,
                        fontWeight: FontWeight.w900,
                      )),
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text('AInterview', style: TextStyle(
                    fontFamily: 'Inter',
                    color: Colors.white,
                    fontSize: 30,
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.5,
                  )),
                  const SizedBox(height: 8),
                  const Text(
                    'AI-powered interview confidence',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      color: Color(0xFFC7D2FE), // indigo-200
                      fontSize: 16,
                    ),
                  ),
                ]),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
