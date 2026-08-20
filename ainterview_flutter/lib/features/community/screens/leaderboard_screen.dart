// lib/features/community/screens/leaderboard_screen.dart
// Matches website CommunityScreens — rose gradient header, leaderboard entries, white cards
import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../../home/widgets/bottom_nav.dart';

class LeaderboardScreen extends StatelessWidget {
  const LeaderboardScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final leaders = [
      {'name': 'Priya Sharma', 'score': 98, 'badge': '🥇', 'sessions': 45, 'isYou': false},
      {'name': 'Arjun Kumar', 'score': 95, 'badge': '🥈', 'sessions': 38, 'isYou': false},
      {'name': 'Sneha Patel', 'score': 92, 'badge': '🥉', 'sessions': 32, 'isYou': false},
      {'name': 'Rahul Verma', 'score': 89, 'badge': '4', 'sessions': 28, 'isYou': false},
      {'name': 'Ananya Singh', 'score': 87, 'badge': '5', 'sessions': 25, 'isYou': false},
      {'name': 'You', 'score': 78, 'badge': '12', 'sessions': 12, 'isYou': true},
    ];
    return Scaffold(
      backgroundColor: AppColors.bg,
      body: CustomScrollView(slivers: [
        // Rose gradient header — matches website community rose gradient
        SliverToBoxAdapter(child: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: [Color(0xFFF43F5E), Color(0xFFEC4899)],
            ),
          ),
          child: SafeArea(bottom: false, child: Stack(children: [
            Positioned(top: 0, right: 0,
              child: Container(
                width: 160, height: 160,
                decoration: BoxDecoration(color: Colors.white.withOpacity(0.05), shape: BoxShape.circle),
                transform: Matrix4.translationValues(50, -50, 0),
              ),
            ),
            Padding(padding: const EdgeInsets.fromLTRB(20, 20, 20, 28), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('🏆 Community', style: AppTextStyles.h2.copyWith(color: Colors.white, fontWeight: FontWeight.w800)),
              const SizedBox(height: 4),
              Text('Top performers this week — see how you stack up.', style: AppTextStyles.body.copyWith(color: const Color(0xFFFFE4E6))),
              const SizedBox(height: 20),
              // Top 3 podium
              Row(crossAxisAlignment: CrossAxisAlignment.end, mainAxisAlignment: MainAxisAlignment.center, children: [
                _Podium(name: leaders[1]['name'] as String, score: leaders[1]['score'] as int, badge: '🥈', barHeight: 80),
                const SizedBox(width: 8),
                _Podium(name: leaders[0]['name'] as String, score: leaders[0]['score'] as int, badge: '🥇', barHeight: 110),
                const SizedBox(width: 8),
                _Podium(name: leaders[2]['name'] as String, score: leaders[2]['score'] as int, badge: '🥉', barHeight: 60),
              ]),
            ])),
          ])),
        )),

        // List
        SliverToBoxAdapter(child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
          child: Text('All Rankings', style: AppTextStyles.h4),
        )),
        SliverList(delegate: SliverChildBuilderDelegate((_, i) {
          final l = leaders[i]; final isYou = l['isYou'] as bool;
          return Container(
            margin: const EdgeInsets.fromLTRB(16, 8, 16, 0),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: isYou ? AppColors.indigoBg : Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: isYou ? const Color(0xFFC7D2FE) : AppColors.border),
              boxShadow: const [BoxShadow(color: Color(0x06000000), blurRadius: 8, offset: Offset(0, 2))],
            ),
            child: Row(children: [
              Container(
                width: 36, height: 36,
                decoration: BoxDecoration(color: AppColors.bgSurface, borderRadius: BorderRadius.circular(10)),
                child: Center(child: Text(l['badge'] as String, style: const TextStyle(fontSize: 16))),
              ),
              const SizedBox(width: 12),
              Container(
                width: 36, height: 36,
                decoration: BoxDecoration(gradient: AppColors.gradientPrimary, shape: BoxShape.circle),
                child: Center(child: Text((l['name'] as String)[0], style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 14))),
              ),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(l['name'] as String, style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w600, color: isYou ? AppColors.primary : AppColors.textPrimary)),
                Text('${l['sessions']} sessions', style: AppTextStyles.bodySm.copyWith(color: AppColors.textSecondary)),
              ])),
              Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                Text('${l['score']}', style: AppTextStyles.h3.copyWith(color: AppColors.textPrimary)),
                if (isYou) Text('You', style: AppTextStyles.caption.copyWith(color: AppColors.primary, fontWeight: FontWeight.w700)),
              ]),
            ]),
          );
        }, childCount: leaders.length)),
        const SliverPadding(padding: EdgeInsets.only(bottom: 100)),
      ]),
      bottomNavigationBar: const AppBottomNav(currentIndex: 3),
    );
  }
}

class _Podium extends StatelessWidget {
  final String name, badge; final int score, barHeight;
  const _Podium({required this.name, required this.score, required this.badge, required this.barHeight});
  @override
  Widget build(BuildContext context) => Expanded(child: Column(mainAxisSize: MainAxisSize.min, children: [
    Text(badge, style: const TextStyle(fontSize: 28)),
    const SizedBox(height: 4),
    Text(name.split(' ').first, style: AppTextStyles.caption.copyWith(color: Colors.white70), overflow: TextOverflow.ellipsis, textAlign: TextAlign.center),
    const SizedBox(height: 4),
    Container(
      height: barHeight.toDouble(),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.25),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(8)),
      ),
      child: Center(child: Text('$score%', style: AppTextStyles.bodySm.copyWith(color: Colors.white, fontWeight: FontWeight.w700))),
    ),
  ]));
}
