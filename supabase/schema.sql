-- ============================================================
-- 369 Detail — Esquema del panel de galería
-- Pegar y ejecutar UNA VEZ en Supabase → SQL Editor → New query
-- ============================================================

-- Trabajos (cada tarjeta de la galería)
create table if not exists trabajos (
  id uuid primary key default gen_random_uuid(),
  servicio text not null,
  categoria text not null,
  vehiculo text not null default '',
  visible boolean not null default true,
  en_inicio boolean not null default false,
  orden int not null default 0,
  creado_en timestamptz not null default now()
);

-- Fotos/ángulos de cada trabajo (antes_url opcional = par antes/después)
create table if not exists fotos (
  id uuid primary key default gen_random_uuid(),
  trabajo_id uuid not null references trabajos(id) on delete cascade,
  etiqueta text not null,
  antes_url text,
  despues_url text not null,
  orden int not null default 0
);

create index if not exists fotos_trabajo_idx on fotos (trabajo_id, orden);

-- Seguridad: RLS activado SIN políticas públicas.
-- Solo el servidor (service_role) puede leer/escribir. Nadie entra desde afuera.
alter table trabajos enable row level security;
alter table fotos enable row level security;

-- Bucket público para las fotos que se suban desde el panel
insert into storage.buckets (id, name, public)
values ('galeria', 'galeria', true)
on conflict (id) do nothing;
