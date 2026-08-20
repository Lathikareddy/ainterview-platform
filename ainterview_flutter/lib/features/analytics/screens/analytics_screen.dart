// lib/features/analytics/screens/analytics_screen.dart
// Matches website AnalyticsDashboard — emerald gradient header, stat cards, score trend bars, history
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../home/widgets/bottom_nav.dart';

class AnalyticsScreen extends StatelessWidget {
  const AnalyticsScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final history = [
      {'role': 'Software Engineer', 'score': 82, 'date': 'Aug 10', 'type': 'Technical'},
      {'role': 'Product Manager', 'score': 75, 'date': 'Aug 8', 'type': 'Behavioral'},
      {'role': 'Data Scientist', 'score': 90, 'date': 'Aug 5', 'type': 'Technical'},
      {'role': 'UX Designer', 'score': 68, 'date': 'Aug 2', 'type': 'HR'},
    ];

    return Scaffold(
      backgroundColor: AppColors.bg,
      body: CustomScrollView(slivers: [
        // Emerald gradient header matching website's "📊 Your Analytics"
        SliverToBoxAdapter(child: Container(
          margin: const EdgeInsets.all(0),
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: [Color(0xFF10B981), Color(0xFF0D9488), Color(0xFF0891B2)],
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
              Text('📊 Your Analytics', style: AppTextStyles.h2.copyWith(color: Colors.white, fontWeight: FontWeight.w800)),
              const SizedBox(height: 4),
              Text('Track your growth and performance over time.', style: AppTextStyles.body.copyWith(color: const Color(0xFFD1FAE5))),
            ])),
          ])),
        )),

        SliverToBoxAdapter(child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            // 4 stat cards in 2x2 grid (matches website)
            Row(children: [
              Expanded(child: _StatCard(label: 'Total Interviews', value: '0', icon: Icons.gps_fixed_outlined, iconBg: AppColors.indigoBg, iconColor: AppColors.primary)),
              const SizedBox(width: 12),
              Expanded(child: _StatCard(label: 'Avg Score', value: '0/100', icon: Icons.trending_up, iconBg: AppColors.emeraldBg, iconColor: AppColors.success)),
            ]),
            const SizedBox(height: 12),
            Row(children: [
              Expanded(child: _StatCard(label: 'Hours Practiced', value: '0.0h', icon: Icons.access_time, iconBg: AppColors.amberBg, iconColor: AppColors.warning)),
              const SizedBox(width: 12),
              Expanded(child: _StatCard(label: 'Current Streak', value: '0 Days', icon: Icons.emoji_events_outlined, iconBg: AppColors.roseBg, iconColor: AppColors.error)),
            ]),

            const SizedBox(height: 24),
            // Score Trend chart card (matches website white card style)
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.bgCard,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.border),
                boxShadow: const [BoxShadow(color: Color(0x08000000), blurRadius: 8, offset: Offset(0, 2))],
              ),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Overall Performance Trend', style: AppTextStyles.h4),
                const SizedBox(height: 20),
                SizedBox(
                  height: 140,
                  child: history.isEmpty
                    ? Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                        Icon(Icons.bar_chart, size: 48, color: AppColors.bgSurface),
                        const SizedBox(height: 8),
                        Text('No data yet', style: AppTextStyles.body.copyWith(color: AppColors.textMuted)),
                        Text('Complete your first interview to see your performance trend.', style: AppTextStyles.bodySm.copyWith(color: AppColors.textMuted), textAlign: TextAlign.center),
                      ]))
                    : Row(crossAxisAlignment: CrossAxisAlignment.end, mainAxisAlignment: MainAxisAlignment.spaceAround, children: history.map((h) {
                        final score = h['score'] as int;
                        return Column(mainAxisAlignment: MainAxisAlignment.end, children: [
                          Text('$score', style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary)),
                          const SizedBox(height: 4),
                          Container(
                            width: 40,
                            height: score.toDouble(),
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [Color(0xFF4F46E5), Color(0xFF7C3AED)]),
                              borderRadius: BorderRadius.circular(6),
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(h['date'] as String, style: AppTextStyles.caption.copyWith(color: AppColors.textMuted, fontSize: 10)),
                        ]);
                      }).toList()),
                ),
              ]),
            ),

            const SizedBox(height: 20),
            // Skill distribution card (matches website)
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.bgCard,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.border),
                boxShadow: const [BoxShadow(color: Color(0x08000000), blurRadius: 8, offset: Offset(0, 2))],
              ),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Skill Distribution', style: AppTextStyles.h4),
                const SizedBox(height: 20),
                for (final skill in [
                  {'label': 'Technical', 'val': 0.0},
                  {'label': 'Backend', 'val': 0.0},
                  {'label': 'System Design', 'val': 0.0},
                  {'label': 'Behavioral', 'val': 0.0},
                ]) ...[
                  Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                    Text(skill['label'] as String, style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w500)),
                    Text('${((skill['val'] as double) * 100).toInt()}/100', style: AppTextStyles.bodySm.copyWith(color: AppColors.textSecondary)),
                  ]),
                  const SizedBox(height: 8),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: skill['val'] as double,
                      minHeight: 8,
                      backgroundColor: AppColors.bgSurface,
                      color: AppColors.primary,
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
              ]),
            ),

            const SizedBox(height: 20),
            // Interview History
            Text('Interview History', style: AppTextStyles.h4),
            const SizedBox(height: 12),
            Container(
              decoration: BoxDecoration(
                color: AppColors.bgCard,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.border),
                boxShadow: const [BoxShadow(color: Color(0x08000000), blurRadius: 8, offset: Offset(0, 2))],
              ),
              child: Column(children: history.asMap().entries.map((e) {
                final i = e.key; final h = e.value;
                final score = h['score'] as int;
                return Container(
                  decoration: BoxDecoration(
                    border: i < history.length - 1 ? const Border(bottom: BorderSide(color: AppColors.border)) : null,
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(children: [
                      Container(
                        width: 48, height: 48,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(colors: _scoreGradient(score)),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Center(child: Text('$score', style: const TextStyle(fontFamily: 'Inter', color: Colors.white, fontWeight: FontWeight.w800, fontSize: 14))),
                      ),
                      const SizedBox(width: 12),
                      Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Text(h['role'] as String, style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w600)),
                        const SizedBox(height: 2),
                        Text('${h['date']} • ${h['type']}', style: AppTextStyles.bodySm.copyWith(color: AppColors.textSecondary)),
                      ])),
                      const Icon(Icons.chevron_right, color: AppColors.textMuted, size: 20),
                    ]),
                  ),
                );
              }).toList()),
            ),
          ]),
        )),
        const SliverPadding(padding: EdgeInsets.only(bottom: 100)),
      ]),
      bottomNavigationBar: const AppBottomNav(currentIndex: 2),
    );
  }

  List<Color> _scoreGradient(int score) {
    if (score >= 85) return [AppColors.success, const Color(0xFF059669)];
    if (score >= 70) return [AppColors.primary, AppColors.violet];
    return [AppColors.warning, AppColors.error];
  }
}

class _StatCard extends StatelessWidget {
  final String label, value;
  final IconData icon;
  final Color iconBg, iconColor;
  const _StatCard({required this.label, required this.value, required this.icon, required this.iconBg, required this.iconColor});

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
      color: AppColors.bgCard,
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: AppColors.border),
      boxShadow: const [BoxShadow(color: Color(0x08000000), blurRadius: 8, offset: Offset(0, 2))],
    ),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Container(
          width: 36, height: 36,
          decoration: BoxDecoration(color: iconBg, borderRadius: BorderRadius.circular(10)),
          child: Icon(icon, color: iconColor, size: 18),
        ),
      ]),
      const SizedBox(height: 12),
      Text(label, style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary)),
      const SizedBox(height: 4),
      Text(value, style: AppTextStyles.h3),
    ]),
  );
}
