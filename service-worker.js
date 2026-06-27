let timer = null;
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
self.addEventListener('message', event => {
  const { type, endTime } = event.data;
  if (type === 'SET_TIMER') {
    clearTimeout(timer);
    const delay = endTime - Date.now();
    if (delay > 0) {
      timer = setTimeout(() => {
        self.clients.matchAll().then(clients => clients.forEach(c => c.postMessage({ type: 'TIMER_FIRED' })));
        self.registration.showNotification('🍼 喂奶时间到！', {
          body: '宝宝该喂奶了',
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍼</text></svg>',
          vibrate: [500,200,500,200,500],
          requireInteraction: true,
          tag: 'feeding-alarm'
        });
      }, delay);
    }
  } else if (type === 'CLEAR_TIMER') clearTimeout(timer);
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window' }).then(clients => {
    if (clients.length) clients[0].focus();
    else clients.openWindow('index.html');
  }));
});