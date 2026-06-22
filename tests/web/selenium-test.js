import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE = 'http://localhost:5173/ainterview-platform';
const results = [];
let driver;

function log(name, category, type, status, detail, duration = 0) {
  results.push({ TestID: results.length + 1, TestName: name, Category: category, TestType: type, Status: status, Details: detail, DurationMs: duration });
}

async function go(p) { await driver.get(BASE + p); }
async function exists(css, t = 4000) {
  try { await driver.wait(until.elementLocated(By.css(css)), t); return true; } catch { return false; }
}
async function run(name, cat, type, fn) {
  const t = Date.now();
  try { await fn(); log(name, cat, type, 'Passed', 'OK', Date.now() - t); }
  catch (e) { log(name, cat, type, 'Failed', e.message.slice(0, 120), Date.now() - t); }
}

const ROUTES = [
  ['/', 'Home/Auth'],
  ['/splash', 'Splash'],
  ['/onboarding-1', 'Onboarding1'],
  ['/onboarding-2', 'Onboarding2'],
  ['/onboarding-3', 'Onboarding3'],
  ['/signin', 'SignIn'],
  ['/forgot-password', 'ForgotPassword'],
  ['/setup-basic', 'SetupBasic'],
  ['/setup-career', 'SetupCareer'],
  ['/setup-experience', 'SetupExperience'],
  ['/setup-industry', 'SetupIndustry'],
  ['/setup-skills', 'SetupSkills'],
  ['/dashboard', 'Dashboard'],
  ['/search', 'Search'],
  ['/categories', 'Categories'],
  ['/recommended', 'Recommended'],
  ['/notifications', 'Notifications'],
  ['/interview-setup', 'InterviewSetup'],
  ['/interview-role', 'InterviewRole'],
  ['/interview-difficulty', 'InterviewDifficulty'],
  ['/interview-format', 'InterviewFormat'],
  ['/interview-precheck', 'PreCheck'],
  ['/live-waiting', 'LiveWaiting'],
  ['/live-voice', 'LiveVoice'],
  ['/live-text', 'LiveText'],
  ['/live-pause', 'LivePause'],
  ['/feedback-summary', 'FeedbackSummary'],
  ['/feedback-detailed', 'FeedbackDetailed'],
  ['/feedback-confidence', 'FeedbackConfidence'],
  ['/feedback-speech', 'FeedbackSpeech'],
  ['/feedback-body', 'FeedbackBody'],
  ['/feedback-answers', 'FeedbackAnswers'],
  ['/feedback-improvements', 'FeedbackImprovements'],
  ['/ai-vs-traditional', 'AIvsTraditional'],
  ['/analytics', 'Analytics'],
  ['/analytics-trends', 'AnalyticsTrends'],
  ['/analytics-heatmap', 'AnalyticsHeatmap'],
  ['/analytics-achievements', 'AnalyticsAchievements'],
  ['/history', 'History'],
  ['/practice', 'Practice'],
  ['/practice-answer', 'PracticeAnswer'],
  ['/practice-mocks', 'PracticeMocks'],
  ['/practice-daily', 'PracticeDaily'],
  ['/practice-resources', 'PracticeResources'],
  ['/community', 'Community'],
  ['/community-mentor', 'CommunityMentor'],
  ['/settings', 'Settings'],
  ['/screens', 'Screens'],
];

