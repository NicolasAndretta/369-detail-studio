const { Capture } = require('./lib-capture');
const PW = process.env.ADMIN_PASSWORD;
const OUT = process.argv[2];
const fs = require('fs');

(async () => {
  const c = new Capture(process.argv[3] || '/tmp/_descartes', { mobile: true });
  const page = await c.open({ width: 540, height: 960 }, 2);
  const tomar = async (n) => { await page.screenshot({ path: `${OUT}/${n}.png` }); console.log('  ·', n); };

  // ── Móvil 1080x1920 ────────────────────────────────────
  await c.goto('/', 2800);
  await tomar('369-detail-mobile-hero');
  await c.warm(); await c.goto('/', 2600);
  const a = await page.evaluate(() => {
    const y = id => document.getElementById(id).getBoundingClientRect().top + window.scrollY;
    return { servicios: y('servicios'), resultados: y('resultados'), contacto: y('contacto') };
  });
  for (const [k, y] of Object.entries(a)) {
    await page.evaluate(yy => window.scrollTo(0, yy), Math.round(y));
    await page.waitForTimeout(900);
    await tomar(`369-detail-mobile-${k}`);
  }
  await page.evaluate(() => window.scrollTo(0, 3450)); await page.waitForTimeout(900);
  await tomar('369-detail-mobile-galeria-inicio');

  await c.goto('/galeria', 2600); await c.warm(); await c.goto('/galeria', 2600);
  await tomar('369-detail-mobile-galeria-top');
  await page.evaluate(() => window.scrollTo(0, 700)); await page.waitForTimeout(900);
  await tomar('369-detail-mobile-galeria-grilla');

  // Par antes/después de la MISMA tarjeta, mismo encuadre.
  const cards = await page.$$('.gallery-card');
  const idx = await page.$$eval('.gallery-card', els =>
    els.map((e, i) => e.querySelector('.gallery-card__compare-action') ? i : -1).filter(i => i >= 0));
  let nPar = 1;
  for (const i of idx) {
    const card = cards[i];
    await card.scrollIntoViewIfNeeded();
    const box = await card.boundingBox();
    const sy = await page.evaluate(() => window.scrollY);
    await page.evaluate(yy => window.scrollTo(0, yy), Math.round(sy + box.y - (960 - box.height) / 2));
    await page.waitForTimeout(1000);
    await tomar(`369-detail-mobile-antes-${nPar}`);
    await card.click(); await page.waitForTimeout(1200);
    await tomar(`369-detail-mobile-despues-${nPar}`);
    await card.click(); await page.waitForTimeout(700);
    nPar++;
  }

  // ── Panel ──────────────────────────────────────────────
  await c.goto('/admin', 2000);
  await tomar('369-detail-mobile-admin-login');
  await (await page.$('input[type=password]')).fill(PW);
  await Promise.all([page.waitForURL('**/admin').catch(()=>{}), page.click('button[type=submit], form button')]);
  await page.waitForTimeout(2400);
  await tomar('369-detail-mobile-admin-panel');
  await c.goto('/admin/nuevo', 2000);
  await tomar('369-detail-mobile-admin-nuevo');
  await c.close();

  // ── Escritorio 2560x1600 ───────────────────────────────
  const d = new Capture('/tmp/_descartes2');
  const dp = await d.open({ width: 1280, height: 800 }, 2);
  const tomarD = async (n) => { await dp.screenshot({ path: `${OUT}/${n}.png` }); console.log('  ·', n); };
  await d.goto('/', 2800);
  await tomarD('369-detail-desktop-hero');
  await d.warm(); await d.goto('/', 2600);
  const b = await dp.evaluate(() => {
    const y = id => document.getElementById(id).getBoundingClientRect().top + window.scrollY;
    return { servicios: y('servicios'), resultados: y('resultados'), contacto: y('contacto') };
  });
  for (const [k, y] of Object.entries(b)) {
    await dp.evaluate(yy => window.scrollTo(0, yy), Math.round(y));
    await dp.waitForTimeout(900);
    await tomarD(`369-detail-desktop-${k}`);
  }
  await d.goto('/galeria', 2600); await d.warm(); await d.goto('/galeria', 2600);
  await tomarD('369-detail-desktop-galeria');
  await d.close();
  console.log('capturas listas');
})();
