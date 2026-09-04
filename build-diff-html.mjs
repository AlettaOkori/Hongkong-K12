import fs from 'node:fs';
import { marked } from '/Users/alettaokori/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/marked/lib/marked.esm.js';

const sourcePath = new URL('./teeko-v2-vs-legacy-demo.md', import.meta.url);
const outputPath = new URL('./teeko-v2-vs-legacy-demo.html', import.meta.url);
const source = fs.readFileSync(sourcePath, 'utf8');
const headings = [];
const slugCounts = new Map();
let diagramIndex = 0;

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
        const captions = ['旧项目端到端业务流程', 'Teeko V2.0 目标业务闭环'];
        const caption = captions[diagramIndex] || `业务流程图 ${diagramIndex + 1}`;
        diagramIndex += 1;
        return `<figure class="diagram-card" data-diagram="${diagramIndex}"><figcaption><span>${caption}</span><span class="diagram-note">原始流程完整渲染</span></figcaption><div class="mermaid">${escapeHtml(token.text)}</div></figure>`;
      }
      const language = (token.lang || 'text').trim();
      return `<figure class="code-block"><figcaption>${escapeHtml(language)}</figcaption><pre><code>${escapeHtml(token.text)}</code></pre></figure>`;
    },
    link(token) {
      const href = token.href === './teeko-prd.md' ? './teeko-prd.html' : token.href;
      const external = /^https?:\/\//.test(href);
      const attrs = external ? ' target="_blank" rel="noreferrer"' : '';
      return `<a href="${escapeHtml(href)}"${attrs}>${this.parser.parseInline(token.tokens)}</a>`;
    }
  }
});

