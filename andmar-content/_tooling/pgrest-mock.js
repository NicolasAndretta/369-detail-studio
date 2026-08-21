// Servidor local que imita la parte de PostgREST que usa el panel de 369.
// Sirve SOLO para grabar el panel con los datos del seed real del repo.
// No toca el código de la app: se apunta SUPABASE_URL acá.
const http = require('http');
const fs = require('fs');
const path = require('path');

const SEED = path.join('/home/user/369-detail-studio/supabase/seed.sql');
const sql = fs.readFileSync(SEED, 'utf8').split('\n').map(l => l.replace(/--.*$/, '')).join('\n');

function parseTuples(block) {
  const rows = [];
  const re = /\(([^()]*)\)/g;
  let m;
  while ((m = re.exec(block))) {
    const parts = [];
    let cur = '', q = false;
    for (let i = 0; i < m[1].length; i++) {
      const c = m[1][i];
      if (c === "'") { if (q && m[1][i+1] === "'") { cur += "'"; i++; } else q = !q; continue; }
      if (c === ',' && !q) { parts.push(cur.trim()); cur = ''; continue; }
      cur += c;
    }
    parts.push(cur.trim());
    rows.push(parts.map(p => p === 'null' ? null : (p === 'true' ? true : (p === 'false' ? false : (/^\d+$/.test(p) ? Number(p) : p)))));
  }
  return rows;
}

const tBlock = sql.split('insert into trabajos')[1].split(';')[0];
const fBlock = sql.split('insert into fotos')[1].split(';')[0];

const trabajos = parseTuples(tBlock.split('values')[1]).map(r => ({
  id: r[0], servicio: r[1], categoria: r[2], vehiculo: r[3],
  visible: r[4], en_inicio: r[5], orden: r[6],
  creado_en: new Date().toISOString(),
}));
let fid = 0;
const fotos = parseTuples(fBlock.split('values')[1]).map(r => ({
  id: 'f' + (++fid), trabajo_id: r[0], etiqueta: r[1],
  antes_url: r[2], despues_url: r[3], orden: r[4],
}));

// Reels reales del taller ya publicados en Instagram (@369detail).
// El código del posteo sale de video-data.ts del propio repo.
const videos = [
  { id: 'v1', titulo: 'Corrección de pintura paso a paso', categoria: 'Pulido',
    instagram_code: 'C0fC_CXvW21', tiktok_id: null, thumbnail_url: null,
    visible: true, en_inicio: true, orden: 1, creado_en: new Date().toISOString() },
];

const tables = { trabajos, fotos, videos };

function withFotos(t) {
  return { ...t, fotos: fotos.filter(f => f.trabajo_id === t.id).sort((a,b)=>a.orden-b.orden) };
}

const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  const seg = u.pathname.replace(/^\/rest\/v1\//, '').split('/')[0];
  let rows = tables[seg];
  if (!rows) { res.writeHead(404, {'Content-Type':'application/json'}); return res.end('[]'); }

  // filtros tipo col=eq.valor
  const filters = [];
  for (const [k, v] of u.searchParams) {
    if (['select','order','limit','offset'].includes(k)) continue;
    const [op, ...rest] = v.split('.');
    filters.push([k, op, rest.join('.')]);
  }
  const match = (r) => filters.every(([k, op, val]) => {
    if (op === 'eq') return String(r[k]) === val;
    if (op === 'is') return val === 'null' ? r[k] == null : r[k] === (val === 'true');
    return true;
  });

  let body = '';
  req.on('data', c => body += c);
  req.on('end', () => {
    const json = () => { try { return JSON.parse(body || '{}'); } catch { return {}; } };

    if (req.method === 'PATCH') {
      rows.filter(match).forEach(r => Object.assign(r, json()));
      res.writeHead(200, {'Content-Type':'application/json'}); return res.end('[]');
    }
    if (req.method === 'DELETE') {
      const keep = rows.filter(r => !match(r));
      tables[seg] = keep; rows.length = 0; keep.forEach(r => rows.push(r));
      res.writeHead(200, {'Content-Type':'application/json'}); return res.end('[]');
    }
    if (req.method === 'POST') {
      const payload = Array.isArray(json()) ? json() : [json()];
      const created = payload.map(p => ({ id: 'n' + Math.random().toString(16).slice(2,10), ...p }));
      created.forEach(c => rows.push(c));
      res.writeHead(201, {'Content-Type':'application/json'}); return res.end(JSON.stringify(created));
    }

    // GET
    let out = rows.filter(match);
    const order = u.searchParams.get('order');
    if (order) {
      const [col, dir] = order.split('.');
      out = [...out].sort((a,b) => (a[col] > b[col] ? 1 : a[col] < b[col] ? -1 : 0) * (dir === 'desc' ? -1 : 1));
    }
    const select = u.searchParams.get('select') || '';
    if (seg === 'trabajos' && select.includes('fotos')) out = out.map(withFotos);
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify(out));
  });
});

server.listen(54321, () => console.log('pgrest-mock en http://127.0.0.1:54321'));
