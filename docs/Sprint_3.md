# Sprint 3

La primera versión jugable incluye un prólogo, seis decisiones de tres opciones cada una, sus consecuencias y tres desenlaces. La corrupción determina el final. Las elecciones previas cambian de dónde salen los indicios, qué pruebas conserva Klark y qué puede demostrar al terminar.

- **FSD** · [Escenas y reglas](../src/historia.js). El [control de la partida](../src/main.js) muestra la escena y guarda las elecciones y el paso actual en el navegador. El HUD muestra las seis variables del diseño. Dinero conserva su valor inicial porque las seis decisiones documentadas no le asignan cambios.
- **Interfaz** · [Pantallas de referencia de Canva](https://canva.link/9hd82p1n5bkytlh). Se conservaron como mockups [menú](mockups/pantalla-01.webp), [prólogo](mockups/pantalla-02.webp), [conversación](mockups/pantalla-03.webp), [decisión](mockups/pantalla-04.webp), [variables](mockups/pantalla-05.webp) y [final](mockups/pantalla-06.webp). Los botones y textos del juego son HTML. La interfaz se adapta a celular y respeta la preferencia de movimiento reducido.
- **Multimedia** · La portada utiliza la ilustración de la primera pantalla del PDF de diseño y el prólogo usa un retrato exportado desde Illustrator. Los [editables de personajes](../assets/personajes/editables/) y el [archivo de Animate](../assets/animaciones/editables/movimiento2.fla) quedan como material de producción. El efecto de cambio de escena usa CSS. El archivo FLA se conserva como editable.

## Verificación

La prueba automática se ejecuta con Node.js mediante `node --test tests/historia.test.cjs`.

Las opciones se cuentan de arriba hacia abajo. Cada número corresponde a una de las seis decisiones del recorrido.

| Opciones | Final esperado |
| --- | --- |
| 2, 2, 2, 3, 2, 2 | La Verdad. Los registros de ZENITH están completos. |
| 1, 1, 1, 1, 1, 1 | ZENITH. |
| 1, 3, 3, 1, 1, 1 | El Heredero. Los documentos destruidos y el dispositivo entregado no figuran en las pruebas. |

Para comprobar el guardado, elegí una opción, recargá desde la pantalla de consecuencia y pulsá **Continuar partida**. Deben aparecer la misma consecuencia y los mismos valores.

El historial de Git registra los cambios de esta entrega. Las responsabilidades de equipo documentadas en el [Sprint 2](Sprint_2_final.docx) corresponden a esa etapa.
