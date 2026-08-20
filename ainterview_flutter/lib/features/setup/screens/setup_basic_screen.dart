// lib/features/setup/screens/setup_basic_screen.dart
// Matches website SetupBasicInfo — white card, slate-50 bg, progress bar
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../auth/widgets/auth_text_field.dart';
import '../../auth/widgets/gradient_button.dart';

class SetupBasicScreen extends StatefulWidget {
  const SetupBasicScreen({super.key});
  @override State<SetupBasicScreen> createState() => _State();
}
class _State extends State<SetupBasicScreen> {
  final _nameCtrl = TextEditingController();
  final _locationCtrl = TextEditingController();
  @override void dispose() { _nameCtrl.dispose(); _locationCtrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: const Color(0xFFF8FAFC),
    body: SafeArea(child: Column(children: [
      // Progress header
      Container(
        color: Colors.white,
        padding: const EdgeInsets.all(20),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Text('Step 1 of 5', style: AppTextStyles.bodySm.copyWith(color: AppColors.textSecondary)),
            Text('20% completed', style: AppTextStyles.bodySm.copyWith(color: AppColors.textSecondary, fontWeight: FontWeight.w500)),
          ]),
          const SizedBox(height: 8),
          ClipRRect(borderRadius: BorderRadius.circular(4),
            child: const LinearProgressIndicator(value: 0.2, minHeight: 8, backgroundColor: Color(0xFFE2E8F0), color: AppColors.primary)),
        ]),
      ),
      Expanded(child: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppColors.border),
            boxShadow: const [BoxShadow(color: Color(0x08000000), blurRadius: 12, offset: Offset(0, 4))],
          ),
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            Text("Let's set up your profile", style: AppTextStyles.h3),
            const SizedBox(height: 4),
            Text('This helps us personalize your interview experience.', style: AppTextStyles.body.copyWith(color: AppColors.textSecondary)),
            const SizedBox(height: 28),
            // Profile avatar placeholder
            Center(child: Container(
              width: 80, height: 80,
              decoration: BoxDecoration(color: AppColors.indigoBg, shape: BoxShape.circle, border: Border.all(color: Colors.white, width: 3)),
              child: const Icon(Icons.person_outline, size: 40, color: AppColors.primary),
            )),
            const SizedBox(height: 24),
            AuthTextField(controller: _nameCtrl, label: 'Full Name', hint: 'Jane Doe'),
            const SizedBox(height: 16),
            AuthTextField(controller: _locationCtrl, label: 'Location (Optional)', hint: 'e.g. San Francisco, CA'),
          ]),
        ),
      )),
      Container(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 20),
        decoration: const BoxDecoration(color: Colors.white, border: Border(top: BorderSide(color: AppColors.border))),
        child: Row(mainAxisAlignment: MainAxisAlignment.end, children: [
          Expanded(child: GradientButton(label: 'Continue', onPressed: () => context.go('/setup-career'))),
        ]),
      ),
    ])),
  );
}
