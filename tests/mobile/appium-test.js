import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Appium test results are simulated here because they require a physical
// device/emulator + Appium server. When running in CI with a real device,
// replace this with the actual webdriverio remote() calls.
const mobileTests = [
  { TestName: 'App launches on Android', Category: 'Mobile', Status: 'Simulated', Detail: 'Requires Appium server + emulator' },
  { TestName: 'Splash screen visible', Category: 'Mobile', Status: 'Simulated', Detail: 'Requires Appium server + emulator' },
  { TestName: 'Can navigate to onboarding', Category: 'Mobile', Status: 'Simulated', Detail: 'Requires Appium server + emulator' },
  { TestName: 'SignIn form renders on mobile', Category: 'Mobile', Status: 'Simulated', Detail: 'Requires Appium server + emulator' },
  { TestName: 'Keyboard opens on email field', Category: 'Mobile', Status: 'Simulated', Detail: 'Requires Appium server + emulator' },
  { TestName: 'Can type in email field', Category: 'Mobile', Status: 'Simulated', Detail: 'Requires Appium server + emulator' },
  { TestName: 'Can type in password field', Category: 'Mobile', Status: 'Simulated', Detail: 'Requires Appium server + emulator' },
  { TestName: 'Sign in button tappable', Category: 'Mobile', Status: 'Simulated', Detail: 'Requires Appium server + emulator' },
  { TestName: 'Dashboard loads on mobile', Category: 'Mobile', Status: 'Simulated', Detail: 'Requires Appium server + emulator' },
  { TestName: 'Navigation bar visible', Category: 'Mobile', Status: 'Simulated', Detail: 'Requires Appium server + emulator' },
  { TestName: 'Interview setup accessible', Category: 'Mobile', Status: 'Simulated', Detail: 'Requires Appium server + emulator' },
  { TestName: 'Back button works', Category: 'Mobile', Status: 'Simulated', Detail: 'Requires Appium server + emulator' },
];

function generateReport() {
  const dir = path.join(__dirname, '..', '..', 'reports');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const summary = [
    { Metric: 'Total Mobile Tests', Value: mobileTests.length },
    { Metric: 'Note', Value: 'Connect Appium server + Android emulator to run live tests' },
    { Metric: 'Run Timestamp', Value: new Date().toISOString() },
  ];

  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(summary), 'Summary');
  xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(mobileTests), 'Mobile Test Cases');

  const out = path.join(dir, 'Appium_Mobile_Test_Report.xlsx');
  xlsx.writeFile(wb, out);
  console.log(`✅ Appium Report: ${out}`);
}

console.log('📱 Generating Appium Mobile Test Report...');
generateReport();
