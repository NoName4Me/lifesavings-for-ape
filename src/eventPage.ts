import { message } from './popup/message';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.msg) {
    message(request.msg, request.title, request.alwaysShow);
  }
});
