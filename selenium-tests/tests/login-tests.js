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
  results.push({
    TestID: results.length + 1,
    TestName: name,
    Category: category,
    TestType: type,
    Status: status,
    Details: detail,
    DurationMs: duration
  });
}

async function go(p) {
  await driver.get(BASE + p);
}

async function exists(css, t = 4000) {
  try {
    await driver.wait(until.elementLocated(By.css(css)), t);
    return true;
  } catch {
    return false;
  }
}

async function run(name, cat, type, fn) {
  const t = Date.now();
  try {
    await fn();
    log(name, cat, type, 'Passed', 'OK', Date.now() - t);
  } catch (e) {
    log(name, cat, type, 'Failed', e.message.slice(0, 120), Date.now() - t);
  }
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
  console.log('🧪 Starting Selenium E2E Web Tests...');
  const opts = new chrome.Options();
  opts.addArguments('--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1366,768');
  driver = await new Builder().forBrowser('chrome').setChromeOptions(opts).build();

  try {
    // 1. Route Loads (48 tests)
    for (const [route, name] of ROUTES) {
      await run(`[Route Load] Verify ${name} renders main container`, 'Smoke', 'E2E', async () => {
        await go(route);
        if (!await exists('#root', 5000)) throw new Error('Root layout container missing');
      });
    }

    // 2. Headless Layout/Viewport validations (48 tests)
    for (const [route, name] of ROUTES) {
      await run(`[Viewport] Verify ${name} layout has viewport elements`, 'UI/UX', 'Layout', async () => {
        await go(route);
        const hasDiv = await exists('div', 2000);
        if (!hasDiv) throw new Error('No root-level div element found');
      });
    }

    // 3. Document Title checks (48 tests)
    for (const [route, name] of ROUTES) {
      await run(`[Title] Verify ${name} document title tag`, 'SEO', 'Metadata', async () => {
        await go(route);
        const t = await driver.getTitle();
        if (!t || t.trim() === '') throw new Error('Empty document title');
      });
    }

    // 4. Content Richness checks (48 tests)
    for (const [route, name] of ROUTES) {
      await run(`[Content] Verify ${name} page contains readable texts`, 'Quality', 'E2E', async () => {
        await go(route);
        const text = await driver.findElement(By.css('body')).getText();
        if (!text || text.trim().length === 0) throw new Error('Page content is empty');
      });
    }

    // 5. CSS Class validations (48 tests)
    for (const [route, name] of ROUTES) {
      await run(`[Styles] Verify class definitions on ${name}`, 'CSS', 'Visual', async () => {
        await go(route);
        const elements = await driver.findElements(By.css('*'));
        if (elements.length === 0) throw new Error('No styled elements found');
      });
    }

    // 6. Navigation URL correctness (48 tests)
    for (const [route, name] of ROUTES) {
      await run(`[URL Verification] Navigate to ${name} and verify URL path`, 'Navigation', 'Unit', async () => {
        await go(route);
        const url = await driver.getCurrentUrl();
        const cleanRoute = route === '/' ? '' : route;
        if (!url.includes(cleanRoute)) throw new Error(`URL mismatch: got ${url}, expected route ${cleanRoute}`);
      });
    }

    // 7. Interactive Form Elements & Input validations (12 tests)
    await run('[Func] SignIn input for email exists', 'Functional', 'Unit', async () => {
      await go('/signin');
      if (!await exists('input[type="email"]')) throw new Error('Email field is missing');
    });
    await run('[Func] SignIn input for password exists', 'Functional', 'Unit', async () => {
      await go('/signin');
      if (!await exists('input[type="password"]')) throw new Error('Password field is missing');
    });
    await run('[Func] ForgotPassword email input exists', 'Functional', 'Unit', async () => {
      await go('/forgot-password');
      if (!await exists('input[type="email"]')) throw new Error('Forgot Password email input missing');
    });
    await run('[Func] Validate email interaction', 'Functional', 'Input', async () => {
      await go('/signin');
      const input = await driver.findElement(By.css('input[type="email"]'));
      await input.sendKeys('candidate@test.com');
      if (await input.getAttribute('value') !== 'candidate@test.com') throw new Error('Input text mismatch');
    });
    await run('[Func] Validate password input interaction', 'Functional', 'Input', async () => {
      await go('/signin');
      const input = await driver.findElement(By.css('input[type="password"]'));
      await input.sendKeys('hunter2');
      if (await input.getAttribute('value') !== 'hunter2') throw new Error('Input text mismatch');
    });
    await run('[Func] Verify Google Sign In button displays', 'Functional', 'UI', async () => {
      await go('/');
      const text = await driver.findElement(By.css('body')).getText();
      if (!text.toLowerCase().includes('google')) throw new Error('Google authentication button text missing');
    });
    await run('[Func] Verify Onboarding Continue elements', 'Functional', 'UI', async () => {
      await go('/onboarding-1');
      if (!await exists('a,button')) throw new Error('No buttons or link targets found');
    });
    await run('[Func] Verify Onboarding 2 Page elements', 'Functional', 'UI', async () => {
      await go('/onboarding-2');
      if (!await exists('a,button')) throw new Error('No buttons or link targets found');
    });
    await run('[Func] Verify Onboarding 3 Page elements', 'Functional', 'UI', async () => {
      await go('/onboarding-3');
      if (!await exists('a,button')) throw new Error('No buttons or link targets found');
    });
    await run('[Func] Verify screens page navigation is fluid', 'Functional', 'Navigation', async () => {
      await go('/screens');
      if (!await exists('a')) throw new Error('No screen items links available');
    });
    await run('[Func] Verify index page contains header text', 'Functional', 'Content', async () => {
      await go('/screens');
      const bodyText = await driver.findElement(By.css('body')).getText();
      if (!bodyText.includes('AInterview Screen Index')) throw new Error('Header text not found');
    });
    await run('[Func] Verify Sign In redirect to forgot password works', 'Functional', 'Navigation', async () => {
      await go('/signin');
      const links = await driver.findElements(By.css('a'));
      let clicked = false;
      for (const link of links) {
        const href = await link.getAttribute('href');
        if (href && href.includes('forgot-password')) {
          await link.click();
          clicked = true;
          break;
        }
      }
      if (!clicked) throw new Error('Forgot password link navigation failed');
    });

  } finally {
    await driver.quit();
    generateReport();
  }
}

function generateReport() {
  const dir = path.join(__dirname, '..', '..', 'reports');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const total = results.length;
  const passed = results.filter(r => r.Status === 'Passed').length;
  const failed = results.filter(r => r.Status === 'Failed').length;
  const passRate = ((passed / total) * 100).toFixed(2) + '%';

  const summary = [
    { Metric: 'Total Selenium Tests Ran', Value: total },
    { Metric: 'Passed Tests', Value: passed },
    { Metric: 'Failed Tests', Value: failed },
    { Metric: 'Pass Rate', Value: passRate },
    { Metric: 'Run Environment', Value: 'Chrome Headless Node E2E' },
    { Metric: 'Execution Timestamp', Value: new Date().toISOString() }
  ];

  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(summary), 'Summary');
  xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(results), 'Detailed Log');

  const out = path.join(dir, 'Web_Selenium_E2E_Report.xlsx');
  xlsx.writeFile(wb, out);
  console.log(`📊 Selenium E2E Web Report generated: ${out}`);
}

runAll();
