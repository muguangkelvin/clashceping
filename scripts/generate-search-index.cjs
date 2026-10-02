const fs = require('fs');
const path = require('path');

const providersPath = path.join(__dirname, '../src/data/providers.json');
const faqsPath = path.join(__dirname, '../src/data/faqs.json');
const outputPath = path.join(__dirname, '../public/search-index.json');

console.log('🔍 Generating Universal Search Index (public/search-index.json)...');

const providers = JSON.parse(fs.readFileSync(providersPath, 'utf-8'));
const faqs = JSON.parse(fs.readFileSync(faqsPath, 'utf-8'));

const commonSynonyms = [
  '魔法上网', '科学上网', '翻墙机场', '梯子推荐', '看油管卡', '买机场', 
  '看推特', '用ChatGPT', 'clash', 'verge', 'singbox', 'sing-box', 
  'jichang', 'tizi', 'mofa', 'fanqiang', 'xiaoheji', '小火箭', 'v2ray', 
  'trojan', 'hysteria', '节点超时', '订阅更新失败', '连不上', '小白怎么买'
];

function cleanText(str) {
  if (!str) return '';
  return str
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

const searchItems = [];

// 1. Providers (28 items)
providers.forEach((p) => {
  searchItems.push({
    id: `provider-${p.slug}`,
    title: `${p.name} - 2026最新机场测评与节点使用指南`,
    url: `/providers/${p.slug}/`,
    category: '机场测评',
    description: `【${p.name}】${p.summary || ''} 线路架构: ${p.lineType || 'IEPL/BGP'}，协议支持: ${(p.protocolSupport || []).join('/')}，套餐起步价: ${p.priceFrom || ''}。`,
    keywords: [
      p.name,
      p.alternateName || '',
      p.lineType || '',
      ...(p.protocolSupport || []),
      ...(p.keywords || []),
      '机场推荐', '专线机场', '速度测评', '节点解锁', '晚高峰稳定'
    ].filter(Boolean),
    search_synonyms: [
      'jichang', 'ceping', 'v2ray', 'trojan', 'hysteria2', 'shadowsocks', 
      'clash', 'singbox', 'sing-box', 'verge', 'xiaoheji', '小火箭', '梯子', 
      '魔法上网', '科学上网', '翻墙', '油管4K', 'Netflix解锁', 'ChatGPT风控', ...commonSynonyms
    ],
    tags: [p.lineType || 'IEPL专线', ...(p.protocolSupport || []), '机场推荐']
  });
});

// 2. FAQs (78 items)
faqs.forEach((faq) => {
  const cleanAns = cleanText(faq.answer || '');
  searchItems.push({
    id: `faq-${faq.slug}`,
    title: faq.questionTitle || faq.keyword || '常见机场使用疑问解答',
    url: `/faq/${faq.slug}/`,
    category: faq.cluster || '常见问答',
    description: cleanAns.length > 150 ? cleanAns.slice(0, 150) + '...' : cleanAns,
    keywords: [
      faq.primaryKeyword || '',
      ...(faq.supportingKeywords || []),
      'FAQ问答', '疑难解答', '排坑指南', '节点超时', '订阅更新失败'
    ].filter(Boolean),
    search_synonyms: [
      'wenti', 'jiaocheng', 'clash', 'v2ray', 'trojan', 'sing-box', 
      '节点超时', '订阅更新失败', '连不上', '端口封锁', '看油管卡', 
      '小火箭怎么填', 'DNS污染', '无法更新', '小白怎么买', ...commonSynonyms
    ],
    tags: [faq.cluster || '常见问题', '使用教程']
  });
});

// 3. Static Guides (5 items)
const guides = [
  {
    slug: 'beginner-guide',
    title: '零基础小白第一次购买机场与配置Clash全流程',
    desc: '手把手教你如何选套餐、注册账号、复制订阅链接并完成第一连接。包含Clash Verge Rev、小火箭与Sing-box配置指南。',
    keywords: ['零基础小白', '第一次买机场', 'Clash配置教程', '一键导入订阅', '小火箭填法', '科学上网入门'],
    synonyms: ['xiaobai', 'jiaocheng', 'xiaoheji', 'clash', 'verge', 'singbox', 'v2ray', 'trojan', '魔法上网', '梯子']
  },
  {
    slug: 'traffic-guide',
    title: '如何看懂套餐流量、计费周期与节点倍率',
    desc: '拆解按月重置流量与一次性不限时流量包的成本换算算法。',
    keywords: ['套餐流量', '计费周期', '节点倍率', '不限时流量包', '流量扣费', '性价比换算'],
    synonyms: ['liuliang', 'beilü', 'beilu', 'buxianshi', '套餐选择', '省钱指南']
  },
  {
    slug: 'plan-calculator',
    title: '根据家庭设备数与使用场景精准计算流量需求',
    desc: '预估4K追剧、网页办公与AI工具交互的实际GB耗费量。',
    keywords: ['流量计算器', '设备数', '4K追剧流量', 'ChatGPT流量', '网页办公耗费', '买多少流量'],
    synonyms: ['jisuan', '4k', 'youguan', 'netflix', '流量不够用']
  },
  {
    slug: 'pre-purchase-checklist',
    title: '购买机场前必看检查清单与风险防范',
    desc: '避免遇到跑路机场、虚标无限流量与端口封锁的六大防坑法则。',
    keywords: ['购买检查清单', '防坑指南', '跑路机场防范', '端口封锁', '虚标流量', '稳定选择'],
    synonyms: ['paolu', 'fangkeng', 'fengsuo', '避坑', '稳妥机场']
  },
  {
    slug: 'multi-platform',
    title: 'Windows/macOS/iOS/Android四端订阅一键拉取',
    desc: '不同系统平台客户端推荐与一键导入配置命令。支持Clash Verge、Shadowrocket、Surfboard与Sing-box。',
    keywords: ['四端订阅', 'Windows教程', 'macOS教程', 'iOS小火箭', 'Android Surfboard', '一键拉取', 'Clash Verge Rev'],
    synonyms: ['pingtai', 'xiaoheji', 'ios', 'android', 'windows', 'mac', 'yijian']
  }
];

guides.forEach((g) => {
  searchItems.push({
    id: `guide-${g.slug}`,
    title: g.title,
    url: `/guides/${g.slug}/`,
    category: '新手教程',
    description: g.desc,
    keywords: g.keywords,
    search_synonyms: [...g.synonyms, ...commonSynonyms],
    tags: ['新手教程', '指南']
  });
});

// 4. Recommendation & Category Pages (10 items)
const categoryPages = [
  {
    title: '2026年全网最佳老牌稳定机场推荐大合集 (28家机场全维度对比表)',
    url: '/recommendations/',
    category: '机场推荐',
    desc: '精选 28 家老牌稳定专线机场，提供 BGP 中转、IEPL 内网专线、流媒体与 AI 解锁测评大表。',
    keywords: ['2026机场推荐', '老牌稳定机场', 'IEPL专线', 'BGP中转', '梯子推荐', '科学上网榜单', '魔法上网', '灵动云', '暮光网络', '飞猫云', '微风网络'],
    synonyms: ['jichangtuijian', 'wending', 'zhuanxian', 'tizi', 'mofa', 'fanqiang', 'top4']
  },
  {
    title: '2026 AI 与风控服务节点推荐 (原生住宅 IP 完美解锁 ChatGPT/Claude)',
    url: '/recommendations/ai/',
    category: '场景推荐',
    desc: '针对 OpenAI ChatGPT、Claude 3.5、Midjourney 及风控拦截严苛业务，精选干净原生住宅 IP 节点机场。',
    keywords: ['AI机场', 'ChatGPT解锁', 'Claude 3.5风控', '原生IP', '住宅IP', 'OpenAI节点', '风控解锁'],
    synonyms: ['chatgpt', 'claude', 'fengkong', 'yuansheng', 'zhuzhai', 'ai', 'midjourney']
  },
  {
    title: '2026 8K 流媒体原生解锁机场推荐 (Netflix/Disney+/HBO 4K秒开)',
    url: '/recommendations/streaming/',
    category: '场景推荐',
    desc: '高清流媒体专属线路，秒开 4K/8K 视频，完美原生解锁 Netflix 奈飞、Disney+、YouTube Premium 及 HBO Max。',
    keywords: ['流媒体解锁', 'Netflix奈飞', 'Disney+', 'YouTube 4K', 'HBO Max', '8K秒开', '视频专线'],
    synonyms: ['liumeiti', 'naifei', 'youguan', '4k', '8k', 'netflix', 'youtube']
  },
  {
    title: '2026 平民廉价性价比机场推荐 (月付3元起/不限时包/高流量比)',
    url: '/recommendations/budget/',
    category: '选购指南',
    desc: '预算有限学生党与备用节点首选，提供月付 3 元-10 元低价门槛及不限时长流量包。',
    keywords: ['平民机场', '廉价机场', '便宜梯子', '月付3元', '不限时流量包', '学生党推荐', '低价机场'],
    synonyms: ['lianjia', 'pianyi', 'yuenian', 'xuesheng', 'xinjian', '低价']
  },
  {
    title: '性价比机场选购指南：如何用最低预算买到跑满千兆专线',
    url: '/recommendations/value/',
    category: '选购指南',
    desc: '5 大性价比专题解析，涵盖月付 10-20 元甜品级专线与流量比率换算法则。',
    keywords: ['性价比机场', '甜品级专线', '千兆跑满', '预算精打细算', '高性价比梯子'],
    synonyms: ['xingjiabi', 'qianzhao', 'zhuanxian', 'yusuan']
  },
  {
    title: 'Clash Verge Rev 最佳适配机场推荐与全平台调优指南',
    url: '/recommendations/clash/',
    category: '选购指南',
    desc: '深度评测完美适配 Clash Verge Rev、Stash 与 Sing-box 内核的 5 大技术型机场，附全平台规则集调优教程。',
    keywords: ['Clash Verge Rev', 'Clash适配机场', 'Sing-box内核', 'Stash配置', '规则集分流', 'GEOIP调优'],
    synonyms: ['clash', 'verge', 'singbox', 'stash', 'guize', 'peizhi']
  },
  {
    title: '2026 机场速测与线路拓扑演进深度评测大集',
    url: '/reviews/',
    category: '机场测评',
    desc: '结合 Speedtest 批量测速、晚高峰抖动压测与 BGP/IEPL 拓扑演进图谱，硬核拆解 28 家机场真实性能。',
    keywords: ['机场测评', 'Speedtest测速', '晚高峰稳定性', 'IEPL拓扑', '真实压测', '测速图表'],
    synonyms: ['cesu', 'ceshi', 'wangaofeng', 'tuopu', 'bgp', 'iepl']
  }
];

categoryPages.forEach((cp, idx) => {
  searchItems.push({
    id: `cat-${idx}`,
    title: cp.title,
    url: cp.url,
    category: cp.category,
    description: cp.desc,
    keywords: cp.keywords,
    search_synonyms: [...cp.synonyms, ...commonSynonyms],
    tags: [cp.category]
  });
});

// Ensure directory exists
const publicDir = path.dirname(outputPath);
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(searchItems, null, 2), 'utf-8');
console.log(`✅ Universal Search Index generated successfully! Total Indexed Items: ${searchItems.length}`);
