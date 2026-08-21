const { V, fondo, grano, eyebrow, firma } = require('./brand');

/** Cartel de apertura / cierre: 1080x1920, negro con halo violeta. */
function carteles({ kicker, titulo, acento, bajada, pie, cta }) {
  return `
  <div style="${fondo()}"></div>
  <div style="${grano}"></div>
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 92px;">
    ${kicker ? eyebrow(kicker) : ''}
    <h1 style="font-family:${V.display};font-size:118px;line-height:.94;font-weight:700;color:${V.ink};margin:${kicker ? '46px' : '0'} 0 0;letter-spacing:-.038em;">
      ${titulo}${acento ? `<br><span style="color:${V.acc2}">${acento}</span>` : ''}
    </h1>
    ${bajada ? `<p style="font-family:${V.body};font-size:36px;line-height:1.48;color:${V.mute};margin:46px 0 0;max-width:820px;font-weight:400;">${bajada}</p>` : ''}
    ${cta ? `<div style="margin:58px 0 0;display:inline-flex;align-self:flex-start;align-items:center;gap:18px;padding:26px 44px;border-radius:99px;background:${V.acc};">
        <span style="font-family:${V.display};font-size:34px;font-weight:600;color:#0B0512;letter-spacing:-.01em;">${cta}</span>
      </div>` : ''}
  </div>
  <div style="position:absolute;left:92px;right:92px;bottom:96px;">${firma(pie || '')}</div>`;
}

/**
 * Franja inferior sobre la UI. Fondo degradado para que el texto se lea
 * sin tapar la interfaz — la UI sigue siendo la protagonista.
 */
function franja({ paso, titulo, detalle }) {
  return `
  <div style="position:absolute;left:0;right:0;bottom:0;height:560px;
       background:linear-gradient(to top, rgba(5,5,8,.96) 0%, rgba(5,5,8,.88) 42%, rgba(5,5,8,0) 100%);"></div>
  <div style="position:absolute;left:72px;right:72px;bottom:118px;">
    ${paso ? `<div style="display:inline-flex;align-items:center;gap:14px;padding:14px 26px;border-radius:99px;
         background:${V.accDim};border:1.5px solid rgba(139,92,246,.42);margin-bottom:30px;">
      <span style="width:8px;height:8px;border-radius:99px;background:${V.acc2};box-shadow:0 0 14px ${V.acc2};"></span>
      <span style="font-family:${V.body};font-size:22px;letter-spacing:.22em;text-transform:uppercase;color:${V.acc2};font-weight:600;">${paso}</span>
    </div>` : ''}
    <div style="font-family:${V.display};font-size:66px;line-height:1.04;font-weight:700;color:${V.ink};letter-spacing:-.03em;">${titulo}</div>
    ${detalle ? `<div style="font-family:${V.body};font-size:31px;line-height:1.42;color:${V.mute};margin-top:20px;max-width:900px;">${detalle}</div>` : ''}
  </div>`;
}

/**
 * Barra de marca arriba. Va OPACA y con altura suficiente para tapar por
 * completo la navbar del sitio: si se deja translúcida, "andmar.studio"
 * cae justo encima del logo de 369 y se pisan las dos marcas.
 */
function marcaArriba(extra) {
  return `
  <div style="position:absolute;left:0;right:0;top:0;height:152px;background:${V.bg};
       border-bottom:1px solid ${V.line};"></div>
  <div style="position:absolute;left:0;right:0;top:152px;height:190px;
       background:linear-gradient(to bottom, rgba(7,7,10,.90) 0%, rgba(7,7,10,0) 100%);"></div>
  <div style="position:absolute;left:72px;right:72px;top:0;height:152px;display:flex;align-items:center;justify-content:space-between;">
    <div style="display:flex;align-items:center;gap:13px;">
      <span style="width:9px;height:9px;border-radius:99px;background:${V.acc};box-shadow:0 0 18px ${V.acc};"></span>
      <span style="font-family:${V.display};font-size:31px;font-weight:600;color:${V.ink};letter-spacing:-.01em;">andmar<span style="color:${V.acc2}">.studio</span></span>
    </div>
    ${extra ? `<span style="font-family:${V.body};font-size:22px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.50);">${extra}</span>` : ''}
  </div>`;
}

/** Teléfono con la UI adentro: deja claro que es una web real, no una imagen. */
function enTelefono({ innerPng, kicker, titulo, pie, w = 812 }) {
  const h = Math.round(w * 1920 / 1080);
  return `
  <div style="${fondo({ a1: .26, a2: .16 })}"></div>
  <div style="${grano}"></div>
  <div style="position:absolute;left:0;right:0;top:126px;padding:0 92px;">
    ${kicker ? eyebrow(kicker) : ''}
    ${titulo ? `<h2 style="font-family:${V.display};font-size:70px;line-height:1.02;font-weight:700;color:${V.ink};margin:28px 0 0;letter-spacing:-.032em;">${titulo}</h2>` : ''}
  </div>
  <div style="position:absolute;left:50%;top:${titulo ? 430 : 330}px;transform:translateX(-50%);
       width:${w}px;height:${h}px;border-radius:44px;overflow:hidden;background:#000;
       box-shadow:0 46px 130px rgba(0,0,0,.8), 0 0 0 2px rgba(255,255,255,.11), 0 0 110px rgba(139,92,246,.24);">
    <img src="${innerPng}" style="width:100%;height:100%;object-fit:cover;display:block;">
  </div>
  <div style="position:absolute;left:92px;right:92px;bottom:92px;">${firma(pie || '')}</div>`;
}

module.exports = { carteles, franja, marcaArriba, enTelefono };
