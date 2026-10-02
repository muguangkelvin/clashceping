# SEO Profile 关键词与导航一键替换协议契约

本文件规定了如何通过更新 `docs/site-seo-profile.json` 单一数据源，整体无缝替换全站 SEO 关键词、Hero 词、页脚词、导航结构及文章集的标准流程。

## 1. 替换接口与输入格式
一键替换指令至少接受以下结构化数据：
- `primaryKeywords`：新的核心关键词数组
- `secondaryKeywords`：新的辅助关键词数组
- `longTailKeywords`：新的长尾关键词数组
- `heroKeywords`：新的 Hero 区域关键词数组（8个以上）
- `footerKeywords`：新的页脚区域关键词数组（5-8个）
- `navigationItems`：包含标签、URL、类型、主关键词、文章种子的新导航数组
- `titlePatterns` & `descriptionPatterns`：新的 TDK 模板

## 2. 8步标准替换执行流程
1. **读取现存配置**：解析 `docs/site-seo-profile.json` 与当前规范 URL 清单。
2. **构建意图集群**：消除新关键词重复项，建立新词与 URL 的单一规范映射。
3. **校验冲突**：核查是否存在相同关键词映射到多个规范 URL 导致的蚕食现象。
4. **更新 Profile 数据源**：覆盖 JSON 配置文件，旧关键词移入 `inactiveKeywords`。
5. **301 重定向处理**：若原导航 URL 发生改变且已有收录或外链，自动建立 301 重定向映射。
6. **保留商业资产**：严禁更改或覆盖前四名固定机场顺序（1. 灵动云 2. 暮光网络 3. 飞猫云 4. 微风网络）、原始邀请链接及优惠码。
7. **全站重新渲染**：重新执行构建，Head、Hero、Footer、Header、导航落地页和内容矩阵统一读取新配置。
8. **自动化 SEO 验证**：运行 `node scripts/seo-check.cjs` 验证死链、canonical、TDK、字数及残余黑名单。
