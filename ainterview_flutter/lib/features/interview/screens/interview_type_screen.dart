// lib/features/interview/screens/interview_type_screen.dart
// Matches website InterviewType — white cards with border, step indicator, indigo selection
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';

class InterviewTypeScreen extends StatefulWidget {
  const InterviewTypeScreen({super.key});
  @override State<InterviewTypeScreen> createState() => _State();
}
class _State extends State<InterviewTypeScreen> {
  String _selected = 'behavioral';
  final _types = [
    {'id': 'behavioral', 'title': 'Behavioral', 'emoji': '🤝', 'desc': 'Leadership, conflict, failure, and teamwork. Answer with real stories using the STAR method.', 'tag': 'STAR Method • Culture Fit • Soft Skills'},
    {'id': 'technical', 'title': 'Technical', 'emoji': '💻', 'desc': 'Coding, algorithms, system design, and deep technical knowledge for engineering roles.', 'tag': 'Algorithms • System Design • Code'},
    {'id': 'hr', 'title': 'HR Round', 'emoji': '🎯', 'desc': 'Salary negotiation, culture fit, and motivation questions.', 'tag': 'HR Screening • Salary • Culture'},
    {'id': 'mixed', 'title': 'Mixed Interview', 'emoji': '⚡', 'desc': 'A combination of all interview types for comprehensive practice.', 'tag': 'All Types • Comprehensive'},
  ];

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: AppColors.bg,
    body: SafeArea(child: Column(children: [
      // Step header — matches website SetupContainer
      Container(
        color: AppColors.bgCard,
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            IconButton(icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.textPrimary, size: 20), onPressed: () => context.pop(), padding: EdgeInsets.zero, constraints: const BoxConstraints()),
            const SizedBox(width: 8),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Select Interview Type', style: AppTextStyles.h3),
              Text('Step 1 of 5 • What kind of interview do you want to practice?', style: AppTextStyles.bodySm.copyWith(color: AppColors.textSecondary)),
            ])),
          ]),
          const SizedBox(height: 12),
          // Progress bar — indigo-600 matching website
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: const LinearProgressIndicator(value: 0.2, minHeight: 8, backgroundColor: Color(0xFFE2E8F0), color: AppColors.primary),
          ),
        ]),
      ),
      // Cards list
      Expanded(child: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _types.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (_, i) {
          final t = _types[i]; final sel = _selected == t['id'];
          return GestureDetector(
            onTap: () => setState(() => _selected = t['id']!),
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
              child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Container(
                  width: 56, height: 56,
                  decoration: BoxDecoration(
                    color: sel ? AppColors.primary : AppColors.bgSurface,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Center(child: Text(t['emoji']!, style: const TextStyle(fontSize: 28))),
                ),
                const SizedBox(width: 16),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(t['title']!, style: AppTextStyles.h4.copyWith(color: sel ? AppColors.primary : AppColors.textPrimary)),
                  const SizedBox(height: 4),
                  Text(t['desc']!, style: AppTextStyles.bodySm.copyWith(color: AppColors.textSecondary)),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(color: AppColors.indigoBg, borderRadius: BorderRadius.circular(20)),
                    child: Text(t['tag']!, style: AppTextStyles.caption.copyWith(color: AppColors.primary, fontWeight: FontWeight.w600)),
                  ),
                ])),
                const SizedBox(width: 8),
                // Radio button — matches website
                Container(
                  width: 22, height: 22,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: sel ? AppColors.primary : AppColors.border, width: 2),
                    color: sel ? AppColors.primary : Colors.transparent,
                  ),
                  child: sel ? const Center(child: Icon(Icons.check, color: Colors.white, size: 13)) : null,
                ),
              ]),
            ),
          );
        },
      )),
      // Continue button
      Container(
        padding: const EdgeInsets.all(16),
        decoration: const BoxDecoration(
          color: AppColors.bgCard,
          border: Border(top: BorderSide(color: AppColors.border)),
        ),
        child: SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: () => context.push('/interview-role'),
            child: const Row(mainAxisAlignment: MainAxisAlignment.center, children: [
              Text('Continue'),
              SizedBox(width: 8),
              Icon(Icons.chevron_right, size: 20),
            ]),
          ),
        ),
      ),
    ])),
  );
}
