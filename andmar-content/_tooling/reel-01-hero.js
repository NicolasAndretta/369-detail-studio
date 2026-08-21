const { montar } = require('./montar');
const SP = process.env.SP, R = process.env.R;
const F = `${SP}/frames`, P = `${SP}/piezas`;
(async () => {
  await montar({
    out: `${R}/369-detail-hero-reel.mp4`,
    tmp: `${SP}/tmp/r1`,
    segmentos: [
      { tipo: 'cartel', png: `${P}/r1-abre.png`, seg: 2.6 },
      // Portada: el slideshow rota solo, se ve el turno por WhatsApp.
      { tipo: 'ui', dir: `${F}/mobile-home`, desde: 30, cuadros: 88,
        marca: `${P}/marca-arriba.png`, franja: `${P}/f-hero.png` },
      // Bajada a servicios.
      { tipo: 'ui', dir: `${F}/mobile-home`, desde: 120, cuadros: 124,
        franja: `${P}/f-servicios.png` },
      // Resultados: trabajos reales del taller.
      { tipo: 'ui', dir: `${F}/mobile-home`, desde: 248, cuadros: 126,
        franja: `${P}/f-resultados.png` },
      // Contacto.
      { tipo: 'ui', dir: `${F}/contacto`, desde: 0, cuadros: 112,
        franja: `${P}/f-contacto.png` },
      { tipo: 'cartel', png: `${P}/r1-cierra.png`, seg: 3.2 },
    ],
  });
  console.log('listo');
})();
