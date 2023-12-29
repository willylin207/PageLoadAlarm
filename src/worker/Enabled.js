const DISABLED_ICON = chrome.runtime.getURL("icons/disabled_loadingalarm128x128.png");
const ENABLED_ICON = chrome.runtime.getURL("icons/loadingalarm128x128.png");

class Enabled {
    /**
     * @type {Promise<boolean|null>}
     */
    static #enabled;

    static {
        this.#refreshEnabled();
    }

    static async get() {
        if (this.#enabled === undefined || await this.#enabled === null) {
            this.#refreshEnabled();
        }
        return this.#enabled;
    }

    /**
     * @param {boolean} shouldEnabled 
     */
    static async set(shouldEnabled) {
        if (typeof shouldEnabled !== "boolean") {
            throw new Error(`The extension can only be enabled or disabled; cannot be in status ${typeof shouldEnabled}`);
        }

        await Promise.all([
            chrome.action.setTitle({ title: `Click to ${shouldEnabled ? "disable" : "enable"} page load alarms` }),
            chrome.action.setIcon({ "path": { "128": shouldEnabled ? ENABLED_ICON : DISABLED_ICON } }),
            chrome.storage.local.set({ "enabled": shouldEnabled })
        ]);
        return this.#refreshEnabled();
    }

    static #refreshEnabled() {
        /**
         * @returns {Promise<boolean|null>}
         */
        let getEnabledBoolean = async () => {
            let stored = await chrome.storage.local.get("enabled");
            if (stored.hasOwnProperty("enabled")) {
                return stored["enabled"];
            } else {
                return null;
            }
        }
        return this.#enabled = getEnabledBoolean();
    }
}

export default Enabled;