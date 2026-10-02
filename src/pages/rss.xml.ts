import rss from '@astrojs/rss';
import providers from '../data/providers.json';

export async function GET(context: any) {
  const items = providers.map((p) => ({
    title: p.seoTitle || `${p.name} 深度起底测评与晚高峰实测`,
    pubDate: new Date('2026-10-01'),
    description: p.summary,
    link: `/providers/${p.slug}/`,
  }));

  return rss({
    title: 'Clash测评家 (clashceping.homes) - RSS Feed',
    description: '2026节点测速与背景溯源 - 稳定高速魔法上网/机场梯子测评指南',
    site: context.site || 'https://clashceping.homes',
    items: items,
    customData: `<language>zh-CN</language>`,
  });
}
