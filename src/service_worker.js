const disabledIcon = "../icons/disabled_loadingalarm128x128.png";
const enabledIcon = "../icons/loadingalarm128x128.png";
const soundpageUrl = "src/offscreen/audioplayer.html";

let enabled = true;
let changingStatus = false;
let creatingSoundpage;

chrome.action.onClicked.addListener(tab => {
    if (changingStatus) return;
    changingStatus = true;
    chrome.action.setIcon({
            "path": {
                "128": enabled ? disabledIcon : enabledIcon
            }
        })
        .then(() => {
            chrome.action.setTitle({
                title: `Click to ${enabled ? "enable" : "disable"} page load alarms`
            });
        })
        .then(() => enabled = !enabled)
        .then(() => changingStatus = false);
});

chrome.webNavigation.onCompleted.addListener(async details => {
    if (enabled && details.frameId === 0) {
        createSoundPage()
            .then(() => chrome.runtime.sendMessage({ action: "playoffscreen" }));
    }
});

function createSoundPage() {
    return chrome.runtime.getContexts({
        contextTypes: ["OFFSCREEN_DOCUMENT"],
        documentUrls: [chrome.runtime.getURL(soundpageUrl)]
    })
        .then(matchingContexts => {
            return new Promise((resolve, reject) => {
                const shouldCreate = matchingContexts.length === 0 && !creatingSoundpage;
                if (shouldCreate) {
                    resolve();
                } else {
                    reject();
                }
            });
        })
        .then(() => creatingSoundpage = chrome.offscreen.createDocument({
            url: soundpageUrl,
            reasons: ["AUDIO_PLAYBACK"],
            justification: "Plays a sound to alert the completion of a tab load."
        }))
        .then(() => creatingSoundpage = null)
        .catch(() => creatingSoundpage); // so creating soundpage can be waited for
}