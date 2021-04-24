import React from "react";
import ReactDOM from "react-dom";
import { ExtSettingsImpl ,useExtSettings } from "../datas_wrapper/ExtSettings";

import { ToggleSwitch } from "../utils";




import { ChromeStorage } from "../chromeAPI_wrapper/storage";
import "../styles/content.scss";



export function Settings() {
    return (
        <div className="content">
            <div className="card">
                <div className="card-body">
                    <h1 className="content-heading">
                        Settings
                    </h1>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <MoodleSetting/>
                    <ExtensionSettings/>
                </div>
            </div>
        </div>
    );
}



function MoodleSetting() {
    return (
        <React.Fragment>
            <span className="text-heading">
                Moodle Settings
            </span>
            <p>
                準備中
            </p>
        </React.Fragment>
    )
}




function ExtensionSettings() {
    const [ready, extSettings] = useExtSettings();
    let extSettingsControls = null;
    if (ready) {
        const errorAlert = !!extSettings.load("errorAlert");
        function errorAlertChange(event: React.ChangeEvent<HTMLInputElement>) {
            // console.log("Clicked!");
            // console.log(event.target.checked);
            extSettings.write("errorAlert", event.target.checked);
        }

        extSettingsControls = (<React.Fragment>
            <p className="row">
                <div className="mr">リロードに失敗した際の通知</div>
                <ToggleSwitch
                    type="checkbox"
                    checked={errorAlert}
                    onChange={errorAlertChange} />
            </p>
        </React.Fragment>);
    }
    


    function clear_storage() {
        if (confirm("本当に設定を消去してしまっても宜しいですか？")) {
            ChromeStorage.clear_local();
        }
    }

    return (
        <React.Fragment>
            <span className="text-heading">
                Extension Settings
            </span>
            {extSettingsControls}
            <p>
                <button onClick={clear_storage}>
                    ストレージの消去
                </button>
            </p>
        </React.Fragment>
    );
}