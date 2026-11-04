SET client_encoding = 'UTF8';

SELECT 'usuarios' AS tabla, COUNT(*) AS registros FROM usuarios
UNION ALL SELECT 'grupos_musculares', COUNT(*) FROM grupos_musculares
UNION ALL SELECT 'ejercicios', COUNT(*) FROM ejercicios
UNION ALL SELECT 'rutinas', COUNT(*) FROM rutinas
UNION ALL SELECT 'rutina_ejercicios', COUNT(*) FROM rutina_ejercicios
UNION ALL SELECT 'calendario', COUNT(*) FROM calendario;

SELECT e.id, e.nombre, g.nombre AS grupo, e.equipo
FROM ejercicios e
JOIN grupos_musculares g ON g.id = e.grupo_muscular_id
ORDER BY g.nombre, e.nombre;

SELECT r.nombre AS rutina,
       COALESCE(u.nombre, 'Plantilla') AS usuario,
       re.orden, e.nombre AS ejercicio, re.series, re.cantidad, re.unidad
FROM rutinas r
LEFT JOIN usuarios u ON u.id = r.usuario_id
JOIN rutina_ejercicios re ON re.rutina_id = r.id
JOIN ejercicios e ON e.id = re.ejercicio_id
ORDER BY r.id, re.orden;

SELECT c.fecha, u.nombre AS usuario, r.nombre AS rutina, c.completado
FROM calendario c
JOIN usuarios u ON u.id = c.usuario_id
JOIN rutinas r ON r.id = c.rutina_id
ORDER BY c.fecha;

SELECT password_hash = crypt('Fit12345', password_hash) AS password_correcta
FROM usuarios WHERE email = 'demo@fittracker.test';