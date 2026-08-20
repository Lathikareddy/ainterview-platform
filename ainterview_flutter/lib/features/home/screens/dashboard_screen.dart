// lib/features/home/screens/dashboard_screen.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../../features/auth/providers/auth_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../widgets/bottom_nav.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});
  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _carouselIndex = 0;

  final _slides = [
    {'label': '🎯 Mock Test', 'title': 'Google Frontend Engineer Mock', 'desc': '5 real questions from Google interviews. System design + React performance. 45 min timed session.', 'gradient': [Color(0xFF4F46E5), Color(0xFF7C3AED)], 'action': 'Start Mock', 'icon': '🧑‍💻'},
    {'label': '⚡ Interview Hack', 'title': 'Use the STAR Method Every Time', 'desc': 'Situation → Task → Action → Result. Structure every behavioral answer this way and you\'ll never blank out again.', 'gradient': [Color(0xFF10B981), Color(0xFF0D9488)], 'action': 'Practice Behavioral', 'icon': '⭐'},
    {'label': '📅 Today\'s Schedule', 'title': 'Day 1: Behavioral Foundations', 'desc': 'Morning: Tell me about yourself. Afternoon: Failure question. Evening: Conflict resolution.', 'gradient': [Color(0xFFF59E0B), Color(0xFFEA580C)], 'action': 'Start Today\'s Plan', 'icon': '📋'},
    {'label': '🔥 Body Language Hack', 'title': 'Silence is a Superpower', 'desc': 'Top candidates pause 2-3 seconds before answering. It signals you\'re thoughtful, not nervous.', 'gradient': [Color(0xFFF43F5E), Color(0xFFEC4899)], 'action': 'Do a Mock Now', 'icon': '🧠'},
    {'label': '💰 Career Hack', 'title': 'Never Give a Salary Number First', 'desc': 'When asked "what are your expectations?", say: "I\'d love to hear your budget for this role first."', 'gradient': [Color(0xFF7C3AED), Color(0xFF4F46E5)], 'action': 'Practice Negotiation', 'icon': '💼'},
  ];

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final hour = DateTime.now().hour;
    final greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    final name = auth.displayName;

    return Scaffold(
      backgroundColor: AppColors.bg,
      body: CustomScrollView(
        slivers: [
          // ── Mobile Header (matches website mobile header) ──
          SliverToBoxAdapter(
            child: Container(
              color: AppColors.bgCard,
              child: SafeArea(
                bottom: false,
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
                  child: Row(children: [
                    Container(
                      width: 32, height: 32,
                      decoration: BoxDecoration(
                        gradient: AppColors.gradientPrimary,
                        borderRadius: BorderRadius.circular(8),
                        boxShadow: [BoxShadow(color: AppColors.shadow, blurRadius: 8, offset: const Offset(0, 2))],
                      ),
                      child: const Center(child: Text('A', style: TextStyle(fontFamily: 'Inter', color: Colors.white, fontSize: 16, fontWeight: FontWeight.w800))),
                    ),
                    const SizedBox(width: 8),
                    Text('AInterview',
                      style: AppTextStyles.h4.copyWith(
                        foreground: Paint()..shader = const LinearGradient(
                          colors: [Color(0xFF4338CA), Color(0xFF6D28D9)],
                        ).createShader(const Rect.fromLTWH(0, 0, 120, 20)),
                      ),
                    ),
                    const Spacer(),
                    IconButton(
                      icon: const Icon(Icons.notifications_outlined, size: 22, color: AppColors.textSecondary),
                      onPressed: () => context.push('/notifications'),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                    ),
                    const SizedBox(width: 4),
                    GestureDetector(
                      onTap: () => context.push('/settings'),
                      child: CircleAvatar(
                        radius: 16,
                        backgroundColor: AppColors.primary,
                        backgroundImage: auth.photoUrl != null ? NetworkImage(auth.photoUrl!) : null,
                        child: auth.photoUrl == null
                          ? Text(name.isNotEmpty ? name[0].toUpperCase() : 'A',
                              style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w700))
                          : null,
                      ),
                    ),
                  ]),
                ),
              ),
            ),
          ),

          // ── Hero Banner (matches website gradient banner) ──
          SliverToBoxAdapter(
            child: Container(
              margin: const EdgeInsets.fromLTRB(16, 16, 16, 0),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                  colors: [Color(0xFF4F46E5), Color(0xFF7C3AED), Color(0xFF6D28D9)],
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [BoxShadow(color: AppColors.primary.withOpacity(0.3), blurRadius: 20, offset: const Offset(0, 8))],
              ),
              child: Stack(children: [
                // Decorative circles
                Positioned(top: 0, right: 0,
                  child: Container(
                    width: 160, height: 160,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.05),
                      shape: BoxShape.circle,
                    ),
                    transform: Matrix4.translationValues(50, -50, 0),
                  ),
                ),
                Positioned(bottom: 0, left: 0,
                  child: Container(
                    width: 100, height: 100,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.05),
                      shape: BoxShape.circle,
                    ),
                    transform: Matrix4.translationValues(-30, 30, 0),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(28),
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(
                      '$greeting, $name 👋',
                      style: AppTextStyles.h2.copyWith(color: Colors.white, fontWeight: FontWeight.w800),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Start your first session to build your practice streak!',
                      style: AppTextStyles.body.copyWith(color: const Color(0xFFC7D2FE)),
                    ),
                  ]),
                ),
              ]),
            ),
          ),

          // ── Stat Cards (3 columns, matches website) ──
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 20, 16, 0),
              child: Row(children: [
                Expanded(child: _StatCard(title: 'Interviews Completed', value: '0', iconBg: AppColors.indigoBg, iconColor: AppColors.primary, icon: Icons.gps_fixed_outlined)),
                const SizedBox(width: 12),
                Expanded(child: _StatCard(title: 'Average Score', value: '0/100', iconBg: AppColors.emeraldBg, iconColor: AppColors.success, icon: Icons.trending_up)),
                const SizedBox(width: 12),
                Expanded(child: _StatCard(title: 'Practice Hours', value: '0.0h', iconBg: AppColors.amberBg, iconColor: AppColors.warning, icon: Icons.access_time)),
              ]),
            ),
          ),

          // ── Recommended Carousel ──
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 24, 16, 0),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                  Text('Recommended for you', style: AppTextStyles.h4),
                  Text('${_carouselIndex + 1} / ${_slides.length}',
                    style: AppTextStyles.bodySm.copyWith(color: AppColors.textMuted)),
                ]),
                const SizedBox(height: 12),
                GestureDetector(
                  onHorizontalDragEnd: (d) {
                    if (d.primaryVelocity != null) {
                      if (d.primaryVelocity! < -300) setState(() => _carouselIndex = (_carouselIndex + 1) % _slides.length);
                      else if (d.primaryVelocity! > 300) setState(() => _carouselIndex = (_carouselIndex - 1 + _slides.length) % _slides.length);
                    }
                  },
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 300),
                    child: _CarouselSlide(
                      key: ValueKey(_carouselIndex),
                      slide: _slides[_carouselIndex],
                      onPrev: () => setState(() => _carouselIndex = (_carouselIndex - 1 + _slides.length) % _slides.length),
                      onNext: () => setState(() => _carouselIndex = (_carouselIndex + 1) % _slides.length),
                      onDot: (i) => setState(() => _carouselIndex = i),
                      dotCount: _slides.length,
                      currentDot: _carouselIndex,
                      onAction: () => context.push('/interview-type'),
                    ),
                  ),
                ),
              ]),
            ),
          ),

          // ── Weekly Goal ──
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 24, 16, 0),
              child: _WeeklyGoalCard(completed: 0),
            ),
          ),

          // ── Quick Actions ──
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 20, 16, 0),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Quick Actions', style: AppTextStyles.h4),
                const SizedBox(height: 12),
                Row(children: [
                  Expanded(child: _QuickAction(icon: Icons.play_arrow_rounded, label: 'Start Interview', color: AppColors.primary, bgColor: AppColors.indigoBg, onTap: () => context.push('/interview-type'))),
                  const SizedBox(width: 12),
                  Expanded(child: _QuickAction(icon: Icons.quiz_outlined, label: 'Practice Q&A', color: AppColors.info, bgColor: const Color(0xFFEFF6FF), onTap: () => context.go('/practice'))),
                ]),
                const SizedBox(height: 12),
                Row(children: [
                  Expanded(child: _QuickAction(icon: Icons.bar_chart_rounded, label: 'Analytics', color: AppColors.success, bgColor: AppColors.emeraldBg, onTap: () => context.go('/analytics'))),
                  const SizedBox(width: 12),
                  Expanded(child: _QuickAction(icon: Icons.people_outline, label: 'Community', color: AppColors.violet, bgColor: const Color(0xFFF5F3FF), onTap: () => context.go('/community'))),
                ]),
              ]),
            ),
          ),

          const SliverPadding(padding: EdgeInsets.only(bottom: 100)),
        ],
      ),
      bottomNavigationBar: const AppBottomNav(currentIndex: 0),
    );
  }
}

