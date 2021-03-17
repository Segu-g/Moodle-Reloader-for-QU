import { QUMoodleURL, is_moodle_url, id2url} from "./MoodleUtils/UrlParser";
import { newTimeTableManeger, TimeTableManeger } from "./datas_wrapper/TimeTable";
import { newCoursesManeger, CoursesManeger } from "./datas_wrapper/Course";
import { get_day_courses, get_current_period } from "./datas_wrapper/CourseCollector";
import { require_reload } from "./chromeAPI_wrapper/message";
import React, { useState, useRef, useReducer } from "react";
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


function TodayCourses(props: { timetable: TimeTableManeger, courses:CoursesManeger }) {
    const today = new Date();
    const courses = get_day_courses(today.getDay(), props.timetable);
    const current = get_current_period();
    let current_id = 0;
    if (current.length != 0) {
        current_id = current[0];
    }
    const day_formatter = ["日", "月", "火", "水", "木", "金", "土"];
    const elements = courses.map(
        (id, index) => {
            const course = props.courses.load(id);
            const style: React.CSSProperties = {
                color: (id != current_id) ? "black" :"#ffe67a"
            };

            return (        
                (course == undefined) ?
                    <div key={index}/> :
                    <div key={index} className="row-center border">
                        <div style={style}>
                            {day_formatter[today.getDay()]
                                + String(index)
                                + "限"}<br />
                            {course.name}
                        </div>
                        <a
                            onClick={(e) => {
                                chrome.tabs.create({
                                    url: id2url(course.id).href
                                });
                            }}
                            href={id2url(course.id).href}>
                            <div className={styles["gg-external"]} />
                        </a>
                    </div>
            );
            
        }
    );
    return (
        <div>
            {elements}
        </div>
    );
    
}


function EnrolCourse(props: { moodle_url?: QUMoodleURL, title?:string, courses: CoursesManeger }) {
    
    var default_id = props.moodle_url?.searchParams.has("id") ?
        Number(props.moodle_url.searchParams.get("id")) : 0;
    var default_name = props.title;
    const id_ref = useRef<HTMLInputElement>(null);
    const name_ref = useRef<HTMLInputElement>(null);

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const id_current = id_ref.current;
        const name_current = name_ref.current;
        if (id_current == null || name_current == null) {
            return false;
        }
        
        if (isNaN(Number(id_current.value))) {
            return false;
        }
        const id = Number(id_current.value);
        const name = name_current.value;
        props.courses.write(
            id,
            {
                id: id,
                name: name
            }
        );
        alert("Success!")
        return false;
    }
    return (
        <form onSubmit={onSubmit}>
            <table>
                <tbody>
                    <tr>
                        <td>id:</td>
                        <td><input ref={id_ref} type="number" min="0" defaultValue={default_id} /></td>
                    </tr>
                    <tr>
                        <td>name:</td>
                        <td><input ref={name_ref} type="text" defaultValue={default_name} /></td>
                    </tr>
                </tbody>
            </table>
            <div className="posright" >
                <input type="submit" value="Add" className="mr" />
            </div>
        </form>
    );
}


function Test() {
    const id_ref = useRef<HTMLInputElement>(null);
    const hours_ref = useRef<HTMLInputElement>(null);
    const min_ref = useRef<HTMLInputElement>(null);

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const id_current = id_ref.current;
        const hours_current = hours_ref.current;
        const min_current = min_ref.current;
        if (id_current == null
            || hours_current == null
            || min_current == null) {
            return false;
        }

        if (
            isNaN(Number(id_current.value))
            || isNaN(Number(hours_current.value))
            || isNaN(Number(min_current.value))
        ) {
            return false;
        }
        const id = Number(id_current.value);
        const hours = Number(hours_current.value);
        const mins = Number(min_current.value);
        var date = new Date();
        date.setHours(hours);
        date.setMinutes(mins);
        console.log(date);
        require_reload(id, date);
        return false;
    }
    return (
        <form onSubmit={onSubmit}>
            <table>
                <tbody>
                    <tr>
                        <td>id:</td>
                        <td><input ref={id_ref} type="number" min="0" /></td>
                    </tr>
                    <tr>
                        <td>hour:</td>
                        <td><input ref={hours_ref} type="number" /></td>
                    </tr>
                    <tr>
                        <td>min_ref:</td>
                        <td><input ref={min_ref} type="number" /></td>
                    </tr>
                </tbody>
            </table>
            <div className="posright" >
                <input type="submit" value="Add" className="mr" />
            </div>
        </form>
    );
}

function Contents(props: {
    timetable: TimeTableManeger,
    courses: CoursesManeger,
    url: string,
    title?: string
}) {
    let keys = ["today", "enrol", "test"];
    const [selected_key, set_key] = useState(keys[0]);
    const tabs = keys.map(
        (key) => {
            return (
                <div
                    key={key}
                    className={"tab" + ((selected_key == key) ? " selected" : "")}
                    onClick={() => { set_key(key); }}>
                    { key }
                </div>
            );
         }
    )
    const content: {[key:string]:JSX.Element}= {
        "today": (
            <TodayCourses timetable={props.timetable} courses={props.courses}/>
        ),
        "enrol": (
            <EnrolCourse
                moodle_url={
                    is_moodle_url(new URL(props.url)) ?
                        new QUMoodleURL(props.url): undefined
                    }
                title={props.title}
                courses={props.courses} />
        ),
        "test": <Test/>
    }

    return (
        <div className="card" >
            <div>
                {tabs}
            </div>
            <div className="card-body">
                {content[selected_key]}
            </div>
        </div>
    );
}

function App(props: {
    timetable: TimeTableManeger,
    courses: CoursesManeger,
    url: string,
    title?: string
}) {
    return (
        <div className={ styles["root"] }>
            <div className={styles["header"]}>
                Moodle Reloader
            </div>
            <div className={styles["header-dummy"]}></div>
            <Contents timetable={props.timetable} courses={props.courses} url={props.url} title={props.title}/>
        </div>
    );
}

async function main() {
    const tab = await crrent_tab();
    const timetable = await newTimeTableManeger();
    const courses = await newCoursesManeger();
    if (tab.url == undefined) {
        return;
    }
    const root = document.getElementById("root");
    ReactDOM.render(
        <App url={tab.url} title={tab.title} courses={courses} timetable={timetable}/>,
        root
    );
}

main()


