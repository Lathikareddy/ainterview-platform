// lib/features/live/screens/live_text_screen.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';

class LiveTextScreen extends StatefulWidget {
  const LiveTextScreen({super.key});
  @override State<LiveTextScreen> createState() => _State();
}
class _State extends State<LiveTextScreen> {
  final _ctrl = TextEditingController();
  int _qIndex = 0;
  final _questions = [
    'Tell me about yourself and your background.',
    'Why are you interested in this position?',
    'Describe a challenging project you worked on.',
    'How do you handle working under pressure?',
    'Where do you see yourself in 5 years?',
  ];
  final _answers = <String>[];

  void _submit() {
    if (_ctrl.text.trim().isEmpty) return;
    _answers.add(_ctrl.text.trim());
    _ctrl.clear();
    if (_qIndex < _questions.length - 1) {
      setState(() => _qIndex++);
    } else {
      context.go('/feedback-summary');
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: AppColors.bg,
    body: SafeArea(child: Column(children: [
      // Header
      Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        color: AppColors.bgCard,
        child: Row(children: [
          Container(width: 36, height: 36, decoration: BoxDecoration(color: AppColors.error.withOpacity(0.15), borderRadius: BorderRadius.circular(10)),
            child: const Center(child: Text('🔴', style: TextStyle(fontSize: 14)))),
          const SizedBox(width: 10),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('Live Interview', style: AppTextStyles.label.copyWith(color: AppColors.error)),
            Text('Question ${_qIndex + 1} of ${_questions.length}', style: AppTextStyles.bodySm.copyWith(color: AppColors.textSecondary)),
          ])),
          TextButton(onPressed: () => context.go('/feedback-summary'), child: Text('End', style: AppTextStyles.label.copyWith(color: AppColors.error))),
        ]),
      ),
      LinearProgressIndicator(value: (_qIndex + 1) / _questions.length, backgroundColor: AppColors.border, color: AppColors.primary, minHeight: 3),
      Expanded(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(color: AppColors.bgCard, borderRadius: BorderRadius.circular(20), border: Border.all(color: AppColors.primary.withOpacity(0.3))),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(children: [
                  Container(width: 32, height: 32, decoration: BoxDecoration(gradient: const LinearGradient(colors: [AppColors.primary, AppColors.violet]), borderRadius: BorderRadius.circular(10)),
                    child: const Center(child: Text('AI', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w800)))),
                  const SizedBox(width: 10),
                  Text('AInterview AI', style: AppTextStyles.label.copyWith(color: AppColors.primaryLight)),
                ]),
                const SizedBox(height: 12),
                Text(_questions[_qIndex], style: AppTextStyles.bodyLg),
              ]),
            ),
            if (_answers.isNotEmpty) ...[
              const SizedBox(height: 20),
              Text('Previous answers:', style: AppTextStyles.label),
              const SizedBox(height: 8),
              ..._answers.asMap().entries.map((e) => Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(color: AppColors.success.withOpacity(0.05), borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.success.withOpacity(0.2))),
                child: Text('Q${e.key + 1}: ${e.value}', style: AppTextStyles.bodySm.copyWith(color: AppColors.textSecondary)),
              )),
            ],
          ]),
        ),
      ),
      // Input area
      Container(
        padding: const EdgeInsets.all(16),
        decoration: const BoxDecoration(color: AppColors.bgCard, border: Border(top: BorderSide(color: AppColors.border))),
        child: Row(children: [
          Expanded(
            child: TextField(
              controller: _ctrl,
              style: AppTextStyles.body,
              maxLines: 4, minLines: 1,
              decoration: const InputDecoration(hintText: 'Type your answer...', border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12)))),
            ),
          ),
          const SizedBox(width: 10),
          GestureDetector(
            onTap: _submit,
            child: Container(
              width: 48, height: 48,
              decoration: BoxDecoration(gradient: const LinearGradient(colors: [AppColors.primary, AppColors.violet]), borderRadius: BorderRadius.circular(14),
                boxShadow: [BoxShadow(color: AppColors.primary.withOpacity(0.4), blurRadius: 12, offset: const Offset(0, 4))]),
              child: Icon(_qIndex < _questions.length - 1 ? Icons.send : Icons.done_all, color: Colors.white, size: 20),
            ),
          ),
        ]),
      ),
    ])),
  );
  @override void dispose() { _ctrl.dispose(); super.dispose(); }
}
