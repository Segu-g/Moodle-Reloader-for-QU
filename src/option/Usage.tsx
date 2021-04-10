import React from "react";


import pic_popup_enrol from "../lib/pic_popup_enrol.png";
import pic_options_schedule from "../lib/pic_options_schedule.png";
import pic_options_home from "../lib/pic_options_home.png";
import pic_popup_today from "../lib/pic_popup_today.png";
import pic_content_menu from "../lib/pic_content_menu.png";


import "../styles/content.scss";

export function Usage() {
    return (
        <div className="content">
            <div className="card">
                <div className="card-body">
                    <h1 className="content-heading">
                        Usages
                    </h1>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <span className="text-heading">
                        基本の使い方
                    </span>
                    <img src={pic_popup_enrol} style={{ width: "600px" }} /><br/>
                    <div>
                        コースの登録はMoodleのコースのページから拡張機能のアイコンを選択することで出てくるポップアップから出来ます．<br />
                        コースのidは
                        <span>
                            https://moodle.s.kyushu-u.ac.jp/course/view.php?id=xxxxxx
                        </span>
                        のようにコースのurlにあるidが用いられます．<br />
                        名前はコースの略称等，分かりやすい名前を自由に入れてもらって構いません．
                    </div>
                    <img src={pic_options_schedule} style={{ width: "600px" }} /><br/>
                    <div>
                        登録したコースは時間割に設定することが出来ます<br />
                        右のコース一覧からドラッグして登録したい時限にドロップすることで登録が完了します．<br />
                    </div>
                    <div>
                        登録したコースが開講される日に開かれると開始から1分ほど後に別のタブで自動でリロードされます．<br />
                        開講する前に自動出席の時間が終わるコースでは出席にならないので気を付けてください．
                    </div>
                    <img src={pic_content_menu} style={{ width: "600px" }} />
                    <div>
                        時間割にコースを設定するとMoodleのメニューに次のコースが表示されるようになります．<br />
                        また，今日の講義をポップアップから見ることもできます．<br />
                    </div>
                </div>
            </div>
        </div>
    );
}