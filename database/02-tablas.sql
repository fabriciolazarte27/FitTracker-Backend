SET client_encoding = 'UTF8';

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS calendario, rutina_ejercicios, rutinas, ejercicios, grupos_musculares, usuarios CASCADE;

CREATE TABLE usuarios (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(60)  NOT NULL CHECK (char_length(trim(nombre)) >= 2),
  email         VARCHAR(120) NOT NULL UNIQUE CHECK (email ~* '^[^@ ]+@[^@ ]+\.[^@ ]+$'),
  password_hash VARCHAR(255) NOT NULL,
  creado_en     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE grupos_musculares (
  id     SERIAL PRIMARY KEY,
  nombre VARCHAR(40) NOT NULL UNIQUE
);

CREATE TABLE ejercicios (
  id                SERIAL PRIMARY KEY,
  slug              VARCHAR(60)  NOT NULL UNIQUE,
  nombre            VARCHAR(80)  NOT NULL,
  grupo_muscular_id INTEGER      NOT NULL REFERENCES grupos_musculares (id) ON DELETE RESTRICT,
  equipo            VARCHAR(40)  NOT NULL,
  descripcion       VARCHAR(300),
  imagen            VARCHAR(200)
);

CREATE TABLE rutinas (
  id          SERIAL PRIMARY KEY,
  usuario_id  INTEGER      REFERENCES usuarios (id) ON DELETE CASCADE,
  nombre      VARCHAR(80)  NOT NULL,
  descripcion VARCHAR(300),
  creado_en   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE NULLS NOT DISTINCT (usuario_id, nombre)
);

CREATE TABLE rutina_ejercicios (
  rutina_id    INTEGER     NOT NULL REFERENCES rutinas (id) ON DELETE CASCADE,
  ejercicio_id INTEGER     NOT NULL REFERENCES ejercicios (id) ON DELETE RESTRICT,
  series       SMALLINT    NOT NULL CHECK (series BETWEEN 1 AND 20),
  cantidad     SMALLINT    NOT NULL CHECK (cantidad BETWEEN 1 AND 600),
  unidad       VARCHAR(12) NOT NULL DEFAULT 'repeticiones' CHECK (unidad IN ('repeticiones', 'segundos')),
  orden        SMALLINT    NOT NULL CHECK (orden >= 1),
  PRIMARY KEY (rutina_id, ejercicio_id),
  UNIQUE (rutina_id, orden),
  CHECK (unidad = 'segundos' OR cantidad <= 100)
);

CREATE TABLE calendario (
  id         SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios (id) ON DELETE CASCADE,
  rutina_id  INTEGER NOT NULL REFERENCES rutinas (id) ON DELETE RESTRICT,
  fecha      DATE    NOT NULL,
  completado BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (usuario_id, fecha)
);

CREATE INDEX idx_ejercicios_grupo ON ejercicios (grupo_muscular_id);
CREATE INDEX idx_rutinas_usuario ON rutinas (usuario_id);
CREATE INDEX idx_calendario_rutina ON calendario (rutina_id);