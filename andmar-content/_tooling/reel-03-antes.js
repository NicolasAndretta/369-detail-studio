const { montar } = require('./montar');
const SP = process.env.SP, R = process.env.R;
const F = `${SP}/frames`, P = `${SP}/piezas`;

// Los tres pares donde la transformación se ve sola. Cada bloque de 84 cuadros
// es: 20 ANTES · 26 de crossfade · 22 DESPUÉS · 16 de vuelta (se descarta).
const PARES = [
  { inicio: 252, nombre: 'Chevrolet Sonic · llanta' },
  { inicio: 336, nombre: 'Citroën Berlingo · exterior' },
  { inicio: 588, nombre: 'VW Amarok blanca · rueda' },
];

(async () => {
  const seg = [{ tipo: 'cartel', png: `${P}/r3-abre.png`, seg: 2.8 }];
  PARES.forEach((p, i) => {
    seg.push({ tipo: 'ui', dir: `${F}/pares`, desde: p.inicio, cuadros: 22,
      ...(i === 0 ? { marca: `${P}/marca-arriba.png` } : {}), franja: `${P}/f-antes.png` });
    seg.push({ tipo: 'ui', dir: `${F}/pares`, desde: p.inicio + 22, cuadros: 46,
      franja: `${P}/f-despues.png` });
  });
  seg.push({ tipo: 'cartel', png: `${P}/r3-cierra.png`, seg: 3.2 });
  await montar({ out: `${R}/369-detail-antes-despues-reel.mp4`, tmp: `${SP}/tmp/r3`, segmentos: seg });
  console.log('reel antes/después rehecho');
})();
