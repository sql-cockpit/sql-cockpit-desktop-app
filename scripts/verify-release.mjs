import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
const { version } = JSON.parse(readFileSync('package.json', 'utf8'));
const tag = process.env.RELEASE_TAG;
if (tag !== `v${version}` || !/^v\d+\.\d+\.\d+$/.test(tag)) throw new Error('Tag must match the stable package version');
if (!process.argv.includes('--assets')) process.exit(0);
const expected = [`SQL-Cockpit-App-${version}-win-x64.exe`, `SQL-Cockpit-App-${version}-mac-arm64.dmg`, `SQL-Cockpit-App-${version}-mac-x64.dmg`, `SQL-Cockpit-App-${version}-linux-x86_64.AppImage`];
const names = readdirSync('artifacts');
for (const name of expected) {
  if (!names.includes(name) || statSync(`artifacts/${name}`).size < 1000000) throw new Error(`Missing or invalid installer: ${name}`);
  console.log(`${createHash('sha256').update(readFileSync(`artifacts/${name}`)).digest('hex')}  ${name}`);
}
if (names.filter(name => /\.(exe|dmg|AppImage)$/.test(name)).length !== 4) throw new Error('Unexpected installer set');
