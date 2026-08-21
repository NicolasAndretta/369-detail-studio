// Monta un Reel 9:16 a partir de segmentos: carteles + tramos de cuadros.
const fs = require('fs');
const path = require('path');
const { ff, clipDesdeCuadros, cartel, concat, silencio } = require('./ff');

const FPS = 30;

/**
 * seg = { tipo:'cartel', png, seg }
 *     | { tipo:'ui', dir, desde, cuadros, marca?, franja?, escritorio? }
 */
async function montar({ segmentos, out, tmp }) {
  fs.mkdirSync(tmp, { recursive: true });
  const partes = [];
  let i = 0;

  for (const s of segmentos) {
    const base = path.join(tmp, `s${String(i++).padStart(2, '0')}`);

    if (s.tipo === 'cartel') {
      cartel(s.png, base + '.mp4', { seg: s.seg ?? 2.2, fps: FPS });
      partes.push(base + '.mp4');
      continue;
    }

    // Tramo de UI ------------------------------------------------
    let vf = '';
    if (s.escritorio) {
      // El escritorio es apaisado: en 9:16 va la ventana nítida centrada
      // sobre su propia imagen desenfocada y oscurecida. Sin bandas muertas.
      vf = [
        'split=2[bg][fg]',
        '[bg]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,' +
          'gblur=sigma=40,eq=brightness=-0.34:saturation=0.45[b]',
        '[fg]scale=1008:-2[f]',
        '[b][f]overlay=(W-w)/2:(H-h)/2',
      ].join(';');
    }
    clipDesdeCuadros(s.dir, base + '-raw.mp4', { fps: FPS, desde: s.desde, cuadros: s.cuadros, vf });

    let actual = base + '-raw.mp4';
    const capas = [s.marca, s.franja].filter(Boolean);
    if (capas.length) {
      // Todas las capas en un solo pase: menos recompresión, más nitidez.
      // Los PNG entran con `-loop 1`: si no, son UN cuadro en t=0 y el fade
      // de alpha lo deja invisible para todo el resto del segmento.
      const inputs = ['-i', actual];
      capas.forEach(p => inputs.push('-loop', '1', '-framerate', String(FPS), '-i', p));
      const fchain = [];
      let last = '0:v';
      capas.forEach((_, k) => {
        const inIdx = k + 1;
        const st = s.fadeIn ?? 0.34;
        // Sólo entra con fade; sale con el corte. Así el texto se lee entero.
        fchain.push(`[${inIdx}:v]format=rgba,fade=t=in:st=0:d=${st}:alpha=1[c${k}]`);
        fchain.push(`[${last}][c${k}]overlay=0:0:shortest=${k === capas.length - 1 ? 1 : 0}[v${k}]`);
        last = `v${k}`;
      });
      ff([...inputs, '-filter_complex', fchain.join(';'), '-map', `[${last}]`,
          '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p',
          '-r', String(FPS), '-frames:v', String(s.cuadros), base + '.mp4'], base);
      actual = base + '.mp4';
    }
    partes.push(actual);
  }

  const sinAudio = out.replace(/\.mp4$/, '-noaudio.mp4');
  concat(partes, sinAudio, tmp);
  silencio(sinAudio, out);
  fs.unlinkSync(sinAudio);
  return out;
}

module.exports = { montar, FPS };
