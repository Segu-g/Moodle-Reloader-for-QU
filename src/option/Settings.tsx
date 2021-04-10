import React from "react";
import ReactDOM from "react-dom";

import { ChromeStorage } from "../chromeAPI_wrapper/storage";
import "../styles/content.scss";
/* global: chrome */


export function Settings(){
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
                    <span className="text-heading">
                        Settings on Moodle
                    </span>
                    <p>
                        準備中
                    </p>
                    <span className="text-heading">
                        Settings on Option
                    </span>
                    <p>
                        <button onClick={() => { ChromeStorage.clear_local() }}>
                            ストレージの消去
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}