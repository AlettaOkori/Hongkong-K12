import fs from 'node:fs';
import { marked } from '/Users/alettaokori/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/marked/lib/marked.esm.js';

const sourcePath = new URL('./teeko-prd.md', import.meta.url);
const outputPath = new URL('./teeko-prd.html', import.meta.url);
const source = fs.readFileSync(sourcePath, 'utf8');
const currentHtml = fs.readFileSync(outputPath, 'utf8');
const headings = [];
const slugCounts = new Map();
let diagramIndex = 0;

const diagramCaptions = [
  '核心业务对象数据关系',
  '端到端业务闭环',
  '教学作品状态',
  '课堂状态',
  '互动轮次状态',
  '课堂报告状态'
];

const escapeHtml = value => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const plainText = value => value
  .replace(/<[^>]+>/g, '')
  .replaceAll('&amp;', '&')
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"');

const slugify = value => {
  const base = plainText(value)
    .toLowerCase()
    .replace(/[\s/]+/g, '-')
    .replace(/[^\p{Letter}\p{Number}-]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'section';
  const count = slugCounts.get(base) || 0;
  slugCounts.set(base, count + 1);
  return count ? `${base}-${count + 1}` : base;
};

marked.use({
  gfm: true,
  breaks: false,
  renderer: {
    heading(token) {
      const label = this.parser.parseInline(token.tokens);
      const id = slugify(label);
      headings.push({ depth: token.depth, id, label: plainText(label) });
      return `<h${token.depth} id="${id}">${label}<a class="heading-anchor" href="#${id}" aria-label="链接到本节">#</a></h${token.depth}>`;
    },
    code(token) {
      if ((token.lang || '').trim() === 'mermaid') {
        const caption = diagramCaptions[diagramIndex] || `业务流程图 ${diagramIndex + 1}`;
        diagramIndex += 1;
        return `<figure class="mermaid-block"><figcaption>${caption}</figcaption><div class="mermaid">${escapeHtml(token.text)}</div></figure>`;
      }
      const language = (token.lang || 'text').trim();
      return `<figure class="code-block"><figcaption>${escapeHtml(language)}</figcaption><pre><code>${escapeHtml(token.text)}</code></pre></figure>`;
    },
    link(token) {
      const external = /^https?:\/\//.test(token.href);
      const attrs = external ? ' target="_blank" rel="noreferrer"' : '';
      return `<a href="${escapeHtml(token.href)}"${attrs}>${this.parser.parseInline(token.tokens)}</a>`;
    }
  }
});

const markdown = source.replace(/^# .+\n+/, '');
const body = marked.parse(markdown)
  .replaceAll('<table>', '<div class="table-wrap"><table>')
  .replaceAll('</table>', '</table></div>');

const toc = headings
  .filter(item => item.depth >= 2 && item.depth <= 3)
  .map(item => `<a class="toc-link level-${item.depth}" href="#${item.id}" data-target="${item.id}">${escapeHtml(item.label)}</a>`)
  .join('\n');

const documentBlock = `    <aside class="sidebar" id="sidebar" aria-label="文档目录"><p class="sidebar-title">目录</p><nav class="toc">${toc}</nav></aside>
    <main class="document" id="document">
      <header class="document-hero"><p class="eyebrow">产品需求文档</p><h1>Teeko 产品需求文档</h1><p class="lede">从教师备课到课堂互动，再回到下一次备课的完整产品定义。</p></header>
      ${body}
    </main>
`;

const blockStart = currentHtml.indexOf('    <aside class="sidebar"');
const blockEnd = currentHtml.indexOf('    <aside class="rail"', blockStart);
if (blockStart < 0 || blockEnd < 0) throw new Error('Unable to locate PRD document shell.');

const pendingCount = (source.match(/待确认/g) || []).length;
const sectionCount = headings.filter(item => item.depth === 2).length;
const documentDate = source.match(/\| 文档日期 \| ([^|]+)\|/)?.[1].trim() || "";
const rail = `    <aside class="rail" aria-label="文档概览"><section class="rail-card"><h2>文档概览</h2><div class="stat"><span>章节</span><strong>${sectionCount}</strong></div><div class="stat"><span>流程图</span><strong>${diagramIndex}</strong></div><div class="stat"><span>待确认</span><strong>${pendingCount}</strong></div><div class="stat"><span>更新日期</span><strong>${escapeHtml(documentDate)}</strong></div></section></aside>`;

let html = `${currentHtml.slice(0, blockStart)}${documentBlock}${currentHtml.slice(blockEnd)}`;
html = html.replace(/    <aside class="rail"[\s\S]*?<\/aside>/, rail);
fs.writeFileSync(outputPath, html);
