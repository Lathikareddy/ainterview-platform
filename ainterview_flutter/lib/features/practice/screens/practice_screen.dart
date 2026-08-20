// lib/features/practice/screens/practice_screen.dart
// Matches website PracticeScreens — white cards, category filters, question cards
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../home/widgets/bottom_nav.dart';

class PracticeScreen extends StatefulWidget {
  const PracticeScreen({super.key});
  @override State<PracticeScreen> createState() => _State();
}
class _State extends State<PracticeScreen> {
  String _filter = 'All';
  final _categories = ['All', 'Technical', 'Behavioral', 'HR', 'Leadership'];
  final _questions = [
    {'q': 'Explain the difference between REST and GraphQL.', 'cat': 'Technical', 'diff': 'Intermediate'},
    {'q': 'Tell me about a time you led a team through adversity.', 'cat': 'Behavioral', 'diff': 'Intermediate'},
    {'q': 'Why do you want to leave your current job?', 'cat': 'HR', 'diff': 'Beginner'},
    {'q': 'How do you design a scalable system for millions of users?', 'cat': 'Technical', 'diff': 'Senior'},
    {'q': 'Describe your leadership style.', 'cat': 'Leadership', 'diff': 'Intermediate'},
    {'q': 'How do you handle disagreements with your manager?', 'cat': 'Behavioral', 'diff': 'Intermediate'},
    {'q': 'What is your greatest weakness?', 'cat': 'HR', 'diff': 'Beginner'},
    {'q': 'Explain the SOLID principles with examples.', 'cat': 'Technical', 'diff': 'Senior'},
  ];

  @override
  Widget build(BuildContext context) {
    final filtered = _filter == 'All' ? _questions : _questions.where((q) => q['cat'] == _filter).toList();
    return Scaffold(
      backgroundColor: AppColors.bg,
      body: CustomScrollView(slivers: [
        // App bar matching website style
        SliverAppBar(
          backgroundColor: AppColors.bgCard,
          pinned: true,
          surfaceTintColor: Colors.transparent,
          elevation: 0,
          shadowColor: Colors.transparent,
          bottom: PreferredSize(preferredSize: const Size.fromHeight(1), child: Container(height: 1, color: AppColors.border)),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.textPrimary, size: 20),
            onPressed: () => context.pop(),
          ),
          title: Text('Practice Q&A', style: AppTextStyles.h3),
        ),
        SliverToBoxAdapter(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          // Category filter chips — matches website style
          SizedBox(height: 60,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              itemCount: _categories.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (_, i) {
                final cat = _categories[i]; final sel = _filter == cat;
                return GestureDetector(
                  onTap: () => setState(() => _filter = cat),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: sel ? AppColors.primary : AppColors.bgCard,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: sel ? AppColors.primary : AppColors.border),
                      boxShadow: sel ? [BoxShadow(color: AppColors.primary.withOpacity(0.25), blurRadius: 8, offset: const Offset(0, 2))] : null,
                    ),
                    child: Text(cat, style: AppTextStyles.bodySm.copyWith(
                      color: sel ? Colors.white : AppColors.textSecondary,
                      fontWeight: sel ? FontWeight.w600 : FontWeight.w400,
                    )),
                  ),
                );
              },
            ),
          ),

          // Question cards — matching website white card style
          ...filtered.map((q) => Container(
            margin: const EdgeInsets.fromLTRB(16, 0, 16, 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.bgCard,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.border),
              boxShadow: const [BoxShadow(color: Color(0x08000000), blurRadius: 8, offset: Offset(0, 2))],
            ),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(children: [
                _Chip(q['cat']!, AppColors.primary, AppColors.indigoBg),
                const SizedBox(width: 8),
                _Chip(q['diff']!, _diffColor(q['diff']!), _diffBg(q['diff']!)),
              ]),
              const SizedBox(height: 10),
              Text(q['q']!, style: AppTextStyles.body.copyWith(color: AppColors.textPrimary)),
              const SizedBox(height: 14),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => context.push('/interview-type'),
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size.fromHeight(40),
                    textStyle: AppTextStyles.bodySm,
                  ),
                  child: const Text('Practice Answer'),
                ),
              ),
            ]),
          )),
          const SizedBox(height: 16),
        ])),
        const SliverPadding(padding: EdgeInsets.only(bottom: 100)),
      ]),
      bottomNavigationBar: const AppBottomNav(currentIndex: 1),
    );
  }

  Color _diffColor(String d) {
    switch (d) {
      case 'Beginner': return AppColors.success;
      case 'Senior': return AppColors.error;
      default: return AppColors.warning;
    }
  }

  Color _diffBg(String d) {
    switch (d) {
      case 'Beginner': return AppColors.emeraldBg;
      case 'Senior': return AppColors.roseBg;
      default: return AppColors.amberBg;
    }
  }
}

class _Chip extends StatelessWidget {
  final String label; final Color color, bg;
  const _Chip(this.label, this.color, this.bg);
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
    decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(20)),
    child: Text(label, style: AppTextStyles.caption.copyWith(color: color, fontWeight: FontWeight.w600)),
  );
}
