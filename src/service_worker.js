self.addEventListener("activate", async () => {
    await createSoundPage();

    chrome.webNavigation.onCompleted.addListener(async details => {
        if (details.frameId === 0) {
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