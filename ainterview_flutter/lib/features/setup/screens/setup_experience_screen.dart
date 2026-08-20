// lib/features/setup/screens/setup_experience_screen.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../auth/widgets/gradient_button.dart';

class SetupExperienceScreen extends StatefulWidget {
  const SetupExperienceScreen({super.key});
  @override State<SetupExperienceScreen> createState() => _State();
}
class _State extends State<SetupExperienceScreen> {
  String? _exp;
  final _levels = [
    {'id': 'fresher', 'label': 'Fresher', 'sub': '0 years • Just starting out'},
    {'id': 'junior', 'label': 'Junior', 'sub': '1–2 years experience'},
    {'id': 'mid', 'label': 'Mid-level', 'sub': '3–5 years experience'},
    {'id': 'senior', 'label': 'Senior', 'sub': '6–10 years experience'},
    {'id': 'lead', 'label': 'Lead / Principal', 'sub': '10+ years experience'},
  ];
  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: const Color(0xFFF8FAFC),
    body: SafeArea(child: Padding(padding: const EdgeInsets.all(20), child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      const SizedBox(height: 8),
      Text('Experience Level', style: AppTextStyles.h2),
      const SizedBox(height: 4),
      Text('This helps us tailor questions for you', style: AppTextStyles.body.copyWith(color: AppColors.textSecondary)),
      const SizedBox(height: 24),
      ..._levels.map((l) => GestureDetector(onTap: () => setState(() => _exp = l['id']), child: AnimatedContainer(duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: _exp == l['id'] ? AppColors.indigoBg : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: _exp == l['id'] ? AppColors.primary : AppColors.border, width: _exp == l['id'] ? 2 : 1),
          boxShadow: [const BoxShadow(color: Color(0x06000000), blurRadius: 8, offset: Offset(0, 2))],
        ),
        child: Row(children: [
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(l['label']!, style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w600)),
            Text(l['sub']!, style: AppTextStyles.bodySm.copyWith(color: AppColors.textSecondary)),
          ])),
          if (_exp == l['id']) const Icon(Icons.check_circle, color: AppColors.primary, size: 20),
        ]),
      ))),
      const Spacer(),
      GradientButton(label: 'Continue', onPressed: _exp != null ? () => context.go('/setup-skills') : null),
    ]))),
  );
}
