const { Capture } = require('./lib-capture');
(async () => {
  const c = new Capture(process.argv[2], { mobile: true });
  const page = await c.open({ width: 540, height: 960 }, 2);
  await c.goto('/galeria', 2600);
  await c.warm();
  await c.goto('/galeria', 2600);

  const cards = await page.$$('.gallery-card');
  const registro = [];

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    // Recorrer los ángulos del trabajo buscando los que tienen par.
    const total = await card.$$eval('.gallery-card__counter', els =>
      els[0] ? Number(els[0].innerText.split('/')[1]) : 1).catch(() => 1);

    for (let a = 0; a < total; a++) {
      const tienePar = await card.$('.gallery-card__compare-action');
      if (tienePar) {
        await card.scrollIntoViewIfNeeded();
        const box = await card.boundingBox();
        const sy = await page.evaluate(() => window.scrollY);
        await page.evaluate(yy => window.scrollTo(0, yy), Math.round(sy + box.y - (960 - box.height) / 2));
        await page.waitForTimeout(800);

        const meta = await card.evaluate(el => ({
          servicio: el.querySelector('.gallery-card__label')?.innerText,
          angulo: el.querySelector('.gallery-card__angle')?.innerText,
        }));
        const inicio = c.count;
        await c.hold(20);            // ANTES
        await card.click();
        await c.live(26, 35);        // crossfade
        await c.hold(22);            // DESPUÉS
        await card.click();
        await c.live(16, 35);
        registro.push({ tarjeta: i, ...meta, inicio, fin: c.count });
        console.log(`par: tarjeta ${i} · ${meta.servicio} · ${meta.angulo} · cuadros ${inicio}-${c.count}`);
      }
      const next = await card.$('.gallery-card__arrow--next');
      if (!next) break;
      await next.click();
      await page.waitForTimeout(650);
    }
  }
  require('fs').writeFileSync(process.argv[2] + '/registro.json', JSON.stringify(registro, null, 1));
  console.log('total cuadros:', c.count);
  await c.close();
})();
