export function message(msg: string, title = '') {
  chrome.notifications.create(
    'error',
    {
      iconUrl: 'icon128.png',
      type: 'basic',
      title: title,
      message: msg
    },
    function (notificationId) { }
  );
}