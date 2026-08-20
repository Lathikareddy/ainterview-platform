// lib/features/auth/screens/signup_screen.dart
// Matches website SignUp — bg-slate-50, white card, same form layout
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../widgets/auth_text_field.dart';
import '../widgets/google_button.dart';
import '../widgets/gradient_button.dart';

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});
  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final _form = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  final _confirmCtrl = TextEditingController();
  bool _loading = false;
  bool _showPass = false;
  String? _error;

  @override
  void dispose() {
    _nameCtrl.dispose(); _emailCtrl.dispose(); _passCtrl.dispose(); _confirmCtrl.dispose();
    super.dispose();
  }

  Future<void> _register() async {
    if (!_form.currentState!.validate()) return;
    if (_passCtrl.text != _confirmCtrl.text) {
      setState(() => _error = 'Passwords do not match.');
      return;
    }
    setState(() { _loading = true; _error = null; });
    final auth = context.read<AuthProvider>();
    final result = await auth.registerWithEmail(_emailCtrl.text.trim(), _passCtrl.text, _nameCtrl.text.trim());
    if (mounted && !result.success) setState(() { _error = result.error; _loading = false; });
  }

  Future<void> _googleSignIn() async {
    setState(() { _loading = true; _error = null; });
    final result = await context.read<AuthProvider>().signInWithGoogle();
    if (mounted && !result.success) setState(() { _error = result.error; _loading = false; });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC), // slate-50
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Form(
            key: _form,
            child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
              const SizedBox(height: 24),
              // Header
              Center(child: Column(children: [
                Text('Create your account', style: AppTextStyles.h2.copyWith(color: AppColors.textPrimary)),
                const SizedBox(height: 4),
                Row(mainAxisSize: MainAxisSize.min, children: [
                  Text('Already have an account? ', style: AppTextStyles.body.copyWith(color: AppColors.textSecondary)),
                  GestureDetector(
                    onTap: () => context.go('/login'),
                    child: Text('Sign in', style: AppTextStyles.body.copyWith(color: AppColors.primary, fontWeight: FontWeight.w600)),
                  ),
                ]),
              ])),
              const SizedBox(height: 32),

              // White card
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.border),
                  boxShadow: const [BoxShadow(color: Color(0x08000000), blurRadius: 12, offset: Offset(0, 4))],
                ),
                child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
                  if (_error != null) ...[
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(color: AppColors.error.withOpacity(0.08), borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.error.withOpacity(0.3))),
                      child: Text(_error!, style: AppTextStyles.bodySm.copyWith(color: AppColors.error)),
                    ),
                    const SizedBox(height: 16),
                  ],
                  GoogleSignInButton(onPressed: _loading ? null : _googleSignIn, loading: _loading),
                  const SizedBox(height: 20),
                  Row(children: [
                    const Expanded(child: Divider()),
                    Padding(padding: const EdgeInsets.symmetric(horizontal: 12), child: Text('or', style: AppTextStyles.caption.copyWith(color: AppColors.textMuted))),
                    const Expanded(child: Divider()),
                  ]),
                  const SizedBox(height: 20),
                  AuthTextField(controller: _nameCtrl, label: 'Full name', hint: 'Alex Chen', validator: (v) => (v?.isEmpty ?? true) ? 'Name is required' : null),
                  const SizedBox(height: 14),
                  AuthTextField(controller: _emailCtrl, label: 'Email address', hint: 'you@example.com', keyboardType: TextInputType.emailAddress, validator: (v) => (v?.isEmpty ?? true) ? 'Email is required' : null),
                  const SizedBox(height: 14),
                  AuthTextField(
                    controller: _passCtrl, label: 'Password', hint: '••••••••',
                    obscure: !_showPass,
                    suffix: IconButton(icon: Icon(!_showPass ? Icons.visibility_outlined : Icons.visibility_off_outlined, color: AppColors.textMuted, size: 20), onPressed: () => setState(() => _showPass = !_showPass)),
                    validator: (v) => (v?.length ?? 0) < 6 ? 'Min 6 characters' : null,
                  ),
                  const SizedBox(height: 24),
                  GradientButton(label: 'Create account', loading: _loading, onPressed: _loading ? null : _register),
                ]),
              ),
            ]),
          ),
        ),
      ),
    );
  }
}
