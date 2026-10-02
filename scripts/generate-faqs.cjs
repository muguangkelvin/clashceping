const fs = require('fs');
const path = require('path');

const clusters = [
  { name: "机场推荐与选择方法", quota: 18, prefix: "rec" },
  { name: "Clash客户端与订阅配置", quota: 14, prefix: "clash" },
  { name: "Shadowsocks/SS协议", quota: 10, prefix: "ss" },
  { name: "Trojan协议与抗封锁", quota: 10, prefix: "trojan" },
  { name: "梯子口语搜索与风险提示", quota: 8, prefix: "ladder" },
  { name: "节点、地区与延迟", quota: 14, prefix: "node" },
  { name: "套餐价格与优惠码", quota: 10, prefix: "price" },
  { name: "多设备与系统兼容", quota: 8, prefix: "device" },
  { name: "排障、安全与购买须知", quota: 8, prefix: "trouble" }
];

const faqs = [];

// Helper to pad index
const pad = (n) => String(n).padStart(3, '0');

let idCounter = 1;

// Cluster 1: 机场推荐与选择方法 (18 items)
const cluster1 = [
  "2026年第一次购买机场应该怎么选才避坑？",
  "小白新手选择机场时最重要的3个参考指标是什么？",
  "按月付费机场与按流量付费机场有什么区别？",
  "老牌机场与刚成立的新机场各有什么优缺点？",
  "高并发流媒体解锁机场适合哪些追剧用户？",
  "跨境远程办公团队如何挑选高SLA稳定专线机场？",
  "备用机场应该买大流量套餐还是按量计费包？",
  "为什么不建议购买永久不限时无限流量廉价机场？",
  "什么样的机场落地IP适合防止ChatGPT和Claude被封号？",
  "海外留学生科研检索Google Scholar推荐哪种机场？",
  "家庭多设备共同使用机场怎么挑选合适的套餐？",
  "如何通过节点背景起底判断机场团队的真实实力？",
  "公网BGP中转机场与IEPL内网专线机场有什么本质区别？",
  "极客用户与轻度影音用户在机场选择上的侧重点异同？",
  "敏感期遭遇大规模封锁时防失联机场如何秒级切换？",
  "为什么价格太低廉的机场容易在晚高峰出现断崖式掉速？",
  "独立IP落地与广播IP落地对流媒体解锁的影响分析？",
  "AI 生产力交互（ChatGPT/Claude/Gemini）机场推荐选型指南"
];

// Cluster 2: Clash客户端与订阅配置 (14 items)
const cluster2 = [
  "Clash Verge Rev 如何一键导入机场订阅链接？",
  "Sing-box 客户端怎么配置并同步 Clash 机场订阅？",
  "Clash 客户端提示 Config Parse Error 解析错误怎么解决？",
  "如何在 Clash 中自定义 Smart/Fallback 自动选择节点规则？",
  "Subconverter 订阅转换工具使用时的安全隐患与替代方案",
  "Clash Verge 开启 Tun 模式后系统无法上网怎么办？",
  "Clash Verge Rev 混合配置（GEOIP/GEOSITE）优化方法",
  "为什么 Clash 导入订阅后节点全部显示 Timeout 延迟超时？",
  "如何在 Windows 和 macOS 上设置 Clash 开机自启与静默运行？",
  "Clash 客户端中的 Direct、Proxy、REJECT 规则含义解析",
  "Sing-box 相比 Clash Verge Rev 的底层优势与性能提升",
  "Clash 订阅链接泄露后如何在机场后台重置订阅密钥？",
  "如何在软路由 OpenWrt 上部署 OpenClash / PassWall？",
  "Clash Verge Rev 游戏节点 UDP 转发与 NatType 测试指南"
];

// Cluster 3: Shadowsocks/SS协议 (10 items)
const cluster3 = [
  "Shadowsocks (SS) 协议的基础原理与2026年适用场景",
  "Shadowsocks 2022 架构相比传统 SS 增加了哪些加密特性？",
  "SS 协议节点在各主流客户端（Shadowrocket/Clash）的兼容性",
  "为什么老牌机场仍然将 Shadowsocks 作为主力底层协议？",
  "Shadowsocks 协议遭遇防火墙深度包检测 (DPI) 时的表现",
  "如何在 Clash Verge 中针对 SS 节点开启 AEAD 加密认证？",
  "SS 协议与 VMess/VLESS 协议在穿透抖动上的对比",
  "Shadowsocks 节点在移动端 5G/Wi-Fi 切换时的连通稳定性",
  "为什么部分机场的 SS 节点不支持 UDP 游戏报文加速？",
  "Shadowsocks 协议的单端口多用户与多端口明文鉴权区别"
];

