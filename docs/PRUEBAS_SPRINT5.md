# Registro de pruebas y correcciones - Sprint 5

Fecha: 17 de noviembre de 2026. Verificación técnica asistida; el playtesting externo humano está pendiente.

## Batería automática

Comando: `node --test tests/historia.test.cjs tests/guardado.test.cjs`.

Resultado: **738 pruebas aprobadas, 0 fallos**. Las 735 del motor se conservaron y volvieron a ejecutar. Se añadieron tres pruebas de recuperación y validación del guardado.

- Se recorren las 3^6 = 729 combinaciones. Cada una termina sin escenas bloqueadas, con seis elecciones registradas y las variables esperadas por un cálculo independiente.
- Distribución: 49 finales de verdad, 127 de cómplice y 553 de silencio.
- Se verifica que cada opción tenga una consecuencia distinta, se rechacen índices inválidos y eventos atrasados, y Nueva partida reinicie el estado.
- La nueva prueba de recuperación reconstruye y compara los diez puntos de cada ruta (inicio, introducción y decisiones), incluidos los finales.
- Se rechazan JSON corruptos, versiones incompatibles, índices inválidos y rutas demasiado largas. Las variables o finales inyectados no reemplazan los calculados por el motor.

Salida completa: `evidencias/sprint-5/pruebas-automaticas.txt`.

## Pruebas en navegador

Opciones numeradas del 1 al 3, después de las tres pantallas de introducción. Se realizaron con la interfaz real por HTTP local, sin sustituir el motor ni escribir estados desde la consola.

| Recorrido / prueba | Resultado esperado | Resultado obtenido | Corrección / pendiente |
| --- | --- | --- | --- |
| 1, 2, 1, 1, 1, 1 | La verdad sale a la luz; C=0, I=11, L=0, M=7 | Coincide; oficina al amanecer visible | Sin fallo observado |
| Recargar y Continuar tras ese final | Recuperar final y seis decisiones | Recuperado | Antes se perdía al recargar; corregido con guardado validado |
| 2, 1, 2, 2, 2, 2 | El nuevo cómplice; C=7, I=1, L=7, M=0 | Coincide; oficina nocturna visible | Sin fallo observado |
| 3, 3, 3, 3, 3, 1 en 390 × 844 | El peso del silencio por falta de testigo; C=1, I=6, L=2, M=3 | Coincide; borde de azotea visible | No se inventa una declaración del testigo fugado |
| Variables y Escape | Ficha con pistas reales; regreso al final | Coincide | Sin fallo observado |
| Animación desactivada | Control no pulsado; transiciones anuladas | Coincide | Sin fallo observado |
| Nueva partida tras un final | Reiniciar introducción, variables y registro | Coincide | Sin fallo observado |
| Menú móvil y controles | Sin desplazamiento horizontal ni textos desbordados | Coincide; botones visibles de al menos 44 px | Emulación de tamaño; falta teléfono humano real |
| Tráiler desde Créditos | MP4 reproducible, 35 s, 1920 × 1080 | Reproducción iniciada; metadatos y controles correctos | Se agregó MP4 y acceso desde el juego |
| Recursos HTTP y búsqueda en el video | HTML/JS/WebP/VTT correctos; rango de bytes | Respuestas 200 y video 206, bytes 100–199 | Se añadieron MIME y rangos al servidor |

Capturas: `final-verdad.jpg`, `final-complice.jpg`, `final-silencio-movil.jpg` y `trailer-movil.jpg`. Registro de pasos en `recorridos-navegador.json`.

## Correcciones y límites

El guardado conserva elecciones y reconstruye variables y consecuencias, evitando confiar en puntuaciones almacenadas. Si el almacenamiento no está disponible, el juego continúa en la pestaña y lo informa.

Los cuatro escenarios exportados que antes sólo estaban archivados ahora aparecen en el prólogo, amenaza y epílogos. El tráiler tiene controles nativos y subtítulos opcionales. Se añadió una entrada `index.html` en la raíz para Go Live y publicación estática.

No se inventaron pruebas humanas, opiniones, participantes ni dispositivos físicos. El registro `PLAYTESTING_EXTERNO.md` está preparado para resultados reales. El equipo todavía debe revisar el tráiler y las observaciones docentes antes del Sprint 6.
