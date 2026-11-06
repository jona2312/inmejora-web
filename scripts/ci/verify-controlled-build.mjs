import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root=fileURLToPath(new URL('../../dist-controlled/',import.meta.url));
const html=readFileSync(root+'index.html','utf8');
const files=readdirSync(root+'assets');
const css=files.filter(f=>f.endsWith('.css')).map(f=>readFileSync(root+'assets/'+f,'utf8')).join('\n');
const js=files.filter(f=>f.endsWith('.js')).map(f=>readFileSync(root+'assets/'+f,'utf8')).join('\n');
assert.match(html,/assets\/[^" ]+\.css/,'real built page must link emitted CSS');
assert.match(css,/\.rounded-lg\{/,'form utility must exist in emitted CSS');
assert.match(css,/background-color:rgb\(20 20 20/,'form background utility must exist');
assert.match(css,/\.space-y-5/,'spacing must survive build outside the Web working directory');
assert.match(js,/core-controlled/,'controlled artifact must declare its mode');
assert.match(js,/https:/,'controlled UI must retain HTTPS guard');
assert.doesNotMatch(html,/\/src\/|@vite\/client/,'no dev-server entrypoint in the artifact');
console.log('CONTROLLED_WEB_BUILD PASS: emitted CSS and production bundle; browser QA remains separate');
