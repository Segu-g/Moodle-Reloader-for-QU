import { QUMoodleURL, is_moodle_url } from "./MoodleUtils/UrlParser";
import { newTimeTableManeger, TimeTableManeger } from "./datas_wrapper/TimeTable";
import React from "react";
import ReactDOM from "react-dom";
import styles from "./styles/popup.scss";
export { }

function crrent_tab() {
    return new Promise<chrome.tabs.Tab>(
        (resolve, reject) => {
            const query = { active: true, currentWindow: true };
            function callback(tabs: chrome.tabs.Tab[]) {
                resolve(tabs[0]);
            }
            chrome.tabs.query(query, callback);
        }
    );
}

function App(props: {url?: string}) {
    return (
        <div className={ styles["root"] }>
            <div className={styles["header"]}>
                Moodle Reloader
            </div>
            <div className={styles["header-dummy"]}></div>
            <div className="card" >
                <div className="card-body">
                    aaa <br />
                    bbb <br />
                    ccc <br />
                    ddd <br />
                    eee
                </div>
            </div>  
        </div>
    );
}

async function main() {
    const tab = await crrent_tab();
    if (tab.url == undefined) {
        return;
    }
    const root = document.getElementById("root");
    ReactDOM.render(
        <App url={tab.url} />,
        root
    );
}

main()


