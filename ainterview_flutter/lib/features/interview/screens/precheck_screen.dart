// lib/features/interview/screens/precheck_screen.dart
// Matches website PreCheck — white card check items with status icons
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';

class PreCheckScreen extends StatefulWidget {
  const PreCheckScreen({super.key});
  @override State<PreCheckScreen> createState() => _State();
}
class _State extends State<PreCheckScreen> {
  bool _mic = false, _camera = false, _ready = false;

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: AppColors.bg,
    body: SafeArea(child: Column(children: [
      Container(
        color: AppColors.bgCard,
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            IconButton(icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.textPrimary, size: 20), onPressed: () => context.pop(), padding: EdgeInsets.zero, constraints: const BoxConstraints()),
            const SizedBox(width: 8),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('System Check', style: AppTextStyles.h3),
              Text("Step 5 of 5 • We'll check your camera, mic, and connection.", style: AppTextStyles.bodySm.copyWith(color: AppColors.textSecondary)),
            ])),
          ]),
          const SizedBox(height: 12),
          ClipRRect(borderRadius: BorderRadius.circular(4),
            child: const LinearProgressIndicator(value: 1.0, minHeight: 8, backgroundColor: Color(0xFFE2E8F0), color: AppColors.primary)),
        ]),
      ),
      Expanded(child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(children: [
          // Camera
          _CheckCard(
            icon: _camera ? Icons.videocam_rounded : Icons.videocam_off_rounded,
            title: 'Camera',
            subtitle: _camera ? '✅ Live — looking good!' : 'Not available or blocked (optional)',
            checked: _camera,
            isOptional: true,
            onTap: () => setState(() => _camera = !_camera),
          ),
          const SizedBox(height: 12),
          // Microphone
          _CheckCard(
            icon: Icons.mic_rounded,
            title: 'Microphone',
            subtitle: _mic ? 'Microphone detected' : 'Allow microphone access to continue',
            checked: _mic,
            isOptional: false,
            onTap: () => setState(() => _mic = !_mic),
          ),
          const SizedBox(height: 12),
          // Connection
          _CheckCard(
            icon: Icons.wifi_rounded,
            title: 'Connection',
            subtitle: 'Excellent connection',
            checked: true,
            isOptional: false,
            onTap: () {},
          ),
          const SizedBox(height: 20),
          // Status banner
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: _mic ? AppColors.emeraldBg : AppColors.amberBg,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: _mic ? const Color(0xFFD1FAE5) : const Color(0xFFFEF3C7)),
            ),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(
                _mic ? '✅ Ready to start!' : '⚠️ Microphone needed',
                style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w600, color: _mic ? const Color(0xFF065F46) : const Color(0xFF92400E)),
              ),
              const SizedBox(height: 4),
              Text(
                _camera ? 'Camera and mic detected. Your interview will include a live video preview.' : _mic ? 'Mic detected. Camera is optional — you can still do a full voice interview.' : 'Please allow microphone access in your browser to continue.',
                style: AppTextStyles.bodySm.copyWith(color: _mic ? const Color(0xFF059669) : const Color(0xFFB45309)),
              ),
            ]),
          ),
          const SizedBox(height: 20),
          // Ready switch
          Container(
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14), border: Border.all(color: AppColors.border)),
            child: SwitchListTile(
              value: _ready, onChanged: (v) => setState(() => _ready = v),
              title: Text("I'm ready to begin", style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w500)),
              activeColor: AppColors.primary,
            ),
          ),
        ]),
      )),
      Container(
        padding: const EdgeInsets.all(16),
        decoration: const BoxDecoration(color: AppColors.bgCard, border: Border(top: BorderSide(color: AppColors.border))),
        child: SizedBox(width: double.infinity,
          child: ElevatedButton(
            onPressed: _ready ? () => context.go('/live-text') : null,
            child: const Text('Start Interview'),
          )),
      ),
    ])),
  );
}

class _CheckCard extends StatelessWidget {
  final IconData icon;
  final String title, subtitle;
  final bool checked, isOptional;
  final VoidCallback onTap;
  const _CheckCard({required this.icon, required this.title, required this.subtitle, required this.checked, required this.isOptional, required this.onTap});

  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: onTap,
    child: Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
        boxShadow: const [BoxShadow(color: Color(0x06000000), blurRadius: 8, offset: Offset(0, 2))],
      ),
      child: Row(children: [
        Container(
          width: 40, height: 40,
          decoration: BoxDecoration(
            color: checked ? AppColors.emeraldBg : (isOptional ? AppColors.amberBg : AppColors.roseBg),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: checked ? AppColors.success : (isOptional ? AppColors.warning : AppColors.error), size: 20),
        ),
        const SizedBox(width: 14),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(title, style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w600)),
          Text(subtitle, style: AppTextStyles.bodySm.copyWith(color: AppColors.textSecondary)),
        ])),
        Icon(
          checked ? Icons.check_circle_rounded : Icons.error_outline_rounded,
          color: checked ? AppColors.success : (isOptional ? AppColors.warning : AppColors.error),
          size: 22,
        ),
      ]),
    ),
  );
}