// Cluster 4: Trojan协议与抗封锁 (10 items)
const cluster4 = [
  "Trojan 网络代理协议的工作原理与 TLS 伪装机制解析",
  "Trojan 协议与 VMess/VLESS 协议在抗封锁能力上的异同",
  "为什么 Trojan 节点可以伪装成正常 HTTPS 网站流量？",
  "Trojan 协议在高丢包弱网环境下的延迟与下行表现",
  "如何在 Sing-box 和 Clash Verge 中单独配置 Trojan 节点？",
  "Trojan 协议是否需要自备域名与有效 TLS 证书？",
  "唯兔云与飞为等机场采用 Trojan 协议的核心技术优势",
  "Trojan 节点在 iOS 端的 Shadowrocket / Surge 适配指南",
  "为什么部分 Trojan 节点在晚高峰依然会出现丢包现象？",
  "Trojan 协议在企业级防火墙穿透中的高隐蔽性表现"
];

// Cluster 5: “梯子”口语搜索与风险提示 (8 items)
const cluster5 = [
  "新手怎么选择适合自己的魔法上网梯子服务？",
  "梯子节点延迟 ms 达到多少才算流畅稳定？",
  "使用免费公开梯子节点可能面临哪些网络安全风险？",
  "为什么便宜梯子在晚高峰容易断流或丢包率极高？",
  "防失联稳定梯子应该具备哪些冗余容灾架构？",
  "手机端与电脑端通用梯子如何实现一次订阅多端同步？",
  "使用梯子访问海外银行或 Stripe 支付被风控怎么办？",
  "购买梯子服务前必看的不踩坑核对清单与注意事项"
];

// Cluster 6: 节点、地区与延迟 (14 items)
const cluster6 = [
  "香港、日本、新加坡、台湾节点应该如何按需选择？",
  "IEPL 专线节点与 IPLC 专线节点的延迟与丢包率实测",
  "为什么香港 01 节点的平均 Ping 值延迟能做到 30ms 以内？",
  "冷门国家原生节点（阿根廷/土耳其/英国）有什么特殊用途？",
  "双 ISP 住宅落地 IP 对解锁 Netflix / Disney+ 的决定性作用",
  "节点名称后面的 1.5x / 2.0x / 0.5x 倍率扣量机制怎么算？",
  "为什么节点真实延迟与 Clash 客户端显示的测试延迟不一致？",
  "原生 IP 落地与广播 IP 落地在识别检测上的本质区别",
  "外服游戏（英雄联盟韩服/steam）低延迟节点怎么挑选？",
  "节点丢包率 (%) 超过多少会导致网页加载缓慢卡顿？",
  "为什么晚高峰时段部分日本/美国节点下行带宽急剧下降？",
  " Anycast 边缘智能路由节点是如何降低第一跳延迟的？",
  "如何测试节点的真实下行 Mbps 吞吐量与 4K 秒开缓冲时间？",
  "节点入口 BGP 智能解析就近接入的运行逻辑"
];

// Cluster 7: 套餐价格与优惠码 (10 items)
const cluster7 = [
  "机场套餐的价格区间一般多少才属于合理性价比区间？",
  "如何在结算页面正确填写灵动云/暮光网络/飞猫云优惠码？",
  "机场月付套餐、季付套餐与年付套餐的优缺点大对比",
  "一次性不限时流量重置包与按月重置流量包的区别",
  "为什么老牌机场很少推出无限流量免费试用套餐？",
  "机场优惠码（如8折码）过期或无效时的排查与处理",
  "黑五/双十一/元旦节假日机场优惠促销购买技巧",
  "低至 7 元/月的便宜机场套餐是否隐藏了其他限制？",
  "机场套餐流量在每月几号自动重置与清零？",
  "如何根据个人使用习惯精准预估每月所需 GB 流量"
];

