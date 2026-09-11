import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import os from 'node:os';

const report = JSON.parse(await readFile('browser-results/results.json', 'utf8'));
if (report.stats.unexpected || report.stats.flaky || report.errors.length) throw new Error('Only a clean browser run can be published as passing evidence');
const destination = 'docs/p0/browser-evidence';
await mkdir(destination, { recursive: true });
const tests = [];
async function visit(suite) {
  for (const spec of suite.specs || []) {
    for (const test of spec.tests) {
      const result = test.results.at(-1);
      const attachment = result.attachments.find(item => item.name === 'network-audit');
      const audit = attachment ? JSON.parse(Buffer.from(attachment.body, 'base64').toString()) : null;
      tests.push({ title: spec.title, project: test.projectName, status: test.status, durationMs: result.duration,
        requests: audit?.requests.length, forbidden: audit?.forbidden.length, unexpected: audit?.unexpected.length,
        consoleErrors: audit?.consoleErrors });
      const name = spec.title === 'route /' ? 'home' : spec.title === 'navigation, history and contact keyboard' ? 'contact' : null;
      if (name) {
        const screenshot = result.attachments.find(item => item.contentType === 'image/png');
        if (screenshot?.body) await writeFile(`${destination}/${name}-${test.projectName}.png`, Buffer.from(screenshot.body, 'base64'));
      }
    }
  }
  for (const child of suite.suites || []) await visit(child);
}
for (const suite of report.suites) await visit(suite);
const browsers = JSON.parse(await readFile('node_modules/playwright-core/browsers.json', 'utf8'));
const summary = {
  generatedAt: new Date().toISOString(), sourceBase: '0c2b9d4049411f2bb03536b5240e38b5dd041c2b',
  platform: `${os.platform()} ${os.release()}`, node: process.version,
  chromium: browsers.browsers.find(item => item.name === 'chromium').browserVersion,
  buildIndexSha256: createHash('sha256').update(await readFile('dist/index.html')).digest('hex'),
  stats: report.stats, tests,
};
await writeFile(`${destination}/browser-summary.json`, JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify({ stats: report.stats, chromium: summary.chromium, tests: tests.length }));
