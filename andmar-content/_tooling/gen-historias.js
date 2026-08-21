const { withRenderer } = require('./render');
const { V, fondo, grano, eyebrow, firma } = require('./brand');
const fsx = require('fs');
const OUT = process.argv[2], CAP = process.argv[3];
const cache = new Map();
const f = n => {
  if (!cache.has(n)) cache.set(n, 'data:image/png;base64,' + fsx.readFileSync(`${CAP}/${n}.png`).toString('base64'));
  return cache.get(n);
};

const W = 1080, H = 1920;
// Instagram tapa ~250px arriba y ~320px abajo con su propia interfaz:
// todo lo que importa vive en la franja segura del medio.
const SEGURO_TOP = 300, SEGURO_BOT = 380;

const tel = (img, w, pos = 'top') => `
  <div style="width:${w}px;height:${Math.round(w * 1920 / 1080)}px;border-radius:${Math.round(w * .052)}px;
       overflow:hidden;background:#000;flex:none;
       box-shadow:0 36px 96px rgba(0,0,0,.76), 0 0 0 2px rgba(255,255,255,.11), 0 0 84px rgba(139,92,246,.22);">
    <img src="${img}" style="width:100%;height:100%;object-fit:cover;object-position:${pos};display:block;">
  </div>`;

/** Historia de texto: titular grande dentro de la franja segura. */
const texto = ({ kicker, titulo, acento, bajada, nota, pie }) => `
  <div style="${fondo({ a1: .26, a2: .16 })}"></div>
  <div style="${grano}"></div>
  <div style="position:absolute;left:88px;right:88px;top:${SEGURO_TOP}px;bottom:${SEGURO_BOT}px;
       display:flex;flex-direction:column;justify-content:center;">
    ${kicker ? eyebrow(kicker) : ''}
    <h1 style="font-family:${V.display};font-size:104px;line-height:.96;font-weight:700;color:${V.ink};margin:40px 0 0;letter-spacing:-.038em;">
      ${titulo}${acento ? `<br><span style="color:${V.acc2}">${acento}</span>` : ''}
    </h1>
    ${bajada ? `<p style="font-family:${V.body};font-size:36px;line-height:1.5;color:${V.mute};margin:40px 0 0;">${bajada}</p>` : ''}
    ${nota ? `<div style="margin-top:44px;padding:26px 32px;border-radius:22px;background:${V.accDim};
         border:1.5px solid rgba(139,92,246,.32);font-family:${V.body};font-size:30px;line-height:1.42;color:${V.acc2};">${nota}</div>` : ''}
  </div>
  <div style="position:absolute;left:88px;right:88px;bottom:${SEGURO_BOT + 20}px;">${firma(pie || '')}</div>`;

/** Historia con captura: titular arriba, teléfono abajo. */
const conCaptura = ({ kicker, titulo, acento, img, pos, pie, ancho = 516 }) => `
  <div style="${fondo({ a1: .24, a2: .14 })}"></div>
  <div style="${grano}"></div>
  <div style="position:absolute;left:88px;right:88px;top:${SEGURO_TOP}px;">
    ${kicker ? eyebrow(kicker) : ''}
    <h1 style="font-family:${V.display};font-size:80px;line-height:.98;font-weight:700;color:${V.ink};margin:30px 0 0;letter-spacing:-.036em;">
      ${titulo}${acento ? ` <span style="color:${V.acc2}">${acento}</span>` : ''}
    </h1>
  </div>
  <div style="position:absolute;left:50%;transform:translateX(-50%);top:${SEGURO_TOP + 232}px;">
    ${tel(img, ancho, pos || 'top')}
  </div>
  <div style="position:absolute;left:88px;right:88px;bottom:${SEGURO_BOT + 20}px;">${firma(pie || '')}</div>`;

/** Comparación antes/después lado a lado. */
const comparar = ({ kicker, titulo, acento, a, b, pie }) => `
  <div style="${fondo({ a1: .24, a2: .14 })}"></div>
  <div style="${grano}"></div>
  <div style="position:absolute;left:88px;right:88px;top:${SEGURO_TOP}px;">
    ${kicker ? eyebrow(kicker) : ''}
    <h1 style="font-family:${V.display};font-size:80px;line-height:.98;font-weight:700;color:${V.ink};margin:30px 0 0;letter-spacing:-.036em;">
      ${titulo}${acento ? ` <span style="color:${V.acc2}">${acento}</span>` : ''}
    </h1>
  </div>
  <div style="position:absolute;left:50%;transform:translateX(-50%);top:${SEGURO_TOP + 250}px;display:flex;gap:26px;">
    <div>${tel(a, 396)}<div style="text-align:center;margin-top:24px;font-family:${V.body};font-size:26px;
      letter-spacing:.24em;text-transform:uppercase;color:${V.faint};font-weight:600;">Antes</div></div>
    <div>${tel(b, 396)}<div style="text-align:center;margin-top:24px;font-family:${V.body};font-size:26px;
      letter-spacing:.24em;text-transform:uppercase;color:${V.acc2};font-weight:600;">Después</div></div>
  </div>
  <div style="position:absolute;left:88px;right:88px;bottom:${SEGURO_BOT + 20}px;">${firma(pie || '')}</div>`;

const HISTORIAS = {
  // ══ SECUENCIA A · problema → solución → demostración → CTA ══
  '369-detail-story-01-problema': texto({
    kicker: 'Secuencia 1 de 4', titulo: 'Un taller', acento: 'sin web',
    bajada: 'Todo su trabajo vivía en Instagram. Si alguien lo buscaba en Google, no existía.',
    pie: 'El problema' }),
  '369-detail-story-02-solucion': texto({
    kicker: 'Secuencia 2 de 4', titulo: 'Le hicimos', acento: 'la suya',
    bajada: 'Sitio propio, dominio propio, galería de trabajos y turnos por WhatsApp.',
    nota: '369detail.com.ar · en producción', pie: 'La solución' }),
  '369-detail-story-03-demo': conCaptura({
    kicker: 'Secuencia 3 de 4', titulo: 'Así quedó', acento: 'la portada',
    img: f('369-detail-mobile-hero'), pie: '369detail.com.ar' }),
  '369-detail-story-04-cta': texto({
    kicker: 'Secuencia 4 de 4', titulo: '¿Tu negocio', acento: 'tiene la suya?',
    bajada: 'Hacemos webs, landings, ecommerce, sistemas de turnos y paneles a medida.',
    nota: 'Escribinos por DM y lo charlamos.', pie: 'El paso siguiente' }),

  // ══ SECUENCIA B · el panel ══
  '369-detail-story-05-panel-problema': texto({
    kicker: 'El panel · 1 de 3', titulo: 'Una web', acento: 'que se queda vieja',
    bajada: 'Si cada foto nueva depende del que la programó, la web deja de actualizarse.',
    pie: 'El problema' }),
  '369-detail-story-06-panel-solucion': conCaptura({
    kicker: 'El panel · 2 de 3', titulo: 'Panel propio,', acento: 'con clave',
    img: f('369-detail-mobile-admin-panel'), pie: 'Acceso privado' }),
  '369-detail-story-07-panel-demo': conCaptura({
    kicker: 'El panel · 3 de 3', titulo: 'Cargan desde', acento: 'el celular',
    img: f('369-detail-mobile-admin-nuevo'), pie: 'Antes y después' }),

  // ══ SECUENCIA C · antes y después ══
  '369-detail-story-08-antes-despues': comparar({
    kicker: 'Funcionalidad', titulo: 'Un toque y', acento: 'cambia la foto',
    a: f('369-detail-mobile-antes-1'), b: f('369-detail-mobile-despues-1'),
    pie: 'Chevrolet Sonic · Abrillantado' }),
  '369-detail-story-09-galeria': conCaptura({
    kicker: 'Galería completa', titulo: 'Filtrá por', acento: 'servicio',
    img: f('369-detail-mobile-galeria-top'), pie: '369detail.com.ar/galeria' }),
  '369-detail-story-10-responsive': conCaptura({
    kicker: 'Responsive', titulo: 'Pensada para', acento: 'el celular',
    img: f('369-detail-mobile-resultados'), pie: '369detail.com.ar' }),

  // ══ SUELTAS ══
  '369-detail-story-11-servicios': conCaptura({
    kicker: 'Contenido real', titulo: 'Seis servicios,', acento: 'seis fichas',
    img: f('369-detail-mobile-servicios'), pie: '369detail.com.ar' }),
  '369-detail-story-12-cta-final': texto({
    kicker: 'andmar.studio', titulo: 'Webs y sistemas', acento: 'a medida',
    bajada: 'Landings, sitios institucionales, ecommerce, turnos, paneles y automatizaciones.',
    nota: 'Contanos qué necesitás por DM.', pie: 'Estudio nuevo, trabajos reales' }),
};

(async () => {
  await withRenderer(async (render) => {
    for (const [n, html] of Object.entries(HISTORIAS)) {
      await render({ html, out: `${OUT}/${n}.png`, width: W, height: H });
      console.log('historia', n);
    }
  });
})();
