/* The page already knows how to live inside a native app: it asks window.Capacitor for sign-in through the
   system browser, for the return link and for reminders. These are the same few calls, answered by the desktop. */
'use strict';
const { contextBridge, ipcRenderer } = require('electron');

const linkListeners = [];
ipcRenderer.on('app-url', (_event, url) => linkListeners.forEach(fn => fn({ url })));

// reminders ring while the app is open; the page sets them again each time it starts
const planned = new Map();
function ring(n) {
  try { new Notification(n.title, { body: n.body || '' }).onclick = () => ipcRenderer.send('focus'); } catch (_) {}
}
setInterval(() => {
  const now = Date.now();
  for (const [id, n] of planned) if (n.at <= now) { planned.delete(id); ring(n); }
}, 30000);

contextBridge.exposeInMainWorld('Capacitor', {
  isNativePlatform: () => true,
  getPlatform: () => 'electron',
  Plugins: {
    App: {
      addListener(name, fn) {
        if (name === 'appUrlOpen') { linkListeners.push(fn); ipcRenderer.send('app-url-ready'); }
        return { remove() {} };
      }
    },
    Browser: {
      open: ({ url }) => ipcRenderer.invoke('open-external', url),
      close: async () => {}
    },
    LocalNotifications: {
      requestPermissions: async () => ({ display: await Notification.requestPermission() }),
      getPending: async () => ({ notifications: [...planned.keys()].map(id => ({ id })) }),
      cancel: async ({ notifications }) => { notifications.forEach(n => planned.delete(n.id)); },
      schedule: async ({ notifications }) => {
        notifications.forEach(n => {
          if (n.schedule && n.schedule.at) planned.set(n.id, { at: +new Date(n.schedule.at), title: n.title, body: n.body });
          else ring(n);
        });
      }
    }
  }
});
