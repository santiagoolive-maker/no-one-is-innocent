# Sprint 5 - Versión final de la Aventura Gráfica

**No One Is Innocent** · Revisión: 17 de noviembre de 2026 · Entrega indicada: jueves 19 de noviembre de 2026.

Equipo: Thiago Maya, Santiago Olive y Facundo Felipe.

## Juego terminado

La WebApp conserva la historia y los recursos del proyecto recibido. Klark investiga la relación de Adrián Veyra con BLACK VEIL y ZENITH. La introducción enlaza con seis decisiones de tres opciones: encargo, amenaza, empleado, archivos, testigo y desenlace. Cada alternativa registra una consecuencia y modifica variables o hechos que aparecen después.

Hay 729 combinaciones de decisiones y tres finales, sin cierre provisional. Corrupción, Investigación, Lealtad y Moralidad son variables globales de la partida. Los documentos y el testigo se guardan como hechos: acumular puntos no recupera pruebas negociadas ni crea una declaración de una persona que huyó.

| Final | Condiciones principales |
| --- | --- |
| La verdad sale a la luz | Denunciar, conservar originales o respaldo, proteger el testimonio, Investigación ≥ 6, Moralidad ≥ 3 y Corrupción ≤ 2 |
| El nuevo cómplice | Aceptar el pacto, Corrupción ≥ 4, Lealtad ≥ 3 y haber entregado control de documentos o testigo |
| El peso del silencio | Abandonar o intentar una denuncia/pacto sin los requisitos que lo sostengan; el epílogo explica la causa |

Las escalas de la ficha reflejan los máximos alcanzables de esta implementación: C=8, I=11, L=7, M=7. Se conserva el modelo de la versión jugable recibida; los documentos históricos de preproducción no se reescriben como si fueran la implementación actual.

## Navegación e interfaz

Menú, Nueva partida, Continuar, Créditos, ficha de variables y pistas, registro de decisiones, retorno al menú y reinicio están conectados. El progreso se conserva automáticamente en este navegador después de recargar mediante un guardado de elecciones validado. Si no hay almacenamiento, se informa que la sesión sólo durará mientras la pestaña esté abierta.

La interfaz adapta imagen y relato a una columna en celular. Los botones tienen foco visible y se operan con mouse, tacto o teclado. V abre la ficha; Escape regresa a la escena o al menú. Las transiciones pueden desactivarse y respetan la preferencia de movimiento reducido.

## Recursos y pieza audiovisual

Se mantienen las láminas originales, los personajes editables y la animación fuente. Los cuatro fondos WebP se utilizan dentro del recorrido y de los finales. El tráiler de 35 segundos, con audio original sintetizado, texto y subtítulos, se reproduce desde Créditos y desde el tablero de entrega. Detalles en `MULTIMEDIA_SPRINT5.md`.

## Pruebas y correcciones

Pasaron 738 pruebas automáticas: incluyen las 729 rutas y la recuperación de todos sus puntos. Se jugaron tres recorridos completos en navegador hasta los tres finales y se comprobaron recarga, ficha, reinicio, animaciones, vista móvil y video. Resultados y problemas corregidos en `PRUEBAS_SPRINT5.md`; capturas y registros en `evidencias/sprint-5/`.

**Falta el playtesting con personas ajenas al desarrollo.** El protocolo y la tabla están listos en `PLAYTESTING_EXTERNO.md`; no se inventaron respuestas ni participantes. Las pruebas técnicas del asistente no se presentan como playtesting humano.

## Organización y entregables

| Entregable | Evidencia |
| --- | --- |
| A. Versión final | Juego terminado; estado y enlace de publicación en `PUBLICACION.md` |
| B. Código | Repositorio `santiagoolive-maker/no-one-is-innocent`, historial conservado y commits de esta revisión |
| C. Multimedia | Recursos integrados y tráiler disponible en el juego y `public/multimedia/` |
| D. Pruebas | Registro técnico completo y formulario de playtesting externo pendiente |
| E. Organización | Tablero navegable `entrega/index.html`, tablero Markdown y aportes confirmados por el usuario |

Thiago Maya hizo parte del código y las decisiones; Santiago Olive, animaciones y diseños; Facundo Felipe, organización de archivos y GitHub. `APORTES_SPRINT5.md` distingue estos aportes declarados del trabajo asistido de esta revisión.

El tablero registra lo completado y los pendientes reales. El equipo debe hacer pruebas externas, revisar la pieza audiovisual y preparar la defensa del Sprint 6. La consigna aclara que sus criterios detallados son una guía propuesta para validación docente; aquí no se presentan como acuerdos adicionales ya comunicados.
