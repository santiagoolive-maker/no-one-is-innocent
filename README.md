# No One Is Innocent · Sprint 5

Aventura gráfica de Klark, Adrián Veyra, BLACK VEIL y ZENITH. Versión final jugable con seis decisiones, 729 combinaciones y tres finales. Revisión del 17 de noviembre de 2026.

## Jugar

Abrí `index.html` con **Go Live** en Visual Studio Code. También podés ejecutar `node servidor.cjs` desde esta carpeta y entrar en http://127.0.0.1:8080. No se instalan paquetes. Conservá juntas las carpetas `src` y `public`.

El progreso se guarda automáticamente en este navegador y se recupera con **Continuar partida**, incluso después de recargar. **Nueva partida** reemplaza ese progreso. Si el navegador bloquea el almacenamiento, la partida sigue funcionando en la pestaña abierta.

Usá mouse, tacto o Tab y Enter. **V** abre la ficha y **Escape** vuelve a la escena o al menú. **Animación** desactiva las transiciones. El tráiler se reproduce desde **Créditos** con controles y subtítulos en español.

## Entrega

- [Informe del Sprint 5](docs/Sprint_5.md)
- [Pruebas y correcciones](docs/PRUEBAS_SPRINT5.md)
- [Tablero de tareas](entrega/index.html) y [versión Markdown](docs/TABLERO_SPRINT5.md)
- [Aportes del equipo](docs/APORTES_SPRINT5.md)
- [Playtesting externo pendiente](docs/PLAYTESTING_EXTERNO.md)
- [Multimedia](docs/MULTIMEDIA_SPRINT5.md)

Las entregas históricas de los sprints 1 a 4 permanecen en `docs/`.

## Pruebas reproducibles

Con Node.js: `node --test tests/historia.test.cjs tests/guardado.test.cjs`.

Resultado: 738 pruebas aprobadas. Las 729 rutas verifican puntos y cierres; tres nuevas pruebas de guardado incluyen la recuperación de cada punto de las 729 rutas. Se comprobó la interfaz en navegador de escritorio y vista móvil. Esto no sustituye las pruebas con personas ajenas al desarrollo, que siguen pendientes de resultados reales.

## Equipo

Thiago Maya: código y decisiones. Santiago Olive: animaciones y diseños. Facundo Felipe: archivos y GitHub. Aportes informados por el usuario; esta revisión incluye trabajo asistido por Codex.
