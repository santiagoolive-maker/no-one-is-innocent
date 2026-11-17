"use strict";
// Servidor opcional para reproducir la misma ejecución HTTP usada en la revisión.
// No instala paquetes. El juego también conserva recursos y scripts relativos.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const raiz = __dirname;
const puerto = Number(process.argv[2] || 8080);
if (!Number.isInteger(puerto) || puerto < 1 || puerto > 65535) {
    console.error('Usá: node servidor.cjs [puerto entre 1 y 65535]');
    process.exit(1);
}
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4', '.vtt': 'text/vtt; charset=utf-8', '.md': 'text/plain; charset=utf-8', '.json': 'application/json' };
const servidor = http.createServer((peticion, respuesta) => {
    if (!['GET', 'HEAD'].includes(peticion.method)) { respuesta.writeHead(405, {Allow:'GET, HEAD'}).end(); return; }
    let ruta;
    try { ruta = decodeURIComponent(new URL(peticion.url, 'http://localhost').pathname); }
    catch { respuesta.writeHead(400).end('Ruta inválida'); return; }
    const archivo = path.resolve(raiz, '.' + (ruta.endsWith('/') ? ruta + 'index.html' : ruta));
    const relativa = path.relative(raiz, archivo);
    if (relativa.split(path.sep).some(parte => parte.startsWith('.')) || path.isAbsolute(relativa)) { respuesta.writeHead(403).end(); return; }
    fs.readFile(archivo, (error, datos) => {
        if (error) { respuesta.writeHead(404).end('Archivo no encontrado'); return; }
        const headers = {'Content-Type':tipos[path.extname(archivo)] || 'application/octet-stream', 'Cache-Control':'no-store', 'Accept-Ranges':'bytes'};
        let inicio = 0, fin = datos.length - 1, codigo = 200;
        if (peticion.headers.range) {
            const rango = /^bytes=(\d+)-(\d*)$/.exec(peticion.headers.range);
            if (!rango || Number(rango[1]) >= datos.length || (rango[2] && Number(rango[2]) < Number(rango[1]))) {
                respuesta.writeHead(416, {'Content-Range':`bytes */${datos.length}`}).end(); return;
            }
            inicio = Number(rango[1]);
            fin = rango[2] ? Math.min(Number(rango[2]), fin) : fin;
            codigo = 206;
            headers['Content-Range'] = `bytes ${inicio}-${fin}/${datos.length}`;
        }
        headers['Content-Length'] = fin - inicio + 1;
        respuesta.writeHead(codigo, headers);
        respuesta.end(peticion.method === 'HEAD' ? undefined : datos.subarray(inicio, fin + 1));
    });
});
servidor.on('error', error => {
    console.error(error.code === 'EADDRINUSE' ? `El puerto ${puerto} está ocupado. Probá: node servidor.cjs ${puerto+1}` : error.message);
    process.exitCode = 1;
});
servidor.listen(puerto, '127.0.0.1', () => console.log(`No One Is Innocent: http://127.0.0.1:${puerto}\nCtrl+C para cerrar el servidor.`));
