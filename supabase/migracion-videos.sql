-- ============================================================
-- 369 Detail — Reels del taller, administrables desde /admin
-- Pegar y ejecutar UNA VEZ en Supabase → SQL Editor → New query.
-- Es seguro correrlo dos veces: no toca nada de lo que ya existe.
-- ============================================================

create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  categoria text not null default 'Detailing',

  -- Se guarda SOLO el código del posteo, no la URL completa que pegó el
  -- usuario. La URL final la arma el código del sitio. Así es imposible que
  -- por el panel entre un link a cualquier otra página y termine embebido
  -- en un iframe dentro de 369.
  instagram_code text,
  tiktok_id text,

  -- Miniatura propia (Instagram no da la suya sin su API). Se sube por el
  -- mismo camino que las fotos de la galería.
  thumbnail_url text,

  visible boolean not null default true,
  orden int not null default 0,
  creado_en timestamptz not null default now(),

  -- Un video sin ninguna plataforma no sirve para nada.
  constraint videos_al_menos_una_plataforma
    check (instagram_code is not null or tiktok_id is not null)
);

create index if not exists videos_orden_idx on videos (orden);

-- Misma política que el resto: RLS prendido y SIN políticas públicas.
-- Solo el servidor (service_role) entra. Nadie lee ni escribe desde afuera.
alter table videos enable row level security;
