// lib/features/home/widgets/bottom_nav.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';

// Matches website NAV_ITEMS exactly: Home, Practice, Analytics, Community
class AppBottomNav extends StatelessWidget {
  final int currentIndex;
  const AppBottomNav({super.key, required this.currentIndex});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.bgCard.withOpacity(0.95),
        border: const Border(top: BorderSide(color: AppColors.border)),
        boxShadow: const [BoxShadow(color: Color(0x18000000), blurRadius: 20, offset: Offset(0, -4))],
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _NavItem(icon: Icons.home_outlined, activeIcon: Icons.home_rounded, label: 'Home', index: 0, current: currentIndex,
                gradient: const [Color(0xFF4F46E5), Color(0xFF7C3AED)],
                onTap: () => context.go('/dashboard')),
              _NavItem(icon: Icons.menu_book_outlined, activeIcon: Icons.menu_book_rounded, label: 'Practice', index: 1, current: currentIndex,
                gradient: const [Color(0xFF10B981), Color(0xFF0D9488)],
                onTap: () => context.go('/practice')),
              _NavItem(icon: Icons.bar_chart_outlined, activeIcon: Icons.bar_chart_rounded, label: 'Analytics', index: 2, current: currentIndex,
                gradient: const [Color(0xFFF59E0B), Color(0xFFEA580C)],
                onTap: () => context.go('/analytics')),
              _NavItem(icon: Icons.group_outlined, activeIcon: Icons.group_rounded, label: 'Community', index: 3, current: currentIndex,
                gradient: const [Color(0xFFF43F5E), Color(0xFFEC4899)],
                onTap: () => context.go('/community')),
            ],
          ),
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon, activeIcon;
  final String label;
  final int index, current;
  final List<Color> gradient;
  final VoidCallback onTap;
  const _NavItem({required this.icon, required this.activeIcon, required this.label, required this.index, required this.current, required this.gradient, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final active = index == current;
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            width: 36,
            height: 36,
            decoration: active ? BoxDecoration(
              gradient: LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: gradient),
              borderRadius: BorderRadius.circular(10),
              boxShadow: [BoxShadow(color: gradient[0].withOpacity(0.35), blurRadius: 8, offset: const Offset(0, 3))],
            ) : null,
            child: Center(child: Icon(
              active ? activeIcon : icon,
              color: active ? Colors.white : AppColors.textMuted,
              size: 20,
            )),
          ),
          const SizedBox(height: 4),
          Text(label, style: AppTextStyles.caption.copyWith(
            color: active ? AppColors.primary : AppColors.textMuted,
            fontWeight: active ? FontWeight.w700 : FontWeight.w500,
          )),
        ]),
      ),
    );
  }
}
