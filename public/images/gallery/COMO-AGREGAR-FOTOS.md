# Cómo agregar las fotos reales de la galería

La galería ya está lista para fotos reales. Hoy muestra **placeholders simulados**
porque todavía no hay imágenes. Apenas pongas los archivos acá y los conectes en
`src/data/gallery-data.ts`, aparecen solas (con efecto antes/después).

## 1. Qué fotos necesito (6 trabajos, antes + después)

Cada trabajo necesita una foto **ANTES** y una **DESPUÉS**, del mismo ángulo.

| Slot | Trabajo | Archivo ANTES | Archivo DESPUÉS |
|------|---------|---------------|-----------------|
| 1 | Lavado detallado completo | `before-1.jpg` | `after-1.jpg` |
| 2 | Tratamiento cerámico 9H | `before-2.jpg` | `after-2.jpg` |
| 3 | Limpieza interior | `before-3.jpg` | `after-3.jpg` |
| 4 | Abrillantado de pintura | `before-4.jpg` | `after-4.jpg` |
| 5 | Tratamiento acrílico | `before-5.jpg` | `after-5.jpg` |
| 6 | Lavado de motor y chasis | `before-6.jpg` | `after-6.jpg` |

Poné todos los archivos en esta carpeta: `public/images/gallery/`

## 2. Cómo deben ser las fotos

- **Mismo encuadre** en el antes y el después (que se note la transformación).
- **Horizontal** para slots 1 y 4 (son anchos), **cuadrada/vertical** para el resto.
- Buena luz, fondo limpio (el estilo premium del sitio).
- Mínimo ~1600px de ancho. JPG está bien (después las paso a WebP/AVIF para que vuelen).

## 3. Reels (videos de Instagram)

En `src/data/video-data.ts` agregá los reels reales: la `instagramUrl` del posteo
y un `thumbnail` (una captura del video) en esta misma carpeta.

---

> Cuando tengas las fotos, avisame y las conecto + las optimizo en un toque.
> Esta guía es local, no se publica.
