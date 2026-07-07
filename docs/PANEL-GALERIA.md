# Panel de galería (/admin) — Guía de setup

El panel permite que Nico y el primo carguen trabajos (pares antes/después),
elijan qué se muestra y qué va al inicio, editen y borren. Las fotos se optimizan
solas (rotación, tamaño, WebP + AVIF).

**Seguridad de diseño:** si Supabase se cae o no está configurado, la web pública
muestra la galería estática de siempre — nunca se rompe. El panel usa claves solo
de servidor (nada llega al navegador) y una clave compartida para entrar.

---

## 1. Proyecto en Supabase (una sola vez, ~5 min)

> ⚠️ El plan gratis permite **2 proyectos activos por organización**. Si la cuenta
> ya está en el límite, hay dos salidas con $0:

**Opción A — Nueva organización (la más limpia, probar primero):**
1. En [supabase.com](https://supabase.com), arriba a la izquierda tocar el
   selector de organización → **New organization** (plan Free) → nombre
   `369 Detail`.
2. Dentro de esa organización: **New project** → nombre `369-detail` → región
   **South America (São Paulo)** → generar contraseña de base (guardarla).

**Opción B — Compartir el proyecto de Finos (si la A no deja):**
1. Abrir el proyecto de **Finos** en Supabase y listo — se usan sus claves.
2. Las tablas del panel (`trabajos`, `fotos`) no chocan con las de Finos
   (`profiles`, `servicios`, `barberos`, `turnos`) y quedan bloqueadas por RLS,
   así que la app de Finos no puede tocarlas ni verlas.
3. En el paso 3 de esta guía, usar la URL y el service_role **del proyecto de
   Finos** en el `.env.local` de 369.

## 2. Crear tablas y cargar la galería actual

1. En el proyecto → **SQL Editor** → New query.
2. Pegar TODO el contenido de [`supabase/schema.sql`](../supabase/schema.sql) → **Run**.
3. Nueva query → pegar TODO [`supabase/seed.sql`](../supabase/seed.sql) → **Run**.
4. Verificar: **Table Editor** → tabla `trabajos` debería tener 9 filas.

## 3. Configurar las variables locales

1. Copiar `.env.example` como `.env.local` (misma carpeta del proyecto).
2. En Supabase → **Settings → API**:
   - `Project URL` → pegarlo en `SUPABASE_URL`
   - `service_role` (en "Project API keys", tocar Reveal) → `SUPABASE_SERVICE_ROLE_KEY`
3. `ADMIN_PASSWORD` → la clave que van a usar vos y el primo (elegila fuerte).
4. `ADMIN_SESSION_SECRET` → cualquier texto largo al azar (30+ caracteres).

> ⚠️ El `service_role` es la llave maestra de la base: solo va en `.env.local`
> y en Hostinger. Nunca en el código, nunca en un chat, nunca con `NEXT_PUBLIC_`.

## 4. Probar en local

```bash
npm run dev
```
- `http://localhost:3000/admin` → pide clave → entrás con `ADMIN_PASSWORD`.
- Deberías ver los 9 trabajos actuales. Probá ocultar/mostrar, y la home
  en `http://localhost:3000` refleja el cambio (tarda hasta 60 seg, o al toque
  después de guardar desde el panel).

## 5. Deploy a producción (Hostinger)

1. En el hPanel de Hostinger, donde corre la app de 369, agregar las **mismas 4
   variables de entorno** de `.env.local` (igual que se hizo con Finos y las de MP).
2. Push a `main` + redeploy como siempre.
3. Probar `https://<tu-dominio>/admin` desde el celu.

## 6. Uso diario (para el primo)

1. Entrar a `/admin` desde el celu → clave.
2. **+ Nuevo trabajo** → elegir servicio, poner el vehículo.
3. Cargar las fotos: **antes y después de la carrocería, antes y después de la
   rueda** (mismo ángulo). Se pueden sumar más ángulos.
4. Guardar. Listo — la web se actualiza sola.

> Protocolo de fotos (qué sacar y cómo): `taller-369/pedido-de-fotos.md` en el
> universo. Regla de oro: **sacar el ANTES siempre, en el momento**; el después
> no se puede "des-lavar".

## Límites del plan gratis de Supabase (para saber, no para preocuparse)

- 500 MB de base (los datos de la galería usan menos del 1%).
- 1 GB de storage (~4.000 fotos optimizadas).
- 5 GB/mes de tráfico de imágenes desde storage: alcanza para ~750 recorridas
  completas de la galería por mes. Las fotos viejas se sirven desde el propio
  sitio, así que no cuentan.
- Si el proyecto pasa 7 días sin NINGUNA consulta, Supabase lo pausa; con la
  web recibiendo visitas no pasa, y si pasara: la web sigue mostrando la última
  galería generada (fallback) y el proyecto se despierta desde el dashboard.
