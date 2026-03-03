const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const scriptPath = path.join('tests', 'performance', 'homepage.k6.js');
const summaryPath = path.join('k6-results', 'k6-summary.json');
const metricsPath = path.join('k6-results', 'k6-metrics.json');
const logPath = path.join('logs', 'k6-performance.log');
const outputDir = 'allure-results';

const ensureDir = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true });
};

const safeReadJson = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
};

const safeReadText = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return '';
    }
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return '';
  }
};

const writeAttachment = (dirPath, extension, content) => {
  const uuid = crypto.randomUUID();
  const filename = `${uuid}-attachment.${extension}`;
  fs.writeFileSync(path.join(dirPath, filename), content, 'utf-8');
  return filename;
};

const formatMetricLine = (name, metric) => {
  if (!metric || typeof metric !== 'object') {
    return `${name}: n/a`;
  }

  const values = metric.values || {};
  const parts = [];

  if (typeof values.count !== 'undefined') {
    parts.push(`count=${values.count}`);
  }
  if (typeof values.rate !== 'undefined') {
    parts.push(`rate=${values.rate}`);
  }
  if (typeof values.avg !== 'undefined') {
    parts.push(`avg=${values.avg}`);
  }
  if (typeof values.p95 !== 'undefined') {
    parts.push(`p95=${values.p95}`);
  }
  if (typeof values.max !== 'undefined') {
    parts.push(`max=${values.max}`);
  }
  if (typeof values.fails !== 'undefined') {
    parts.push(`fails=${values.fails}`);
  }

  if (parts.length === 0) {
    return `${name}: no numeric values`;
  }

  return `${name}: ${parts.join(', ')}`;
};

const runK6Local = () => {
  ensureDir(path.dirname(summaryPath));
  ensureDir(path.dirname(logPath));

  const command = `k6 run --summary-export=${summaryPath} --out json=${metricsPath} "${scriptPath}" > "${logPath}" 2>&1`;
  return spawnSync(command, {
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });
};

const runK6Docker = () => {
  ensureDir(path.dirname(summaryPath));
  ensureDir(path.dirname(logPath));

  const command = `docker run --rm -i -v "${process.cwd()}:/work" -w /work grafana/k6:latest run --summary-export=${summaryPath} --out json=${metricsPath} "${scriptPath}" > "${logPath}" 2>&1`;
  return spawnSync(command, {
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });
};

const runK6 = () => {
  if (!fs.existsSync(scriptPath)) {
    console.error(`k6 script not found at: ${scriptPath}`);
    return 1;
  }

  console.log('Running performance tests with local k6...');
  const localRun = runK6Local();
  if (localRun.status === 0) {
    return 0;
  }

  console.log('Local k6 failed or is unavailable. Trying Docker k6...');
  const dockerRun = runK6Docker();
  if (dockerRun.status === 0) {
    return 0;
  }

  console.error('Unable to run k6 locally or via Docker. Install k6 or ensure Docker is available.');
  return dockerRun.status ?? 1;
};

const generateAllure = () => {
  const summary = safeReadJson(summaryPath);
  const logText = safeReadText(logPath);
  const now = Date.now();

  let status = 'broken';
  let statusMessage = 'k6 summary file was not found or invalid.';

  const checksMetric = summary?.metrics?.checks;
  const failedChecks = checksMetric?.values?.fails ?? null;
  const passedChecks = checksMetric?.values?.passes ?? null;

  if (summary) {
    const hasFailures = typeof failedChecks === 'number' ? failedChecks > 0 : false;
    status = hasFailures ? 'failed' : 'passed';

    const checksDetails = [];
    if (typeof passedChecks === 'number') {
      checksDetails.push(`passes=${passedChecks}`);
    }
    if (typeof failedChecks === 'number') {
      checksDetails.push(`fails=${failedChecks}`);
    }

    statusMessage = checksDetails.length > 0
      ? `k6 checks: ${checksDetails.join(', ')}`
      : 'k6 completed and produced summary metrics.';
  }

  ensureDir(outputDir);

  const summaryLines = [
    `Status: ${status}`,
    `Message: ${statusMessage}`,
    '',
    formatMetricLine('checks', summary?.metrics?.checks),
    formatMetricLine('http_req_failed', summary?.metrics?.http_req_failed),
    formatMetricLine('http_req_duration', summary?.metrics?.http_req_duration),
    formatMetricLine('http_reqs', summary?.metrics?.http_reqs),
  ];

  const attachments = [];

  const metricsAttachment = writeAttachment(outputDir, 'txt', summaryLines.join('\n'));
  attachments.push({
    name: 'k6-summary.txt',
    source: metricsAttachment,
    type: 'text/plain',
  });

  if (summary) {
    const rawSummaryAttachment = writeAttachment(outputDir, 'json', JSON.stringify(summary, null, 2));
    attachments.push({
      name: 'k6-summary.json',
      source: rawSummaryAttachment,
      type: 'application/json',
    });
  }

  if (logText) {
    const logAttachment = writeAttachment(outputDir, 'log', logText);
    attachments.push({
      name: 'k6-execution.log',
      source: logAttachment,
      type: 'text/plain',
    });
  }

  const result = {
    uuid: crypto.randomUUID(),
    historyId: 'k6-homepage-performance',
    testCaseId: 'k6-homepage-performance',
    fullName: 'k6 homepage performance',
    name: 'k6 homepage performance',
    status,
    statusDetails: {
      message: statusMessage,
    },
    stage: 'finished',
    start: now,
    stop: now + 1,
    labels: [
      { name: 'suite', value: 'Performance' },
      { name: 'subSuite', value: 'k6' },
      { name: 'framework', value: 'k6' },
      { name: 'language', value: 'javascript' },
    ],
    attachments,
  };

  fs.writeFileSync(
    path.join(outputDir, `${result.uuid}-result.json`),
    JSON.stringify(result, null, 2),
    'utf-8'
  );

  const executor = {
    name: 'GitHub Actions',
    type: 'github',
    buildName: process.env.GITHUB_WORKFLOW || 'Load Tests (k6)',
    buildUrl: `${process.env.GITHUB_SERVER_URL || 'https://github.com'}/${process.env.GITHUB_REPOSITORY || ''}/actions/runs/${process.env.GITHUB_RUN_ID || ''}`,
  };

  fs.writeFileSync(path.join(outputDir, 'executor.json'), JSON.stringify(executor, null, 2), 'utf-8');
  console.log(`Allure results generated in ${outputDir}`);
  return 0;
};

const mode = process.argv[2] || 'run';

if (mode === 'run') {
  process.exit(runK6());
}

if (mode === 'allure') {
  process.exit(generateAllure());
}

if (mode === 'ci') {
  const runStatus = runK6();
  const allureStatus = generateAllure();
  if (runStatus !== 0) {
    process.exit(runStatus);
  }
  process.exit(allureStatus);
}

console.error(`Unknown mode: ${mode}. Use one of: run, allure, ci.`);
process.exit(1);
