const CACHE='sichuan-v9-3-score-floor-20261123-isolated';
const FILES=['./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(x=>x.startsWith('sichuan-v')&&x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
 if(e.request.mode==='navigate'){
  // The original application must never cache a different app under its root index.html.
  const path=new URL(e.request.url).pathname;
  if(path!=='/shisen/'&&path!=='/shisen/index.html')return;
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const rc=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',rc));}return r;}).catch(()=>caches.match('./index.html')));
 }else e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request)));
});