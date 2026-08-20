// lib/features/live/screens/live_waiting_screen.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';

class LiveWaitingScreen extends StatefulWidget {
  const LiveWaitingScreen({super.key});
  @override State<LiveWaitingScreen> createState() => _State();
}
class _State extends State<LiveWaitingScreen> with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _pulse;
  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: const Duration(seconds: 2))..repeat(reverse: true);
    _pulse = Tween<double>(begin: 0.8, end: 1.1).animate(CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut));
    Future.delayed(const Duration(seconds: 3), () { if (mounted) context.go('/live-text'); });
  }
  @override void dispose() { _ctrl.dispose(); super.dispose(); }
  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: AppColors.bg,
    body: Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
      ScaleTransition(scale: _pulse, child: Container(
        width: 100, height: 100,
        decoration: BoxDecoration(shape: BoxShape.circle, gradient: const LinearGradient(colors: [AppColors.primary, AppColors.violet]),
          boxShadow: [BoxShadow(color: AppColors.primary.withOpacity(0.5), blurRadius: 40, spreadRadius: 10)]),
        child: const Center(child: Text('🧠', style: TextStyle(fontSize: 48))),
      )),
      const SizedBox(height: 32),
      Text('Preparing your interview...', style: AppTextStyles.h3),
      const SizedBox(height: 12),
      Text('AI is generating questions', style: AppTextStyles.body.copyWith(color: AppColors.textSecondary)),
      const SizedBox(height: 32),
      const CircularProgressIndicator(color: AppColors.primary),
    ])),
  );
}
