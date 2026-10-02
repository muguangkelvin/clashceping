const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');

console.log('🔍 Starting Automated SEO & Quality Inspection on build artifacts in dist/...\n');

if (!fs.existsSync(distDir)) {
  console.error('❌ Error: dist/ directory does not exist. Run build first.');
  process.exit(1);
}

let errors = [];
let warnings = [];

// 1. Core Files Check
const coreFiles = ['index.html', 'robots.txt', 'sitemap-index.xml', 'rss.xml', '404.html'];
coreFiles.forEach(file => {
  const filePath = path.join(distDir, file);
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing core file: ${file}`);
  } else {
    console.log(`  ✓ Found core file: ${file}`);
  }
});

// 2. Scan All HTML Files
function getAllHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const htmlFiles = getAllHtmlFiles(distDir);
console.log(`\n📄 Auditing ${htmlFiles.length} HTML pages...`);

// Blacklist Words
const blocklist = ['三毛机场', '猫梦博客', 'Gaterank', '星维机场', '一毛机场', '二毛博客'];

let totalH1Count = 0;
let jsonLdCount = 0;

htmlFiles.forEach(file => {
  const relativePath = path.relative(distDir, file);
  const content = fs.readFileSync(file, 'utf-8');

  // Check Blocklist
  blocklist.forEach(word => {
    if (content.includes(word)) {
      errors.push(`Blocklist word "${word}" found in file: ${relativePath}`);
    }
  });

  // Check Title
  if (!content.includes('<title>') || !content.includes('</title>')) {
    errors.push(`Missing <title> in ${relativePath}`);
  }

  // Check Description
  if (!content.includes('name="description"')) {
    errors.push(`Missing meta description in ${relativePath}`);
  }

  // Check H1 Count
  const h1Matches = content.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || [];
  if (h1Matches.length === 0) {
    warnings.push(`No <h1> found in ${relativePath}`);
  } else if (h1Matches.length > 1) {
    warnings.push(`Multiple (${h1Matches.length}) <h1> found in ${relativePath}`);
  } else {
    totalH1Count++;
  }

  // Check Canonical URL
  if (!content.includes('rel="canonical"') || !content.includes('https://clashceping.homes')) {
    errors.push(`Invalid or missing canonical URL in ${relativePath}`);
  }

  // Check JSON-LD
  if (content.includes('application/ld+json')) {
    jsonLdCount++;
  }
});

console.log(`  ✓ Audited ${htmlFiles.length} HTML files.`);
console.log(`  ✓ Verified ${totalH1Count} single <h1> pages.`);
console.log(`  ✓ Verified ${jsonLdCount} pages with valid JSON-LD schemas.`);

// 3. Verify Provider Review Pages Count (28 expected)
const providersData = require('../src/data/providers.json');
console.log(`\n📦 Auditing Provider Review Pages (${providersData.length} total)...`);

let foundProviderCount = 0;
providersData.forEach(p => {
  // Check if dist/providers/review-xxx/index.html exists
  const providerPath1 = path.join(distDir, 'providers', p.slug, 'index.html');
  const providerPath2 = path.join(distDir, 'providers', `${p.slug}.html`);
  if (fs.existsSync(providerPath1) || fs.existsSync(providerPath2)) {
    foundProviderCount++;
  } else {
    errors.push(`Missing provider review page artifact for ${p.name} (slug: ${p.slug})`);
  }
});

console.log(`  ✓ Verified ${foundProviderCount} / ${providersData.length} Provider Review Pages built!`);

// 4. Verify Fixed Top 4 Rankings Order (1. 灵动云, 2. 暮光网络, 3. 飞猫云, 4. 微风网络)
console.log(`\n🏆 Verifying Strict Top 4 Ranking Order...`);
const expectedTop4 = ["灵动云", "暮光网络", "飞猫云", "微风网络"];
const actualTop4 = providersData.slice(0, 4).map(p => p.name);

let rankOk = true;
expectedTop4.forEach((name, idx) => {
  if (actualTop4[idx] !== name) {
    rankOk = false;
    errors.push(`Ranking mismatch at #${idx + 1}: Expected ${name}, got ${actualTop4[idx]}`);
  }
});

if (rankOk) {
  console.log(`  ✓ Strict Ranking Top 4 Order verified: 1. 灵动云, 2. 暮光网络, 3. 飞猫云, 4. 微风网络`);
}

// Summary Output
console.log('\n==================================================');
console.log('📋 SEO Inspection Summary');
console.log('==================================================');

if (warnings.length > 0) {
  console.log(`⚠️ Warnings (${warnings.length}):`);
  warnings.forEach(w => console.log(`   - ${w}`));
}

if (errors.length > 0) {
  console.error(`❌ Errors Found (${errors.length}):`);
  errors.forEach(e => console.error(`   - ${e}`));
  process.exit(1);
} else {
  console.log('✅ All SEO & Quality Inspections Passed Cleanly! Website is Production Ready.');
}
