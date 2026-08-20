// lib/features/settings/screens/settings_screen.dart
// Matches website Settings — white/slate background, profile card, settings tiles
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../../features/auth/providers/auth_provider.dart';
import '../../../core/theme/app_theme.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final name = auth.displayName;
    final email = auth.email;
    final initials = name.isNotEmpty
      ? name.trim().split(' ').map((n) => n.isNotEmpty ? n[0] : '').take(2).join().toUpperCase()
      : 'A';

    return Scaffold(
      backgroundColor: AppColors.bg,
      body: CustomScrollView(slivers: [
        SliverAppBar(
          backgroundColor: AppColors.bgCard,
          pinned: true,
          surfaceTintColor: Colors.transparent,
          elevation: 0,
          bottom: PreferredSize(preferredSize: const Size.fromHeight(1), child: Container(height: 1, color: AppColors.border)),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.textPrimary, size: 20),
            onPressed: () => context.pop(),
          ),
          title: Text('Settings', style: AppTextStyles.h3),
        ),
        SliverToBoxAdapter(child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            // Profile card — matches website sidebar user card (gradient indigo/violet)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                  colors: [Color(0xFFEEF2FF), Color(0xFFF5F3FF)], // indigo-50 to violet-50
                ),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFE0E7FF)), // indigo-100
              ),
              child: Row(children: [
                Container(
                  width: 48, height: 48,
                  decoration: BoxDecoration(
                    gradient: AppColors.gradientPrimary,
                    shape: BoxShape.circle,
                    boxShadow: [BoxShadow(color: AppColors.primary.withOpacity(0.3), blurRadius: 8, offset: const Offset(0, 2))],
                  ),
                  child: auth.photoUrl != null
                    ? ClipOval(child: Image.network(auth.photoUrl!, fit: BoxFit.cover))
                    : Center(child: Text(initials, style: const TextStyle(fontFamily: 'Inter', color: Colors.white, fontSize: 16, fontWeight: FontWeight.w700))),
                ),
                const SizedBox(width: 12),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(name, style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                  Text(email.isNotEmpty ? email : 'Signed in', style: AppTextStyles.caption.copyWith(color: AppColors.textMuted)),
                ])),
              ]),
            ),
            const SizedBox(height: 24),

            // Settings group — white card
            _group([
              _tile(context, Icons.notifications_outlined, 'Notifications', () {}),
              _tile(context, Icons.language_outlined, 'Language', () {}),
              _tile(context, Icons.privacy_tip_outlined, 'Privacy Policy', () {}),
              _tile(context, Icons.help_outline, 'Help & Support', () {}),
            ]),
            const SizedBox(height: 16),

            // Sign out — rose colored
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.border),
              ),
              child: ListTile(
                leading: Container(
                  width: 36, height: 36,
                  decoration: BoxDecoration(color: AppColors.roseBg, borderRadius: BorderRadius.circular(10)),
                  child: const Icon(Icons.logout, color: AppColors.error, size: 18),
                ),
                title: Text('Sign Out', style: AppTextStyles.body.copyWith(color: AppColors.error, fontWeight: FontWeight.w600)),
                trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: AppColors.textMuted),
                onTap: () async {
                  await auth.signOut();
                  if (context.mounted) context.go('/login');
                },
              ),
            ),
          ]),
        )),
      ]),
    );
  }

  Widget _group(List<Widget> items) => Container(
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: AppColors.border),
      boxShadow: const [BoxShadow(color: Color(0x06000000), blurRadius: 8, offset: Offset(0, 2))],
    ),
    child: Column(children: items),
  );

  Widget _tile(BuildContext context, IconData icon, String title, VoidCallback onTap) => ListTile(
    leading: Container(
      width: 36, height: 36,
      decoration: BoxDecoration(color: AppColors.bgSurface, borderRadius: BorderRadius.circular(10)),
      child: Icon(icon, color: AppColors.textSecondary, size: 18),
    ),
    title: Text(title, style: AppTextStyles.body),
    trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: AppColors.textMuted),
    onTap: onTap,
  );
}
