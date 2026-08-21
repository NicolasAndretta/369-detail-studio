const { withRenderer } = require('./render');
const { V, fondo, grano, eyebrow, firma } = require('./brand');
const OUT = process.argv[2], CAP = process.argv[3];
// La página del sitio corre con CSP `img-src 'self' data:`: un file:// queda
// bloqueado y la captura sale negra. Se incrusta en data: URI.
const fsx = require('fs');
const cache = new Map();
const f = n => {
  if (!cache.has(n)) {
    cache.set(n, 'data:image/png;base64,' + fsx.readFileSync(`${CAP}/${n}.png`).toString('base64'));
  }
  return cache.get(n);
};

const W = 1080, H = 1350;   // 4:5 — el formato que más pantalla ocupa en el feed

/** Teléfono con la captura adentro. */
const tel = (img, w, extra = '') => `
  <div style="width:${w}px;height:${Math.round(w * 1920 / 1080)}px;border-radius:${Math.round(w * .052)}px;
       overflow:hidden;background:#000;flex:none;${extra}
       box-shadow:0 34px 90px rgba(0,0,0,.72), 0 0 0 2px rgba(255,255,255,.11), 0 0 76px rgba(139,92,246,.20);">
    <img src="${img}" style="width:100%;height:100%;object-fit:cover;object-position:top;display:block;">
  </div>`;

/** Ventana de escritorio con barra de puntos. */
const ventana = (img, w, extra = '') => `
  <div style="width:${w}px;border-radius:16px;overflow:hidden;background:#0B0B10;flex:none;${extra}
       box-shadow:0 34px 90px rgba(0,0,0,.72), 0 0 0 1.5px rgba(255,255,255,.11), 0 0 76px rgba(139,92,246,.18);">
    <div style="height:38px;background:#111118;display:flex;align-items:center;gap:9px;padding:0 18px;border-bottom:1px solid rgba(255,255,255,.07);">
      <span style="width:11px;height:11px;border-radius:99px;background:rgba(255,255,255,.20);"></span>
      <span style="width:11px;height:11px;border-radius:99px;background:rgba(255,255,255,.20);"></span>
      <span style="width:11px;height:11px;border-radius:99px;background:rgba(255,255,255,.20);"></span>
      <span style="margin-left:16px;font-family:${V.body};font-size:17px;color:rgba(255,255,255,.42);">369detail.com.ar</span>
    </div>
    <img src="${img}" style="width:100%;display:block;">
  </div>`;

const marco = (contenido, pie) => `
  <div style="${fondo({ a1: .24, a2: .14 })}"></div>
  <div style="${grano}"></div>
  ${contenido}
  <div style="position:absolute;left:74px;right:74px;bottom:64px;">${firma(pie || '')}</div>`;

