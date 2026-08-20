// lib/features/auth/widgets/gradient_button.dart
import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';

class GradientButton extends StatelessWidget {
  final String label;
  final bool loading;
  final VoidCallback? onPressed;
  final IconData? icon;

  const GradientButton({
    super.key,
    required this.label,
    this.loading = false,
    this.onPressed,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 52,
      decoration: BoxDecoration(
        gradient: onPressed == null
          ? LinearGradient(colors: [AppColors.primary.withOpacity(0.4), AppColors.violet.withOpacity(0.4)])
          : const LinearGradient(colors: [AppColors.primary, AppColors.violet],
              begin: Alignment.centerLeft, end: Alignment.centerRight),
        borderRadius: BorderRadius.circular(14),
        boxShadow: onPressed != null
          ? [BoxShadow(color: AppColors.primary.withOpacity(0.35), blurRadius: 16, offset: const Offset(0, 4))]
          : [],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onPressed,
          borderRadius: BorderRadius.circular(14),
          child: Center(
            child: loading
              ? const SizedBox(width: 20, height: 20,
                  child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
              : Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (icon != null) ...[Icon(icon, color: Colors.white, size: 18), const SizedBox(width: 8)],
                    Text(label, style: AppTextStyles.button),
                    const SizedBox(width: 6),
                    const Icon(Icons.arrow_forward, color: Colors.white, size: 16),
                  ],
                ),
          ),
        ),
      ),
    );
  }
}
