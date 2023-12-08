chrome.webNavigation.onCompleted.addListener(async details => {
    if (details.frameId === 0) {
        notify(details);

    }
});

async function notify(details) {
    const inverseSupportedURLCharactersRegex = /[^-A-Za-z0-9+&@#/%?=~_|!:,.;\(\)]/g
    const title = await chrome.tabs.get(details.tabId)
        .then(tab => tab.title.replace(inverseSupportedURLCharactersRegex, ""))
        .catch(err => console.log(err));
    const notifId = await chrome.notifications.create(null, {
        type: "basic",
        title: "Tab Loaded",
        message: `${details.url}`,
        iconUrl: "icons/loadingalarm128x128.png"
    }).catch(err => console.log(err));
}

