const { Capture } = require('./lib-capture');
(async () => {
  const c = new Capture(process.argv[2], { mobile: true });
  const page = await c.open({ width: 540, height: 960 }, 2);
  await c.goto('/galeria', 2600);
  await c.warm();
  await c.goto('/galeria', 2600);

  const filtros = await page.$$eval('button', els =>
    els.map(e => e.innerText.trim()).filter(t => ['Todos','Lavado','Abrillantado','Cerámico','Acrílico','Interior','Motor y Chasis'].includes(t)));
  console.log('filtros:', JSON.stringify(filtros));

  // Encuadre: la fila de filtros arriba y la grilla debajo.
  const y0 = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find(e => e.innerText.trim() === 'Todos');
    return b.getBoundingClientRect().top + window.scrollY - 90;
  });
  await page.evaluate(yy => window.scrollTo(0, yy), Math.round(y0));
  await page.waitForTimeout(900);
  await c.hold(18);

  for (const nombre of ['Cerámico', 'Interior', 'Lavado', 'Motor y Chasis', 'Todos']) {
    const btn = await page.$(`button:text-is("${nombre}")`);
    if (!btn) { console.log('no encontrado:', nombre); continue; }
    await btn.click();
    await c.live(22, 40);   // reflow animado de la grilla
    await c.hold(16);
  }
  console.log('cuadros:', c.count);
  await c.close();
})();