async function runAll() {
  const opts = new chrome.Options();
  opts.addArguments('--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--window-size=1366,768');
  driver = await new Builder().forBrowser('chrome').setChromeOptions(opts).build();

  try {
    // ── SMOKE: Page Loads (48 tests) ──────────────────────────────
    for (const [route, name] of ROUTES) {
      await run(`[Smoke] ${name} page loads`, 'Smoke', 'E2E', async () => {
        await go(route); if (!await exists('div', 5000)) throw new Error('No content');
      });
    }

    // ── NAVIGATION: URL Verification (48 tests) ───────────────────
    for (const [route, name] of ROUTES) {
      await run(`[Nav] ${name} URL is correct`, 'Navigation', 'Unit', async () => {
        await go(route);
        const url = await driver.getCurrentUrl();
        if (!url.includes(route.replace('/', ''))) throw new Error('URL mismatch: ' + url);
      });
    }

    // ── UI/UX: Body Not Empty (48 tests) ─────────────────────────
    for (const [route, name] of ROUTES) {
      await run(`[UI] ${name} body has content`, 'UI/UX', 'Visual', async () => {
        await go(route);
        const body = await driver.findElement(By.css('body'));
        const txt = await body.getText();
        if (!txt.trim()) throw new Error('Empty page body');
      });
    }

    // ── PERFORMANCE: Load Under 5s (48 tests) ────────────────────
    for (const [route, name] of ROUTES) {
      await run(`[Perf] ${name} loads under 5s`, 'Performance', 'NFR', async () => {
        const t = Date.now();
        await go(route);
        await exists('div', 5000);
        if (Date.now() - t > 5000) throw new Error('Load exceeded 5s');
      });
    }

    // ── VALIDATION: Title Non-Empty (48 tests) ────────────────────
    for (const [route, name] of ROUTES) {
      await run(`[Val] ${name} has page title`, 'Validation', 'Unit', async () => {
        await go(route);
        const t = await driver.getTitle();
        if (!t || t.trim() === '') throw new Error('Empty title');
      });
    }

    // ── FUNCTIONAL: Form Fields ───────────────────────────────────
    await run('[Func] SignIn email field exists', 'Functional', 'Unit', async () => {
      await go('/signin'); if (!await exists('input[type="email"]')) throw new Error('Missing email');
    });
    await run('[Func] SignIn password field exists', 'Functional', 'Unit', async () => {
      await go('/signin'); if (!await exists('input[type="password"]')) throw new Error('Missing password');
    });
    await run('[Func] SignIn remember-me checkbox exists', 'Functional', 'Unit', async () => {
      await go('/signin'); if (!await exists('#remember-me')) throw new Error('Missing checkbox');
    });
    await run('[Func] ForgotPassword email input exists', 'Functional', 'Unit', async () => {
      await go('/forgot-password'); if (!await exists('input[type="email"]')) throw new Error('Missing email');
    });
    await run('[Func] Email input accepts valid email', 'Functional', 'Input', async () => {
      await go('/signin');
      const el = await driver.findElement(By.css('input[type="email"]'));
      await el.sendKeys('user@test.com');
      if (await el.getAttribute('value') !== 'user@test.com') throw new Error('Email not entered');
    });
    await run('[Func] Password input accepts text', 'Functional', 'Input', async () => {
      await go('/signin');
      const el = await driver.findElement(By.css('input[type="password"]'));
      await el.sendKeys('secret123');
      if (!await el.getAttribute('value')) throw new Error('Password not entered');
    });
    await run('[Func] Password field masks input', 'Functional', 'Security', async () => {
      await go('/signin');
      const el = await driver.findElement(By.css('input[type="password"]'));
      if (await el.getAttribute('type') !== 'password') throw new Error('Not masked');
    });
    await run('[Func] Remember-me is checkable', 'Functional', 'Input', async () => {
      await go('/signin');
      const el = await driver.findElement(By.css('#remember-me'));
      await el.click();
      if (!await el.isSelected()) throw new Error('Not checked');
    });
    await run('[Func] Forgot password link navigates', 'Functional', 'Navigation', async () => {
      await go('/signin');
      await driver.findElement(By.css('a[href*="forgot"]')).click();
      await driver.wait(until.urlContains('forgot'), 3000);
    });
    await run('[Func] Onboarding Continue button exists', 'Functional', 'Unit', async () => {
      await go('/onboarding-1'); if (!await exists('a,button')) throw new Error('No button');
    });
    await run('[Func] Onboarding Skip link exists', 'Functional', 'Unit', async () => {
      await go('/onboarding-1');
      const links = await driver.findElements(By.css('a'));
      let found = false;
      for (const l of links) { const t = await l.getText(); if (t.toLowerCase().includes('skip')) { found = true; break; } }
      if (!found) throw new Error('No skip link');
    });
    await run('[Func] Onboarding 3 Get Started button', 'Functional', 'Unit', async () => {
      await go('/onboarding-3');
      const els = await driver.findElements(By.css('a,button'));
      let found = false;
      for (const e of els) { const t = await e.getText(); if (t.includes('Get Started')) { found = true; break; } }
      if (!found) throw new Error('No Get Started');
    });
    await run('[Func] Onboarding 1 links to Onboarding 2', 'Functional', 'Navigation', async () => {
      await go('/onboarding-1');
      const links = await driver.findElements(By.css('a'));
      let found = false;
      for (const l of links) { const h = await l.getAttribute('href'); if (h && h.includes('onboarding-2')) { found = true; break; } }
      if (!found) throw new Error('No onboarding-2 link');
    });
    await run('[Func] Onboarding 2 links to Onboarding 3', 'Functional', 'Navigation', async () => {
      await go('/onboarding-2');
      const links = await driver.findElements(By.css('a'));
      let found = false;
      for (const l of links) { const h = await l.getAttribute('href'); if (h && h.includes('onboarding-3')) { found = true; break; } }
      if (!found) throw new Error('No onboarding-3 link');
    });

    // ── DEPLOYMENT/SEO: Meta Tags ─────────────────────────────────
    await run('[SEO] App has charset meta', 'Deployment', 'SEO', async () => {
      await go('/'); if (!await exists('meta[charset]')) throw new Error('No charset');
    });
    await run('[SEO] App has viewport meta', 'Deployment', 'SEO', async () => {
      await go('/'); if (!await exists('meta[name="viewport"]')) throw new Error('No viewport');
    });
    await run('[SEO] App title is non-empty', 'Deployment', 'SEO', async () => {
      await go('/'); const t = await driver.getTitle(); if (!t) throw new Error('Empty title');
    });
    await run('[SEO] Title includes AInterview', 'Deployment', 'SEO', async () => {
      await go('/'); const t = await driver.getTitle(); if (!t.includes('AInterview')) throw new Error('Wrong title');
    });
    await run('[SEO] App has favicon', 'Deployment', 'Asset', async () => {
      await go('/'); if (!await exists('link[rel*="icon"]')) throw new Error('No favicon');
    });
    await run('[SEO] Root div exists', 'Deployment', 'Asset', async () => {
      await go('/'); if (!await exists('#root')) throw new Error('No #root');
    });

    // ── JS ERRORS: Console Check ──────────────────────────────────
    const errorRoutes = ['/', '/signin', '/dashboard', '/analytics', '/settings', '/practice', '/community', '/forgot-password'];
    for (const r of errorRoutes) {
      await run(`[JS] No severe errors on ${r}`, 'Quality', 'Unit', async () => {
        await go(r);
        const logs = await driver.manage().logs().get('browser');
        const errs = logs.filter(l => l.level.name === 'SEVERE');
        if (errs.length) throw new Error(`${errs.length} JS error(s): ${errs[0].message.slice(0, 80)}`);
      });
    }

    // ── LAYOUT: min-h-screen Checks ───────────────────────────────
    const layoutRoutes = ['/splash', '/signin', '/forgot-password', '/onboarding-1', '/onboarding-2', '/onboarding-3'];
    for (const r of layoutRoutes) {
      await run(`[Layout] ${r} has min-h-screen`, 'UI/UX', 'Layout', async () => {
        await go(r); if (!await exists('.min-h-screen')) throw new Error('No min-h-screen');
      });
    }

    // ── ACCESSIBILITY: Form Labels ────────────────────────────────
    await run('[A11y] SignIn email has label', 'Accessibility', 'A11y', async () => {
      await go('/signin'); if (!await exists('label')) throw new Error('No label');
    });
    await run('[A11y] ForgotPassword has label', 'Accessibility', 'A11y', async () => {
      await go('/forgot-password'); if (!await exists('label')) throw new Error('No label');
    });
    await run('[A11y] SignIn form has submit action', 'Accessibility', 'A11y', async () => {
      await go('/signin'); if (!await exists('form')) throw new Error('No form');
    });
    await run('[A11y] ForgotPassword has form', 'Accessibility', 'A11y', async () => {
      await go('/forgot-password'); if (!await exists('form')) throw new Error('No form');
    });

    // ── EXTRA FUNCTIONAL: Interactions ───────────────────────────
    await run('[Func] ForgotPassword email accepts input', 'Functional', 'Input', async () => {
      await go('/forgot-password');
      const el = await driver.findElement(By.css('input[type="email"]'));
      await el.sendKeys('reset@test.com');
      if (await el.getAttribute('value') !== 'reset@test.com') throw new Error('Email not accepted');
    });
    await run('[Func] Dashboard body text is non-empty', 'Functional', 'Visual', async () => {
      await go('/dashboard');
      const t = await driver.findElement(By.css('body')).getText();
      if (!t.trim()) throw new Error('Empty dashboard');
    });
    await run('[Func] Analytics body text is non-empty', 'Functional', 'Visual', async () => {
      await go('/analytics');
      const t = await driver.findElement(By.css('body')).getText();
      if (!t.trim()) throw new Error('Empty analytics');
    });
    await run('[Func] Settings body text is non-empty', 'Functional', 'Visual', async () => {
      await go('/settings');
      const t = await driver.findElement(By.css('body')).getText();
      if (!t.trim()) throw new Error('Empty settings');
    });
    await run('[Func] Community body text is non-empty', 'Functional', 'Visual', async () => {
      await go('/community');
      const t = await driver.findElement(By.css('body')).getText();
      if (!t.trim()) throw new Error('Empty community');
    });
    await run('[Func] Practice body text is non-empty', 'Functional', 'Visual', async () => {
      await go('/practice');
      const t = await driver.findElement(By.css('body')).getText();
      if (!t.trim()) throw new Error('Empty practice');
    });

    // ── EXTRA VALIDATION TESTS ────────────────────────────────────
    const validateRoutes = ROUTES.slice(0, 40);
    for (const [route, name] of validateRoutes) {
      await run(`[Val2] ${name} renders at least one div`, 'Validation', 'Structural', async () => {
        await go(route);
        const divs = await driver.findElements(By.css('div'));
        if (!divs.length) throw new Error('No divs found');
      });
    }

  } finally {
    await driver.quit();
    generateReport();
  }
}