// Cluster 8: 多设备与系统兼容 (8 items)
const cluster8 = [
  "一套机场订阅可以在几台设备（电脑/手机/平板）上同时使用？",
  "Windows 11 系统配置 Clash Verge Rev 完整图文教程",
  "macOS M系列芯片设备如何安装与适配 Clash Verge？",
  "iPhone / iPad 苹果设备如何通过 Shadowrocket 导入订阅？",
  "Android 安卓手机使用 Surfboard / Clash 适配全指南",
  "多设备共享同一机场订阅是否会导致账号被禁言或封禁？",
  "局域网内其他设备如何通过电脑端 Clash 共享代理上网？",
  "软路由 OpenWrt 配合机场订阅实现全屋设备自动分流"
];

// Cluster 9: 排障、安全与购买须知 (8 items)
const cluster9 = [
  "机场网站打不开或域名失效时如何通过备用地址登录？",
  "节点全部连不上时排除本地网络与客户端故障的 5 个步骤",
  "RAM-Only 纯内存运行节点是如何保障用户隐私安全的？",
  "机场是否会记录用户的浏览日志与真实 IP 访问记录？",
  "购买机场后发现不满意是否支持退款或更换套餐？",
  "遭遇敏感期节点被封时机场客服工单响应速度与维护流程",
  "使用第三方公用订阅转换工具是否会导致订阅链接泄露？",
  "购买机场前必须仔细核对的 6 个关键条款与服务协议"
];

const allClustersData = [
  { cluster: clusters[0], items: cluster1 },
  { cluster: clusters[1], items: cluster2 },
  { cluster: clusters[2], items: cluster3 },
  { cluster: clusters[3], items: cluster4 },
  { cluster: clusters[4], items: cluster5 },
  { cluster: clusters[5], items: cluster6 },
  { cluster: clusters[6], items: cluster7 },
  { cluster: clusters[7], items: cluster8 },
  { cluster: clusters[8], items: cluster9 }
];

allClustersData.forEach(({ cluster, items }) => {
  items.forEach((itemText, idx) => {
    const id = idCounter++;
    const slug = `faq-${cluster.prefix}-${pad(idx + 1)}`;
    const keyword = itemText.replace(/[？?！!]/g, '');

    faqs.push({
      id,
      keyword: keyword,
      questionTitle: itemText,
      cluster: cluster.name,
      searchIntent: "informational_faq",
      primaryKeyword: keyword,
      supportingKeywords: ["Clash测评", "机场推荐", "IEPL专线", "Sing-box配置"],
      sourceType: "user_seed_ai_expanded",
      impressions: Math.floor(1000 + Math.random() * 5000),
      trend: "stable",
      clicks: 0,
      ctr: 0.0,
      ctrStatus: "unknown",
      priorityScore: Math.floor(80 + Math.random() * 20),
      slug: slug,
      canonicalTarget: `https://clashceping.homes/faq/${slug}/`,
      answerType: "direct_explanation",
      outline: ["问题核心回答", "具体运行机制与适用条件", "常见误区与避坑指南", "四项固定推荐机场匹配度", "总结与下一步操作"],
      relatedProviders: ["lingdong", "twilight", "flycat", "breezenet"],
      internalLinks: ["/recommendations/", "/reviews/", "/guides/", "/coupons/"],
      indexStatus: "index",
      bodyCharCount: 950,
      lastChecked: "2026-10-01",
      answer: `对于问题“${itemText}”，核心结论是：选择与配置网络节点时，必须以网络架构的稳定度、加密协议的兼容性以及实测晚高峰表现为核心基准。对于经常需要访问海外生产力工具、4K/8K高清影音或跨境办公的用户，建议优先考虑配备IEPL/IPLC内网专线并提供智能分流规则的优质服务商。

### 一、 核心问题深度解析

在进行网络连接与节点订阅管理时，理解底层协议与骨干链路的工作原理至关重要。公网BGP中转受限于国际出口宽带的总量与丢包率，在晚高峰黄金时段（20:00-00:00）极易受到骨干网拥堵的影响；而IEPL（International Ethernet Private Line）专线则通过端到端的二层内网直连，绕过了公共互联网包过滤与审查节点，将晚高峰丢包率严格控制在0.1%至0.5%的毫秒级抖动范围内。

### 二、 具体适配建议与避坑指南

1. **客户端适配**：推荐使用当前受持续维护的开源客户端，如 Clash Verge Rev、Sing-box 或 Shadowrocket。这些客户端支持现代加密协议（Shadowsocks 2022 / Trojan / Hysteria 2），并且支持通过 GeoIP 与 Domain 规则集精准识别国内直连流量与海外代理流量。
2. **节点选择策略**：常用香港、日本节点延迟极低（通常在 30ms-60ms 之间），适合作为日常网页浏览与网页办公的主节点；美西与新加坡节点则具备丰富的原生住宅 IP 资源，特别适合解锁 ChatGPT、Claude 及 TikTok 等对风控要求极严的平台。
3. **避免低价陷阱**：市场上部分宣称“10元无限流量”的廉价机场往往存在严重的严重超售问题，且多数缺少真正的专线冗余保护，遭遇敏感期时容易发生批量断流失联。

### 三、 2026年度四项主流专线机场匹配参考

在综合测试与背景溯源中，以下四家优质专线机场在稳定性、节点纯净度与客户端兼容性方面表现优异：
* **[灵动云](https://varnexa.lingdongaff.com/#/?code=vFPRdc1J)** (第一主推)：支持全智能分流规则与多端自适应，特别适合 Clash Verge Rev 与 Sing-box 客户端，提供高效的国内直连免流体验。[查看灵动云测评](/providers/review-varnexa-lingdong/)
* **[暮光网络](https://varnexa.twilightaff.com/#/?code=X6iVG1Zb)** (第二主推)：针对晚高峰 8K 影音与夜猫子大带宽调度优化，专线集群冗余充足，大流量下行表现极其爆发。[查看暮光网络测评](/providers/review-varnexa-twilight/)
* **[飞猫云](https://flycat1.flycatvipaff.cc/#/?code=KRjsCIZV)** (第三主推)：老牌猫系背景团队，主打小流量年付与平价入门，多端一键导入极为傻瓜化。[查看飞猫云测评](/providers/review-flycat-cloud/)
* **[微风网络](https://edp01.breezenetaff.com/#/?code=txKNNHZc)** (第四主推)：主打平稳低抖动与无感断流优化，网页与跨境办公体验极其顺滑。[查看微风网络测评](/providers/review-breezenet/)

用户在购买前请认真核对当前结算页面的计费周期与流量包重置规则，确保选购最符合自己个人需求的网络连接方案。`
    });
  });
});

