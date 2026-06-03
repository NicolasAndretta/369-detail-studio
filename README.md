# 369 Detail Studio — Landing Web Profesional

Landing page premium para **369 Detail**, estudio de detailing automotor en Buenos Aires.

🌐 **[Ver sitio en producción](https://steelblue-bear-881853.hostingersite.com)**

---

## ¿Qué problema resuelve?

La mayoría de los talleres de detailing en Argentina depende exclusivamente de Instagram, lo que limita su alcance y credibilidad. 369 Detail necesitaba una presencia web profesional que transmitiera confianza, mostrara resultados reales y convirtiera visitantes en consultas por WhatsApp.

---

## Funcionalidades

- Hero animado con métricas y llamada a la acción
- Galería before/after interactiva con crossfade al hacer click
- Galería completa con filtros por categoría (Lavado, Cerámico, Interior, etc.)
- Sistema de videos con grid de thumbnails y modal de reproducción — soporta embeds de Instagram y TikTok
- Navbar inteligente con scroll suave desde cualquier ruta
- Botón de WhatsApp sticky que aparece al scrollear
- SEO técnico completo — metadata, Open Graph, Twitter Cards, sitemap.xml, robots.txt, Schema.org
- Fully responsive — mobile, tablet y desktop

---

## Tecnologías

| Área | Tecnología |
|------|-----------|
| Framework | Next.js 16 con App Router |
| Lenguaje | TypeScript |
| Animaciones | Framer Motion |
| Estilos | CSS Modular |
| Hosting | Hostinger con Node.js 20 |
| CI/CD | Deploy automático desde GitHub |

---

## Arquitectura

Sin base de datos. El contenido se gestiona mediante archivos TypeScript centralizados:

- `gallery-data.ts` — imágenes con categorías y rutas
- `video-data.ts` — videos con URLs de Instagram/TikTok y thumbnails

Agregar contenido nuevo es tan simple como descomentar una entrada y reemplazar la URL, sin tocar componentes.

---

## Correr el proyecto localmente

```bash
git clone https://github.com/NicolasAndretta/369-detail-studio
cd 369-detail-studio
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Estado del proyecto

✅ Infraestructura completa y deployada  
⏳ Pendiente: fotos reales de trabajos, videos del proceso y dominio personalizado
