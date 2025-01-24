chrome.runtime.onMessage.addListener(async function (message) {
    console.log(await chrome.storage.local.get(message.delete))
    await chrome.storage.local.remove(message.delete)
});