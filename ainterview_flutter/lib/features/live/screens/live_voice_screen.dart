// lib/features/live/screens/live_voice_screen.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';

class LiveVoiceScreen extends StatefulWidget {
  const LiveVoiceScreen({super.key});
  @override State<LiveVoiceScreen> createState() => _State();
}
class _State extends State<LiveVoiceScreen> with SingleTickerProviderStateMixin {
  bool _recording = false;
  late AnimationController _ctrl;
  late Animation<double> _pulse;
  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 800))..repeat(reverse: true);
    _pulse = Tween<double>(begin: 1.0, end: 1.2).animate(CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut));
  }
  @override void dispose() { _ctrl.dispose(); super.dispose(); }
  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: AppColors.bg,
    body: SafeArea(child: Column(children: [
      Padding(padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16), child: Row(children: [
        IconButton(icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.textPrimary, size: 20), onPressed: () => context.pop()),
        Text('Voice Interview', style: AppTextStyles.h3),
        const Spacer(),
        TextButton(onPressed: () => context.go('/feedback-summary'), child: Text('End', style: AppTextStyles.label.copyWith(color: AppColors.error))),
      ])),
      const Expanded(child: Center(child: Padding(padding: EdgeInsets.all(24), child: Text('Tell me about yourself and your background.', style: TextStyle(fontFamily: 'Inter', fontSize: 20, fontWeight: FontWeight.w600, color: Colors.white, height: 1.4), textAlign: TextAlign.center)))),
      Padding(padding: const EdgeInsets.all(40), child: Column(children: [
        if (_recording) ScaleTransition(scale: _pulse,
          child: Container(width: 100, height: 100, decoration: BoxDecoration(shape: BoxShape.circle, color: AppColors.error.withOpacity(0.15), border: Border.all(color: AppColors.error, width: 2)),
            child: const Icon(Icons.mic, color: AppColors.error, size: 44))),
        if (!_recording) Container(width: 100, height: 100, decoration: const BoxDecoration(shape: BoxShape.circle, gradient: LinearGradient(colors: [AppColors.primary, AppColors.violet])),
          child: const Icon(Icons.mic_none, color: Colors.white, size: 44)),
        const SizedBox(height: 16),
        Text(_recording ? 'Listening...' : 'Tap to speak', style: AppTextStyles.body.copyWith(color: _recording ? AppColors.error : AppColors.textSecondary)),
        const SizedBox(height: 24),
        Row(mainAxisAlignment: MainAxisAlignment.center, children: [
          GestureDetector(
            onTap: () => setState(() => _recording = !_recording),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              decoration: BoxDecoration(gradient: LinearGradient(colors: _recording ? [AppColors.error, const Color(0xFFDC2626)] : [AppColors.primary, AppColors.violet]), borderRadius: BorderRadius.circular(30)),
              child: Row(mainAxisSize: MainAxisSize.min, children: [
                Icon(_recording ? Icons.stop : Icons.mic, color: Colors.white, size: 18),
                const SizedBox(width: 8),
                Text(_recording ? 'Stop Recording' : 'Start Recording', style: AppTextStyles.button),
              ]),
            ),
          ),
          if (_recording) ...[
            const SizedBox(width: 12),
            GestureDetector(onTap: () => context.go('/feedback-summary'), child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(color: AppColors.success.withOpacity(0.15), shape: BoxShape.circle, border: Border.all(color: AppColors.success)),
              child: const Icon(Icons.check, color: AppColors.success, size: 20))),
          ],
        ]),
      ])),
    ])),
  );
}
