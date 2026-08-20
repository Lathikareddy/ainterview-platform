// lib/features/setup/screens/setup_career_screen.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../auth/widgets/gradient_button.dart';

class SetupCareerScreen extends StatefulWidget {
  const SetupCareerScreen({super.key});
  @override State<SetupCareerScreen> createState() => _State();
}
class _State extends State<SetupCareerScreen> {
  String? _goal;
  final _goals = ['Get a new job', 'Prepare for promotion', 'Practice regularly', 'Switch career fields'];
  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: const Color(0xFFF8FAFC),
    body: SafeArea(child: Padding(padding: const EdgeInsets.all(20), child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      const SizedBox(height: 8),
      Text('Career Goal', style: AppTextStyles.h2),
      const SizedBox(height: 4),
      Text('What do you want to achieve?', style: AppTextStyles.body.copyWith(color: AppColors.textSecondary)),
      const SizedBox(height: 24),
      ..._goals.map((g) => GestureDetector(onTap: () => setState(() => _goal = g), child: AnimatedContainer(duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: _goal == g ? AppColors.indigoBg : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: _goal == g ? AppColors.primary : AppColors.border, width: _goal == g ? 2 : 1),
          boxShadow: [const BoxShadow(color: Color(0x06000000), blurRadius: 8, offset: Offset(0, 2))],
        ),
        child: Row(children: [
          Expanded(child: Text(g, style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w500))),
          if (_goal == g) const Icon(Icons.check_circle, color: AppColors.primary, size: 20),
        ]),
      ))),
      const Spacer(),
      GradientButton(label: 'Continue', onPressed: _goal != null ? () => context.go('/setup-experience') : null),
    ]))),
  );
}
