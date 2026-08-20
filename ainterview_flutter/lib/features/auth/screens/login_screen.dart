// lib/features/auth/screens/login_screen.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../widgets/auth_text_field.dart';
import '../widgets/google_button.dart';
import '../widgets/gradient_button.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _form = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  bool _loading = false;
  bool _showPass = false;
  String? _error;

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passCtrl.dispose();
    super.dispose();
  }

  Future<void> _signIn() async {
    if (!_form.currentState!.validate()) return;
    setState(() { _loading = true; _error = null; });
    final auth = context.read<AuthProvider>();
    final result = await auth.signInWithEmail(_emailCtrl.text.trim(), _passCtrl.text);
    if (mounted && !result.success) {
      setState(() { _error = result.error; _loading = false; });
    }
  }

  Future<void> _googleSignIn() async {
    setState(() { _loading = true; _error = null; });
    final auth = context.read<AuthProvider>();
    final result = await auth.signInWithGoogle();
    if (mounted && !result.success) {
      setState(() { _error = result.error; _loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bg,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
          child: Form(
            key: _form,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 24),
                // Logo Header
                Center(
                  child: Column(children: [
                    Container(
                      width: 56, height: 56,
                      decoration: BoxDecoration(
                        gradient: AppColors.gradientPrimary,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: const [BoxShadow(color: AppColors.shadow, blurRadius: 16)],
                      ),
                      child: const Center(child: Text('A', style: TextStyle(fontFamily: 'Inter', color: Colors.white, fontSize: 28, fontWeight: FontWeight.w800))),
                    ),
                    const SizedBox(height: 16),
                    Text('Welcome back', style: AppTextStyles.h2),
                    const SizedBox(height: 4),
                    Text('Sign in to continue your AI interview prep', style: AppTextStyles.body.copyWith(color: AppColors.textSecondary)),
                  ]),
                ),
                const SizedBox(height: 32),

                // Form Container
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AppColors.bgCard,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      if (_error != null) ...[
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: AppColors.error.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.error.withOpacity(0.3)),
                          ),
                          child: Row(children: [
                            const Icon(Icons.error_outline, color: AppColors.error, size: 16),
                            const SizedBox(width: 8),
                            Expanded(child: Text(_error!, style: AppTextStyles.bodySm.copyWith(color: AppColors.error))),
                          ]),
                        ),
                        const SizedBox(height: 16),
                      ],

                      GoogleSignInButton(onPressed: _loading ? null : _googleSignIn, loading: _loading),
                      const SizedBox(height: 20),

                      Row(children: [
                        const Expanded(child: Divider()),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          child: Text('or', style: AppTextStyles.caption.copyWith(color: AppColors.textMuted)),
                        ),
                        const Expanded(child: Divider()),
                      ]),
                      const SizedBox(height: 20),

                      AuthTextField(
                        controller: _emailCtrl,
                        label: 'Email address',
                        hint: 'you@example.com',
                        keyboardType: TextInputType.emailAddress,
                        validator: (v) => (v?.isEmpty ?? true) ? 'Email is required' : null,
                      ),
                      const SizedBox(height: 14),

                      AuthTextField(
                        controller: _passCtrl,
                        label: 'Password',
                        hint: '••••••••',
                        obscure: !_showPass,
                        suffix: IconButton(
                          icon: Icon(
                            !_showPass ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                            color: AppColors.textMuted, size: 20,
                          ),
                          onPressed: () => setState(() => _showPass = !_showPass),
                        ),
                        validator: (v) => (v?.isEmpty ?? true) ? 'Password is required' : null,
                      ),

                      Align(
                        alignment: Alignment.centerRight,
                        child: TextButton(
                          onPressed: () => context.push('/forgot-password'),
                          child: Text('Forgot password?', style: AppTextStyles.bodySm.copyWith(color: AppColors.primary)),
                        ),
                      ),
                      const SizedBox(height: 12),

                      GradientButton(label: 'Sign in', loading: _loading, onPressed: _loading ? null : _signIn),
                      const SizedBox(height: 16),

                      Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                        Text("Don't have an account? ", style: AppTextStyles.bodySm.copyWith(color: AppColors.textSecondary)),
                        GestureDetector(
                          onTap: () => context.go('/signup'),
                          child: Text('Sign Up', style: AppTextStyles.bodySm.copyWith(color: AppColors.primary, fontWeight: FontWeight.w600)),
                        ),
                      ]),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
