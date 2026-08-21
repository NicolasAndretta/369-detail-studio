const { execFileSync } = require('child_process');
const path = require('path');
const FF = path.join(__dirname, 'node_modules/ffmpeg-static/ffmpeg');

function ff(args, label = '') {
  try {
    execFileSync(FF, ['-y', '-hide_banner', '-loglevel', 'error', ...args], { stdio: ['ignore','pipe','pipe'], maxBuffer: 1 << 28 });
  } catch (e) {
    console.error('FFMPEG FALLÓ', label, '\n', e.stderr?.toString().slice(0, 3000));
    throw e;
  }
}

/** Cuadros PNG → clip h264 1080x1920, listo para Instagram. */
function clipDesdeCuadros(dir, out, { fps = 30, desde = 0, cuadros = 0, vf = '' } = {}) {
  const a = ['-framerate', String(fps), '-start_number', String(desde), '-i', path.join(dir, '%05d.png')];
  if (cuadros) a.push('-frames:v', String(cuadros));
  if (vf) a.push('-vf', vf);
  a.push('-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p',
         '-profile:v', 'high', '-level', '4.2', '-r', String(fps), '-movflags', '+faststart', out);
  ff(a, out);
}

/** PNG fijo → segmento de video con deriva de escala casi imperceptible. */
function cartel(png, out, { seg = 2.0, fps = 30, zoom = 1.035 } = {}) {
  const n = Math.round(seg * fps);
  ff(['-loop', '1', '-i', png, '-frames:v', String(n),
      '-vf', `scale=3240:5760,zoompan=z='1+(${zoom}-1)*on/${n}':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=${fps},format=yuv420p`,
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(fps), out], out);
}

/** Une segmentos con cortes limpios (sin transiciones baratas). */
function concat(lista, out, dirTmp) {
  const fs = require('fs');
  const f = path.join(dirTmp, 'concat-' + path.basename(out) + '.txt');
  fs.writeFileSync(f, lista.map(p => `file '${p}'`).join('\n'));
  ff(['-f', 'concat', '-safe', '0', '-i', f, '-c', 'copy', '-movflags', '+faststart', out], out);
}

/** Superpone un PNG con alpha; opcionalmente sólo entre `desde` y `hasta` (seg). */
function superponer(video, png, out, { desde = null, hasta = null, fade = 0.35 } = {}) {
  let expr = '';
  if (desde !== null) {
    const a = desde, b = hasta;
    expr = `,fade=t=in:st=${a}:d=${fade}:alpha=1,fade=t=out:st=${b - fade}:d=${fade}:alpha=1`;
  }
  const enable = desde !== null ? `:enable='between(t,${desde},${hasta})'` : '';
  ff(['-i', video, '-i', png,
      '-filter_complex', `[1:v]format=rgba${expr}[o];[0:v][o]overlay=0:0${enable}[v]`,
      '-map', '[v]', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart', out], out);
}

/** Pista de silencio: Instagram trata mejor los archivos que traen audio. */
function silencio(video, out) {
  ff(['-i', video, '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',
      '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', out], out);
}

function dur(video) {
  const { execFileSync } = require('child_process');
  const o = execFileSync(FF, ['-i', video], { stdio: ['ignore','pipe','pipe'] , encoding:'utf8'}).toString();
  return o;
}

module.exports = { ff, FF, clipDesdeCuadros, cartel, concat, superponer, silencio };
