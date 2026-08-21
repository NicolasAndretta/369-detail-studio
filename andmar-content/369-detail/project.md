# 369 Detail — ficha de proyecto para andmar.studio

**Cliente / proyecto:** 369 Detail — estudio de estética vehicular
**Sitio:** [369detail.com.ar](https://369detail.com.ar)
**Instagram del taller:** [@369detail](https://www.instagram.com/369detail/)
**Ubicación:** Dr. Horacio Casco 5140, Lugano, CABA
**Estado:** 🟢 **EN PRODUCCIÓN**
**Repositorio:** `NicolasAndretta/369-detail-studio`

---

## Descripción

369 Detail es un taller de detailing de Lugano. Antes de este proyecto toda su
presencia digital era una cuenta de Instagram: no aparecía en búsquedas, no
tenía dónde mostrar los trabajos ordenados y no había un canal de contacto
propio.

andmar.studio le desarrolló el sitio completo: diseño, desarrollo, contenido,
SEO técnico, panel de administración y puesta en producción.

Lo importante para comunicar: **es un proyecto real, que está online, y que el
taller usa todos los días.** Cualquiera puede abrir el link y comprobarlo.

---

## Stack

| Área | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript |
| Animaciones | Framer Motion |
| Estilos | CSS modular + Tailwind |
| Base de datos y storage | Supabase |
| Optimización de imágenes | sharp (WebP + AVIF, rotación EXIF) |
| Hosting | Hostinger, Node.js 20 |
| Deploy | Automático desde GitHub |

---

## Páginas

| Ruta | Qué es | Pública |
|---|---|---|
| `/` | Portada: hero, servicios, resultados, reels, contacto | Sí |
| `/galeria` | Galería completa con filtros por servicio + sección de videos | Sí |
| `/admin/login` | Acceso al panel | No (bloqueada en `robots.txt`) |
| `/admin` | Panel: lista de trabajos, mostrar/ocultar, inicio, editar, borrar | No |
| `/admin/nuevo` | Alta de trabajo con pares antes/después y varios ángulos | No |
| `/admin/[id]` | Edición de un trabajo | No |
| `/admin/videos` | Administración de los reels de Instagram y TikTok | No |
| `/sitemap.xml` · `/robots.txt` | SEO técnico | Sí |
| `/api/health` | Chequeo de estado de la base | Sí |

---

## Funcionalidades reales (verificadas corriendo el proyecto)

### Sitio público

- **Hero con slideshow rotativo** de tres fotos reales del taller (Amarok,
  BMW S1000R, Mercedes 300 CE), con crossfade automático cada 4,5 s.
- **Botón de turno por WhatsApp** con mensaje prellenado, en el hero y en un
  botón flotante que aparece al scrollear.
- **Seis fichas de servicio** con su descripción propia: lavado detallado,
  abrillantado, tratamiento cerámico, tratamiento acrílico, limpieza de
  interior, lavado de motor y chasis.
- **Galería de resultados** con seis trabajos en el inicio, uno por servicio.
- **Antes / después con crossfade**: cada tarjeta que tiene par guarda las dos
  fotos del mismo ángulo; se toca la tarjeta y cambia, con la etiqueta pasando
  de ANTES a DESPUÉS.
- **Navegación por ángulos** dentro de cada trabajo, con flechas y contador
  (por ejemplo `1/4`).
- **Galería completa** en `/galeria` con nueve trabajos y siete filtros
  (Todos + los seis servicios).
- **Sección de reels** con grilla de miniaturas y modal de reproducción;
  soporta embeds de Instagram y TikTok.
- **Navbar con scroll suave** que funciona también entrando desde `/galeria`.
- **Diseño responsive** real: la misma página en escritorio y celular (verificado en esos dos tamaños; no se probó en tablet).
- **SEO técnico completo**: metadata, Open Graph, Twitter Cards, `sitemap.xml`,
  `robots.txt` (que bloquea `/admin` y `/api`) y JSON-LD de Schema.org con
  tipo `AutoWash` + `AutoRepair`, dirección, teléfono, geolocalización,
  horarios y zonas de cobertura.
- **CSP y cabeceras de seguridad** configuradas a mano en `src/lib/csp.ts`.

### Panel de administración

- **Login con clave compartida**, sesión en cookie `httpOnly` firmada con HMAC
  y vencimiento a 7 días.
- **Bloqueo por intentos fallidos**: 8 intentos fallan → 10 minutos de bloqueo
  para esa IP.
- **Alta de trabajos** eligiendo servicio, vehículo y si va a la página de
  inicio, con uno o más ángulos, cada uno con su foto de antes (opcional) y
  de después.
- **Mostrar / ocultar** un trabajo del sitio público.
- **Poner / sacar del inicio** con un click; la web pública se actualiza al
  instante.
- **Editar y borrar** trabajos, con las fotos del storage incluidas.
- **Administración de reels**: se pega el link de Instagram o TikTok y el
  sistema guarda **sólo el código del posteo**, nunca la URL completa — así es
  imposible que por el panel entre un link a otra página y termine embebido
  dentro del sitio.
- **Optimización de fotos del lado del cliente**: la foto se achica en el
  celular *antes* de subirla, y en el servidor se rota según EXIF y se
  convierte a WebP + AVIF.
- **Mensajes de error en criollo**: "Eso no es una foto", "La foto pesa X MB y
  es demasiado", "Formato HEIC y este navegador no la puede leer".
- **Transacción limpia**: si falla una foto a mitad de un alta, se borra el
  trabajo y las fotos ya subidas; no queda nada a medias.

### Resiliencia

- Si Supabase se cae o no está configurado, **la web pública no se rompe**:
  cae a la galería estática de `gallery-data.ts` y `video-data.ts`. Está
  verificado: se levantó el proyecto sin base y el sitio siguió mostrando la
  galería completa.
- `/api/health` devuelve el estado real de la conexión (`ok` / `sin-configurar`).

---

## Assets creados en esta sesión

### Videos — `videos/` (material bruto, sin marca, reutilizable)

| Archivo | Formato | Duración | Contenido |
|---|---|---|---|
| `369-detail-bruto-mobile-recorrido.mp4` | 1080x1920 | 17 s | Recorrido completo del sitio en celular |
| `369-detail-bruto-desktop-recorrido.mp4` | 1920x1200 | 20 s | Recorrido en escritorio + galería con filtros |
| `369-detail-bruto-antes-despues.mp4` | 1080x1920 | 25 s | Los **nueve** pares antes/después del sitio, uno tras otro |
| `369-detail-bruto-galeria-filtros.mp4` | 1080x1920 | 7 s | Filtros de la galería completa |
| `369-detail-bruto-panel-admin.mp4` | 1080x1920 | 18 s | Login, panel, toggle de inicio y alta de trabajo |
| `369-detail-bruto-contacto.mp4` | 1080x1920 | 4 s | Sección de contacto: turno, horarios y zona |

### Reels — `social/reels/` (montados, listos para publicar)

Todos 1080x1920, 30 fps, H.264 + pista de audio silenciosa.

| Archivo | Duración |
|---|---|
| `369-detail-hero-reel.mp4` | 20 s |
| `369-detail-recorrido-reel.mp4` | 23 s |
| `369-detail-antes-despues-reel.mp4` | 12 s |
| `369-detail-panel-admin-reel.mp4` | 19 s |
| `369-detail-galeria-filtros-reel.mp4` | 13 s |
| `369-detail-responsive-reel.mp4` | 20 s |

### Posts — `social/posts/` (1080x1350)

`369-detail-post-proyecto` · `-web` · `-antes-despues` · `-panel` ·
`-galeria` · `-responsive` · `-servicios`

### Historias — `social/historias/` (1080x1920)

12 piezas, organizadas en tres secuencias (proyecto, panel, funcionalidades).

### Destacadas — `social/destacadas/` (1080x1920)

6 portadas: PROYECTOS, 369 DETAIL, WEBS, PANELES, ANTES/DESPUÉS,
CÓMO TRABAJAMOS.

### Herramientas — `andmar-content/_tooling/`

Los 22 scripts con los que se generó todo el material, más un README con el
procedimiento. Sirven para regenerar o retocar una pieza sin rehacer el
pipeline desde cero.

### Recursos — `recursos/`

`pares-antes-despues.md` — índice de los nueve pares antes/después del sitio,
con el segundo exacto de cada uno dentro del material bruto y una nota sobre
cuál conviene evitar.

### Capturas — `capturas/`

21 capturas fuente: 16 de celular a 1080x1920 y 5 de escritorio a 2560x1600.
Son la materia prima de los posts e historias y sirven para armar piezas
nuevas sin volver a levantar el proyecto.

---

## Claims permitidos ✅

Todo esto se puede afirmar y se puede comprobar entrando al sitio:

- "Desarrollamos el sitio de 369 Detail, un taller de detailing de Lugano."
- "Está en producción" / "está online".
- "Tiene galería de trabajos con antes y después."
- "Tiene panel administrativo propio: el taller carga sus fotos."
- "Tiene filtros por servicio."
- "Es responsive."
- "Los turnos se piden por WhatsApp desde el sitio."
- "Tiene SEO técnico: sitemap, metadata, datos estructurados."
- "Si la base falla, la web no se cae."
- "Está hecho con Next.js y TypeScript."
- "Las fotos son del taller." (son reales, están en el repositorio)
- "Somos un estudio nuevo."

## Claims prohibidos ❌

Nada de esto se puede demostrar hoy. **No usar.**

- Cualquier métrica: visitas, consultas, conversiones, posiciones en Google,
  porcentajes de mejora, "x3 más turnos".
- Testimonios o frases atribuidas al cliente que no haya dicho.
- Cartera de clientes: "trabajamos con decenas de negocios", "+50 proyectos".
- Antigüedad: "años de experiencia", "desde 2019".
- Premios, certificaciones, partners.
- Equipo inventado: "nuestro equipo de diez personas".
- Precios: **no hay ninguna referencia de precios en el repositorio ni en el
  contexto disponible.** No inventar un "desde $X". Si hace falta hablar de
  plata, decir "presupuesto según el alcance, escribinos" y listo.
- Funcionalidades que no existen: turnos con calendario online, pagos,
  facturación, chat en vivo, app móvil nativa, multiidioma.
- "Aumentamos las ventas del taller" o similar.

> Regla corta: **demostrar, no afirmar.** Si no se puede abrir en
> 369detail.com.ar y verlo, no se dice.

---

## Los mejores assets

1. **`369-detail-antes-despues-reel.mp4`** — la transformación se ve sola, no
   hace falta explicar nada. Es lo más específico y lo más difícil de copiar.
2. **`369-detail-panel-admin-reel.mp4`** — es lo que nos separa del que hace
   una web y desaparece. Explica qué entregamos.
3. **`369-detail-post-responsive.png`** — escritorio y celular en una imagen;
   responde la duda más común sin que la pregunten.
4. **`369-detail-hero-reel.mp4`** — la mejor pieza de presentación general.
5. **`369-detail-post-proyecto.png`** — el post ancla del proyecto.

---

## Recomendaciones de publicación

**Primera semana**

| Día | Pieza | Formato |
|---|---|---|
| 1 | `369-detail-hero-reel.mp4` | Reel |
| 1 | Secuencia A de historias (01→04) | Historias |
| 2 | `369-detail-post-proyecto.png` | Post |
| 3 | `369-detail-antes-despues-reel.mp4` | Reel |
| 3 | `369-detail-story-08-antes-despues.png` | Historia |
| 4 | `369-detail-post-responsive.png` | Post |
| 5 | `369-detail-panel-admin-reel.mp4` | Reel |
| 5 | Secuencia B de historias (05→07) | Historias |
| 6 | `369-detail-post-panel.png` | Post |
| 7 | `369-detail-story-12-cta-final.png` | Historia |

**Reservar para la semana 2:** el reel de recorrido, el de galería con filtros,
el de responsive y los posts de web, galería y servicios. Así hay contenido
para dos semanas sin repetir y sin quemar todo el proyecto de golpe.

**Destacadas:** armar **PROYECTOS** el mismo día 1, con las historias de la
secuencia A. Es lo primero que mira alguien que entra al perfil.

---

## Ideas futuras (necesitan material o desarrollo nuevo)

- **Grabar el panel usándose de verdad en el taller**: el primo cargando un
  trabajo desde el celular, con las manos y el auto de fondo. Sería la pieza
  más fuerte de todas y no la podemos fabricar desde acá.
- **Carrusel "cómo se construyó"**: boceto → maquetado → producción.
- **Reel de velocidad de carga** mostrando métricas reales de Lighthouse
  (hay que medirlas primero, no inventarlas).
- **Antes/después del negocio, no del auto**: "así se los encontraba en Google
  antes / así ahora". Requiere capturas reales de antes.
- **Pieza de SEO técnico** mostrando el JSON-LD y el sitemap; es un diferencial
  real y casi nadie lo comunica.
- **Reel del fallback**: apagar la base y mostrar que el sitio sigue en pie.
  Está verificado y es un argumento técnico fuerte.
- Cuando exista un segundo proyecto publicable, abrir la destacada por proyecto
  y dejar PROYECTOS como índice.

---

## Pendientes del proyecto (del propio repositorio)

Cosas que el proyecto tiene identificadas y **no** hay que comunicar como
terminadas:

- La sección **"Nuestro espacio"** está maquetada pero apagada
  (`SHOW_NUESTRO_ESPACIO = false`): faltan las fotos del frente terminado.
- El widget **"Consultar orden"** de Gestioo está apagado
  (`SHOW_ORDER_STATUS = false`) porque el proveedor manda un header
  `Cross-Origin-Resource-Policy: same-origin` que el navegador bloquea.
  No se arregla del lado de 369.
- La sección de reels tiene un solo video cargado.
