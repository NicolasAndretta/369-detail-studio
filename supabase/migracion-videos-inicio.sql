-- ============================================================
-- 369 Detail — Elegir qué reels se muestran en la página de inicio
-- Pegar y ejecutar UNA VEZ en Supabase → SQL Editor → New query.
-- Es seguro correrlo dos veces.
-- ============================================================

-- Mismo criterio que la tabla `trabajos`: `visible` decide si se muestra en
-- algún lado, y `en_inicio` decide si además sube a la portada.
alter table videos
  add column if not exists en_inicio boolean not null default false;

create index if not exists videos_inicio_idx on videos (en_inicio, orden);
