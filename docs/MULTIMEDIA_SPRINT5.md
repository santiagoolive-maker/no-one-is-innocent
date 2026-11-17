# Recursos multimedia

Se mantienen las cinco láminas originales y los archivos editables del repositorio.

| Recurso | Uso efectivo en el juego |
| --- | --- |
| Lámina de portada | Menú con zonas clicables |
| Pasado de Klark | Presentación y créditos |
| Reunión, encargo y ficha | Diálogos, decisiones, expediente y pistas |
| Azotea nocturna (WebP) | Prólogo, antes de la reunión |
| Borde de la azotea (WebP) | Amenaza y final del silencio |
| Oficina nocturna (WebP) | Final del cómplice |
| Oficina al amanecer (WebP) | Final de la verdad |
| Tráiler MP4 | Reproductor de Créditos, sin reproducción automática |

Las transiciones de entrada de escenas y consecuencias están en `src/styles.css`; pueden desactivarse con el control Animación y respetan `prefers-reduced-motion`. No se utilizan parpadeos rápidos.

El tráiler dura 35 segundos, es 1920 × 1080 a 30 fps y utiliza video H.264 con audio AAC. Incluye ambiente original sintetizado y textos visibles. Se conserva SRT y se añade WebVTT para el reproductor. Hay una transcripción junto al video. La ficha técnica está en `public/multimedia/Ficha_audiovisual.md`; el sonido fuente queda en `assets/Ambiente_original.wav`.

`assets/animaciones/editables/movimiento2.fla` se preserva como fuente editable de Animate. El navegador no reproduce archivos FLA; la animación reproducible de esta versión son las transiciones CSS y el montaje del tráiler. No se presenta el FLA como exportado ni integrado.
