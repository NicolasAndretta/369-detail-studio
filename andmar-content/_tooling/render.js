// Renderiza HTML con las tipografías reales del proyecto (Inter + Outfit).
// Trabaja DENTRO de la página del sitio para heredar --font-display /
// --font-primary sin tener que adivinar qué woff2 es cada peso.
const { chromium } = require('playwright');
const fs = require('fs');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

async function withRenderer(fn) {
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--force-color-profile=srgb','--hide-scrollbars'] });
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1, colorScheme: 'dark' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const render = async ({ html, css, out, width = 1080, height = 1920, transparent = false }) => {
    await page.setViewportSize({ width, height });
    await page.evaluate(({ html, css, transparent }) => {
      document.querySelectorAll('style[data-andmar]').forEach(e => e.remove());
      const st = document.createElement('style');
      st.dataset.andmar = '1';
      st.textContent = `
        html,body{margin:0;padding:0;overflow:hidden;background:${transparent ? 'transparent' : '#07070A'} !important;}
        body>*:not(#andmar-root){display:none !important;}
        #andmar-root{position:fixed;inset:0;display:block;}
        ${css || ''}`;
      document.head.appendChild(st);
      let root = document.getElementById('andmar-root');
      if (!root) { root = document.createElement('div'); root.id = 'andmar-root'; document.body.appendChild(root); }
      root.innerHTML = html;
    }, { html, css, transparent });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(320);
    await page.screenshot({ path: out, omitBackground: transparent });
  };
  try { await fn(render, page); } finally { await browser.close(); }
}

module.exports = { withRenderer };
