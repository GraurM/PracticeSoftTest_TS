const { spawnSync } = require('node:child_process');

const scriptPath = 'tests/performance/homepage.k6.js';

const runLocal = () => {
  return spawnSync('k6', ['run', scriptPath], {
    stdio: 'inherit',
    shell: true,
  });
};

const runDocker = () => {
  return spawnSync(
    'docker',
    [
      'run',
      '--rm',
      '-i',
      '-v',
      `${process.cwd()}:/work`,
      '-w',
      '/work',
      'grafana/k6:latest',
      'run',
      scriptPath,
    ],
    {
      stdio: 'inherit',
      shell: true,
    }
  );
};

console.log('Running performance tests with local k6...');
const localRun = runLocal();

if (localRun.status === 0) {
  process.exit(0);
}

console.log('Local k6 failed or is unavailable. Trying Docker k6...');
const dockerRun = runDocker();

if (dockerRun.status === 0) {
  process.exit(0);
}

console.error('Unable to run k6 locally or via Docker. Install k6 or ensure Docker is available.');
process.exit(1);
