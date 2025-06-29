
const CACHE_NAME = 'econova-pwa';
const urlsToCache = [
  '/',
  '/index.html',
  '/index2.html',
  '/chatbot.html',
  '/IniciarSesion.html',
  '/perfil.html',
  '/actualizate/actualizate.html',
  '/actualizate/actualizate-usuario.html',
  '/actualizate/ecodatos.html',
  '/actualizate/ecodatos-usuario.html',
  '/actualizate/cinco-r-usuario.html',
  '/actualizate/cinco-r.html',
  '/actualizate/recicla-en-casa-usuario.html',
  '/actualizate/recicla-en-casa.html',
  '/actualizate/residuos-usuario.html',
  '/actualizate/residuos.html',
  '/nosotros/nosotros-usuario.html',
  '/nosotros/nosotros.html',
  '/backend/nosotros-usuario.html',
  '/noticias/noticia1-usuario.html',
  '/noticias/noticia1.html',
  '/noticias/noticia2-usuario.html',
  '/noticias/noticia2.html',
  '/noticias/noticia3-usuario.html',
  '/noticias/noticia3.html',
  '/noticias/noticia4-usuario.html',
  '/noticias/noticia4.html',
  '/noticias/noticia5-usuario.html',
  '/noticias/noticia5.html',
  '/noticias/noticias-usuario.html',
  '/noticias/noticias.html',
  '/js/actualizate-item.js',
  '/js/carousel.js',
  '/js/index.js',
  '/js/menu_actualizate.js',
  '/js/menu.js',
  '/js/notificacion.js',
  '/js/scroll_top_btn.js',
  '/css/actualizate-item.css',
  '/css/actualiate.css',
  '/css/contribuir.css',
  '/css/home.css',
  '/css/nosotros.css',
  '/css/noticias.css',
  '/css/notificacion.css',
  '/assets_inicio/css/estilos.css',
  '/assets_inicio/img/Imagen1.png',
  '/assets_inicio/img/Imagen2.png',
  '/assets_inicio/js/app.js',
  '/assets_inicio/js/firebase.js',
  '/styles.css',
  // Agrega todas las URL de los recursos que quieres cachear
];

// Evento 'install': Se ejecuta cuando el Service Worker se instala por primera vez
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cacheando archivos...');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'fetch': Se ejecuta cada vez que el navegador solicita un recurso
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el recurso está en caché, devolverlo
        if (response) {
          return response;
        }
        // Si no está en caché, intentar obtenerlo de la red
        return fetch(event.request);
      })
  );
});

// Evento 'activate': Se ejecuta cuando el Service Worker se activa
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Eliminando cache antiguo', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});