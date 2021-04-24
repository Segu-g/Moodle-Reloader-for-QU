/*!
 * event.js. v1.0.0
 *
 * Copyright (c) 2020 Segu
 * Released under the MIT license.
 * see https://opensource.org/licenses/MIT
 */
import { HOSTNAME, id2url } from "./MoodleUtils/UrlParser";
import { ChromeStorage } from "./chromeAPI_wrapper/storage";
import { newExtSettingManeger, ExtSettingsManeger } from "./datas_wrapper/ExtSettings";
import { message, reload, require_reload } from "./chromeAPI_wrapper/message";
export { }

chrome.runtime.onInstalled.addListener(async (details) => {
    const version = 2;
    const old_version = await ChromeStorage.cheack_version();
    if (old_version < version) {
        await Promise.all([
            ChromeStorage.clear_sync(),
            ChromeStorage.clear_local()
        ]);
        await ChromeStorage.set_version(version);
    }
    return;
});

chrome.runtime.onMessage.addListener(
    (message: message, sender, sendResponse) => {
        switch (message.operation) {
            case "reload":
                console.log(message)
                const now = new Date();
                const time = new Date(message.data.time);
                const delay_ms = time.getTime() - now.getTime();
                const delay_min = (delay_ms + 30000) / 1000 / 60;
                chrome.alarms.create(
                    "reload-"
                    + String(message.data.id)
                    + "-"
                    + String(time.getTime()),
                    {
                        delayInMinutes: delay_min
                    }
                )
                break;
            case "get":
                break;
            default:
                console.log("unknown message: " + message.operation);
                sendResponse();
                return;
                
        }
        sendResponse();
        return;
    }
);

chrome.alarms.onAlarm.addListener(
    (alarm) => {
        const name = alarm.name;
        const operation = name.split("-")[0];
        switch (operation) {
            case "reload":
                const id = Number(name.split("-")[1]);
                const time = Number(name.split("-")[2]);
                reload_process(id, time);
                break;
        }
    }
)


function reload_process(id: number, time: number) {
    const course_url = id2url(id).href;
    chrome.tabs.create(
        {
            url: course_url,
            active: false
        },
        (tab) => {
            const course_tab_id = tab.id;
            if (course_tab_id != undefined) {
                function mycallback(
                    tabId: number,
                    changeInfo: chrome.tabs.TabChangeInfo,
                    tab: chrome.tabs.Tab)
                {
                    console.log(changeInfo, tab);
                    if (tabId == course_tab_id && changeInfo.status == "complete") {
                        if (tab.title != undefined && tab.title.substr(0, 3) == "コース") {
                            setInterval(
                                () => { chrome.tabs.remove(course_tab_id) },
                                5 * 1000
                            );
                            console.log("The tab has been successfully removed.")
                        } else {
                            (async ()=> {
                                const extSettings = await newExtSettingManeger();
                                if (extSettings.load("errorAlert")) {
                                    alert("Failed to reload Moodle.\n[" + course_url + "]\nPlease reload Moodle manually.")
                                }
                            })()
                        }
                        chrome.tabs.onUpdated.removeListener(mycallback);
                        
                    }
                }

                chrome.tabs.onUpdated.addListener(
                    mycallback
                );
            }
        }
    );
}


console.log("Event.tsx");