-- ============================================================
-- 369 Detail — Seed: carga la galería actual en la base
-- Ejecutar UNA VEZ, después de schema.sql
-- (las fotos existentes siguen sirviéndose desde /public del sitio;
--  las nuevas que se suban desde el panel van al Storage de Supabase)
-- ============================================================

insert into trabajos (id, servicio, categoria, vehiculo, visible, en_inicio, orden) values
  ('11111111-1111-4111-8111-111111111101', 'Lavado detallado',                 'Lavado',         'Moto BMW S1000R',        true, true,  1),
  ('11111111-1111-4111-8111-111111111102', 'Tratamiento cerámico',             'Cerámico',       'Mercedes-Benz 300 CE',   true, true,  2),
  ('11111111-1111-4111-8111-111111111103', 'Abrillantado y realce de pintura', 'Abrillantado',   'Chevrolet Sonic',        true, true,  3),
  ('11111111-1111-4111-8111-111111111104', 'Lavado de motor y chasis',         'Motor y Chasis', 'Chevrolet Sonic',        true, true,  4),
  ('11111111-1111-4111-8111-111111111105', 'Limpieza de interior',             'Interior',       'VW Amarok gris',         true, true,  5),
  ('11111111-1111-4111-8111-111111111106', 'Tratamiento acrílico',             'Acrílico',       'Citroën Berlingo',       true, true,  6),
  ('11111111-1111-4111-8111-111111111107', 'Lavado detallado',                 'Lavado',         'VW Amarok gris',         true, false, 7),
  ('11111111-1111-4111-8111-111111111108', 'Lavado detallado',                 'Lavado',         'VW Amarok champagne',    true, false, 8),
  ('11111111-1111-4111-8111-111111111109', 'Lavado detallado',                 'Lavado',         'VW Amarok blanca',       true, false, 9);

insert into fotos (trabajo_id, etiqueta, antes_url, despues_url, orden) values
  -- Moto BMW (lavado)
  ('11111111-1111-4111-8111-111111111101', 'Lateral',        null,                                              '/images/gallery/hero-2-bmw.webp',                           1),
  ('11111111-1111-4111-8111-111111111101', 'Rueda trasera',  '/images/gallery/moto-bmw-rueda-antes.webp',       '/images/gallery/moto-bmw-rueda-despues.webp',               2),
  ('11111111-1111-4111-8111-111111111101', 'Frente',         null,                                              '/images/gallery/moto-bmw-frente.webp',                      3),
  ('11111111-1111-4111-8111-111111111101', 'Detalle',        null,                                              '/images/gallery/moto-bmw-detalle.webp',                     4),

  -- Mercedes (cerámico)
  ('11111111-1111-4111-8111-111111111102', 'Carrocería',     '/images/gallery/auto-mercedes-frente-antes.webp', '/images/gallery/auto-mercedes-frente.webp',                 1),
  ('11111111-1111-4111-8111-111111111102', 'Trasera',        null,                                              '/images/gallery/auto-mercedes-carroceria-despues.webp',     2),
  ('11111111-1111-4111-8111-111111111102', 'Detalle',        null,                                              '/images/gallery/auto-mercedes-detalle.webp',                3),

  -- Sonic (abrillantado)
  ('11111111-1111-4111-8111-111111111103', 'Exterior',       null,                                              '/images/gallery/auto-sonic-exterior.webp',                  1),
  ('11111111-1111-4111-8111-111111111103', 'Llanta',         '/images/gallery/auto-sonic-rueda-antes.webp',     '/images/gallery/auto-sonic-rueda-despues.webp',             2),
  ('11111111-1111-4111-8111-111111111103', 'Perfil',         null,                                              '/images/gallery/auto-sonic-perfil.webp',                    3),

  -- Sonic (motor)
  ('11111111-1111-4111-8111-111111111104', 'Motor',          null,                                              '/images/gallery/auto-sonic-motor.webp',                     1),

  -- Amarok gris (interior)
  ('11111111-1111-4111-8111-111111111105', 'Butacas y tablero', null,                                           '/images/gallery/camioneta-amarok-gris-interior.webp',       1),
  ('11111111-1111-4111-8111-111111111105', 'Detalle',        null,                                              '/images/gallery/camioneta-amarok-gris-interior-2.webp',     2),

  -- Berlingo (acrílico)
  ('11111111-1111-4111-8111-111111111106', 'Exterior',       null,                                              '/images/gallery/auto-berlingo-exterior.webp',               1),

  -- Amarok gris (lavado)
  ('11111111-1111-4111-8111-111111111107', 'Exterior',       null,                                              '/images/gallery/hero-1-amarok.webp',                        1),
  ('11111111-1111-4111-8111-111111111107', 'Ruedas',         '/images/gallery/camioneta-amarok-gris-rueda-antes.webp', '/images/gallery/camioneta-amarok-gris-rueda-despues.webp', 2),
  ('11111111-1111-4111-8111-111111111107', 'Interior',       null,                                              '/images/gallery/camioneta-amarok-gris-interior.webp',       3),

  -- Amarok champagne (lavado)
  ('11111111-1111-4111-8111-111111111108', 'Exterior',       null,                                              '/images/gallery/camioneta-amarok-champagne-exterior.webp',  1),
  ('11111111-1111-4111-8111-111111111108', 'Ruedas',         '/images/gallery/camioneta-amarok-champagne-rueda-antes.webp', '/images/gallery/camioneta-amarok-champagne-rueda-despues.webp', 2),
  ('11111111-1111-4111-8111-111111111108', 'Frente',         null,                                              '/images/gallery/camioneta-amarok-champagne-frente.webp',    3),
  ('11111111-1111-4111-8111-111111111108', 'Perfil',         null,                                              '/images/gallery/camioneta-amarok-champagne-perfil.webp',    4),

  -- Amarok blanca (lavado, dos pares reales)
  ('11111111-1111-4111-8111-111111111109', 'Frente',         null,                                              '/images/gallery/camioneta-amarok-blanca-frente.webp',       1),
  ('11111111-1111-4111-8111-111111111109', 'Ruedas',         '/images/gallery/camioneta-amarok-blanca-rueda-antes.webp', '/images/gallery/camioneta-amarok-blanca-rueda-despues.webp', 2),
  ('11111111-1111-4111-8111-111111111109', 'Portón',         '/images/gallery/camioneta-amarok-blanca-porton-antes.webp', '/images/gallery/camioneta-amarok-blanca-porton.webp',  3),
  ('11111111-1111-4111-8111-111111111109', 'Exterior',       null,                                              '/images/gallery/camioneta-amarok-blanca-exterior.webp',     4);
