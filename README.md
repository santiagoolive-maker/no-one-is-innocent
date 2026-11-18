# No One Is Innocent · Sprint 5

Aventura gráfica de Klark, Adrián Veyra, BLACK VEIL y ZENITH. Versión final jugable con seis decisiones, 729 combinaciones y tres finales. Revisión del 18 de noviembre de 2026.

## Jugar

Abrí la carpeta en Visual Studio Code y ejecutá `index.html` con **Go Live**. No se instalan paquetes. Conservá juntas las carpetas `css`, `js`, `img` y `multimedia`. Todo el JavaScript de la aplicación está dentro de `js/` y no utiliza programación asincrónica.

El progreso se guarda automáticamente en este navegador y se recupera con **Continuar partida**, incluso después de recargar. **Nueva partida** reemplaza ese progreso. Si el navegador bloquea el almacenamiento, la partida sigue funcionando en la pestaña abierta.

Usá mouse, tacto o Tab y Enter. **V** abre la ficha y **Escape** vuelve a la escena o al menú. **Animación** desactiva las transiciones y muestra un fotograma estático de las secuencias. El tráiler se reproduce desde **Créditos** con controles y subtítulos en español.

## Entrega

- [Tablero de tareas y aportes](TABLERO_SPRINT5.md)
- [Registro de playtesting simulado](PLAYTESTING_SPRINT5.md)
- Tráiler: **Créditos** dentro del juego.
- Fuentes editables: `assets/`.

## Historial de sprints

| Sprint | Cambios de la etapa | Entrega |
| --- | --- | --- |
| 1 | Se definieron la historia de Klark y Adrián Veyra, las variables, el árbol de decisiones y tres finales posibles. | [Historia y decisiones](https://github.com/santiagoolive-maker/no-one-is-innocent/blob/3fb9a907655eab89aa5ace43704d198968eb1afb/docs/Sprint_1_final.docx) |
| 2 | Se planificaron la interfaz, los personajes, los escenarios y la cinemática introductoria. Se prepararon las primeras propuestas de pantallas. | [Preproducción](https://github.com/santiagoolive-maker/no-one-is-innocent/blob/3fb9a907655eab89aa5ace43704d198968eb1afb/docs/Sprint_2_final.docx) |
| 3 | Se creó el primer prototipo jugable con prólogo, seis decisiones, tres desenlaces, guardado local y una interfaz adaptable a celular. | [Entrega del Sprint 3](https://github.com/santiagoolive-maker/no-one-is-innocent/blob/d48d6bc/docs/Sprint_3.md) |
| 4 | Se incorporaron las láminas al juego, se revisó el recorrido y se agregó una ficha con variables, pistas y consecuencias. Se guardaron cuatro escenarios editables de Illustrator. | [Entrega y capturas del Sprint 4](https://github.com/santiagoolive-maker/no-one-is-innocent/blob/ce4a675/docs/Sprint_4.md) |
| 5 | Se integraron los cuatro fondos al recorrido, se recuperó el guardado automático tras recargar y se incorporó el tráiler con audio y subtítulos. Se agregaron pruebas de guardado y documentación de la entrega. | [Informe del Sprint 5](https://github.com/santiagoolive-maker/no-one-is-innocent/blob/3fb9a907655eab89aa5ace43704d198968eb1afb/docs/Sprint_5.md) |

## Pruebas reproducibles

Con Node.js: `node --test tests/historia.test.cjs tests/guardado.test.cjs`.

Resultado: 738 pruebas aprobadas. Las 729 rutas verifican puntos y cierres; tres nuevas pruebas de guardado incluyen la recuperación de cada punto de las 729 rutas. Se comprobó la interfaz en navegador de escritorio y vista móvil. Esto no sustituye las pruebas con personas ajenas al desarrollo, que siguen pendientes de resultados reales.

## Equipo

Thiago Maya: código y decisiones. Santiago Olive: animaciones y diseños. Facundo Felipe: archivos y GitHub. Aportes informados por el usuario; esta revisión incluye trabajo asistido por Codex.
