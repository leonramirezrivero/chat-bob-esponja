importScripts('js/sw_aux.js');

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/arenita.jpg',
    'img/avatars/bob_esponja.jpg',
    'img/avatars/calamardo.jpg',
    'img/avatars/don_cangrejo.jpg',
    'img/avatars/patricio.jpg',
    'js/app.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    //'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

//Se instala el SW
self.addEventListener('install', event =>{

    const cacheStatic = caches.open(STATIC_CACHE).then(cache=>
        cache.addAll(APP_SHELL)
    );

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache=>
        cache.addAll(APP_SHELL_INMUTABLE)
    );
    event.waitUntil(Promise.all([cacheStatic, cacheInmutable]));

});

//Se activa el SW
self.addEventListener('activate', event =>{

    const respuesta = caches.keys().then(keys =>{
        keys.forEach(key =>{
            if(key !== STATIC_CACHE && key.includes('static')){
                return caches.delete(key);
            }
        });
    });

    event.waitUntil(respuesta);

});

//fetch
self.addEventListener('fetch', event =>{
    const respuesta = caches.match(event.request).then(res=>{
        //Si el archivo esta en cache
        //Este se muestra
       if (res) {
           return res;
        } 
        //Manda respuesta el que no esta
        //Busca en internet
        //Se guarda en el cache dinamico 
        else {
            console.log("el archivo solicitado no esta en cache", event.request.url);
            return fetch(event.request).then(newRes=>{
                //Llamamos funcion del archivo sw-aux.js de Guardar en cache Dinamico
                return actualizarCacheDinamico(DYNAMIC_CACHE,event.request,newRes);
                
            });
        }

    });
    event.respondWith(respuesta);
});