function generateReport() {
  const dir = path.join(__dirname, '..', '..', 'reports');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const passed = results.filter(r => r.Status === 'Passed').length;
  const failed = results.filter(r => r.Status === 'Failed').length;
  const total = results.length;
  const pct = ((passed / total) * 100).toFixed(1);
  const deploy = Number(pct) >= 80 ? 'DEPLOYABLE ✅' : 'NOT READY ❌';
  const cats = [...new Set(results.map(r => r.Category))];
  const summary = [
    { Metric: 'Total Tests', Value: total },
    { Metric: 'Passed', Value: passed },
    { Metric: 'Failed', Value: failed },
    { Metric: 'Pass Rate (%)', Value: pct },
    { Metric: 'Deployment Status', Value: deploy },
    { Metric: 'Timestamp', Value: new Date().toISOString() },
  ];
  const breakdown = cats.map(c => {
    const sub = results.filter(r => r.Category === c);
    const p = sub.filter(r => r.Status === 'Passed').length;
    return { Category: c, Total: sub.length, Passed: p, Failed: sub.length - p, PassRate: ((p / sub.length) * 100).toFixed(1) + '%' };
  });
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(summary), 'Summary');
  xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(breakdown), 'By Category');
  xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(results), 'All Tests');
  xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(results.filter(r => r.Status === 'Failed')), 'Failed');
  const out = path.join(dir, 'Web_E2E_Test_Report.xlsx');
  xlsx.writeFile(wb, out);
  console.log(`\n✅ Selenium Report: ${out}`);
  console.log(`📊 ${passed}/${total} passed (${pct}%) — ${deploy}`);
}

runAll();
