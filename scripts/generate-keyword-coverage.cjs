const fs = require('fs');
const path = require('path');

const keywordsData = [
  { keyword: "Clash测评", impressions: 15400, trend: "up", cluster: "核心测评", url: "/reviews/" },
  { keyword: "Clash节点测速", impressions: 12100, trend: "up", cluster: "节点测速", url: "/reviews/" },
  { keyword: "机场出生背景", impressions: 8900, trend: "stable", cluster: "背景溯源", url: "/reviews/" },
  { keyword: "老牌机场推荐", impressions: 18500, trend: "up", cluster: "机场推荐", url: "/recommendations/" },
  { keyword: "2026魔法上网梯子", impressions: 22000, trend: "up", cluster: "梯子推荐", url: "/recommendations/" },
  { keyword: "IEPL专线测评", impressions: 9800, trend: "up", cluster: "专线测评", url: "/reviews/" },
  { keyword: "4K流媒体解锁节点", impressions: 14200, trend: "up", cluster: "节点解锁", url: "/nodes/" },
  { keyword: "Sing-box配置订阅", impressions: 11500, trend: "up", cluster: "客户端配置", url: "/recommendations/clash/" },
  { keyword: "防失联稳定机场", impressions: 13400, trend: "stable", cluster: "稳定机场", url: "/rankings/" },
  { keyword: "性价比机场", impressions: 28260, trend: "up", cluster: "性价比", url: "/recommendations/value/" },
  { keyword: "机场推荐 clash", impressions: 10065, trend: "up", cluster: "Clash机场", url: "/recommendations/clash/" },
  { keyword: "机场节点", impressions: 9627, trend: "stable", cluster: "节点推荐", url: "/nodes/" },
  { keyword: "顶级机场", impressions: 8444, trend: "stable", cluster: "排行榜", url: "/rankings/" },
  { keyword: "便宜机场", impressions: 6176, trend: "up", cluster: "性价比", url: "/recommendations/value/" },
  { keyword: "机场订阅", impressions: 5369, trend: "stable", cluster: "订阅教程", url: "/guides/" },
  { keyword: "性价比飞机场", impressions: 4872, trend: "up", cluster: "性价比", url: "/recommendations/value/" },
  { keyword: "机场测评", impressions: 4284, trend: "up", cluster: "核心测评", url: "/reviews/" },
  { keyword: "节点推荐", impressions: 4094, trend: "stable", cluster: "节点推荐", url: "/nodes/" },
  { keyword: "好用的机场", impressions: 2819, trend: "stable", cluster: "机场推荐", url: "/recommendations/" },
  { keyword: "稳定机场", impressions: 2225, trend: "stable", cluster: "稳定机场", url: "/rankings/" },
  { keyword: "低价机场", impressions: 1744, trend: "stable", cluster: "性价比", url: "/recommendations/value/" },
  { keyword: "飞机场推荐", impressions: 1406, trend: "stable", cluster: "机场推荐", url: "/recommendations/" },
  { keyword: "机场节点推荐", impressions: 1271, trend: "stable", cluster: "节点推荐", url: "/nodes/" },
  { keyword: "机场评测", impressions: 1213, trend: "stable", cluster: "核心测评", url: "/reviews/" },
  { keyword: "机场测速", impressions: 1044, trend: "stable", cluster: "节点测速", url: "/reviews/" },
  { keyword: "高速机场", impressions: 956, trend: "stable", cluster: "专线测评", url: "/reviews/" },
  { keyword: "Clash 机场推荐", impressions: 715, trend: "up", cluster: "Clash机场", url: "/recommendations/clash/" },
  { keyword: "性价比机场推荐", impressions: 711, trend: "up", cluster: "性价比", url: "/recommendations/value/" },
  { keyword: "稳定机场推荐", impressions: 666, trend: "stable", cluster: "稳定机场", url: "/rankings/" },
  { keyword: "专线机场", impressions: 618, trend: "up", cluster: "专线测评", url: "/reviews/" },
  { keyword: "AI 机场推荐", impressions: 8800, trend: "up", cluster: "AI生产力", url: "/recommendations/" },
  { keyword: "AI 工具机场推荐", impressions: 6500, trend: "up", cluster: "AI生产力", url: "/recommendations/" },
  { keyword: "AI 办公机场推荐", impressions: 5400, trend: "up", cluster: "AI生产力", url: "/recommendations/" },
  { keyword: "灵动云机场", impressions: 4500, trend: "up", cluster: "服务品牌", url: "/providers/review-varnexa-lingdong/" },
  { keyword: "暮光网络怎么样", impressions: 4200, trend: "up", cluster: "服务品牌", url: "/providers/review-varnexa-twilight/" },
  { keyword: "飞猫云官网", impressions: 4800, trend: "stable", cluster: "服务品牌", url: "/providers/review-flycat-cloud/" },
  { keyword: "微风网络Breezenet", impressions: 3900, trend: "stable", cluster: "服务品牌", url: "/providers/review-breezenet/" },
  { keyword: "隐形人机场", impressions: 3600, trend: "up", cluster: "服务品牌", url: "/providers/review-varnexa-invisible/" },
  { keyword: "浪网WaveNet", impressions: 3400, trend: "stable", cluster: "服务品牌", url: "/providers/review-varnexa-wavenet/" },
  { keyword: "梯子云官网", impressions: 3800, trend: "stable", cluster: "服务品牌", url: "/providers/review-varnexa-ladder/" },
  { keyword: "飞V机场官网", impressions: 3100, trend: "stable", cluster: "服务品牌", url: "/providers/review-varnexa-flyv/" }
];

let csvHeader = "keyword,normalized_keyword,impressions,trend,cluster,intent,public_status,primary_url,supporting_urls,placement_plan,notes\n";
let csvRows = keywordsData.map(k => [
  `"${k.keyword}"`,
  `"${k.keyword.toLowerCase().replace(/\s+/g, '')}"`,
  k.impressions,
  k.trend,
  `"${k.cluster}"`,
  "commercial_informational",
  "public",
  `"https://clashceping.homes${k.url}"`,
  `"https://clashceping.homes/recommendations/"`,
  "hero_header_body",
  "SEO核心词与数据索引集"
].join(',')).join('\n');

fs.writeFileSync(path.join(__dirname, '../docs/keyword-coverage.csv'), csvHeader + csvRows, 'utf-8');

let mapContent = `# 关键词聚类与页面映射规则 (Keyword Map)\n\n`;
mapContent += `本文件记录核心关键词的意图聚类与对应规范 URL 映射关系，防止同类词引发竞争与流量吞噬。\n\n`;
mapContent += `| 关键词 | 展现相对数 | 搜索意图集群 | 主要规范 URL |\n|---|---|---|---|\n`;
keywordsData.forEach(k => {
  mapContent += `| ${k.keyword} | ${k.impressions} | ${k.cluster} | ${k.url} |\n`;
});

fs.writeFileSync(path.join(__dirname, '../docs/keyword-map.md'), mapContent, 'utf-8');
console.log("Keyword coverage & map generated successfully!");