// ── Stat Card ──
class _StatCard extends StatelessWidget {
  final String title, value;
  final Color iconBg, iconColor;
  final IconData icon;
  const _StatCard({required this.title, required this.value, required this.iconBg, required this.iconColor, required this.icon});

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
      Container(
        width: 36, height: 36,
        decoration: BoxDecoration(color: iconBg, borderRadius: BorderRadius.circular(10)),
        child: Icon(icon, color: iconColor, size: 18),
      ),
      const SizedBox(height: 12),
      Text(title, style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary), maxLines: 2),
      const SizedBox(height: 4),
      Text(value, style: AppTextStyles.h3),
    ]),
  );
}

// ── Carousel Slide ──
class _CarouselSlide extends StatelessWidget {
  final Map<String, dynamic> slide;
  final VoidCallback onPrev, onNext, onAction;
  final void Function(int) onDot;
  final int dotCount, currentDot;
  const _CarouselSlide({super.key, required this.slide, required this.onPrev, required this.onNext, required this.onAction, required this.onDot, required this.dotCount, required this.currentDot});

  @override
  Widget build(BuildContext context) {
    final colors = slide['gradient'] as List<Color>;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: colors),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: colors[0].withOpacity(0.3), blurRadius: 12, offset: const Offset(0, 4))],
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(20)),
            child: Text(slide['label'] as String, style: AppTextStyles.caption.copyWith(color: Colors.white, fontWeight: FontWeight.w700)),
          ),
          Text(slide['icon'] as String, style: const TextStyle(fontSize: 32)),
        ]),
        const SizedBox(height: 12),
        Text(slide['title'] as String, style: AppTextStyles.h3.copyWith(color: Colors.white), maxLines: 2),
        const SizedBox(height: 6),
        Text(slide['desc'] as String, style: AppTextStyles.bodySm.copyWith(color: Colors.white70), maxLines: 3),
        const SizedBox(height: 16),
        Row(children: [
          GestureDetector(
            onTap: onAction,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
              child: Text(slide['action'] as String, style: AppTextStyles.bodySm.copyWith(color: colors[0], fontWeight: FontWeight.w700)),
            ),
          ),
          const SizedBox(width: 8),
          GestureDetector(
            onTap: onPrev,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(12)),
              child: const Text('‹ Prev', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 13)),
            ),
          ),
          const SizedBox(width: 8),
          GestureDetector(
            onTap: onNext,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(12)),
              child: const Text('Next ›', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 13)),
            ),
          ),
        ]),
        const SizedBox(height: 14),
        Row(children: List.generate(dotCount, (i) => AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          margin: const EdgeInsets.only(right: 6),
          height: 6,
          width: i == currentDot ? 24 : 6,
          decoration: BoxDecoration(
            color: i == currentDot ? Colors.white : Colors.white.withOpacity(0.4),
            borderRadius: BorderRadius.circular(3),
          ),
        ))),
      ]),
    );
  }
}

