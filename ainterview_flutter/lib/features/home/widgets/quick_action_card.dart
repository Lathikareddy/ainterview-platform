// lib/features/home/widgets/quick_action_card.dart
import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';

class QuickActionCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;
  const QuickActionCard({super.key, required this.icon, required this.label, required this.color, required this.onTap});

  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: onTap,
    child: Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.bgCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(children: [
        Container(
          width: 40, height: 40,
          decoration: BoxDecoration(color: color.withOpacity(0.15), borderRadius: BorderRadius.circular(12)),
          child: Icon(icon, color: color, size: 20),
        ),
        const SizedBox(width: 10),
        Expanded(child: Text(label, style: AppTextStyles.bodySm.copyWith(fontWeight: FontWeight.w600))),
        Icon(Icons.arrow_forward_ios, color: AppColors.textMuted, size: 12),
      ]),
    ),
  );
}
