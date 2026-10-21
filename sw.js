const CACHE='piano-studio-v1';
const FILES=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
// Prima la rete, così dopo un aggiornamento si vede subito la versione nuova; senza rete usa la copia salvata.
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(function(r){
    if(r.ok&&new URL(e.request.url).origin===location.origin){
      var cp=r.clone();caches.open(CACHE).then(function(c){c.put(e.request,cp);});
    }
    return r;
  }).catch(function(){
    return caches.match(e.request).then(function(m){return m||caches.match('index.html');});
  }));
});