const markdown = source.replace(/^# .+\n+/, '');
let body = marked.parse(markdown)
  .replaceAll('<table>', '<div class="table-wrap"><table>')
  .replaceAll('</table>', '</table></div>')
  .replace('<div class="table-wrap"><table>', '<div class="table-wrap meta-table"><table>');

const toc = headings
  .filter(item => item.depth >= 2 && item.depth <= 3)
  .map(item => `<a class="toc-link level-${item.depth}" href="#${item.id}" data-target="${item.id}">${escapeHtml(item.label)}</a>`)
  .join('\n');

const html = `<!doctype html>
<html lang="zh-Hant" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Teeko V2.0 与旧项目的业务流程、功能保留、调整、废弃及新增差异说明。">
  <title>Teeko V2.0 与旧项目差异说明</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #edf2ef;
      --surface: #f9fbfa;
      --surface-raised: #ffffff;
      --surface-muted: #e7eeea;
      --text: #17231f;
      --muted: #5a6963;
      --line: #ccd8d2;
      --accent: #0b725f;
      --accent-strong: #075b4b;
      --accent-soft: #d9eee7;
      --old: #8b4a3a;
      --old-soft: #f5e4df;
      --new: #0b725f;
      --new-soft: #d9eee7;
      --warning: #8b6105;
      --warning-soft: #f7edcf;
      --danger: #a13b3b;
      --danger-soft: #f7e1e1;
      --info: #315f8f;
      --info-soft: #e0eaf4;
      --code: #14201c;
      --code-text: #dce8e3;
      --radius: 14px;
      --shadow: 0 18px 56px rgb(30 62 51 / 9%);
      font-family: "SF Pro Text", "PingFang TC", "PingFang SC", "Microsoft JhengHei", system-ui, sans-serif;
      font-synthesis: none;
    }
    :root[data-theme="dark"] {
      color-scheme: dark;
      --bg: #0e1512;
      --surface: #151d19;
      --surface-raised: #1a231f;
      --surface-muted: #202b26;
      --text: #e7efeb;
      --muted: #a7b4ae;
      --line: #34443c;
      --accent: #58c6aa;
      --accent-strong: #8bdac7;
      --accent-soft: #123b31;
      --old: #e5a18f;
      --old-soft: #452921;
      --new: #8bdac7;
      --new-soft: #123b31;
      --warning: #f1c56c;
      --warning-soft: #423416;
      --danger: #ef9b9b;
      --danger-soft: #452424;
      --info: #9ec4e9;
      --info-soft: #1d344b;
      --code: #0a100d;
      --code-text: #dce8e3;
      --shadow: 0 18px 56px rgb(0 0 0 / 28%);
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; scroll-padding-top: 92px; }
    body { margin: 0; background: var(--bg); color: var(--text); line-height: 1.72; }
    button, input { font: inherit; }
    button { color: inherit; }
    a { color: var(--accent-strong); text-decoration-thickness: 1px; text-underline-offset: 3px; }
    a:hover { text-decoration-thickness: 2px; }
    :focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
    .skip-link { position: fixed; z-index: 100; left: 16px; top: -80px; padding: 10px 14px; border-radius: 9px; background: var(--accent); color: #071b15; font-weight: 800; }
    .skip-link:focus { top: 12px; }
    .topbar { position: sticky; top: 0; z-index: 30; min-height: 68px; border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--bg) 91%, transparent); backdrop-filter: blur(16px); }
    .topbar-inner { width: min(1480px, 100%); min-height: 68px; margin: auto; padding: 10px 24px; display: flex; align-items: center; gap: 12px; }
    .brand { display: flex; align-items: baseline; gap: 10px; min-width: 280px; font-weight: 800; letter-spacing: -.02em; }
    .brand small { color: var(--muted); font-size: 12px; font-weight: 650; letter-spacing: 0; }
    .top-summary { flex: 1; color: var(--muted); font-size: 13px; text-align: center; }
    .actions { margin-left: auto; display: flex; gap: 8px; }
    .action-button { min-width: 64px; height: 40px; padding: 0 13px; border: 1px solid var(--line); border-radius: 10px; background: var(--surface-raised); cursor: pointer; }
    .action-button:hover { border-color: var(--accent); color: var(--accent-strong); }
    .action-button:active { transform: translateY(1px); }
    .menu-button { display: none; }
    .layout { width: min(1480px, 100%); margin: 0 auto; padding: 38px 24px 90px; display: grid; grid-template-columns: 260px minmax(0, 900px) 200px; gap: 36px; align-items: start; }
    .sidebar { position: sticky; top: 94px; max-height: calc(100dvh - 118px); overflow: auto; scrollbar-width: thin; }
    .sidebar-title { margin: 0 0 11px; color: var(--muted); font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
    .toc { display: grid; gap: 2px; }
    .toc-link { display: block; padding: 7px 10px; border-left: 2px solid transparent; border-radius: 0 8px 8px 0; color: var(--muted); font-size: 13px; line-height: 1.35; text-decoration: none; }
    .toc-link.level-3 { padding-left: 22px; font-size: 12px; }
    .toc-link:hover { background: var(--surface-muted); color: var(--text); }
    .toc-link.active { border-left-color: var(--accent); background: var(--accent-soft); color: var(--accent-strong); font-weight: 760; }
    .document { min-width: 0; padding: 0 54px 70px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); box-shadow: var(--shadow); }
    .document-hero { margin: 0 -54px 48px; padding: 58px 54px 50px; border-bottom: 1px solid var(--line); border-radius: var(--radius) var(--radius) 0 0; background: linear-gradient(132deg, var(--accent-soft), transparent 72%); }
    .hero-label { margin: 0 0 14px; color: var(--accent-strong); font-size: 12px; font-weight: 800; letter-spacing: .11em; text-transform: uppercase; }
    h1 { max-width: 16ch; margin: 0; font-size: clamp(38px, 5vw, 60px); line-height: 1.04; letter-spacing: -.052em; }
    .lede { max-width: 650px; margin: 20px 0 0; color: var(--muted); font-size: 18px; }
    .model-shift { margin-top: 32px; display: grid; grid-template-columns: minmax(0, 1fr) 38px minmax(0, 1fr); align-items: stretch; gap: 10px; }
    .model { padding: 16px 18px; border: 1px solid var(--line); border-radius: 12px; background: color-mix(in srgb, var(--surface-raised) 88%, transparent); }
    .model strong { display: block; margin-bottom: 5px; font-size: 13px; }
    .model.old strong { color: var(--old); }
    .model.new strong { color: var(--new); }
    .model span { color: var(--muted); font-size: 13px; line-height: 1.5; }
    .shift-arrow { align-self: center; color: var(--accent); font-size: 24px; font-weight: 800; text-align: center; }
    h2, h3, h4 { position: relative; color: var(--text); text-wrap: balance; }
    h2 { margin: 72px 0 22px; padding-top: 5px; font-size: 30px; line-height: 1.25; letter-spacing: -.034em; }
    h2::before { content: ""; display: block; width: 42px; height: 4px; margin-bottom: 15px; border-radius: 3px; background: var(--accent); }
    h3 { margin: 44px 0 15px; font-size: 21px; line-height: 1.35; letter-spacing: -.018em; }
    h4 { margin: 30px 0 10px; font-size: 16px; line-height: 1.4; }
    .heading-anchor { margin-left: 8px; color: var(--muted); opacity: 0; font-size: .7em; text-decoration: none; }
    h2:hover .heading-anchor, h3:hover .heading-anchor, h4:hover .heading-anchor, .heading-anchor:focus-visible { opacity: 1; }
    p { margin: 12px 0; font-size: 15px; }
    strong { font-weight: 780; }
    ul, ol { margin: 14px 0 22px; padding-left: 1.35em; }
    li { margin: 7px 0; padding-left: .28em; }
    li::marker { color: var(--accent); font-weight: 800; }
    hr { margin: 62px 0; border: 0; border-top: 1px solid var(--line); }
    blockquote { margin: 24px 0; padding: 16px 18px; border-left: 4px solid var(--accent); border-radius: 0 12px 12px 0; background: var(--accent-soft); }
    code { padding: .12em .38em; border-radius: 5px; background: var(--surface-muted); font-family: "SFMono-Regular", Consolas, monospace; font-size: .88em; }
    .table-wrap { margin: 20px 0 30px; overflow-x: auto; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface-raised); scrollbar-width: thin; }
    table { width: 100%; min-width: 700px; border-collapse: collapse; font-size: 13px; line-height: 1.55; }
    th, td { padding: 12px 14px; text-align: left; vertical-align: top; border-bottom: 1px solid var(--line); }
    th { position: sticky; top: 0; background: var(--surface-muted); color: var(--text); font-weight: 780; }
    td:first-child, th:first-child { min-width: 118px; }
    tbody tr:last-child td { border-bottom: 0; }
    tbody tr:hover { background: color-mix(in srgb, var(--accent-soft) 42%, transparent); }
    .meta-table { margin-top: -12px; }
    .meta-table table { min-width: 560px; }
    .meta-table td:first-child { width: 130px; color: var(--muted); font-weight: 700; }
    .status { display: inline-block; padding: 2px 8px; border-radius: 999px; white-space: nowrap; font-size: 12px; font-weight: 780; }
    .status-keep { background: var(--new-soft); color: var(--new); }
    .status-adjust { background: var(--info-soft); color: var(--info); }
    .status-remove { background: var(--danger-soft); color: var(--danger); }
    .status-new { background: var(--warning-soft); color: var(--warning); }
    .status-pending { outline: 1px dashed currentColor; color: var(--warning); }
    .code-block { margin: 22px 0 32px; overflow: hidden; border: 1px solid #34443c; border-radius: var(--radius); background: var(--code); }
    .code-block figcaption { padding: 10px 15px; border-bottom: 1px solid #34443c; color: #a5b7af; font-size: 12px; font-weight: 700; }
    .code-block pre { margin: 0; padding: 20px; overflow: auto; color: var(--code-text); line-height: 1.7; }
    .code-block pre code { padding: 0; background: transparent; color: inherit; font-size: 12px; }
    .diagram-card { margin: 24px 0 42px; overflow: hidden; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface-raised); box-shadow: 0 12px 34px rgb(30 62 51 / 7%); }
    .diagram-card figcaption { display: flex; justify-content: space-between; gap: 16px; padding: 13px 16px; border-bottom: 1px solid var(--line); background: var(--surface-muted); font-size: 13px; font-weight: 780; }
    .diagram-note { color: var(--muted); font-size: 12px; font-weight: 620; }
    .mermaid { min-height: 260px; padding: 30px 24px; overflow: auto; color: var(--muted); white-space: pre; font-family: "SFMono-Regular", Consolas, monospace; font-size: 12px; line-height: 1.65; }
    .mermaid[data-processed="true"] { display: flex; justify-content: center; min-width: 0; color: inherit; white-space: normal; font-family: inherit; }
    .mermaid svg { display: block; width: auto; min-width: 760px; max-width: none; height: auto; }
    .diagram-card.failed figcaption::after { content: "图表加载失败，已显示完整 Mermaid 源码"; color: var(--danger); font-size: 12px; }
    .rail { position: sticky; top: 94px; display: grid; gap: 14px; }
    .rail-card { padding: 16px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); }
    .rail-card h2 { margin: 0 0 12px; padding: 0; font-size: 13px; letter-spacing: 0; }
    .rail-card h2::before { display: none; }
    .legend-list { display: grid; gap: 9px; }
    .legend-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; color: var(--muted); font-size: 12px; }
    .rail-note { margin: 0; color: var(--muted); font-size: 12px; line-height: 1.55; }
    .backdrop { display: none; }
    @media (max-width: 1220px) {
      .layout { grid-template-columns: 248px minmax(0, 1fr); gap: 28px; }
      .rail { display: none; }
      .top-summary { display: none; }
    }
    @media (max-width: 860px) {
      html { scroll-padding-top: 78px; }
      .topbar-inner { min-height: 62px; padding: 9px 14px; }
      .brand { min-width: 0; }
      .brand small, .print-button { display: none; }
      .menu-button { display: inline-block; }
      .layout { display: block; padding: 18px 12px 64px; }
      .sidebar { position: fixed; z-index: 50; inset: 0 auto 0 0; width: min(86vw, 330px); max-height: none; padding: 26px 20px; background: var(--surface-raised); transform: translateX(-105%); transition: transform .2s ease; box-shadow: var(--shadow); }
      body.menu-open .sidebar { transform: translateX(0); }
      .backdrop { position: fixed; z-index: 40; inset: 0; background: rgb(7 15 12 / 55%); }
      body.menu-open .backdrop { display: block; }
      .document { padding: 0 20px 46px; }
      .document-hero { margin: 0 -20px 42px; padding: 42px 20px 38px; }
      h1 { font-size: 40px; }
      .lede { font-size: 16px; }
      .model-shift { grid-template-columns: 1fr; }
      .shift-arrow { transform: rotate(90deg); }
      h2 { margin-top: 58px; font-size: 26px; }
      h3 { margin-top: 38px; }
      .heading-anchor { opacity: .55; }
      .diagram-card figcaption { display: block; }
      .diagram-note { display: block; margin-top: 3px; }
    }
    @media (max-width: 520px) {
      .brand { font-size: 14px; }
      .actions { gap: 5px; }
      .action-button { min-width: 52px; padding: 0 9px; font-size: 12px; }
      h1 { font-size: 34px; }
      .document { border-radius: 10px; }
      .mermaid { padding: 22px 16px; }
    }
    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      *, *::before, *::after { transition: none !important; }
    }
    @media print {
      :root { color-scheme: light; --bg: #fff; --surface: #fff; --surface-raised: #fff; --surface-muted: #f0f3f1; --text: #111; --muted: #444; --line: #c8ceca; --accent: #0b725f; --accent-strong: #075b4b; --accent-soft: #e5f2ed; }
      .topbar, .sidebar, .rail, .backdrop, .heading-anchor { display: none !important; }
      body { background: #fff; font-size: 10pt; }
      .layout { display: block; max-width: none; padding: 0; }
      .document { padding: 0; border: 0; box-shadow: none; }
      .document-hero { margin: 0 0 34px; padding: 30px 0; border-radius: 0; }
      h1 { font-size: 32pt; }
      h2 { break-before: page; margin-top: 0; padding-top: 20px; }
      h2:first-of-type { break-before: auto; }
      h3, h4 { break-after: avoid; }
      p, li, tr, blockquote, figure { break-inside: avoid; }
      .table-wrap { overflow: visible; }
      table { min-width: 0; font-size: 8pt; }
      .diagram-card { break-inside: auto; }
      .mermaid { overflow: visible; padding: 14px 0; }
      .mermaid svg { width: 100%; min-width: 0; max-width: 100%; }
      a { color: inherit; text-decoration: none; }
    }
  </style>
</head>
<body>
  <a class="skip-link" href="#document">跳到正文</a>
  <header class="topbar">
    <div class="topbar-inner">
      <button class="action-button menu-button" type="button" aria-expanded="false" aria-controls="sidebar">目录</button>
      <div class="brand">Teeko <small>版本差异说明</small></div>
      <div class="top-summary">从学校治理型产品迁移到教师个人教学闭环</div>
      <div class="actions">
        <button class="action-button theme-button" type="button" aria-label="切换深浅色">深色</button>
        <button class="action-button print-button" type="button">打印</button>
      </div>
    </div>
  </header>
  <div class="layout">
    <aside class="sidebar" id="sidebar" aria-label="文档目录">
      <p class="sidebar-title">目录</p>
      <nav class="toc">${toc}</nav>
    </aside>
    <main class="document" id="document">
      <header class="document-hero">
        <p class="hero-label">产品迁移与范围决策</p>
        <h1>Teeko V2.0 与旧项目差异说明</h1>
        <p class="lede">完整梳理业务流程、功能处置、页面迁移、业务对象与研发待确认项。</p>
        <div class="model-shift" aria-label="产品模型变化">
          <div class="model old"><strong>旧项目</strong><span>学校工作空间、学校治理、正式任教关系、班级课堂</span></div>
          <div class="shift-arrow" aria-hidden="true">→</div>
          <div class="model new"><strong>Teeko V2.0</strong><span>学校采购激活码、教师个人账号、匿名课堂、连续备课闭环</span></div>
        </div>
      </header>
      ${body}
    </main>
    <aside class="rail" aria-label="阅读辅助">
      <section class="rail-card">
        <h2>状态说明</h2>
        <div class="legend-list">
          <div class="legend-row"><span class="status status-keep">保留</span><span>价值继续存在</span></div>
          <div class="legend-row"><span class="status status-adjust">调整</span><span>规则或对象改变</span></div>
          <div class="legend-row"><span class="status status-remove">废弃</span><span>不进入 2.0</span></div>
          <div class="legend-row"><span class="status status-new">新增</span><span>闭环必须补齐</span></div>
          <div class="legend-row"><span class="status status-pending">待确认</span><span>尚未形成决定</span></div>
        </div>
      </section>
      <section class="rail-card">
        <h2>阅读重点</h2>
        <p class="rail-note">先看第 1 章总览和两张流程图，再按流程阶段核对功能处置。第 9 章集中列出研发评审待确认项。</p>
      </section>
    </aside>
  </div>
  <button class="backdrop" type="button" aria-label="关闭目录"></button>
  <script>
    const root = document.documentElement;
    const themeButton = document.querySelector('.theme-button');
    const storedTheme = localStorage.getItem('teeko-diff-theme');
    const preferredTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const setTheme = theme => {
      root.dataset.theme = theme;
      themeButton.textContent = theme === 'dark' ? '浅色' : '深色';
      localStorage.setItem('teeko-diff-theme', theme);
      dispatchEvent(new CustomEvent('teeko-theme', { detail: theme }));
    };
    setTheme(storedTheme || preferredTheme);
    themeButton.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
    document.querySelector('.print-button').addEventListener('click', () => print());

    const menuButton = document.querySelector('.menu-button');
    const backdrop = document.querySelector('.backdrop');
    const closeMenu = () => {
      document.body.classList.remove('menu-open');
      menuButton.setAttribute('aria-expanded', 'false');
    };
    menuButton.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    backdrop.addEventListener('click', closeMenu);
    document.querySelectorAll('.toc-link').forEach(link => link.addEventListener('click', closeMenu));

    const tocLinks = [...document.querySelectorAll('.toc-link')];
    const sections = tocLinks.map(link => document.getElementById(link.dataset.target)).filter(Boolean);
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;
      tocLinks.forEach(link => link.classList.toggle('active', link.dataset.target === visible.target.id));
    }, { rootMargin: '-18% 0px -70% 0px' });
    sections.forEach(section => observer.observe(section));

    const statusRules = [
      ['废弃', 'status-remove'], ['不迁移', 'status-remove'],
      ['不新增', 'status-remove'],
      ['新增', 'status-new'],
      ['待确认', 'status-pending'],
      ['调整', 'status-adjust'], ['重做', 'status-adjust'], ['拆分', 'status-adjust'],
      ['保留', 'status-keep']
    ];
    document.querySelectorAll('td').forEach(cell => {
      const value = cell.textContent.trim();
      if (value.length > 24 || cell.children.length) return;
      const match = statusRules.find(([word]) => value.includes(word));
      if (!match) return;
      const span = document.createElement('span');
      span.className = 'status ' + match[1];
      span.textContent = value;
      cell.replaceChildren(span);
    });
  </script>
  <script type="module">
    const figures = [...document.querySelectorAll('.diagram-card')];
    const diagrams = figures.map((figure, index) => {
      const node = figure.querySelector('.mermaid');
      node.dataset.source = node.textContent.trim();
      node.setAttribute('role', 'img');
      node.setAttribute('aria-label', figure.querySelector('figcaption span').textContent);
      node.id = 'mermaid-diagram-' + (index + 1);
      return node;
    });
    let mermaid;
    let rendering = Promise.resolve();
    const renderDiagrams = theme => {
      if (!mermaid) return;
      rendering = rendering.then(async () => {
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: theme === 'dark' ? 'dark' : 'base',
          fontFamily: 'SF Pro Text, PingFang TC, PingFang SC, Microsoft JhengHei, sans-serif',
          themeVariables: theme === 'dark' ? {
            primaryColor: '#123b31', primaryTextColor: '#e7efeb', primaryBorderColor: '#58c6aa',
            lineColor: '#8bdac7', secondaryColor: '#202b26', tertiaryColor: '#151d19'
          } : {
            primaryColor: '#d9eee7', primaryTextColor: '#17231f', primaryBorderColor: '#0b725f',
            lineColor: '#0b725f', secondaryColor: '#e7eeea', tertiaryColor: '#ffffff'
          },
          flowchart: { curve: 'basis', htmlLabels: true, useMaxWidth: false, nodeSpacing: 28, rankSpacing: 42 }
        });
        for (const [index, node] of diagrams.entries()) {
          node.removeAttribute('data-processed');
          node.textContent = node.dataset.source;
          figures[index].classList.remove('failed');
          try {
            await mermaid.run({ nodes: [node] });
          } catch (error) {
            node.textContent = node.dataset.source;
            figures[index].classList.add('failed');
            console.error('Mermaid diagram failed', error);
          }
        }
      });
    };
    try {
      const module = await import('https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs');
      mermaid = module.default;
      renderDiagrams(root.dataset.theme);
      addEventListener('teeko-theme', event => renderDiagrams(event.detail));
    } catch (error) {
      figures.forEach(figure => figure.classList.add('failed'));
      console.error('Mermaid runtime unavailable', error);
    }
  </script>
</body>
</html>`;

fs.writeFileSync(outputPath, html);
console.log(`Generated ${outputPath.pathname}`);
