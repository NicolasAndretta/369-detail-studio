const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const BASE = 'http://localhost:3000';

// easeInOutCubic — el movimiento arranca y frena suave, sin tirones.
const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;

class Capture {
  constructor(dir, opts = {}) {
    this.dir = dir;
    this.n = 0;
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    this.opts = opts;
  }
  async open(viewport, dsf) {
    this.browser = await chromium.launch({
      executablePath: CHROME,
      args: ['--force-color-profile=srgb', '--disable-lcd-text', '--hide-scrollbars'],
    });
    this.ctx = await this.browser.newContext({
      viewport, deviceScaleFactor: dsf,
      isMobile: !!this.opts.mobile, hasTouch: !!this.opts.mobile,
      colorScheme: 'dark',
    });
    if (this.opts.storageCookies) await this.ctx.addCookies(this.opts.storageCookies);
    this.page = await this.ctx.newPage();
    // Barra de scroll fuera: en el video se ve como un artefacto.
    await this.page.addStyleTag({ content: `::-webkit-scrollbar{display:none!important}
      html{scrollbar-width:none!important}` }).catch(()=>{});
    return this.page;
  }
  async goto(url, wait = 2200) {
    await this.page.goto(BASE + url, { waitUntil: 'networkidle' });
    await this.page.addStyleTag({ content: `::-webkit-scrollbar{display:none!important}
      html{scrollbar-width:none!important}` }).catch(()=>{});
    await this.page.waitForTimeout(wait);
  }
  /** Pre-scroll: dispara todas las animaciones `once:true` y precarga imágenes. */
  async warm() {
    const h = await this.page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 350) {
      await this.page.evaluate(yy => window.scrollTo(0, yy), y);
      await this.page.waitForTimeout(130);
    }
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(700);
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.waitForTimeout(900);
  }
  async shot() {
    const f = path.join(this.dir, String(this.n++).padStart(5, '0') + '.png');
    await this.page.screenshot({ path: f, animations: 'allow', caret: 'hide' });
  }
  /** N cuadros quietos (para respirar antes/después de un movimiento). */
  async hold(frames) { for (let i = 0; i < frames; i++) await this.shot(); }
  /** Scroll suave de `from` a `to` en `frames` cuadros. */
  async scrollTo(from, to, frames) {
    for (let i = 0; i < frames; i++) {
      const y = from + (to - from) * ease(i / (frames - 1 || 1));
      await this.page.evaluate(yy => window.scrollTo(0, yy), Math.round(y));
      await this.shot();
    }
  }
  /** Cuadros en tiempo real: sirve para transiciones (crossfades, modales). */
  async live(frames, gapMs = 40) {
    for (let i = 0; i < frames; i++) { await this.shot(); await this.page.waitForTimeout(gapMs); }
  }
  async close() { await this.browser.close(); }
  get count() { return this.n; }
}

module.exports = { Capture, BASE, CHROME, ease };
