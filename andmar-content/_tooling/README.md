# Herramientas de generación

Scripts con los que se generó todo el material de `andmar-content/369-detail/`.
No forman parte del proyecto 369 Detail: viven acá para poder **regenerar o
retocar una pieza sin rehacer el pipeline desde cero**.

No los corre nadie automáticamente. No tienen tests. Son de uso interno.

---

## Qué necesitás antes de correrlos

```bash
# 1. Dependencias del proyecto y build de producción
npm install
npm run build

# 2. Un .env.local con credenciales cualquiera (NO las de producción)
cat > .env.local <<'ENV'
ADMIN_PASSWORD=<16+ caracteres al azar>
ADMIN_SESSION_SECRET=<40+ caracteres al azar>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV

# 3. Playwright y FFmpeg con H.264 (el de Playwright viene sin libx264)
mkdir -p /tmp/tools && cd /tmp/tools && npm init -y
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install playwright ffmpeg-static
```

Las rutas a Chromium y a FFmpeg están escritas en `lib-capture.js`, `render.js`
y `ff.js`. Si tu instalación está en otro lado, ajustalas ahí.

---

## Cómo levantar el entorno de grabación

```bash
node pgrest-mock.js &     # fixture de base en 127.0.0.1:54321
./start-app.sh &          # Next en producción, apuntado a la fixture
curl localhost:3000/api/health   # tiene que devolver {"ok":true,"db":"ok"}
```

`pgrest-mock.js` imita la parte de PostgREST que usa el panel y **sirve las
filas reales de `supabase/seed.sql`** (9 trabajos, 26 fotos). Existe porque sin
base el panel `/admin` sólo muestra "Falta conectar la base de datos" y no se
puede filmar. No inventa datos y no toca producción.

---

## Los archivos

### Base

| Archivo | Qué hace |
|---|---|
| `lib-capture.js` | Motor de captura: abre Chromium, precalienta la página para disparar las animaciones de scroll, y guarda PNG cuadro por cuadro a resolución nativa |
| `render.js` | Renderiza HTML **dentro de la página del sitio** para heredar Inter y Outfit sin adivinar qué `.woff2` es cada peso. Devuelve PNG, con o sin alpha |
| `brand.js` | Sistema visual de andmar.studio: paleta, fondos, grano, eyebrow, firma |
| `piezas.js` | Plantillas de carteles, franjas inferiores y barra de marca |
| `ff.js` | Envoltorio de FFmpeg: cuadros → clip, PNG → cartel con deriva, concatenar, superponer, pista de audio en silencio |
| `montar.js` | Arma un Reel a partir de una lista de segmentos |

### Captura

`cap-mobile-home.js` · `cap-desktop.js` · `cap-antes-despues.js` ·
`cap-pares.js` · `cap-filtros.js` · `cap-contacto.js` · `cap-admin.js` ·
`cap-stills.js`

Cada uno recibe como argumento la carpeta donde deja los cuadros.
`cap-admin.js` y `cap-stills.js` necesitan `ADMIN_PASSWORD` en el entorno.

`cap-pares.js` es el que recorre la galería **ángulo por ángulo** buscando
pares antes/después; escribe un `registro.json` con el rango de cuadros de
cada par.

### Generación de imágenes

`gen-piezas.js` (carteles y franjas) · `gen-posts.js` · `gen-historias.js` ·
`gen-destacadas.js`

Reciben la carpeta de salida y la de capturas.

### Montaje de reels

`reel-01-hero.js` · `reel-03-antes.js` · `reels-resto.js`

Necesitan `SP` (carpeta con `frames/` y `piezas/`) y `R` (carpeta de salida) en
el entorno.

---

## Dos cosas que se rompieron y ya están arregladas acá

**Comillas en las pilas tipográficas.** Si una `font-family` lleva comillas
dobles y va dentro de un atributo `style="..."`, la comilla corta el atributo y
se pierden todas las declaraciones siguientes: los textos salen en 19 px. En
`brand.js` las pilas usan comillas simples. **No las cambies.**

**PNG con alpha en FFmpeg.** Un `-i archivo.png` es un solo cuadro en t=0; con
`fade=alpha=1` ese cuadro queda invisible y `overlay` lo repite así todo el
segmento. En `montar.js` los PNG entran con `-loop 1 -framerate 30`.
**No lo saques.**

---

## Nota sobre los pares antes/después

Antes de armar cualquier pieza de antes/después, leé
`../369-detail/recursos/pares-antes-despues.md`. Hay nueve pares en el sitio y
**uno no sirve** (Mercedes · Carrocería): las dos fotos tienen encuadres
distintos y el "después" no se lee como una mejora.
