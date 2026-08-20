import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPORTS_DIR = path.join(__dirname, '..', 'reports');

function readReport(file) {
  const full = path.join(REPORTS_DIR, file);
  if (!fs.existsSync(full)) return null;
  const wb = xlsx.readFile(full);
  const summary = xlsx.utils.sheet_to_json(wb.Sheets['Summary'] || wb.Sheets[wb.SheetNames[0]]);
  return summary;
}

function main() {
  console.log('📋 Generating Master Combined Report...');
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

  const selenium = readReport('Web_E2E_Test_Report.xlsx') || readReport('Web_Selenium_E2E_Report.xlsx');
  const vuln = readReport('Vulnerability_Test_Report.xlsx');
  const load = readReport('Load_Test_Report.xlsx');
  const appium = readReport('Appium_Mobile_Test_Report.xlsx') || readReport('Appium_Mobile_E2E_Report.xlsx');

  const masterSummary = [
    { TestSuite: 'Selenium E2E', ...(selenium ? Object.fromEntries(selenium.map(r => [r.Metric, r.Value])) : { Note: 'Report not found' }) },
    { TestSuite: 'Vulnerability', ...(vuln ? Object.fromEntries(vuln.map(r => [r.Metric, r.Value])) : { Note: 'Report not found' }) },
    { TestSuite: 'Load Testing', ...(load ? Object.fromEntries(load.map(r => [r.Metric, r.Value])) : { Note: 'Report not found' }) },
    { TestSuite: 'Appium Mobile', ...(appium ? Object.fromEntries(appium.map(r => [r.Metric, r.Value])) : { Note: 'Report not found' }) },
  ];

  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(masterSummary), 'Master Summary');

  // Include all individual sheets
  [
    'Web_E2E_Test_Report.xlsx',
    'Web_Selenium_E2E_Report.xlsx',
    'Vulnerability_Test_Report.xlsx',
    'Load_Test_Report.xlsx',
    'Appium_Mobile_Test_Report.xlsx',
    'Appium_Mobile_E2E_Report.xlsx'
  ].forEach(file => {
    const full = path.join(REPORTS_DIR, file);
    if (!fs.existsSync(full)) return;
    const src = xlsx.readFile(full);
    const prefix = file.split('_')[0];
    src.SheetNames.forEach(name => {
      const key = `${prefix}_${name}`.slice(0, 31);
      wb.Sheets[key] = src.Sheets[name];
      wb.SheetNames.push(key);
    });
  });

  const out = path.join(REPORTS_DIR, 'MASTER_Test_Report.xlsx');
  xlsx.writeFile(wb, out);
  console.log(`✅ Master Report: ${out}`);
}

main();
