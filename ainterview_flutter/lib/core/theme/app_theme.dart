// lib/core/theme/app_theme.dart
import 'package:flutter/material.dart';

class AppColors {
  // Backgrounds — sleek dark mode
  static const bg = Color(0xFF0A0A0F);
  static const bgCard = Color(0xFF12121A);
  static const bgSurface = Color(0xFF1A1A26);

  // Brand
  static const primary = Color(0xFF6366F1); // indigo
  static const primaryLight = Color(0xFF818CF8);
  static const violet = Color(0xFF7C3AED);
  static const indigo = Color(0xFF4F46E5);

  // Text
  static const textPrimary = Color(0xFFF8FAFC);
  static const textSecondary = Color(0xFF94A3B8);
  static const textMuted = Color(0xFF64748B);

  // Status
  static const success = Color(0xFF10B981);
  static const warning = Color(0xFFF59E0B);
  static const error = Color(0xFFEF4444);
  static const info = Color(0xFF3B82F6);

  // Borders
  static const border = Color(0xFF2E2E3E);
  static const borderFocus = Color(0xFF6366F1);

  // Gradients
  static const gradientPrimary = LinearGradient(
    colors: [Color(0xFF6366F1), Color(0xFF7C3AED)],
  );
  static const gradientBg = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [Color(0xFF0A0A0F), Color(0xFF12121A)],
  );
  static const gradientBanner = LinearGradient(
    colors: [Color(0xFF4F46E5), Color(0xFF7C3AED), Color(0xFF6D28D9)],
  );

  // Semantic backgrounds
  static const indigoBg = Color(0x1F6366F1);
  static const emeraldBg = Color(0x1F10B981);
  static const amberBg = Color(0x1FF59E0B);
  static const roseBg = Color(0x1FEF4444);
  static const shadow = Color(0x40000000);
}

class AppTextStyles {
  static const _base = TextStyle(fontFamily: 'Inter', color: AppColors.textPrimary);

  static final h1 = _base.copyWith(fontSize: 28, fontWeight: FontWeight.w800, letterSpacing: -0.5);
  static final h2 = _base.copyWith(fontSize: 22, fontWeight: FontWeight.w700, letterSpacing: -0.3);
  static final h3 = _base.copyWith(fontSize: 18, fontWeight: FontWeight.w700, letterSpacing: -0.2);
  static final h4 = _base.copyWith(fontSize: 16, fontWeight: FontWeight.w600);
  static final bodyLg = _base.copyWith(fontSize: 16, fontWeight: FontWeight.w400, height: 1.6);
  static final body = _base.copyWith(fontSize: 14, fontWeight: FontWeight.w400, height: 1.5);
  static final bodySm = _base.copyWith(fontSize: 12, fontWeight: FontWeight.w400, height: 1.4);
  static final caption = _base.copyWith(fontSize: 11, fontWeight: FontWeight.w500, letterSpacing: 0.3);
  static final button = _base.copyWith(fontSize: 15, fontWeight: FontWeight.w600, letterSpacing: 0.1);
  static final label = _base.copyWith(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.textSecondary);
}

class AppTheme {
  static ThemeData get dark => ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: AppColors.bg,
    colorScheme: const ColorScheme.dark(
      primary: AppColors.primary,
      secondary: AppColors.violet,
      surface: AppColors.bgCard,
      onPrimary: Colors.white,
      onSecondary: Colors.white,
      onSurface: AppColors.textPrimary,
      error: AppColors.error,
    ),
    fontFamily: 'Inter',
    appBarTheme: const AppBarTheme(
      backgroundColor: AppColors.bg,
      elevation: 0,
      iconTheme: IconThemeData(color: AppColors.textPrimary),
      titleTextStyle: TextStyle(
        fontFamily: 'Inter',
        color: AppColors.textPrimary,
        fontSize: 18,
        fontWeight: FontWeight.w700,
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        minimumSize: const Size.fromHeight(52),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        textStyle: AppTextStyles.button,
        elevation: 0,
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: AppColors.bgCard,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: AppColors.border),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: AppColors.border),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
      ),
      hintStyle: AppTextStyles.body.copyWith(color: AppColors.textMuted),
      labelStyle: AppTextStyles.label,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
    ),
    dividerTheme: const DividerThemeData(color: AppColors.border, thickness: 1),
    cardTheme: CardTheme(
      color: AppColors.bgCard,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: AppColors.border),
      ),
    ),
  );

  static ThemeData get light => dark;
}
