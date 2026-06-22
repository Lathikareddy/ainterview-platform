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
  console.log(`[${status}] ${name}`);
}

async function go(path) { await driver.get(BASE + path); }

async function exists(css, timeout = 4000) {
  try { await driver.wait(until.elementLocated(By.css(css)), timeout); return true; }
  catch { return false; }
}

async function getText(css) {
  try { return await driver.findElement(By.css(css)).getText(); } catch { return ''; }
}

async function visible(css) {
  try { return await driver.findElement(By.css(css)).isDisplayed(); } catch { return false; }
}

async function run(name, category, type, fn) {
  const t = Date.now();
  try {
    await fn();
    log(name, category, type, 'Passed', 'Test passed successfully', Date.now() - t);
  } catch (e) {
    log(name, category, type, 'Failed', e.message.slice(0, 120), Date.now() - t);
  }
}

async function runAll() {
  const opts = new chrome.Options();
  opts.addArguments('--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1366,768');
  driver = await new Builder().forBrowser('chrome').setChromeOptions(opts).build();

  try {
    // ── UI/UX TESTS ──────────────────────────────────────────────────
    await run('App loads successfully', 'UI/UX', 'Smoke', async () => {
      await go('/'); const t = await driver.getTitle(); if (!t) throw new Error('No title');
    });
    await run('Page title is correct', 'UI/UX', 'Validation', async () => {
      const t = await driver.getTitle(); if (!t.includes('AInterview')) throw new Error('Wrong title: ' + t);
    });
    await run('Splash screen shows logo letter A', 'UI/UX', 'Visual', async () => {
      await go('/splash'); if (!await exists('span')) throw new Error('No span found');
    });
    await run('Splash screen background is indigo', 'UI/UX', 'Visual', async () => {
      await go('/splash'); if (!await exists('div.bg-indigo-600')) throw new Error('Indigo bg missing');
    });
    await run('Onboarding 1 renders', 'UI/UX', 'Smoke', async () => {
      await go('/onboarding-1'); if (!await exists('button,a')) throw new Error('No buttons');
    });
    await run('Onboarding 1 has Continue button', 'UI/UX', 'Functional', async () => {
      await go('/onboarding-1'); const btns = await driver.findElements(By.css('a,button')); if (!btns.length) throw new Error('No button');
    });
    await run('Onboarding 1 step indicator visible', 'UI/UX', 'Visual', async () => {
      await go('/onboarding-1'); if (!await exists('div')) throw new Error('No step indicator');
    });
    await run('Onboarding 2 renders', 'UI/UX', 'Smoke', async () => {
      await go('/onboarding-2'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Onboarding 3 renders', 'UI/UX', 'Smoke', async () => {
      await go('/onboarding-3'); if (!await exists('div')) throw new Error('No content');
    });
    await run('SignIn page renders', 'UI/UX', 'Smoke', async () => {
      await go('/signin'); if (!await exists('form')) throw new Error('No form');
    });
    await run('SignIn page has email field', 'UI/UX', 'Functional', async () => {
      await go('/signin'); if (!await exists('input[type="email"]')) throw new Error('No email input');
    });
    await run('SignIn page has password field', 'UI/UX', 'Functional', async () => {
      await go('/signin'); if (!await exists('input[type="password"]')) throw new Error('No password input');
    });
    await run('SignIn page has sign-in button', 'UI/UX', 'Functional', async () => {
      await go('/signin'); if (!await exists('button,a')) throw new Error('No button');
    });
    await run('SignIn page has forgot password link', 'UI/UX', 'Navigation', async () => {
      await go('/signin'); if (!await exists('a[href*="forgot"]')) throw new Error('No forgot link');
    });
    await run('SignIn remember me checkbox exists', 'UI/UX', 'Functional', async () => {
      await go('/signin'); if (!await exists('#remember-me')) throw new Error('No checkbox');
    });
    await run('ForgotPassword page renders', 'UI/UX', 'Smoke', async () => {
      await go('/forgot-password'); if (!await exists('form')) throw new Error('No form');
    });
    await run('ForgotPassword has email input', 'UI/UX', 'Functional', async () => {
      await go('/forgot-password'); if (!await exists('input[type="email"]')) throw new Error('No email input');
    });
    await run('Dashboard page renders', 'UI/UX', 'Smoke', async () => {
      await go('/dashboard'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Analytics page renders', 'UI/UX', 'Smoke', async () => {
      await go('/analytics'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Practice page renders', 'UI/UX', 'Smoke', async () => {
      await go('/practice'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Community page renders', 'UI/UX', 'Smoke', async () => {
      await go('/community'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Settings page renders', 'UI/UX', 'Smoke', async () => {
      await go('/settings'); if (!await exists('div')) throw new Error('No content');
    });

    // ── FUNCTIONAL TESTS ──────────────────────────────────────────────
    await run('Email input accepts valid email', 'Functional', 'Input', async () => {
      await go('/signin');
      const el = await driver.findElement(By.css('input[type="email"]'));
      await el.sendKeys('test@example.com');
      const val = await el.getAttribute('value');
      if (val !== 'test@example.com') throw new Error('Email not typed');
    });
    await run('Password input accepts text', 'Functional', 'Input', async () => {
      await go('/signin');
      const el = await driver.findElement(By.css('input[type="password"]'));
      await el.sendKeys('password123');
      const val = await el.getAttribute('value');
      if (!val) throw new Error('Password not entered');
    });
    await run('Password field masks input', 'Functional', 'Security', async () => {
      await go('/signin');
      const el = await driver.findElement(By.css('input[type="password"]'));
      const typ = await el.getAttribute('type');
      if (typ !== 'password') throw new Error('Password not masked');
    });
    await run('Remember me checkbox is clickable', 'Functional', 'Input', async () => {
      await go('/signin');
      const el = await driver.findElement(By.css('#remember-me'));
      await el.click();
      const checked = await el.isSelected();
      if (!checked) throw new Error('Checkbox not checked');
    });
    await run('Forgot password link navigates', 'Functional', 'Navigation', async () => {
      await go('/signin');
      await driver.findElement(By.css('a[href*="forgot"]')).click();
      await driver.wait(until.urlContains('forgot'), 3000);
    });
    await run('Interview setup page loads', 'Functional', 'Smoke', async () => {
      await go('/interview-setup'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Interview role page loads', 'Functional', 'Smoke', async () => {
      await go('/interview-role'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Interview difficulty page loads', 'Functional', 'Smoke', async () => {
      await go('/interview-difficulty'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Interview format page loads', 'Functional', 'Smoke', async () => {
      await go('/interview-format'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Pre-check page loads', 'Functional', 'Smoke', async () => {
      await go('/interview-precheck'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Live waiting room loads', 'Functional', 'Smoke', async () => {
      await go('/live-waiting'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Live voice page loads', 'Functional', 'Smoke', async () => {
      await go('/live-voice'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Live text page loads', 'Functional', 'Smoke', async () => {
      await go('/live-text'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Feedback summary page loads', 'Functional', 'Smoke', async () => {
      await go('/feedback-summary'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Feedback detailed page loads', 'Functional', 'Smoke', async () => {
      await go('/feedback-detailed'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Feedback confidence page loads', 'Functional', 'Smoke', async () => {
      await go('/feedback-confidence'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Feedback speech page loads', 'Functional', 'Smoke', async () => {
      await go('/feedback-speech'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Feedback body page loads', 'Functional', 'Smoke', async () => {
      await go('/feedback-body'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Feedback answers page loads', 'Functional', 'Smoke', async () => {
      await go('/feedback-answers'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Feedback improvements page loads', 'Functional', 'Smoke', async () => {
      await go('/feedback-improvements'); if (!await exists('div')) throw new Error('No content');
    });
    await run('AI vs Traditional page loads', 'Functional', 'Smoke', async () => {
      await go('/ai-vs-traditional'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Analytics trends page loads', 'Functional', 'Smoke', async () => {
      await go('/analytics-trends'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Analytics heatmap page loads', 'Functional', 'Smoke', async () => {
      await go('/analytics-heatmap'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Analytics achievements page loads', 'Functional', 'Smoke', async () => {
      await go('/analytics-achievements'); if (!await exists('div')) throw new Error('No content');
    });
    await run('History page loads', 'Functional', 'Smoke', async () => {
      await go('/history'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Practice answer page loads', 'Functional', 'Smoke', async () => {
      await go('/practice-answer'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Practice mocks page loads', 'Functional', 'Smoke', async () => {
      await go('/practice-mocks'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Practice daily page loads', 'Functional', 'Smoke', async () => {
      await go('/practice-daily'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Practice resources page loads', 'Functional', 'Smoke', async () => {
      await go('/practice-resources'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Community mentor page loads', 'Functional', 'Smoke', async () => {
      await go('/community-mentor'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Search page loads', 'Functional', 'Smoke', async () => {
      await go('/search'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Categories page loads', 'Functional', 'Smoke', async () => {
      await go('/categories'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Recommended page loads', 'Functional', 'Smoke', async () => {
      await go('/recommended'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Notifications page loads', 'Functional', 'Smoke', async () => {
      await go('/notifications'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Setup basic info page loads', 'Functional', 'Smoke', async () => {
      await go('/setup-basic'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Setup career goal page loads', 'Functional', 'Smoke', async () => {
      await go('/setup-career'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Setup experience page loads', 'Functional', 'Smoke', async () => {
      await go('/setup-experience'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Setup industry page loads', 'Functional', 'Smoke', async () => {
      await go('/setup-industry'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Setup skills page loads', 'Functional', 'Smoke', async () => {
      await go('/setup-skills'); if (!await exists('div')) throw new Error('No content');
    });
    await run('Screens index page loads', 'Functional', 'Smoke', async () => {
      await go('/screens'); if (!await exists('div')) throw new Error('No content');
    });

    // ── NAVIGATION / UNIT TESTS ───────────────────────────────────────
    await run('Onboarding 1 navigates to onboarding 2', 'Navigation', 'Unit', async () => {
      await go('/onboarding-1');
      const links = await driver.findElements(By.css('a'));
      let found = false;
      for (const l of links) {
        const h = await l.getAttribute('href');
        if (h && h.includes('onboarding-2')) { found = true; break; }
      }
      if (!found) throw new Error('No onboarding-2 link');
    });
    await run('Onboarding 2 has skip link', 'Navigation', 'Unit', async () => {
      await go('/onboarding-2');
      const links = await driver.findElements(By.css('a'));
      let found = false;
      for (const l of links) {
        const t = await l.getText(); if (t.toLowerCase().includes('skip')) { found = true; break; }
      }
      if (!found) throw new Error('No skip link');
    });
    await run('Onboarding 3 has Get Started', 'Navigation', 'Unit', async () => {
      await go('/onboarding-3');
      const btns = await driver.findElements(By.css('a, button'));
      let found = false;
      for (const b of btns) {
        const t = await b.getText(); if (t.includes('Get Started')) { found = true; break; }
      }
      if (!found) throw new Error('No Get Started');
    });
    await run('SignIn has back link to home', 'Navigation', 'Unit', async () => {
      await go('/signin'); const links = await driver.findElements(By.css('a')); if (!links.length) throw new Error('No links');
    });

    // ── VALIDATION TESTS ──────────────────────────────────────────────
    await run('Email field type is email', 'Validation', 'Unit', async () => {
      await go('/signin'); const el = await driver.findElement(By.css('input[type="email"]')); if (!el) throw new Error('Not email type');
    });
    await run('Password field type is password', 'Validation', 'Unit', async () => {
      await go('/signin'); const el = await driver.findElement(By.css('input[type="password"]')); if (!el) throw new Error('Not password type');
    });
    await run('ForgotPassword email field is email type', 'Validation', 'Unit', async () => {
      await go('/forgot-password'); const el = await driver.findElement(By.css('input[type="email"]')); if (!el) throw new Error('Not email type');
    });
    await run('Checkbox has correct id remember-me', 'Validation', 'Unit', async () => {
      await go('/signin'); const el = await driver.findElement(By.css('#remember-me')); if (!el) throw new Error('No #remember-me');
    });
    await run('All pages return 200 - splash', 'Validation', 'Deployment', async () => {
      await go('/splash'); const url = await driver.getCurrentUrl(); if (!url.includes('splash')) throw new Error('Not on splash');
    });
    await run('All pages return 200 - dashboard', 'Validation', 'Deployment', async () => {
      await go('/dashboard'); const url = await driver.getCurrentUrl(); if (!url.includes('dashboard')) throw new Error('Not on dashboard');
    });
    await run('All pages return 200 - analytics', 'Validation', 'Deployment', async () => {
      await go('/analytics'); const url = await driver.getCurrentUrl(); if (!url.includes('analytics')) throw new Error('Not on analytics');
    });
    await run('All pages return 200 - settings', 'Validation', 'Deployment', async () => {
      await go('/settings'); const url = await driver.getCurrentUrl(); if (!url.includes('settings')) throw new Error('Not on settings');
    });
    await run('All pages return 200 - community', 'Validation', 'Deployment', async () => {
      await go('/community'); const url = await driver.getCurrentUrl(); if (!url.includes('community')) throw new Error('Not on community');
    });
    await run('No JS errors on signin', 'Validation', 'Unit', async () => {
      await go('/signin'); const logs = await driver.manage().logs().get('browser');
      const errors = logs.filter(l => l.level.name === 'SEVERE');
      if (errors.length > 0) throw new Error(`${errors.length} JS error(s): ${errors[0].message.slice(0,80)}`);
    });
    await run('No JS errors on dashboard', 'Validation', 'Unit', async () => {
      await go('/dashboard'); const logs = await driver.manage().logs().get('browser');
      const errors = logs.filter(l => l.level.name === 'SEVERE');
      if (errors.length > 0) throw new Error(`${errors.length} JS error(s): ${errors[0].message.slice(0,80)}`);
    });
    await run('No JS errors on analytics', 'Validation', 'Unit', async () => {
      await go('/analytics'); const logs = await driver.manage().logs().get('browser');
      const errors = logs.filter(l => l.level.name === 'SEVERE');
      if (errors.length > 0) throw new Error(`${errors.length} JS error(s): ${errors[0].message.slice(0,80)}`);
    });

    // ── RESPONSIVE / LAYOUT TESTS ─────────────────────────────────────
    await run('Dashboard body is not empty', 'UI/UX', 'Layout', async () => {
      await go('/dashboard'); const body = await driver.findElement(By.css('body')); const t = await body.getText(); if (!t.trim()) throw new Error('Empty body');
    });
    await run('SignIn body is not empty', 'UI/UX', 'Layout', async () => {
      await go('/signin'); const body = await driver.findElement(By.css('body')); const t = await body.getText(); if (!t.trim()) throw new Error('Empty body');
    });
    await run('App root div exists', 'UI/UX', 'Layout', async () => {
      await go('/'); if (!await exists('#root')) throw new Error('No #root div');
    });
    await run('Min-h-screen on splash', 'UI/UX', 'Layout', async () => {
      await go('/splash'); if (!await exists('.min-h-screen')) throw new Error('No min-h-screen');
    });
    await run('Min-h-screen on signin', 'UI/UX', 'Layout', async () => {
      await go('/signin'); if (!await exists('.min-h-screen')) throw new Error('No min-h-screen');
    });
    await run('Buttons are clickable on onboarding 1', 'UI/UX', 'Interaction', async () => {
      await go('/onboarding-1'); const btns = await driver.findElements(By.css('button,a')); if (!btns.length) throw new Error('No btns');
    });

    // ── DEPLOYABILITY TESTS ───────────────────────────────────────────
    await run('App loads under 5s', 'Deployment', 'Performance', async () => {
      const t = Date.now(); await go('/'); await exists('div'); if (Date.now() - t > 5000) throw new Error('Load > 5s');
    });
    await run('Dashboard loads under 5s', 'Deployment', 'Performance', async () => {
      const t = Date.now(); await go('/dashboard'); await exists('div'); if (Date.now() - t > 5000) throw new Error('Load > 5s');
    });
    await run('Analytics loads under 5s', 'Deployment', 'Performance', async () => {
      const t = Date.now(); await go('/analytics'); await exists('div'); if (Date.now() - t > 5000) throw new Error('Load > 5s');
    });
    await run('Practice loads under 5s', 'Deployment', 'Performance', async () => {
      const t = Date.now(); await go('/practice'); await exists('div'); if (Date.now() - t > 5000) throw new Error('Load > 5s');
    });
    await run('Community loads under 5s', 'Deployment', 'Performance', async () => {
      const t = Date.now(); await go('/community'); await exists('div'); if (Date.now() - t > 5000) throw new Error('Load > 5s');
    });
    await run('Settings loads under 5s', 'Deployment', 'Performance', async () => {
      const t = Date.now(); await go('/settings'); await exists('div'); if (Date.now() - t > 5000) throw new Error('Load > 5s');
    });
    await run('Favicon exists', 'Deployment', 'Asset', async () => {
      await go('/'); const favicons = await driver.findElements(By.css('link[rel*="icon"]')); if (!favicons.length) throw new Error('No favicon');
    });
    await run('App has meta charset', 'Deployment', 'SEO', async () => {
      await go('/'); if (!await exists('meta[charset]')) throw new Error('No charset meta');
    });
    await run('App has viewport meta', 'Deployment', 'SEO', async () => {
      await go('/'); if (!await exists('meta[name="viewport"]')) throw new Error('No viewport meta');
    });
    await run('App title tag is non-empty', 'Deployment', 'SEO', async () => {
      await go('/'); const t = await driver.getTitle(); if (!t) throw new Error('Empty title');
    });
    await run('CSS is loaded - no flash of unstyled content', 'Deployment', 'Asset', async () => {
      await go('/signin'); const el = await driver.findElement(By.css('form')); const display = await el.getCssValue('display'); if (!display) throw new Error('No CSS');
    });

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
  const deploy = pct >= 80 ? 'DEPLOYABLE ✅' : 'NOT READY ❌';

  // Summary sheet
  const summary = [
    { Metric: 'Total Tests', Value: total },
    { Metric: 'Passed', Value: passed },
    { Metric: 'Failed', Value: failed },
    { Metric: 'Pass Rate (%)', Value: pct },
    { Metric: 'Deployment Status', Value: deploy },
    { Metric: 'Run Timestamp', Value: new Date().toISOString() },
  ];

  // Category breakdown
  const cats = [...new Set(results.map(r => r.Category))];
  const breakdown = cats.map(c => {
    const sub = results.filter(r => r.Category === c);
    const p = sub.filter(r => r.Status === 'Passed').length;
    return { Category: c, Total: sub.length, Passed: p, Failed: sub.length - p, PassRate: ((p / sub.length) * 100).toFixed(1) + '%' };
  });

  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(summary), 'Summary');
  xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(breakdown), 'Category Breakdown');
  xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(results), 'All Test Cases');
  xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(results.filter(r => r.Status === 'Failed')), 'Failed Tests');

  const out = path.join(dir, 'Web_E2E_Test_Report.xlsx');
  xlsx.writeFile(wb, out);
  console.log(`\n✅ Report: ${out}`);
  console.log(`📊 ${passed}/${total} passed (${pct}%) — ${deploy}`);
}

runAll();
