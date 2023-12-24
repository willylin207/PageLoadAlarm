import Enabled from './Enabled.js';

const SOUNDPAGE = chrome.runtime.getURL("src/offscreen/audioplayer.html");

let changingStatus = false;
let creatingSoundpage;

chrome.runtime.onInstalled.addListener(details => {
    if (details.reason === "install") {
        Enabled.set(true);
    }
});

chrome.runtime.onStartup.addListener(() => {
    initializeEnabledUIState();
});

chrome.action.onClicked.addListener(async () => {
    if (changingStatus) return;
    changingStatus = true;

    let enabled = await Enabled.get();
    await Enabled.set(!enabled);

    changingStatus = false;
});

chrome.webNavigation.onCompleted.addListener(async details => {
    if (details.frameId !== 0) {
        return;
    }

    if (await Enabled.get()) {
        await createSoundPage();
        chrome.runtime.sendMessage({ action: "playoffscreen" });
    }
});

async function initializeEnabledUIState() {
    return Enabled.set(await Enabled.get());
}

async function createSoundPage() {
    let existingSoundpages = await chrome.runtime.getContexts({
        contextTypes: ["OFFSCREEN_DOCUMENT"],
        documentUrls: [SOUNDPAGE]
    });

    if (existingSoundpages.length !== 0 || creatingSoundpage) {
        return creatingSoundpage;
    }

    creatingSoundpage = chrome.offscreen.createDocument({
        url: SOUNDPAGE,
        reasons: ["AUDIO_PLAYBACK"],
        justification: "Plays a sound to alert the completion of a tab load."
    });

    await creatingSoundpage;
    creatingSoundpage = null;
}