const fs = require('fs');
const path = require('path');
const providers = require('../src/data/providers.json');
const profile = require('../docs/site-seo-profile.json');

// 1. Generate docs/provider-review-matrix.md
let pMd = `# 28 家机场独立测评矩阵 (Provider Review Matrix)\n\n`;
pMd += `| 排名 | 机场名称 | 规范 URL | 主关键词 | 状态 | 参考起步价 | 落地特性 | 核验日期 |\n`;
pMd += `|---|---|---|---|---|---|---|---|\n`;

providers.forEach(p => {
  pMd += `| #${p.rank} | ${p.name} | /providers/${p.slug}/ | ${p.name}机场测评 | 已完成 | ${p.priceFrom || '以结算页为准'} | ${p.suitableFor} | ${p.lastChecked} |\n`;
});

fs.writeFileSync(path.join(__dirname, '../docs/provider-review-matrix.md'), pMd, 'utf-8');

// 2. Generate docs/navigation-content-matrix.md
let nMd = `# 导航栏目落地页与文章集矩阵 (Navigation Content Matrix)\n\n`;
nMd += `| 导航名称 | 目标 URL | 页面类型 | 主关键词 | 计划文章数 | 文章种子列表 |\n`;
nMd += `|---|---|---|---|---|---|\n`;

profile.navigationItems.forEach(item => {
  if (item.url === '/') return;
  nMd += `| ${item.label} | ${item.url} | ${item.type} | ${item.primaryKeyword} | ${item.articleCount} | ${item.articleSeeds.join('<br>')} |\n`;
});

fs.writeFileSync(path.join(__dirname, '../docs/navigation-content-matrix.md'), nMd, 'utf-8');

console.log("Matrices generated successfully!");
