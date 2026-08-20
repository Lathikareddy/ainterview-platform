// lib/features/interview/screens/interview_role_screen.dart
// Matches website InterviewRole — white card, job title input, company input
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';

class InterviewRoleScreen extends StatefulWidget {
  const InterviewRoleScreen({super.key});
  @override
  State<InterviewRoleScreen> createState() => _InterviewRoleScreenState();
}

class _InterviewRoleScreenState extends State<InterviewRoleScreen> {
  final _roleCtrl = TextEditingController(text: 'Frontend Engineer');
  final _companyCtrl = TextEditingController();
  final _jdCtrl = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
                Text('Target Role & Company', style: AppTextStyles.h3),
                Text('Step 2 of 5 • Customize the AI persona and question context.', style: AppTextStyles.bodySm.copyWith(color: AppColors.textSecondary)),
              ])),
            ]),
            const SizedBox(height: 12),
            ClipRRect(borderRadius: BorderRadius.circular(4),
              child: const LinearProgressIndicator(value: 0.4, minHeight: 8, backgroundColor: Color(0xFFE2E8F0), color: AppColors.primary)),
          ]),
        ),
        Expanded(child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(children: [
            // Job title card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.border),
                boxShadow: const [BoxShadow(color: Color(0x06000000), blurRadius: 8, offset: Offset(0, 2))],
              ),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Job Title', style: AppTextStyles.label),
                const SizedBox(height: 8),
                TextField(
                  controller: _roleCtrl,
                  style: AppTextStyles.body,
                  decoration: const InputDecoration(hintText: 'e.g. Frontend Engineer'),
                ),
                const SizedBox(height: 20),
                Text('Target Company (Optional)', style: AppTextStyles.label),
                const SizedBox(height: 8),
                TextField(
                  controller: _companyCtrl,
                  style: AppTextStyles.body,
                  decoration: const InputDecoration(hintText: 'e.g. Google, Stripe, Startup'),
                ),
                const SizedBox(height: 6),
                Text("We'll tailor the interview style to this company's known practices.", style: AppTextStyles.caption.copyWith(color: AppColors.textMuted)),
              ]),
            ),
            const SizedBox(height: 16),
            // JD card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.border),
                boxShadow: const [BoxShadow(color: Color(0x06000000), blurRadius: 8, offset: Offset(0, 2))],
              ),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Job Description (Optional)', style: AppTextStyles.label),
                const SizedBox(height: 8),
                TextField(
                  controller: _jdCtrl,
                  maxLines: 4,
                  style: AppTextStyles.body,
                  decoration: const InputDecoration(hintText: 'Paste the job description here for highly specific questions...'),
                ),
              ]),
            ),
          ]),
        )),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: const BoxDecoration(color: AppColors.bgCard, border: Border(top: BorderSide(color: AppColors.border))),
          child: SizedBox(width: double.infinity,
            child: ElevatedButton(
              onPressed: () => context.push('/interview-difficulty'),
              child: const Row(mainAxisAlignment: MainAxisAlignment.center, children: [Text('Continue'), SizedBox(width: 8), Icon(Icons.chevron_right, size: 20)]),
            )),
        ),
      ])),
    );
  }

  @override
  void dispose() { _roleCtrl.dispose(); _companyCtrl.dispose(); _jdCtrl.dispose(); super.dispose(); }
}
