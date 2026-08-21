const { Capture } = require('./lib-capture');
const PW = process.env.ADMIN_PASSWORD;
(async () => {
  const c = new Capture(process.argv[2], { mobile: true });
  const page = await c.open({ width: 540, height: 960 }, 2);

  // ── Login ──────────────────────────────────────────────
  await c.goto('/admin', 2200);
  await c.hold(20);
  const inp = await page.$('input[type=password]');
  // Se teclea una clave FICTICIA solo para el video: la real nunca se filma.
  await inp.click();
  for (const ch of '••••••••••'.split('')) { await page.waitForTimeout(70); await c.shot(); }
  await c.hold(10);
  // El campo es type=password: en pantalla siempre son puntitos, nunca el texto.
  await inp.fill(PW);
  await Promise.all([
    page.waitForURL('**/admin', { timeout: 15000 }).catch(() => {}),
    page.click('button[type=submit], form button'),
  ]);
  await page.waitForTimeout(2200);
  console.log('URL post-login:', page.url());
  await c.hold(24);

  // ── Lista de trabajos ──────────────────────────────────
  const total = await page.evaluate(() => document.body.scrollHeight);
  console.log('alto panel:', total);
  await c.scrollTo(0, Math.min(1400, total - 960), 54);
  await c.hold(14);
  await c.scrollTo(Math.min(1400, total - 960), Math.min(2900, total - 960), 54);
  await c.hold(16);
  await c.scrollTo(Math.min(2900, total - 960), 0, 46);
  await c.hold(14);

  // ── Toggle real: sacar/poner en inicio ─────────────────
  const btn = await page.$('button:text-is("Sacar del inicio")');
  if (btn) {
    await btn.scrollIntoViewIfNeeded(); await page.waitForTimeout(600);
    await c.hold(16);
    await btn.click();
    await page.waitForTimeout(1600);
    await c.hold(26);
    const back = await page.$('button:text-is("Poner en inicio")');
    if (back) { await back.click(); await page.waitForTimeout(1500); await c.hold(20); }
  }

  // ── Formulario "Nuevo trabajo" ─────────────────────────
  await page.goto('http://localhost:3000/admin/nuevo', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1600);
  await c.hold(22);
  const veh = await page.$('input[placeholder*="Amarok"]');
  if (veh) {
    await veh.click();
    for (const ch of 'VW Amarok gris') {
      await veh.type(ch, { delay: 0 });
      await page.waitForTimeout(55);
      await c.shot();
    }
    await c.hold(14);
  }
  const chk = await page.$('input[type=checkbox]');
  if (chk) { await chk.click(); await c.live(12, 45); await c.hold(12); }
  const h2 = await page.evaluate(() => document.body.scrollHeight);
  await c.scrollTo(0, Math.min(1500, h2 - 960), 56);
  await c.hold(16);
  await c.scrollTo(Math.min(1500, h2 - 960), h2 - 960, 50);
  await c.hold(20);

  console.log('cuadros:', c.count);
  await c.close();
})();
