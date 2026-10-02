# 内部参考发布者屏蔽黑名单 (Reference Publisher Blocklist)

> **重要提示**：本文件为内部维护文件，不参与公开页面构建与部署。

为了维护本站权威度与合规独立性，全站公开页面（包括 HTML、JSON、RSS、Sitemap、JavaScript）严禁出现任何第三方参考博客、评测站或资料整理者的品牌名称、域名、域名后缀或“根据某某博客”等句式。

## 黑名单词库
- 三毛机场 / sanmaojichang
- 猫梦博客 / maomeng
- Gaterank
- 星维机场 / xingweijichang
- 一毛机场
- 一份机场
- 二毛博客
- 某某博客
- 根据某评测站
- 资料来自某博客
- 据某站测试

## 自动扫描机制
在生产构建产物检查环节 (`node scripts/seo-check.cjs`)，脚本会自动扫描 `dist/` 目录下全部可见产物，若检测到上述黑名单词汇，构建检查将直接报错退出并要求改写。
