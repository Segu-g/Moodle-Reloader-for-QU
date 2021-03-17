import React from "react";
import ReactDOM from "react-dom";


import "../styles/content.scss";

export function Home() {
    return (
        <div className="content">
            <div className="card">
                <div className="card-body">
                    <h1 className="content-heading">
                        Home
                    </h1>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <span className="text-heading">
                        この拡張機能についての情報 / Infomation about this extension.
                    </span>
                    <p>
                        Moodle Reloader for QU
                        ver.{chrome.runtime.getManifest().version} <br />
                        author: Segu (<a href="https://twitter.com/SeguSegment">@SeguSegment</a>) <br />
                        email: <a href="mailto:segusegment@gmail.com">segusegment@gmail.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
}