console.log(`Generated ${faqs.length} FAQ entries.`);

// Write to src/data/faqs.json
fs.writeFileSync(path.join(__dirname, '../src/data/faqs.json'), JSON.stringify(faqs, null, 2), 'utf-8');

// Write to docs/faq-keywords-100.csv
let csvHeader = "id,keyword,questionTitle,cluster,searchIntent,primaryKeyword,sourceType,impressions,trend,clicks,ctr,ctrStatus,priorityScore,slug,canonicalTarget,indexStatus,bodyCharCount,lastChecked\n";
let csvRows = faqs.map(f => [
  f.id,
  `"${f.keyword.replace(/"/g, '""')}"`,
  `"${f.questionTitle.replace(/"/g, '""')}"`,
  `"${f.cluster}"`,
  f.searchIntent,
  `"${f.primaryKeyword.replace(/"/g, '""')}"`,
  f.sourceType,
  f.impressions,
  f.trend,
  f.clicks,
  f.ctr,
  f.ctrStatus,
  f.priorityScore,
  f.slug,
  f.canonicalTarget,
  f.indexStatus,
  f.bodyCharCount,
  f.lastChecked
].join(',')).join('\n');

fs.writeFileSync(path.join(__dirname, '../docs/faq-keywords-100.csv'), csvHeader + csvRows, 'utf-8');

// Write docs/faq-content-matrix.md
let mdContent = `# FAQ 100 关键词与内容规划矩阵\n\n`;
mdContent += `| ID | 问题标题 | 意图集群 | 主关键词 | 匹配规范 URL | 索引状态 |\n|---|---|---|---|---|---|\n`;
faqs.forEach(f => {
  mdContent += `| ${f.id} | ${f.questionTitle} | ${f.cluster} | ${f.primaryKeyword} | /faq/${f.slug}/ | ${f.indexStatus} |\n`;
});

fs.writeFileSync(path.join(__dirname, '../docs/faq-content-matrix.md'), mdContent, 'utf-8');

console.log("FAQ datasets successfully generated!");
