// lib/features/auth/widgets/google_button.dart
import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';

class GoogleSignInButton extends StatelessWidget {
  final VoidCallback? onPressed;
  final bool loading;
  const GoogleSignInButton({super.key, this.onPressed, this.loading = false});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        onTap: onPressed,
        borderRadius: BorderRadius.circular(14),
        child: Container(
          height: 52,
          decoration: BoxDecoration(borderRadius: BorderRadius.circular(14)),
          child: loading
            ? const Center(child: SizedBox(width: 20, height: 20,
                child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary)))
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Google logo SVG colors
                  _GoogleLogo(),
                  const SizedBox(width: 10),
                  const Text('Continue with Google',
                    style: TextStyle(fontFamily: 'Inter', color: Color(0xFF1F1F1F),
                      fontSize: 15, fontWeight: FontWeight.w600)),
                ],
              ),
        ),
      ),
    );
  }
}

class _GoogleLogo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 20, height: 20,
      child: CustomPaint(painter: _GoogleLogoPainter()),
    );
  }
}

class _GoogleLogoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final cx = size.width / 2;
    final cy = size.height / 2;
    final r = size.width / 2;
    // Simplified colored arc segments
    final paints = [
      Paint()..color = const Color(0xFF4285F4),
      Paint()..color = const Color(0xFF34A853),
      Paint()..color = const Color(0xFFFBBC05),
      Paint()..color = const Color(0xFFEA4335),
    ];
    const angles = [0.0, 1.57, 3.14, 4.71];
    for (int i = 0; i < 4; i++) {
      canvas.drawArc(
        Rect.fromCircle(center: Offset(cx, cy), radius: r),
        angles[i], 1.57, true, paints[i],
      );
    }
    // White center
    canvas.drawCircle(Offset(cx, cy), r * 0.55, Paint()..color = Colors.white);
  }
  @override
  bool shouldRepaint(_) => false;
}
