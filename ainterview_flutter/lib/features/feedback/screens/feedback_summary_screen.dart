// lib/features/feedback/screens/feedback_summary_screen.dart
// Matches website InterviewFeedback — white/light bg, score card, metrics grid
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';

class FeedbackSummaryScreen extends StatelessWidget {
  const FeedbackSummaryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final metrics = [
      {'label': 'Overall Score', 'value': '78%', 'color': AppColors.primary, 'icon': Icons.star_rounded, 'bg': AppColors.indigoBg},
      {'label': 'Confidence', 'value': '82%', 'color': AppColors.success, 'icon': Icons.psychology_outlined, 'bg': AppColors.emeraldBg},
      {'label': 'Clarity', 'value': '75%', 'color': AppColors.info, 'icon': Icons.record_voice_over_outlined, 'bg': const Color(0xFFEFF6FF)},
      {'label': 'Relevance', 'value': '80%', 'color': AppColors.warning, 'icon': Icons.check_circle_outline, 'bg': AppColors.amberBg},
    ];

    return Scaffold(
      backgroundColor: AppColors.bg,
      body: SafeArea(child: Column(children: [
        // Header — matches website congratulations card style
        Container(
          color: AppColors.bgCard,
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
          child: Column(children: [
            // Celebration icon
            Container(
              width: 72, height: 72,
              decoration: BoxDecoration(
                gradient: AppColors.gradientPrimary,
                shape: BoxShape.circle,
                boxShadow: [BoxShadow(color: AppColors.primary.withOpacity(0.3), blurRadius: 20)],
              ),
              child: const Center(child: Text('🎉', style: TextStyle(fontSize: 36))),
            ),
            const SizedBox(height: 16),
            Text('Interview Complete!', style: AppTextStyles.h2),
            const SizedBox(height: 4),
            Text("Great job! Here's your performance summary.", style: AppTextStyles.body.copyWith(color: AppColors.textSecondary), textAlign: TextAlign.center),
          ]),
        ),

        Expanded(child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            // Score ring card — white card matching website
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.border),
                boxShadow: const [BoxShadow(color: Color(0x08000000), blurRadius: 12, offset: Offset(0, 4))],
              ),
              child: Column(children: [
                Stack(alignment: Alignment.center, children: [
                  SizedBox(
                    width: 120, height: 120,
                    child: CircularProgressIndicator(
                      value: 0.78,
                      strokeWidth: 10,
                      backgroundColor: AppColors.bgSurface,
                      color: AppColors.primary,
                      strokeCap: StrokeCap.round,
                    ),
                  ),
                  Column(mainAxisSize: MainAxisSize.min, children: [
                    Text('78', style: AppTextStyles.h1.copyWith(color: AppColors.primary)),
                    Text('/ 100', style: AppTextStyles.bodySm.copyWith(color: AppColors.textSecondary)),
                  ]),
                ]),
                const SizedBox(height: 16),
                Text('Above Average Performance', style: AppTextStyles.h4),
                const SizedBox(height: 4),
                Text('You performed better than 65% of candidates in this category.', style: AppTextStyles.bodySm.copyWith(color: AppColors.textSecondary), textAlign: TextAlign.center),
              ]),
            ),
            const SizedBox(height: 16),

            // Metrics 2x2 grid — white cards with colored tops
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 1.3,
              children: metrics.map((m) => Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.border),
                  boxShadow: const [BoxShadow(color: Color(0x06000000), blurRadius: 8, offset: Offset(0, 2))],
                ),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Container(
                    width: 32, height: 32,
                    decoration: BoxDecoration(color: m['bg'] as Color, borderRadius: BorderRadius.circular(8)),
                    child: Icon(m['icon'] as IconData, color: m['color'] as Color, size: 18),
                  ),
                  const Spacer(),
                  Text(m['value'] as String, style: AppTextStyles.h3.copyWith(color: m['color'] as Color)),
                  Text(m['label'] as String, style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary)),
                ]),
              )).toList(),
            ),
            const SizedBox(height: 16),

            // Strengths card
            _Section(
              title: '✅ Strengths',
              color: AppColors.success,
              bg: AppColors.emeraldBg,
              borderColor: const Color(0xFFD1FAE5),
              items: ['Clear communication style', 'Good use of concrete examples', 'Confident delivery'],
            ),
            const SizedBox(height: 12),

            // Improve On card
            _Section(
              title: '🎯 Areas to Improve',
              color: AppColors.warning,
              bg: AppColors.amberBg,
              borderColor: const Color(0xFFFEF3C7),
              items: ['Be more concise in answers', 'Use more industry terminology', 'Address all parts of the question'],
            ),
            const SizedBox(height: 24),
          ]),
        )),

        // Bottom buttons — white bar
        Container(
          padding: const EdgeInsets.all(16),
          decoration: const BoxDecoration(
            color: AppColors.bgCard,
            border: Border(top: BorderSide(color: AppColors.border)),
          ),
          child: Row(children: [
            Expanded(child: OutlinedButton(
              onPressed: () => context.go('/dashboard'),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.textPrimary,
                side: const BorderSide(color: AppColors.border),
                minimumSize: const Size.fromHeight(52),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              child: const Text('Dashboard'),
            )),
            const SizedBox(width: 12),
            Expanded(child: ElevatedButton(
              onPressed: () => context.go('/interview-type'),
              child: const Text('Try Again'),
            )),
          ]),
        ),
      ])),
    );
  }
}

class _Section extends StatelessWidget {
  final String title;
  final List<String> items;
  final Color color, bg, borderColor;
  const _Section({required this.title, required this.items, required this.color, required this.bg, required this.borderColor});

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
      color: bg,
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: borderColor),
    ),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(title, style: AppTextStyles.h4.copyWith(color: AppColors.textPrimary)),
      const SizedBox(height: 10),
      ...items.map((i) => Padding(
        padding: const EdgeInsets.only(bottom: 8),
        child: Row(children: [
          Icon(Icons.check_circle_rounded, size: 16, color: color),
          const SizedBox(width: 8),
          Expanded(child: Text(i, style: AppTextStyles.body.copyWith(color: AppColors.textSecondary))),
        ]),
      )),
    ]),
  );
}
