// lib/features/home/screens/notifications_screen.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final notifs = [
      {'icon': '🎯', 'title': 'Daily Practice Reminder', 'body': 'You have not practiced today. Stay consistent!', 'time': '2h ago', 'read': false},
      {'icon': '📈', 'title': 'Score Improved!', 'body': 'Your avg score went up 5% this week.', 'time': '1d ago', 'read': false},
      {'icon': '🏆', 'title': 'New Achievement', 'body': 'You earned "5-Day Streak" badge.', 'time': '2d ago', 'read': true},
      {'icon': '🤝', 'title': 'Mentor Available', 'body': 'A mentor is available for a session now.', 'time': '3d ago', 'read': true},
    ];
    return Scaffold(
      backgroundColor: AppColors.bg,
      appBar: AppBar(backgroundColor: AppColors.bgCard, title: Text('Notifications', style: AppTextStyles.h3),
        leading: IconButton(icon: const Icon(Icons.arrow_back_ios_new, size: 20), onPressed: () => context.pop())),
      body: ListView.separated(
        padding: const EdgeInsets.all(20),
        itemCount: notifs.length,
        separatorBuilder: (_, __) => const SizedBox(height: 8),
        itemBuilder: (_, i) {
          final n = notifs[i];
          return Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: n['read'] as bool ? AppColors.bgCard : AppColors.primary.withOpacity(0.07),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: n['read'] as bool ? AppColors.border : AppColors.primary.withOpacity(0.25)),
            ),
            child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(n['icon'] as String, style: const TextStyle(fontSize: 24)),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(n['title'] as String, style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w600)),
                const SizedBox(height: 2),
                Text(n['body'] as String, style: AppTextStyles.bodySm.copyWith(color: AppColors.textSecondary)),
              ])),
              Text(n['time'] as String, style: AppTextStyles.caption.copyWith(color: AppColors.textMuted)),
            ]),
          );
        },
      ),
    );
  }
}
