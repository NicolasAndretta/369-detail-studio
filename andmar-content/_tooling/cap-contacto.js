const { Capture } = require('./lib-capture');
(async () => {
  const c = new Capture(process.argv[2], { mobile: true });
  const page = await c.open({ width: 540, height: 960 }, 2);
  await c.goto('/', 2600);
  await c.warm();
  await c.goto('/', 2600);
  const y = await page.evaluate(() => {
    const e = document.getElementById('contacto');
    return e.getBoundingClientRect().top + window.scrollY;
  });
  // Se entra a la sección de contacto y se recorre SOLO ella: el reel tiene
  // que cerrar en el botón de turno, no en el pie de página.
  await page.evaluate(yy => window.scrollTo(0, yy - 260), Math.round(y));
  await page.waitForTimeout(1100);
  await c.hold(24);
  await c.scrollTo(y - 260, y + 250, 52);
  await c.hold(36);
  console.log('cuadros:', c.count, '· contacto en y =', Math.round(y));
  await c.close();
})();
