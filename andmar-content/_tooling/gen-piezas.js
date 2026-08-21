const { withRenderer } = require('./render');
const { carteles, franja, marcaArriba } = require('./piezas');
const OUT = process.argv[2];

const CARTELES = {
  // ── REEL 1 · HERO ────────────────────────────────────────
  'r1-abre': { kicker: 'Proyecto en producción', titulo: 'Le hicimos', acento: 'la web', bajada: 'A un taller de detailing de Lugano que trabajaba solo con Instagram.', pie: 'Lugano · Buenos Aires' },
  'r1-cierra': { kicker: '369detail.com.ar', titulo: '¿Tu negocio', acento: 'tiene la suya?', bajada: 'Diseñamos y desarrollamos sitios, sistemas y paneles a medida.', cta: 'Escribinos por DM', pie: 'Está online' },

  // ── REEL 2 · RECORRIDO ───────────────────────────────────
  'r2-abre': { kicker: 'Recorrido completo', titulo: '369 Detail', acento: 'de arriba a abajo', bajada: 'Hero, servicios, resultados y contacto. Todo en una sola página.', pie: '369detail.com.ar' },
  'r2-cierra': { kicker: 'andmar.studio', titulo: 'Así queda', acento: 'una web propia', bajada: 'Diseño, desarrollo y puesta online. Del boceto al dominio.', cta: 'Escribinos por DM', pie: '369detail.com.ar' },

  // ── REEL 3 · ANTES / DESPUÉS ─────────────────────────────
  'r3-abre': { kicker: 'Funcionalidad', titulo: 'Antes y después', acento: 'en un toque', bajada: 'Un taller de detailing vende transformaciones. La web tenía que mostrarlas.', pie: '369detail.com.ar' },
  'r3-cierra': { kicker: 'andmar.studio', titulo: 'Cada rubro', acento: 'necesita lo suyo', bajada: 'No usamos plantillas: la funcionalidad sale de cómo trabaja el negocio.', cta: 'Escribinos por DM', pie: '369detail.com.ar' },

  // ── REEL 4 · PANEL ───────────────────────────────────────
  'r4-abre': { kicker: 'Panel administrativo', titulo: 'Carga sus', acento: 'propias fotos', bajada: 'Sin llamarnos, sin esperar, sin tocar una línea de código.', pie: 'Panel privado' },
  'r4-cierra': { kicker: 'andmar.studio', titulo: 'Te entregamos', acento: 'el control', bajada: 'Cada sitio que hacemos viene con su panel. Lo actualizás vos.', cta: 'Escribinos por DM', pie: '369detail.com.ar' },

  // ── REEL 5 · FILTROS / GALERÍA ───────────────────────────
  'r5-abre': { kicker: 'Funcionalidad', titulo: 'Galería', acento: 'con filtros', bajada: 'Seis servicios, un filtro por servicio. El cliente encuentra lo que busca.', pie: '369detail.com.ar' },

  // ── REEL 6 · DESKTOP ─────────────────────────────────────
  'r6-abre': { kicker: 'Diseño responsive', titulo: 'Una web', acento: 'para cada pantalla', bajada: 'La misma página en celular y en computadora. Sin versiones a medias.', pie: '369detail.com.ar' },
};

const FRANJAS = {
  'f-hero':        { paso: 'Inicio', titulo: 'Portada con turno<br>a un toque', detalle: 'El botón de WhatsApp acompaña todo el scroll.' },
  'f-servicios':   { paso: 'Servicios', titulo: 'Seis servicios,<br>seis fichas', detalle: 'Qué incluye cada uno, en criollo.' },
  'f-resultados':  { paso: 'Resultados', titulo: 'Trabajos reales<br>del taller', detalle: 'Fotos propias, no banco de imágenes.' },
  'f-contacto':    { paso: 'Contacto', titulo: 'Horarios, zona<br>y WhatsApp', detalle: 'Todo lo que necesita saber quien quiere un turno.' },
  'f-antes':       { paso: 'Antes', titulo: 'Así llega<br>el vehículo', detalle: null },
  'f-despues':     { paso: 'Después', titulo: 'Así se va', detalle: 'Cómo llegó y cómo se fue, en la misma tarjeta.' },
  'f-filtro':      { paso: 'Filtros', titulo: 'Filtrá por servicio', detalle: 'Cerámico, interior, motor, lavado. La grilla se arma sola.' },
  'f-login':       { paso: 'Acceso privado', titulo: 'Panel con clave', detalle: 'Sesión firmada y bloqueo por intentos fallidos.' },
  'f-lista':       { paso: 'Panel', titulo: 'Sus trabajos,<br>su galería', detalle: 'Mostrar, ocultar, editar o mandar al inicio.' },
  'f-inicio':      { paso: 'Un click', titulo: 'Sale del inicio', detalle: 'La web pública se actualiza al instante.' },
  'f-nuevo':       { paso: 'Cargar trabajo', titulo: 'Antes y después,<br>desde el celular', detalle: 'Las fotos se optimizan solas al subirlas.' },
  'f-desktop':     { paso: 'Escritorio', titulo: 'La misma web<br>en pantalla grande', detalle: null },
};

(async () => {
  await withRenderer(async (render) => {
    for (const [k, v] of Object.entries(CARTELES)) {
      await render({ html: carteles(v), out: `${OUT}/${k}.png` });
      console.log('cartel', k);
    }
    for (const [k, v] of Object.entries(FRANJAS)) {
      await render({ html: franja(v), out: `${OUT}/${k}.png`, transparent: true });
      console.log('franja', k);
    }
    await render({ html: marcaArriba('369detail.com.ar'), out: `${OUT}/marca-arriba.png`, transparent: true });
    await render({ html: marcaArriba('Panel /admin'), out: `${OUT}/marca-arriba-panel.png`, transparent: true });
    await render({ html: marcaArriba(''), out: `${OUT}/marca-arriba-simple.png`, transparent: true });
    console.log('marcas ok');
  });
})();