// ── Weekly Goal Card ──
class _WeeklyGoalCard extends StatelessWidget {
  final int completed;
  const _WeeklyGoalCard({required this.completed});

  @override
  Widget build(BuildContext context) {
    final progress = (completed.clamp(0, 5) / 5.0);
    final days = ['M', 'T', 'W', 'T', 'F'];
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.bgCard,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
        boxShadow: const [BoxShadow(color: Color(0x08000000), blurRadius: 8, offset: Offset(0, 2))],
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text('Weekly Goal', style: AppTextStyles.h4),
        const SizedBox(height: 16),
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Text('${completed.clamp(0, 5)} of 5 sessions', style: AppTextStyles.bodySm.copyWith(color: AppColors.textSecondary)),
          Text('${(progress * 100).round()}%', style: AppTextStyles.bodySm.copyWith(fontWeight: FontWeight.w600)),
        ]),
        const SizedBox(height: 8),
        ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: LinearProgressIndicator(
            value: progress,
            minHeight: 10,
            backgroundColor: AppColors.bgSurface,
            color: AppColors.primary,
          ),
        ),
        const SizedBox(height: 16),
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: List.generate(5, (i) {
          final done = i < completed.clamp(0, 5);
          return Column(children: [
            Container(
              width: 36, height: 36,
              decoration: BoxDecoration(
                color: done ? AppColors.emeraldBg : AppColors.bgSurface,
                shape: BoxShape.circle,
              ),
              child: Center(child: done
                ? const Icon(Icons.check_circle_outline, color: AppColors.success, size: 18)
                : Text(days[i], style: AppTextStyles.bodySm.copyWith(color: AppColors.textMuted, fontWeight: FontWeight.w500)),
              ),
            ),
          ]);
        })),
      ]),
    );
  }
}

// ── Quick Action ──
class _QuickAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color, bgColor;
  final VoidCallback onTap;
  const _QuickAction({required this.icon, required this.label, required this.color, required this.bgColor, required this.onTap});

  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: onTap,
    child: Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.bgCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
        boxShadow: const [BoxShadow(color: Color(0x08000000), blurRadius: 8, offset: Offset(0, 2))],
      ),
      child: Row(children: [
        Container(
          width: 36, height: 36,
          decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(10)),
          child: Icon(icon, color: color, size: 20),
        ),
        const SizedBox(width: 12),
        Expanded(child: Text(label, style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w600))),
      ]),
    ),
  );
}
