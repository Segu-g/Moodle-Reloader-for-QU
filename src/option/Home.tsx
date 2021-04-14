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

                    <span className="text-heading">
                        更新履歴
                    </span>
                    <p>
                        <h5>
                            ver2.0.2
                        </h5>
                        <p>
                            TimeTable周りのUIを改善
                        </p>

                        <h5>
                            ver2.0.1
                        </h5>
                        <p>
                            ナビゲーションに表示するコースを先4時限から当日の講義に変更．
                        </p>

                        <h5>
                            ver2.0.0
                        </h5>
                        <p>
                            UIを一新し，Moodleのナビゲーションへのコースの表示，ポップアップをサポート．
                        </p>
                    </p>
                </div>
            </div>
        </div>
    );
}