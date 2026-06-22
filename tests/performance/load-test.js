import autocannon from 'autocannon';
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE = 'http://localhost:5173';
const ROUTES = [
  '/ainterview-platform/',
  '/ainterview-platform/signin',
  '/ainterview-platform/dashboard',
  '/ainterview-platform/analytics',
  '/ainterview-platform/practice',
  '/ainterview-platform/community',
  '/ainterview-platform/settings',
];

async function loadTest(url) {
  return new Promise((resolve) => {
    const instance = autocannon({
      url: BASE + url,
      connections: 10,
      duration: 5,
      pipelining: 1,
    }, (err, result) => {
      if (err) { resolve({ url, error: err.message }); return; }
      resolve({
        URL: url,
        Requests_Total: result.requests.total,
        Throughput_ReqPerSec: result.requests.average.toFixed(2),
        Latency_Avg_ms: result.latency.average.toFixed(2),
        Latency_P99_ms: result.latency.p99,
        Errors: result.errors,
        Timeouts: result.timeouts,
        Status: result.errors === 0 && result.latency.average < 500 ? 'Passed ✅' : 'Warning ⚠️',
      });
    });
    autocannon.track(instance, { renderProgressBar: false });
  });
}

async function main() {
  console.log('⚡ Running Load Tests...');
  const results = [];

  for (const route of ROUTES) {
    console.log(`  Testing: ${route}`);
    const r = await loadTest(route);
    results.push(r);
  }

  const dir = path.join(__dirname, '..', '..', 'reports');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const passed = results.filter(r => r.Status && r.Status.includes('Passed')).length;
  const summary = [
    { Metric: 'URLs Tested', Value: results.length },
    { Metric: 'Passed', Value: passed },
    { Metric: 'Warnings/Failed', Value: results.length - passed },
    { Metric: 'Connections Per Test', Value: 10 },
    { Metric: 'Duration Per Test (s)', Value: 5 },
    { Metric: 'Run Timestamp', Value: new Date().toISOString() },
  ];

  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(summary), 'Summary');
  xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(results), 'Load Test Results');

  const out = path.join(dir, 'Load_Test_Report.xlsx');
  xlsx.writeFile(wb, out);
  console.log(`✅ Load Test Report: ${out}`);
}

main();
