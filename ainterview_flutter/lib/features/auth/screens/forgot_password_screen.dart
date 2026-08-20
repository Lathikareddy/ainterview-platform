// lib/features/auth/screens/forgot_password_screen.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../widgets/auth_text_field.dart';
import '../widgets/gradient_button.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});
  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _emailCtrl = TextEditingController();
  bool _loading = false;
  bool _sent = false;
  String? _error;

  Future<void> _send() async {
    if (_emailCtrl.text.trim().isEmpty) { setState(() => _error = 'Please enter your email'); return; }
    setState(() { _loading = true; _error = null; });
    final result = await context.read<AuthProvider>().resetPassword(_emailCtrl.text.trim());
    if (mounted) setState(() { _loading = false; _sent = result.success; _error = result.error; });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            IconButton(icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.textPrimary, size: 20), onPressed: () => context.pop(), alignment: Alignment.centerLeft),
            const SizedBox(height: 32),
            Container(width: 64, height: 64, decoration: BoxDecoration(color: AppColors.indigoBg, shape: BoxShape.circle), child: const Center(child: Icon(Icons.lock_reset_outlined, color: AppColors.primary, size: 32))),
            const SizedBox(height: 20),
            Text('Reset password', style: AppTextStyles.h2, textAlign: TextAlign.center),
            const SizedBox(height: 8),
            Text("Enter your email and we'll send you a reset link.", style: AppTextStyles.body.copyWith(color: AppColors.textSecondary), textAlign: TextAlign.center),
            const SizedBox(height: 32),
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: AppColors.border),
                boxShadow: const [BoxShadow(color: Color(0x08000000), blurRadius: 12, offset: Offset(0, 4))]),
              child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
                if (_sent)
                  Column(children: [
                    const Icon(Icons.check_circle_outline, color: AppColors.success, size: 40),
                    const SizedBox(height: 8),
                    Text('Reset email sent!', style: AppTextStyles.h4.copyWith(color: AppColors.success)),
                    const SizedBox(height: 4),
                    Text('Check your inbox and follow the instructions.', style: AppTextStyles.bodySm.copyWith(color: AppColors.textSecondary), textAlign: TextAlign.center),
                  ])
                else ...[
                  if (_error != null) ...[
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(color: AppColors.error.withOpacity(0.08), borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.error.withOpacity(0.3))),
                      child: Text(_error!, style: AppTextStyles.bodySm.copyWith(color: AppColors.error)),
                    ),
                    const SizedBox(height: 16),
                  ],
                  AuthTextField(controller: _emailCtrl, label: 'Email address', hint: 'you@example.com', keyboardType: TextInputType.emailAddress),
                  const SizedBox(height: 24),
                  GradientButton(label: 'Send reset link', loading: _loading, onPressed: _loading ? null : _send),
                ],
              ]),
            ),
            const SizedBox(height: 16),
            TextButton(onPressed: () => context.go('/login'), child: Text('Back to sign in', style: AppTextStyles.body.copyWith(color: AppColors.primary))),
          ]),
        ),
      ),
    );
  }

  @override
  void dispose() { _emailCtrl.dispose(); super.dispose(); }
}