const POSTS = {

  // ── 1 · PRESENTACIÓN DEL PROYECTO ─────────────────────────────
  '369-detail-post-proyecto': marco(`
    <div style="position:absolute;left:74px;top:0;bottom:150px;width:530px;display:flex;flex-direction:column;justify-content:center;">
      ${eyebrow('Proyecto')}
      <h1 style="font-family:${V.display};font-size:88px;line-height:.95;font-weight:700;color:${V.ink};margin:34px 0 0;letter-spacing:-.038em;">
        369 Detail<br><span style="color:${V.acc2}">ya tiene web</span>
      </h1>
      <p style="font-family:${V.body};font-size:29px;line-height:1.52;color:${V.mute};margin:34px 0 0;">
        Un taller de detailing de Lugano que trabajaba solo con Instagram.
        Ahora tiene sitio propio, galería de trabajos y turnos por WhatsApp.
      </p>
      <div style="margin-top:38px;display:flex;flex-wrap:wrap;gap:12px;">
        ${['Next.js','TypeScript','Supabase','Panel propio'].map(t => `
          <span style="font-family:${V.body};font-size:21px;color:${V.acc2};padding:12px 22px;border-radius:99px;
                background:${V.accDim};border:1.5px solid rgba(139,92,246,.34);">${t}</span>`).join('')}
      </div>
    </div>
    <div style="position:absolute;right:-92px;top:108px;transform:rotate(-6deg);">
      ${tel(f('369-detail-mobile-hero'), 520)}
    </div>`, '369detail.com.ar'),

  // ── 2 · LA WEB (escritorio) ───────────────────────────────────
  '369-detail-post-web': marco(`
    <div style="position:absolute;left:74px;right:74px;top:92px;">
      ${eyebrow('En producción')}
      <h1 style="font-family:${V.display};font-size:80px;line-height:.97;font-weight:700;color:${V.ink};margin:30px 0 0;letter-spacing:-.038em;">
        Una página, <span style="color:${V.acc2}">todo el negocio</span>
      </h1>
      <p style="font-family:${V.body};font-size:28px;line-height:1.5;color:${V.mute};margin:26px 0 0;max-width:880px;">
        Servicios, resultados, horarios y contacto. Sin menús que no llevan a ningún lado.
      </p>
    </div>
    <div style="position:absolute;left:50%;transform:translateX(-50%);top:520px;">
      ${ventana(f('369-detail-desktop-hero'), 900)}
    </div>`, 'andmar.studio'),

  // ── 3 · ANTES / DESPUÉS (funcionalidad) ───────────────────────
  '369-detail-post-antes-despues': marco(`
    <div style="position:absolute;left:74px;right:74px;top:88px;">
      ${eyebrow('Funcionalidad')}
      <h1 style="font-family:${V.display};font-size:78px;line-height:.97;font-weight:700;color:${V.ink};margin:28px 0 0;letter-spacing:-.038em;">
        Antes y después, <span style="color:${V.acc2}">en un toque</span>
      </h1>
    </div>
    <div style="position:absolute;left:50%;transform:translateX(-50%);top:390px;display:flex;gap:34px;align-items:flex-start;">
      <div>
        ${tel(f('369-detail-mobile-antes-1'), 396)}
        <div style="text-align:center;margin-top:22px;font-family:${V.body};font-size:24px;letter-spacing:.24em;
             text-transform:uppercase;color:${V.faint};font-weight:600;">Antes</div>
      </div>
      <div>
        ${tel(f('369-detail-mobile-despues-1'), 396)}
        <div style="text-align:center;margin-top:22px;font-family:${V.body};font-size:24px;letter-spacing:.24em;
             text-transform:uppercase;color:${V.acc2};font-weight:600;">Después</div>
      </div>
    </div>`, 'Chevrolet Sonic · Abrillantado'),

  // ── 4 · PANEL (problema / solución) ───────────────────────────
  '369-detail-post-panel': marco(`
    <div style="position:absolute;left:74px;top:0;bottom:150px;width:530px;display:flex;flex-direction:column;justify-content:center;">
      ${eyebrow('Panel administrativo')}
      <h1 style="font-family:${V.display};font-size:82px;line-height:.95;font-weight:700;color:${V.ink};margin:32px 0 0;letter-spacing:-.038em;">
        El taller<br><span style="color:${V.acc2}">carga sus fotos</span>
      </h1>
      <div style="margin-top:40px;display:flex;flex-direction:column;gap:22px;">
        ${[
          ['El problema', 'Cada foto nueva era un mensaje al desarrollador.'],
          ['La solución', 'Un panel con clave. Suben, ocultan y ordenan solos.'],
        ].map(([t, d]) => `
          <div style="padding-left:22px;border-left:3px solid ${V.acc};">
            <div style="font-family:${V.body};font-size:21px;letter-spacing:.20em;text-transform:uppercase;color:${V.acc2};font-weight:600;">${t}</div>
            <div style="font-family:${V.body};font-size:27px;line-height:1.45;color:${V.mute};margin-top:10px;">${d}</div>
          </div>`).join('')}
      </div>
    </div>
    <div style="position:absolute;right:-84px;top:132px;transform:rotate(5deg);">
      ${tel(f('369-detail-mobile-admin-panel'), 496)}
    </div>`, 'Acceso privado'),

  // ── 5 · GALERÍA CON FILTROS ───────────────────────────────────
  '369-detail-post-galeria': marco(`
    <div style="position:absolute;left:74px;right:74px;top:90px;">
      ${eyebrow('Galería')}
      <h1 style="font-family:${V.display};font-size:80px;line-height:.96;font-weight:700;color:${V.ink};margin:28px 0 0;letter-spacing:-.038em;">
        Filtrá por <span style="color:${V.acc2}">servicio</span>
      </h1>
      <p style="font-family:${V.body};font-size:27px;line-height:1.5;color:${V.mute};margin:24px 0 0;max-width:820px;">
        Lavado, abrillantado, cerámico, acrílico, interior, motor y chasis.
      </p>
    </div>
    <div style="position:absolute;left:50%;transform:translateX(-50%);top:452px;display:flex;gap:30px;">
      ${tel(f('369-detail-mobile-galeria-top'), 372, 'transform:translateY(26px);')}
      ${tel(f('369-detail-mobile-galeria-grilla'), 372)}
    </div>`, '369detail.com.ar/galeria'),

  // ── 6 · RESPONSIVE ────────────────────────────────────────────
  '369-detail-post-responsive': marco(`
    <div style="position:absolute;left:74px;right:74px;top:88px;">
      ${eyebrow('Responsive')}
      <h1 style="font-family:${V.display};font-size:78px;line-height:.97;font-weight:700;color:${V.ink};margin:26px 0 0;letter-spacing:-.038em;">
        La misma web <span style="color:${V.acc2}">en cada pantalla</span>
      </h1>
    </div>
    <div style="position:absolute;left:64px;top:400px;">
      ${ventana(f('369-detail-desktop-resultados'), 760)}
    </div>
    <div style="position:absolute;right:58px;top:508px;">
      ${tel(f('369-detail-mobile-resultados'), 300)}
    </div>`, 'andmar.studio'),

  // ── 7 · SERVICIOS (detalle visual) ────────────────────────────
  '369-detail-post-servicios': marco(`
    <div style="position:absolute;left:74px;right:74px;top:92px;">
      ${eyebrow('Contenido real')}
      <h1 style="font-family:${V.display};font-size:80px;line-height:.96;font-weight:700;color:${V.ink};margin:28px 0 0;letter-spacing:-.038em;">
        Seis servicios, <span style="color:${V.acc2}">seis fichas</span>
      </h1>
      <p style="font-family:${V.body};font-size:27px;line-height:1.5;color:${V.mute};margin:24px 0 0;max-width:840px;">
        Qué incluye cada uno, escrito como lo explica el taller. Sin relleno.
      </p>
    </div>
    <div style="position:absolute;left:50%;transform:translateX(-50%);top:470px;">
      ${ventana(f('369-detail-desktop-servicios'), 880)}
    </div>`, '369detail.com.ar'),
};

(async () => {
  await withRenderer(async (render) => {
    for (const [n, html] of Object.entries(POSTS)) {
      await render({ html, out: `${OUT}/${n}.png`, width: W, height: H });
      console.log('post', n);
    }
  });
})();
