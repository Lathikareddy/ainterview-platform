// lib/features/interview/screens/interview_format_screen.dart
// Matches website InterviewFormat — 3 format cards with gradient icons, white background
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';

class InterviewFormatScreen extends StatefulWidget {
  const InterviewFormatScreen({super.key});
  @override State<InterviewFormatScreen> createState() => _State();
}
class _State extends State<InterviewFormatScreen> {
  String _selected = 'video';
  final _formats = [
    {'id': 'video', 'title': 'Video Call', 'emoji': '📹', 'badge': '🎥 Most Realistic', 'desc': 'Most realistic. See yourself, practice eye contact and body language alongside speech.', 'gradient': [Color(0xFF7C3AED), Color(0xFF4F46E5)]},
    {'id': 'voice', 'title': 'Voice Only', 'emoji': '🎤', 'badge': '🎤 Recommended', 'desc': 'Like a phone screen. Speak your answers — real-time speech detection and evaluation.', 'gradient': [Color(0xFF4F46E5), Color(0xFF3B82F6)]},
    {'id': 'text', 'title': 'Text Chat', 'emoji': '💬', 'badge': '⌨️ Beginner Friendly', 'desc': 'Low pressure. Type your answers. Great for practicing structure and content.', 'gradient': [Color(0xFF10B981), Color(0xFF0D9488)]},
  ];

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: AppColors.bg,
    body: SafeArea(child: Column(children: [
      Container(
        color: AppColors.bgCard,
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            IconButton(icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.textPrimary, size: 20), onPressed: () => context.pop(), padding: EdgeInsets.zero, constraints: const BoxConstraints()),
            const SizedBox(width: 8),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Interview Format', style: AppTextStyles.h3),
              Text('Step 4 of 5 • Choose how you want to practice.', style: AppTextStyles.bodySm.copyWith(color: AppColors.textSecondary)),
            ])),
          ]),
          const SizedBox(height: 12),
          ClipRRect(borderRadius: BorderRadius.circular(4),
            child: const LinearProgressIndicator(value: 0.8, minHeight: 8, backgroundColor: Color(0xFFE2E8F0), color: AppColors.primary)),
        ]),
      ),
      Expanded(child: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _formats.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (_, i) {
          final f = _formats[i]; final sel = _selected == f['id'];
          final colors = f['gradient'] as List<Color>;
          return GestureDetector(
            onTap: () => setState(() => _selected = f['id'] as String),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: sel ? const Color(0xFFF5F8FF) : Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: sel ? AppColors.primary : AppColors.border, width: sel ? 2 : 1),
                boxShadow: sel
                  ? [BoxShadow(color: AppColors.primary.withOpacity(0.12), blurRadius: 12, offset: const Offset(0, 4))]
                  : [const BoxShadow(color: Color(0x06000000), blurRadius: 8, offset: Offset(0, 2))],
              ),
              child: Row(children: [
                // Gradient icon circle — matches website
                Container(
                  width: 56, height: 56,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: colors),
                    shape: BoxShape.circle,
                  ),
                  child: Center(child: Text(f['emoji'] as String, style: const TextStyle(fontSize: 26))),
                ),
                const SizedBox(width: 16),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  // Badge
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(color: AppColors.indigoBg, borderRadius: BorderRadius.circular(10)),
                    child: Text(f['badge'] as String, style: AppTextStyles.caption.copyWith(color: AppColors.primary, fontWeight: FontWeight.w700)),
                  ),
                  const SizedBox(height: 6),
                  Text(f['title'] as String, style: AppTextStyles.h4),
                  const SizedBox(height: 4),
                  Text(f['desc'] as String, style: AppTextStyles.bodySm.copyWith(color: AppColors.textSecondary)),
                ])),
                const SizedBox(width: 8),
                Container(
                  width: 22, height: 22,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: sel ? AppColors.primary : AppColors.border, width: 2),
                    color: sel ? AppColors.primary : Colors.transparent,
                  ),
                  child: sel ? const Icon(Icons.check, color: Colors.white, size: 13) : null,
                ),
              ]),
            ),
          );
        },
      )),
      Container(
        padding: const EdgeInsets.all(16),
        decoration: const BoxDecoration(color: AppColors.bgCard, border: Border(top: BorderSide(color: AppColors.border))),
        child: SizedBox(width: double.infinity,
          child: ElevatedButton(
            onPressed: () => context.push('/precheck'),
            child: const Row(mainAxisAlignment: MainAxisAlignment.center, children: [Text('Continue'), SizedBox(width: 8), Icon(Icons.chevron_right, size: 20)]),
          )),
      ),
    ])),
  );
}
