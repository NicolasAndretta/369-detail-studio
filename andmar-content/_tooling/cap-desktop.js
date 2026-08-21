const { Capture } = require('./lib-capture');
(async () => {
  const c = new Capture(process.argv[2]);
  // 1280x800 @2x = 2560x1600. Se reduce después dentro del lienzo 9:16 → queda nítido.
  const page = await c.open({ width: 1280, height: 800 }, 1.5);
  await c.goto('/', 2600);
  await c.live(60, 55);            // hero + un crossfade del slideshow
  await c.warm();
  await c.goto('/', 2600);
  await c.live(40, 50);

  const a = await page.evaluate(() => {
    const y = id => { const e = document.getElementById(id); return e ? e.getBoundingClientRect().top + window.scrollY : 0; };
    return { servicios: y('servicios'), resultados: y('resultados'), contacto: y('contacto'), total: document.body.scrollHeight };
  });
  console.log(JSON.stringify(a));

  await c.scrollTo(0, a.servicios, 44);
  await c.hold(18);
  await c.scrollTo(a.servicios, a.resultados, 48);
  await c.hold(18);
  await c.scrollTo(a.resultados, a.resultados + 800, 44);
  await c.hold(16);
  await c.scrollTo(a.resultados + 800, a.contacto, 46);
  await c.hold(20);
  await c.scrollTo(a.contacto, a.total - 800, 38);
  await c.hold(20);

  // ── Galería completa en desktop ────────────────────────
  await c.goto('/galeria', 2400);
  await c.warm();
  await c.goto('/galeria', 2400);
  await c.hold(22);
  const g = await page.evaluate(() => document.body.scrollHeight);
  await c.scrollTo(0, Math.min(900, g - 800), 46);
  await c.hold(16);
  for (const f of ['Cerámico', 'Interior', 'Todos']) {
    const b = await page.$(`button:text-is("${f}")`);
    if (b) { await b.click(); await c.live(20, 40); await c.hold(14); }
  }
  console.log('cuadros:', c.count);
  await c.close();
})();
