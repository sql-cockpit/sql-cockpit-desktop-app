import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
const script=join(process.cwd(),'scripts/verify-release.mjs');
const fixture=mkdtempSync(join(tmpdir(),'desktop-release-'));
writeFileSync(join(fixture,'package.json'), JSON.stringify({version:'0.0.1'}));
mkdirSync(join(fixture,'artifacts'));
function run(tag,assets=false){return spawnSync(process.execPath,[script,...(assets?['--assets']:[])],{cwd:fixture,env:{...process.env,RELEASE_TAG:tag},encoding:'utf8'});}
test('matching stable tag succeeds',()=>assert.equal(run('v0.0.1').status,0));
test('wrong version and prerelease tags fail',()=>{assert.notEqual(run('v0.0.2').status,0);assert.notEqual(run('v0.0.1-beta').status,0);});
test('publication refuses missing or incomplete installers',()=>{assert.notEqual(run('v0.0.1',true).status,0);writeFileSync(join(fixture,'artifacts','SQL-Cockpit-App-0.0.1-win-x64.exe'),'invalid');assert.notEqual(run('v0.0.1',true).status,0);});
test('complete platform set produces checksums',()=>{for(const suffix of ['win-x64.exe','mac-arm64.dmg','mac-x64.dmg'])writeFileSync(join(fixture,'artifacts',`SQL-Cockpit-App-0.0.1-${suffix}`),Buffer.alloc(1000001));const result=run('v0.0.1',true);assert.equal(result.status,0,result.stderr);assert.equal(result.stdout.trim().split('\n').length,3);});
