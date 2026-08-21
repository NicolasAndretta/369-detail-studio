const { Capture } = require('./lib-capture');
(async () => {
  const dir = process.argv[2];
  const c = new Capture(dir, { mobile: true });
  // 540x960 CSS @2x = 1080x1920 nativo, exacto para Reels. Sin reescalado.
  const page = await c.open({ width: 540, height: 960 }, 2);
  await c.goto('/', 2600);

  // ── 1. Hero quieto: que se lea el título y entre el slideshow ──
  await c.live(70, 55);                 // ~4 s reales: alcanza un crossfade
  const H = await page.evaluate(() => document.body.scrollHeight);
  console.log('altura mobile:', H);

  await c.warm();                       // dispara reveals y precarga
  await c.goto('/', 2600);              // recarga limpia, ya con todo en caché
  await c.live(50, 50);

  // ── 2. Recorrido: hero → servicios → resultados → contacto ──
  const anchors = await page.evaluate(() => {
    const y = id => { const e = document.getElementById(id); return e ? e.getBoundingClientRect().top + window.scrollY : null; };
    return { servicios: y('servicios'), resultados: y('resultados'), contacto: y('contacto'), total: document.body.scrollHeight };
  });
  console.log(JSON.stringify(anchors));

  await c.scrollTo(0, anchors.servicios, 46);
  await c.hold(16);
  await c.scrollTo(anchors.servicios, anchors.servicios + 900, 52);
  await c.hold(14);
  await c.scrollTo(anchors.servicios + 900, anchors.resultados, 44);
  await c.hold(16);
  await c.scrollTo(anchors.resultados, anchors.resultados + 1100, 56);
  await c.hold(14);
  await c.scrollTo(anchors.resultados + 1100, anchors.contacto, 50);
  await c.hold(20);
  await c.scrollTo(anchors.contacto, anchors.total - 960, 40);
  await c.hold(22);

  console.log('cuadros:', c.count);
  await c.close();
})();
