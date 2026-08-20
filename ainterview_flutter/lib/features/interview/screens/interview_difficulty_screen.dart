// lib/features/interview/screens/interview_difficulty_screen.dart
// Matches website InterviewDifficulty — white card style, indigo selection
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';

class InterviewDifficultyScreen extends StatefulWidget {
  const InterviewDifficultyScreen({super.key});
  @override
  State<InterviewDifficultyScreen> createState() => _State();
}
class _State extends State<InterviewDifficultyScreen> {
  String _selected = 'intermediate';
  final _levels = [
    {'id': 'beginner', 'title': 'Beginner', 'desc': 'Standard questions, forgiving AI, hints available.', 'badge': 'Easy', 'emoji': '🌱', 'color': AppColors.success, 'bg': AppColors.emeraldBg},
    {'id': 'intermediate', 'title': 'Intermediate', 'desc': 'Industry standard difficulty, moderate follow-ups.', 'badge': 'Medium', 'emoji': '🔥', 'color': AppColors.primary, 'bg': AppColors.indigoBg},
    {'id': 'advanced', 'title': 'Advanced', 'desc': 'Complex scenarios, rigorous follow-up questions.', 'badge': 'Hard', 'emoji': '⚡', 'color': AppColors.warning, 'bg': AppColors.amberBg},
    {'id': 'expert', 'title': 'Expert (Stress Test)', 'desc': 'Hostile/skeptical AI persona, deep technical probing.', 'badge': 'Very Hard', 'emoji': '💎', 'color': AppColors.error, 'bg': AppColors.roseBg},
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
              Text('Select Difficulty', style: AppTextStyles.h3),
              Text('Step 3 of 5 • How hard should the AI push you?', style: AppTextStyles.bodySm.copyWith(color: AppColors.textSecondary)),
            ])),
          ]),
          const SizedBox(height: 12),
          ClipRRect(borderRadius: BorderRadius.circular(4),
            child: const LinearProgressIndicator(value: 0.6, minHeight: 8, backgroundColor: Color(0xFFE2E8F0), color: AppColors.primary)),
        ]),
      ),
      Expanded(child: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _levels.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (_, i) {
          final l = _levels[i]; final sel = _selected == l['id'];
          final color = l['color'] as Color;
          return GestureDetector(
            onTap: () => setState(() => _selected = l['id'] as String),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: sel ? (l['bg'] as Color) : Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: sel ? color : AppColors.border, width: sel ? 2 : 1),
                boxShadow: sel ? [BoxShadow(color: color.withOpacity(0.12), blurRadius: 8, offset: const Offset(0, 3))] : [const BoxShadow(color: Color(0x06000000), blurRadius: 8, offset: Offset(0, 2))],
              ),
              child: Row(children: [
                Text(l['emoji'] as String, style: const TextStyle(fontSize: 28)),
                const SizedBox(width: 14),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Row(children: [
                    Text(l['title'] as String, style: AppTextStyles.h4.copyWith(color: sel ? color : AppColors.textPrimary)),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(color: color.withOpacity(0.12), borderRadius: BorderRadius.circular(10)),
                      child: Text(l['badge'] as String, style: AppTextStyles.caption.copyWith(color: color, fontWeight: FontWeight.w700)),
                    ),
                  ]),
                  const SizedBox(height: 4),
                  Text(l['desc'] as String, style: AppTextStyles.bodySm.copyWith(color: sel ? AppColors.textSecondary : AppColors.textSecondary)),
                ])),
                Container(
                  width: 22, height: 22,
                  decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: sel ? color : AppColors.border, width: 2), color: sel ? color : Colors.transparent),
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
            onPressed: () => context.push('/interview-format'),
            child: const Row(mainAxisAlignment: MainAxisAlignment.center, children: [Text('Continue'), SizedBox(width: 8), Icon(Icons.chevron_right, size: 20)]),
          )),
      ),
    ])),
  );
}
