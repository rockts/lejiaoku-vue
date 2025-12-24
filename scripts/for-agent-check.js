#!/usr/bin/env node
/*
LeJiaoKu for-agent rules enforcement
- Fail if `filterState.formats` exists anywhere in src
- Warn if file format terms (PPT/PDF/DOC/图片/视频) appear in filter UI components beyond ResourceCard
- Ensure filters are instant (emit update on change) by checking for presence of `update:filterState` emits in SearchBar
This is a lightweight heuristic to prevent common violations referenced in docs/for-agent.
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');

const glob = (dir, exts = ['.ts', '.js', '.vue']) => {
    const results = [];
    const walk = (d) => {
        for (const name of fs.readdirSync(d)) {
            const fp = path.join(d, name);
            const stat = fs.statSync(fp);
            if (stat.isDirectory()) {
                // skip node_modules, assets fonts/images
                if (/node_modules|assets\/font|assets\/img/.test(fp)) continue;
                walk(fp);
            } else {
                if (exts.includes(path.extname(fp))) results.push(fp);
            }
        }
    };
    walk(dir);
    return results;
};

const error = (msg, locations = []) => {
    console.error(`\n[for-agent] ${msg}`);
    for (const loc of locations) console.error(`  - ${loc}`);
};

let violations = 0;

// 1) Disallow filterState.formats
const files = glob(SRC);
const formatsHits = [];
for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    if (/filterState\s*\.\s*formats/.test(text)) {
        formatsHits.push(file);
    }
}
if (formatsHits.length) {
    violations++;
    error('禁止使用 `filterState.formats`，文件格式不可作为筛选条件（见 frontend-rules-for-agent.md）', formatsHits);
}

// 2) Disallow file format terms in filter UI outside ResourceCard
const formatTerms = /(PPT|PDF|DOC|图片|视频)/;
const uiHits = [];
for (const file of files) {
    if (file.includes('ResourceCard.vue')) continue; // allowed for display only
    const text = fs.readFileSync(file, 'utf8');
    // heuristic: appearance in options arrays or labels within components folder
    if (file.includes(path.join('src', 'app', 'components')) && formatTerms.test(text)) {
        uiHits.push(file);
    }
}
if (uiHits.length) {
    violations++;
    error('文件格式（PPT/PDF/DOC/图片/视频）只能在 ResourceCard 作为信息展示，禁止作为筛选/分类（见蓝图与前端规则）', uiHits);
}

// 3) Encourage instant filter updates (SearchBar emits update:filterState)
const searchBarPath = path.join(SRC, 'app', 'components', 'SearchBar.vue');
if (fs.existsSync(searchBarPath)) {
    const sb = fs.readFileSync(searchBarPath, 'utf8');
    if (!/update:filterState/.test(sb)) {
        violations++;
        error('筛选交互需即时生效：SearchBar 需通过 `update:filterState` 同步（见前端规则第四章）', [searchBarPath]);
    }
}

if (violations > 0) {
    console.error(`\n❌ for-agent 规则检查未通过：共 ${violations} 项问题。请参考 docs/for-agent/*.md 修复。`);
    process.exit(1);
} else {
    console.log('✅ for-agent 规则检查通过');
}
