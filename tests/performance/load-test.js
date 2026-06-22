import autocannon from 'autocannon';
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE = 'http://localhost:5173';

const ROUTES = [
  '/ainterview-platform/', '/ainterview-platform/splash',
  '/ainterview-platform/onboarding-1', '/ainterview-platform/onboarding-2',
  '/ainterview-platform/onboarding-3', '/ainterview-platform/signin',
  '/ainterview-platform/forgot-password', '/ainterview-platform/setup-basic',
  '/ainterview-platform/setup-career', '/ainterview-platform/setup-experience',
  '/ainterview-platform/setup-industry', '/ainterview-platform/setup-skills',
  '/ainterview-platform/dashboard', '/ainterview-platform/search',
  '/ainterview-platform/categories', '/ainterview-platform/recommended',
  '/ainterview-platform/notifications', '/ainterview-platform/interview-setup',
  '/ainterview-platform/interview-role', '/ainterview-platform/interview-difficulty',
  '/ainterview-platform/interview-format', '/ainterview-platform/interview-precheck',
  '/ainterview-platform/live-waiting', '/ainterview-platform/live-voice',
  '/ainterview-platform/live-text', '/ainterview-platform/live-pause',
  '/ainterview-platform/feedback-summary', '/ainterview-platform/feedback-detailed',
  '/ainterview-platform/feedback-confidence', '/ainterview-platform/feedback-speech',
  '/ainterview-platform/feedback-body', '/ainterview-platform/feedback-answers',
  '/ainterview-platform/feedback-improvements', '/ainterview-platform/ai-vs-traditional',
  '/ainterview-platform/analytics', '/ainterview-platform/analytics-trends',
  '/ainterview-platform/analytics-heatmap', '/ainterview-platform/analytics-achievements',
  '/ainterview-platform/history', '/ainterview-platform/practice',
  '/ainterview-platform/practice-answer', '/ainterview-platform/practice-mocks',
  '/ainterview-platform/practice-daily', '/ainterview-platform/practice-resources',
  '/ainterview-platform/community', '/ainterview-platform/community-mentor',
  '/ainterview-platform/settings', '/ainterview-platform/screens',
];

// Load profiles: [connections, duration, label]
const PROFILES = [
  [1,  3, 'Single User'],
  [5,  3, 'Light Load (5 users)'],
  [10, 3, 'Normal Load (10 users)'],
  [25, 3, 'Medium Load (25 users)'],
  [50, 5, 'Heavy Load (50 users)'],
  [100,5, 'Stress Test (100 users)'],
  [200,5, 'Spike Test (200 users)'],
];

async function test(url, connections, duration, label) {
  return new Promise((resolve) => {
    autocannon({ url: BASE + url, connections, duration, pipelining: 1 }, (err, r) => {
      if (err) { resolve({ Route: url, Profile: label, Connections: connections, Duration: duration, Error: err.message, Status: 'Error ❌' }); return; }
      const avgLatency = r.latency.average;
      const status = r.errors > 0 ? 'Failed ❌' : avgLatency < 200 ? 'Passed ✅' : avgLatency < 1000 ? 'Warning ⚠️' : 'Failed ❌';
      resolve({
        Route: url,
        Profile: label,
        Connections: connections,
        Duration_s: duration,
        Total_Requests: r.requests.total,
        Req_Per_Sec: r.requests.average.toFixed(1),
        Avg_Latency_ms: avgLatency.toFixed(1),
        P50_ms: r.latency.p50,
        P99_ms: r.latency.p99,
        Max_Latency_ms: r.latency.max,
        Errors: r.errors,
        Timeouts: r.timeouts,
        Throughput_MB: (r.throughput.total / 1024 / 1024).toFixed(2),
        Status: status,
      });
    });
  });
}

async function main() {
  console.log('⚡ Running Load Tests across all routes and profiles...');
  const results = [];

  // Test each route under each profile - generates 48 routes × 7 profiles = 336 scenarios
  for (const route of ROUTES) {
    for (const [connections, duration, label] of PROFILES) {
      process.stdout.write(`  ${label} → ${route}\r`);
      const r = await test(route, connections, duration, label);
      results.push(r);
    }
  }

  console.log(`\nTotal load test scenarios: ${results.length}`);

  const dir = path.join(__dirname, '..', '..', 'reports');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const passed = results.filter(r => r.Status && r.Status.includes('Passed')).length;
  const warned = results.filter(r => r.Status && r.Status.includes('Warning')).length;
  const failed = results.filter(r => r.Status && (r.Status.includes('Failed') || r.Status.includes('Error'))).length;

  // Per-route summary
  const routeSummary = ROUTES.map(route => {
    const sub = results.filter(r => r.Route === route);
    const avgLatAll = sub.map(r => parseFloat(r.Avg_Latency_ms) || 0);
    const avgLat = (avgLatAll.reduce((a, b) => a + b, 0) / avgLatAll.length).toFixed(1);
    return {
      Route: route,
      Tests: sub.length,
      Passed: sub.filter(r => r.Status && r.Status.includes('Passed')).length,
      Warnings: sub.filter(r => r.Status && r.Status.includes('Warning')).length,
      Failed: sub.filter(r => r.Status && (r.Status.includes('Failed') || r.Status.includes('Error'))).length,
      Avg_Latency_ms: avgLat,
    };
  });

  const summary = [
    { Metric: 'Total Scenarios', Value: results.length },
    { Metric: 'Routes Tested', Value: ROUTES.length },
    { Metric: 'Load Profiles', Value: PROFILES.length },
    { Metric: 'Passed', Value: passed },
    { Metric: 'Warnings', Value: warned },
    { Metric: 'Failed', Value: failed },
    { Metric: 'Overall Status', Value: failed === 0 ? 'STABLE ✅' : 'ISSUES FOUND ❌' },
    { Metric: 'Timestamp', Value: new Date().toISOString() },
  ];

  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(summary), 'Summary');
  xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(routeSummary), 'Route Summary');
  xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(results), 'All Scenarios');
  xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(results.filter(r => r.Status && !r.Status.includes('Passed'))), 'Issues');

  const out = path.join(dir, 'Load_Test_Report.xlsx');
  xlsx.writeFile(wb, out);
  console.log(`✅ Load Test Report (${results.length} scenarios): ${out}`);
  console.log(`✅ Passed: ${passed} | ⚠️ Warned: ${warned} | ❌ Failed: ${failed}`);
}

main();
