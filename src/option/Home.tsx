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
                    <span>
                        <h5>Moodle Reloader for QU
                        ver.{chrome.runtime.getManifest().version} </h5>
                        <p>
                            author: Segu (<a href="https://twitter.com/SeguSegment">@SeguSegment</a>) <br />
                        email: <a href="mailto:segusegment@gmail.com">segusegment@gmail.com</a> <br />
                        要望，質問: <a href="https://peing.net/ja/segusegment">Peing</a>
                        </p>
                    </span>



                    <span className="text-heading">
                        更新履歴
                    </span>
                    <span>
                        <h5>
                            ver2.0.5
                        </h5>
                        Popupのtypoを修正．
                        PopupのUIを改善．
                        Popupのコースをホイールクリックを用いて非アクティブで開く操作に対応．

                        <h5>
                            ver2.0.4
                        </h5>
                        リロード時にバックグラウンドで処理がループする不具合を修正
                        リロードに失敗した際のアラート機能を追加(Settingから設定)

                        <h5>
                            ver2.0.3
                        </h5>
                        popupで他の曜日を表示できるように変更
                        リロード後にページが閉じない不具合を修正<br />

                        <h5>
                            ver2.0.2
                        </h5>
                        TimeTable周りのUIを改善<br />

                        <h5>
                            ver2.0.1
                        </h5>
                        ナビゲーションに表示するコースを先4時限から当日の講義に変更．<br />

                        <h5>
                            ver2.0.0
                        </h5>
                        UIを一新し，Moodleのナビゲーションへのコースの表示，ポップアップをサポート．<br />
                    </span>
                </div>
            </div>
        </div>
    );
}