const { montar } = require('./montar');
const SP = process.env.SP, R = process.env.R;
const F = `${SP}/frames`, P = `${SP}/piezas`;

const REELS = [

  // ── 2 · RECORRIDO GENERAL ──────────────────────────────────────
  { out: '369-detail-recorrido-reel.mp4', tmp: 'r2', seg: [
    { tipo: 'cartel', png: `${P}/r2-abre.png`, seg: 2.8 },
    { tipo: 'ui', dir: `${F}/mobile-home`, desde: 20, cuadros: 96,
      marca: `${P}/marca-arriba.png`, franja: `${P}/f-hero.png` },
    { tipo: 'ui', dir: `${F}/mobile-home`, desde: 120, cuadros: 126,
      franja: `${P}/f-servicios.png` },
    { tipo: 'ui', dir: `${F}/mobile-home`, desde: 248, cuadros: 128,
      franja: `${P}/f-resultados.png` },
    { tipo: 'ui', dir: `${F}/contacto`, desde: 0, cuadros: 112,
      franja: `${P}/f-contacto.png` },
    // Cierra con la galería completa: hay más trabajo del que entra en el inicio.
    { tipo: 'ui', dir: `${F}/filtros`, desde: 0, cuadros: 56,
      franja: `${P}/f-filtro.png` },
    { tipo: 'cartel', png: `${P}/r2-cierra.png`, seg: 3.2 },
  ]},

  // ── 3 · ANTES Y DESPUÉS ────────────────────────────────────────
  { out: '369-detail-antes-despues-reel.mp4', tmp: 'r3', seg: [
    { tipo: 'cartel', png: `${P}/r3-abre.png`, seg: 2.8 },
    // Mercedes 300 CE — tratamiento cerámico
    { tipo: 'ui', dir: `${F}/antes-despues`, desde: 0, cuadros: 22,
      marca: `${P}/marca-arriba.png`, franja: `${P}/f-antes.png` },
    { tipo: 'ui', dir: `${F}/antes-despues`, desde: 22, cuadros: 64,
      franja: `${P}/f-despues.png` },
    // Citroën Berlingo — tratamiento acrílico
    { tipo: 'ui', dir: `${F}/antes-despues`, desde: 94, cuadros: 22,
      franja: `${P}/f-antes.png` },
    { tipo: 'ui', dir: `${F}/antes-despues`, desde: 116, cuadros: 66,
      franja: `${P}/f-despues.png` },
    { tipo: 'cartel', png: `${P}/r3-cierra.png`, seg: 3.2 },
  ]},

  // ── 4 · PANEL ADMINISTRATIVO ───────────────────────────────────
  { out: '369-detail-panel-admin-reel.mp4', tmp: 'r4', seg: [
    { tipo: 'cartel', png: `${P}/r4-abre.png`, seg: 2.8 },
    { tipo: 'ui', dir: `${F}/admin`, desde: 0, cuadros: 40,
      marca: `${P}/marca-arriba-panel.png`, franja: `${P}/f-login.png` },
    { tipo: 'ui', dir: `${F}/admin`, desde: 40, cuadros: 150,
      franja: `${P}/f-lista.png` },
    { tipo: 'ui', dir: `${F}/admin`, desde: 262, cuadros: 62,
      franja: `${P}/f-inicio.png` },
    { tipo: 'ui', dir: `${F}/admin`, desde: 324, cuadros: 128,
      franja: `${P}/f-nuevo.png` },
    { tipo: 'cartel', png: `${P}/r4-cierra.png`, seg: 3.2 },
  ]},

  // ── 5 · GALERÍA CON FILTROS ────────────────────────────────────
  { out: '369-detail-galeria-filtros-reel.mp4', tmp: 'r5', seg: [
    { tipo: 'cartel', png: `${P}/r5-abre.png`, seg: 2.8 },
    { tipo: 'ui', dir: `${F}/filtros`, desde: 0, cuadros: 208,
      marca: `${P}/marca-arriba.png`, franja: `${P}/f-filtro.png` },
    { tipo: 'cartel', png: `${P}/r3-cierra.png`, seg: 3.2 },
  ]},

  // ── 6 · RESPONSIVE / ESCRITORIO ────────────────────────────────
  { out: '369-detail-responsive-reel.mp4', tmp: 'r6', seg: [
    { tipo: 'cartel', png: `${P}/r6-abre.png`, seg: 2.8 },
    { tipo: 'ui', dir: `${F}/desktop`, desde: 20, cuadros: 90, escritorio: true,
      marca: `${P}/marca-arriba.png`, franja: `${P}/f-desktop.png` },
    { tipo: 'ui', dir: `${F}/desktop`, desde: 110, cuadros: 118, escritorio: true,
      franja: `${P}/f-servicios.png` },
    { tipo: 'ui', dir: `${F}/desktop`, desde: 228, cuadros: 126, escritorio: true,
      franja: `${P}/f-resultados.png` },
    // Y la misma web en el celular.
    { tipo: 'ui', dir: `${F}/mobile-home`, desde: 30, cuadros: 88,
      franja: `${P}/f-hero.png` },
    { tipo: 'cartel', png: `${P}/r2-cierra.png`, seg: 3.2 },
  ]},
];

(async () => {
  const solo = process.argv[2];
  for (const r of REELS) {
    if (solo && !r.out.includes(solo)) continue;
    console.log('montando', r.out);
    await montar({ out: `${R}/${r.out}`, tmp: `${SP}/tmp/${r.tmp}`, segmentos: r.seg });
    console.log('  ok');
  }
})();
