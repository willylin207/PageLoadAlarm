window.addEventListener("load", () => {
    const AUDIOFILE_PATH = "../../sounds/4.wav";

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (sender.id === chrome.runtime.id && request.action === "playoffscreen") {
            new Audio(AUDIOFILE_PATH)
                .play();
        }
    });
});