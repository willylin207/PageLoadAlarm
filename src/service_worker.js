chrome.runtime.onInstalled.addListener(async details => {
    let enabled = true;

    await createSoundPage();

    const disabledIcon = "../icons/disabled_loadingalarm128x128.png";
    const enabledIcon = "../icons/loadingalarm128x128.png";
    chrome.action.onClicked.addListener(tab => {
        chrome.action.setIcon({
            "path": {
                "128": enabled ? disabledIcon : enabledIcon
            }
        })
            .then(() => {
                chrome.action.setTitle({ "title": `Click to ${enabled ? "disable" : "enable"} page load alarms` })
            })
            .then(() => { enabled = !enabled });
    });

    chrome.webNavigation.onCompleted.addListener(async details => {
        if (enabled && details.frameId === 0) {
            chrome.runtime.sendMessage({ action: "playoffscreen" });
        }
    });
});

async function notify(details) {
    const title = await chrome.tabs.get(details.tabId)
        .then(tab => tab.title);
    chrome.notifications.create(null, {
        type: "basic",
        title: "Tab Loaded",
        message: `${title}`,
        iconUrl: "icons/loadingalarm128x128.png"
    });
}

async function createSoundPage() {
    chrome.offscreen.createDocument({
        url: "/src/offscreen/audioplayer.html",
        reasons: ["AUDIO_PLAYBACK"],
        justification: "Plays a sound to alert the completion of a tab load."
    });
}