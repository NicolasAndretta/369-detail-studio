const { Capture } = require('./lib-capture');
(async () => {
  const c = new Capture(process.argv[2], { mobile: true });
  const page = await c.open({ width: 540, height: 960 }, 2);
  await c.goto('/galeria', 2600);
  await c.warm();
  await c.goto('/galeria', 2600);

  // Las tarjetas con par antes/después son las que muestran "VER DESPUÉS".
  const idx = await page.$$eval('.gallery-card', els =>
    els.map((e, i) => e.querySelector('.gallery-card__compare-action') ? i : -1).filter(i => i >= 0));
  console.log('tarjetas con antes/después:', JSON.stringify(idx));

  const cards = await page.$$('.gallery-card');
  for (const i of idx.slice(0, 3)) {
    const card = cards[i];
    await card.scrollIntoViewIfNeeded();
    // Centrar la tarjeta en el encuadre vertical.
    const box = await card.boundingBox();
    const y = await page.evaluate(() => window.scrollY);
    await page.evaluate(yy => window.scrollTo(0, yy), Math.round(y + box.y - (960 - box.height) / 2));
    await page.waitForTimeout(900);
    await c.hold(20);          // ANTES
    await card.click();
    await c.live(26, 35);      // crossfade a DESPUÉS
    await c.hold(20);          // DESPUÉS
    await card.click();
    await c.live(20, 35);      // vuelta al ANTES
    await c.hold(8);
  }
  console.log('cuadros:', c.count);
  await c.close();
})();
