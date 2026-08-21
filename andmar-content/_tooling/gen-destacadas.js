const { withRenderer } = require('./render');
const { V, fondo, grano } = require('./brand');
const fsx = require('fs');
const OUT = process.argv[2], CAP = process.argv[3];
const f = n => 'data:image/png;base64,' + fsx.readFileSync(`${CAP}/${n}.png`).toString('base64');

// Instagram recorta un CÍRCULO del centro de una historia 1080x1920.
// Todo lo que tiene que verse va dentro de ese círculo de ~1080 de diámetro,
// centrado verticalmente. Fuera queda sólo el fondo.
const CY = 960;

const tapa = ({ icono, titulo, sub }) => `
  <div style="${fondo({ a1: .30, a2: .18 })}"></div>
  <div style="${grano}"></div>
  <!-- Guía del recorte circular: aro tenue, queda lindo si se ve y no molesta -->
  <div style="position:absolute;left:50%;top:${CY}px;transform:translate(-50%,-50%);
       width:880px;height:880px;border-radius:99px;border:1.5px solid rgba(139,92,246,.20);"></div>
  <div style="position:absolute;left:50%;top:${CY}px;transform:translate(-50%,-50%);
       width:640px;height:640px;border-radius:99px;
       background:radial-gradient(circle at 50% 40%, rgba(139,92,246,.24) 0%, transparent 70%);"></div>
  <div style="position:absolute;left:0;right:0;top:${CY}px;transform:translateY(-50%);
       display:flex;flex-direction:column;align-items:center;gap:34px;">
    <div style="font-size:150px;line-height:1;">${icono}</div>
    <div style="font-family:${V.display};font-size:82px;font-weight:700;color:${V.ink};
         letter-spacing:-.02em;text-align:center;">${titulo}</div>
    ${sub ? `<div style="font-family:${V.body};font-size:28px;letter-spacing:.26em;text-transform:uppercase;
         color:${V.acc2};font-weight:600;">${sub}</div>` : ''}
  </div>`;

/** Portada de destacada con una captura real de fondo, oscurecida. */
const tapaFoto = ({ img, titulo, sub }) => `
  <div style="position:absolute;inset:0;background:#000;">
    <img src="${img}" style="width:100%;height:100%;object-fit:cover;object-position:center;
         display:block;opacity:.55;filter:blur(9px) saturate(.62);transform:scale(1.06);">
  </div>
  <div style="position:absolute;inset:0;background:
    radial-gradient(66% 40% at 50% 50%, rgba(7,7,10,.42) 0%, rgba(7,7,10,.86) 60%, #07070A 100%);"></div>
  <div style="${grano}"></div>
  <div style="position:absolute;left:50%;top:${CY}px;transform:translate(-50%,-50%);
       width:880px;height:880px;border-radius:99px;border:1.5px solid rgba(139,92,246,.24);"></div>
  <div style="position:absolute;left:0;right:0;top:${CY}px;transform:translateY(-50%);
       display:flex;flex-direction:column;align-items:center;gap:26px;">
    <span style="width:12px;height:12px;border-radius:99px;background:${V.acc};box-shadow:0 0 24px ${V.acc};"></span>
    <div style="font-family:${V.display};font-size:88px;font-weight:700;color:${V.ink};letter-spacing:-.025em;text-align:center;">${titulo}</div>
    ${sub ? `<div style="font-family:${V.body};font-size:28px;letter-spacing:.26em;text-transform:uppercase;color:${V.acc2};font-weight:600;">${sub}</div>` : ''}
  </div>`;

const DESTACADAS = {
  // La destacada madre: acá va todo lo que mostremos de trabajos.
  '369-detail-destacada-proyectos':      tapaFoto({ img: f('369-detail-mobile-hero'), titulo: 'PROYECTOS', sub: 'Trabajos reales' }),
  // Sub-destacadas por tipo de pieza.
  '369-detail-destacada-369-detail':     tapaFoto({ img: f('369-detail-mobile-resultados'), titulo: '369 DETAIL', sub: 'En producción' }),
  '369-detail-destacada-webs':           tapa({ icono: '◈', titulo: 'WEBS', sub: 'Sitios y landings' }),
  '369-detail-destacada-paneles':        tapa({ icono: '▤', titulo: 'PANELES', sub: 'Administrables' }),
  '369-detail-destacada-antes-despues':  tapaFoto({ img: f('369-detail-mobile-despues-1'), titulo: 'ANTES', sub: 'Y después' }),
  '369-detail-destacada-como-trabajamos':tapa({ icono: '◇', titulo: 'CÓMO', sub: 'Trabajamos' }),
};

(async () => {
  await withRenderer(async (render) => {
    for (const [n, html] of Object.entries(DESTACADAS)) {
      await render({ html, out: `${OUT}/${n}.png`, width: 1080, height: 1920 });
      console.log('destacada', n);
    }
  });
})();
