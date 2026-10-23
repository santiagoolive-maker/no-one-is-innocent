# Propuesta de pantallas y HUD

Esta propuesta es una guia para programar la WebApp. Los espacios marcados como **fondo propio** o **personaje propio** deben reemplazarse por exportaciones de los archivos `.ai` del grupo.

## Paleta

- Fondo: azul noche `#16202A`.
- Paneles y tarjetas: gris acero `#324A5F`.
- Accion principal y pista: oro opaco `#C99B3B`.
- Riesgo o corrupcion: rojo oscuro `#8C2F39`.
- Texto principal: blanco humo `#F6F8FA`.
- Texto secundario: gris azulado `#B8C4CE`.

## Pantallas

### Inicio

El titulo, el boton **Nueva partida** y una imagen de Klark sobre un fondo propio. La pantalla no necesita mostrar todas las variables: debe invitar a empezar.

### Escena narrativa

Muestra el fondo propio, el retrato del personaje que habla y un bloque breve de texto. El boton **Continuar** avanza a la proxima situacion.

### Decision y HUD

El HUD se ubica arriba y muestra cinco variables con barra, numero y etiqueta. Las opciones se ven como tarjetas grandes y siempre incluyen texto; el color por si solo no comunica el efecto.

En celular, el HUD se reduce a un boton **Estado** que abre un panel. Las tres decisiones se apilan en una sola columna.

### Resultado de decision

Confirma la eleccion, muestra una consecuencia narrativa breve y destaca solamente las variables que cambiaron. Asi el jugador entiende que una decision produjo una nueva situacion.

### Final

Muestra el nombre del final, una ilustracion propia del cierre, un texto corto y dos acciones: revisar estado final o jugar otra vez.

## Estados del HUD

| Variable | Que representa | Indicador |
| --- | --- | --- |
| Confianza | Relacion de Klark con Veyra | Barra gris-acero y valor numerico |
| Moralidad | Limites que Klark decide respetar | Barra gris-acero y valor numerico |
| Investigacion | Pruebas y pistas disponibles | Barra dorada y valor numerico |
| Lealtad | Compromiso con Veyra | Barra gris-acero y valor numerico |
| Corrupcion | Costo de las decisiones tomadas | Barra roja y valor numerico |

La propuesta visual completa se encuentra en `propuesta_pantallas_hud.svg`.
