SET client_encoding = 'UTF8';

TRUNCATE calendario, rutina_ejercicios, rutinas, ejercicios, grupos_musculares, usuarios RESTART IDENTITY CASCADE;

INSERT INTO usuarios (nombre, email, password_hash) VALUES
  ('Facundo Morán',    'facundo@fittracker.test',  crypt('Fit12345', gen_salt('bf'))),
  ('Santiago Avila',   'santiago@fittracker.test', crypt('Fit12345', gen_salt('bf'))),
  ('Leandro López',    'leandro@fittracker.test',  crypt('Fit12345', gen_salt('bf'))),
  ('Fabricio Lazarte', 'fabricio@fittracker.test', crypt('Fit12345', gen_salt('bf'))),
  ('Usuario Demo',     'demo@fittracker.test',     crypt('Fit12345', gen_salt('bf')));

INSERT INTO grupos_musculares (nombre) VALUES
  ('Pecho'), ('Espalda'), ('Piernas'), ('Glúteos'),
  ('Hombros'), ('Bíceps'), ('Tríceps'), ('Abdomen');

INSERT INTO ejercicios (slug, nombre, grupo_muscular_id, equipo, descripcion, imagen)
SELECT e.slug, e.nombre, g.id, e.equipo, e.descripcion, e.imagen
FROM (VALUES
  ('press-banca',    'Press de banca',                'Pecho',   'Barra',              'Empuje horizontal sobre un banco.',                 '/img/mascota-press-banca.png'),
  ('remo-mancuerna', 'Remo con mancuerna',            'Espalda', 'Mancuernas',         'Tracción de una mancuerna hacia el torso.',         '/img/mascota-remo-mancuerna.png'),
  ('dominadas',      'Dominadas',                     'Espalda', 'Barra de dominadas', 'Tracción del cuerpo hacia una barra fija.',         '/img/mascota-dominadas.png'),
  ('sentadilla',     'Sentadilla con barra',          'Piernas', 'Barra',              'Flexión y extensión de piernas con barra.',         '/img/mascota-sentadilla.png'),
  ('hip-thrust',     'Hip thrust',                    'Glúteos', 'Barra',              'Extensión de cadera con espalda apoyada en banco.', '/img/mascota-hip-thrust.png'),
  ('press-militar',  'Press militar',                 'Hombros', 'Barra',              'Empuje de barra por encima de la cabeza.',          '/img/mascota-press-militar.png'),
  ('curl-barra',     'Curl con barra',                'Bíceps',  'Barra',              'Flexión de codos con barra.',                       '/img/mascota-curl-barra.png'),
  ('triceps-polea',  'Extensión de tríceps en polea', 'Tríceps', 'Polea',              'Extensión de codos desde una polea alta.',          '/img/mascota-triceps-polea.png'),
  ('plancha',        'Plancha',                       'Abdomen', 'Peso corporal',      'Sostén del cuerpo sobre antebrazos y pies.',        '/img/mascota-plancha.png'),
  ('crunch',         'Crunch abdominal',              'Abdomen', 'Peso corporal',      'Flexión corta del tronco desde el suelo.',          '/img/mascota-crunch.png')
) AS e (slug, nombre, grupo, equipo, descripcion, imagen)
JOIN grupos_musculares g ON g.nombre = e.grupo;

-- Tres plantillas (sin usuario) y tres rutinas propias.
INSERT INTO rutinas (usuario_id, nombre, descripcion)
SELECT u.id, r.nombre, r.descripcion
FROM (VALUES
  (NULL,                       'Rutina de fuerza',          'Ejemplo de entrenamiento orientado a trabajar la fuerza.'),
  (NULL,                       'Rutina de hipertrofia',     'Ejemplo de rutina enfocada en el desarrollo muscular.'),
  (NULL,                       'Rutina de cuerpo completo', 'Ejemplo de entrenamiento para distintos grupos musculares.'),
  ('facundo@fittracker.test',  'Mi día de piernas',         'Piernas y glúteos con barra.'),
  ('santiago@fittracker.test', 'Tren superior',             'Pecho, espalda y brazos.'),
  ('demo@fittracker.test',     'Core rápido',               'Rutina corta de abdomen.')
) AS r (email, nombre, descripcion)
LEFT JOIN usuarios u ON u.email = r.email;

INSERT INTO rutina_ejercicios (rutina_id, ejercicio_id, series, cantidad, unidad, orden)
SELECT r.id, e.id, x.series, x.cantidad, x.unidad, x.orden
FROM (VALUES
  ('Rutina de fuerza',          'sentadilla',     5,  5, 'repeticiones', 1),
  ('Rutina de fuerza',          'press-banca',    5,  5, 'repeticiones', 2),
  ('Rutina de fuerza',          'press-militar',  4,  6, 'repeticiones', 3),
  ('Rutina de hipertrofia',     'press-banca',    4, 10, 'repeticiones', 1),
  ('Rutina de hipertrofia',     'remo-mancuerna', 4, 12, 'repeticiones', 2),
  ('Rutina de hipertrofia',     'curl-barra',     3, 12, 'repeticiones', 3),
  ('Rutina de cuerpo completo', 'sentadilla',     3, 10, 'repeticiones', 1),
  ('Rutina de cuerpo completo', 'dominadas',      3,  8, 'repeticiones', 2),
  ('Rutina de cuerpo completo', 'plancha',        3, 45, 'segundos',     3),
  ('Mi día de piernas',         'sentadilla',     4,  8, 'repeticiones', 1),
  ('Mi día de piernas',         'hip-thrust',     4, 10, 'repeticiones', 2),
  ('Tren superior',             'press-banca',    4,  8, 'repeticiones', 1),
  ('Tren superior',             'dominadas',      4,  6, 'repeticiones', 2),
  ('Tren superior',             'triceps-polea',  3, 12, 'repeticiones', 3),
  ('Core rápido',               'plancha',        3, 60, 'segundos',     1),
  ('Core rápido',               'crunch',         3, 20, 'repeticiones', 2)
) AS x (rutina, slug, series, cantidad, unidad, orden)
JOIN rutinas r ON r.nombre = x.rutina
JOIN ejercicios e ON e.slug = x.slug;

INSERT INTO calendario (usuario_id, rutina_id, fecha, completado)
SELECT u.id, r.id, x.fecha::date, x.completado
FROM (VALUES
  ('facundo@fittracker.test',  'Mi día de piernas',         '2026-11-02', TRUE),
  ('facundo@fittracker.test',  'Rutina de fuerza',          '2026-11-04', FALSE),
  ('santiago@fittracker.test', 'Tren superior',             '2026-11-03', TRUE),
  ('santiago@fittracker.test', 'Rutina de hipertrofia',     '2026-11-05', FALSE),
  ('leandro@fittracker.test',  'Rutina de cuerpo completo', '2026-11-06', FALSE),
  ('fabricio@fittracker.test', 'Rutina de fuerza',          '2026-11-07', FALSE),
  ('demo@fittracker.test',     'Core rápido',               '2026-11-01', TRUE)
) AS x (email, rutina, fecha, completado)
JOIN usuarios u ON u.email = x.email
JOIN rutinas r ON r.nombre = x.rutina;