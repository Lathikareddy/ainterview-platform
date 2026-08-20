// lib/features/setup/screens/setup_skills_screen.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../../features/auth/providers/auth_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../auth/widgets/gradient_button.dart';

class SetupSkillsScreen extends StatefulWidget {
  const SetupSkillsScreen({super.key});
  @override State<SetupSkillsScreen> createState() => _State();
}
class _State extends State<SetupSkillsScreen> {
  final _skills = {'Flutter', 'React', 'Python', 'Node.js', 'SQL', 'Machine Learning', 'Product Management', 'UI/UX', 'DevOps', 'Java', 'Swift', 'Leadership'};
  final _selected = <String>{};
  bool _loading = false;

  Future<void> _complete() async {
    if (_selected.isEmpty) return;
    setState(() => _loading = true);
    await context.read<AuthProvider>().completeSetup({'skills': _selected.toList()});
    if (mounted) context.go('/dashboard');
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: const Color(0xFFF8FAFC),
    body: SafeArea(child: Padding(padding: const EdgeInsets.all(20), child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      const SizedBox(height: 8),
      Text('Your Skills', style: AppTextStyles.h2),
      const SizedBox(height: 4),
      Text('Select skills relevant to your role', style: AppTextStyles.body.copyWith(color: AppColors.textSecondary)),
      const SizedBox(height: 24),
      Expanded(child: SingleChildScrollView(child: Wrap(spacing: 10, runSpacing: 10, children: _skills.map((s) {
        final sel = _selected.contains(s);
        return GestureDetector(onTap: () => setState(() => sel ? _selected.remove(s) : _selected.add(s)), child: AnimatedContainer(duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          decoration: BoxDecoration(
            color: sel ? AppColors.primary : Colors.white,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: sel ? AppColors.primary : AppColors.border, width: sel ? 2 : 1),
            boxShadow: sel ? [BoxShadow(color: AppColors.primary.withOpacity(0.2), blurRadius: 6, offset: const Offset(0, 2))] : [const BoxShadow(color: Color(0x06000000), blurRadius: 4, offset: Offset(0, 1))],
          ),
          child: Text(s, style: AppTextStyles.bodySm.copyWith(color: sel ? Colors.white : AppColors.textSecondary, fontWeight: sel ? FontWeight.w600 : FontWeight.w400))));
      }).toList()))),
      const SizedBox(height: 16),
      Text('${_selected.length} selected', style: AppTextStyles.bodySm.copyWith(color: AppColors.textSecondary), textAlign: TextAlign.center),
      const SizedBox(height: 12),
      GradientButton(label: 'Complete Setup', loading: _loading, onPressed: _selected.isNotEmpty && !_loading ? _complete : null),
    ]))),
  );
}
