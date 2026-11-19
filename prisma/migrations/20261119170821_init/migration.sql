CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(60) NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "creado_en" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grupos_musculares" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(40) NOT NULL,

    CONSTRAINT "grupos_musculares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ejercicios" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(60) NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "grupo_muscular_id" INTEGER NOT NULL,
    "equipo" VARCHAR(40) NOT NULL,
    "descripcion" VARCHAR(300),
    "imagen" VARCHAR(200),

    CONSTRAINT "ejercicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rutinas" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "nombre" VARCHAR(80) NOT NULL,
    "descripcion" VARCHAR(300),
    "creado_en" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rutinas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rutina_ejercicios" (
    "rutina_id" INTEGER NOT NULL,
    "ejercicio_id" INTEGER NOT NULL,
    "series" SMALLINT NOT NULL,
    "cantidad" SMALLINT NOT NULL,
    "unidad" VARCHAR(12) NOT NULL DEFAULT 'repeticiones',
    "orden" SMALLINT NOT NULL,

    CONSTRAINT "rutina_ejercicios_pkey" PRIMARY KEY ("rutina_id","ejercicio_id")
);

-- CreateTable
CREATE TABLE "calendario" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "rutina_id" INTEGER NOT NULL,
    "fecha" DATE NOT NULL,
    "completado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "calendario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "grupos_musculares_nombre_key" ON "grupos_musculares"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "ejercicios_slug_key" ON "ejercicios"("slug");

-- CreateIndex
CREATE INDEX "idx_ejercicios_grupo" ON "ejercicios"("grupo_muscular_id");

-- CreateIndex
CREATE INDEX "idx_rutinas_usuario" ON "rutinas"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "rutinas_usuario_id_nombre_key" ON "rutinas"("usuario_id", "nombre") NULLS NOT DISTINCT;

-- CreateIndex
CREATE UNIQUE INDEX "rutina_ejercicios_rutina_id_orden_key" ON "rutina_ejercicios"("rutina_id", "orden");

-- CreateIndex
CREATE INDEX "idx_calendario_rutina" ON "calendario"("rutina_id");

-- CreateIndex
CREATE UNIQUE INDEX "calendario_usuario_id_fecha_key" ON "calendario"("usuario_id", "fecha");

-- AddForeignKey
ALTER TABLE "ejercicios" ADD CONSTRAINT "ejercicios_grupo_muscular_id_fkey" FOREIGN KEY ("grupo_muscular_id") REFERENCES "grupos_musculares"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rutinas" ADD CONSTRAINT "rutinas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rutina_ejercicios" ADD CONSTRAINT "rutina_ejercicios_rutina_id_fkey" FOREIGN KEY ("rutina_id") REFERENCES "rutinas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rutina_ejercicios" ADD CONSTRAINT "rutina_ejercicios_ejercicio_id_fkey" FOREIGN KEY ("ejercicio_id") REFERENCES "ejercicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendario" ADD CONSTRAINT "calendario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendario" ADD CONSTRAINT "calendario_rutina_id_fkey" FOREIGN KEY ("rutina_id") REFERENCES "rutinas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_nombre_check" CHECK (char_length(trim("nombre")) >= 2);
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_email_check" CHECK ("email" ~* '^[^@ ]+@[^@ ]+\.[^@ ]+$');
ALTER TABLE "rutina_ejercicios" ADD CONSTRAINT "rutina_ejercicios_series_check" CHECK ("series" BETWEEN 1 AND 20);
ALTER TABLE "rutina_ejercicios" ADD CONSTRAINT "rutina_ejercicios_cantidad_check" CHECK ("cantidad" BETWEEN 1 AND 600);
ALTER TABLE "rutina_ejercicios" ADD CONSTRAINT "rutina_ejercicios_unidad_check" CHECK ("unidad" IN ('repeticiones', 'segundos'));
ALTER TABLE "rutina_ejercicios" ADD CONSTRAINT "rutina_ejercicios_orden_check" CHECK ("orden" >= 1);
ALTER TABLE "rutina_ejercicios" ADD CONSTRAINT "rutina_ejercicios_unidad_cantidad_check" CHECK ("unidad" = 'segundos' OR "cantidad" <= 100);
