export function message(msg: string, title = '', alwaysShow = false) {
  chrome.notifications.create('error', {
    iconUrl: 'icon48.png',
    type: 'basic',
    title: title,
    message: msg,
    requireInteraction: alwaysShow,
  });
}