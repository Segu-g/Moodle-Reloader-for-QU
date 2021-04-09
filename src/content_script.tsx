/*!
 * content_script.tsx v0.1.0
 *
 * Copyright (c) 2020 Segu
 * Released under the MIT license.
 * see https://opensource.org/licenses/MIT
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { PAGETYPES, QUMoodleURL , id2url} from "./MoodleUtils/UrlParser";
import { newCoursesManeger, CoursesManeger } from "./datas_wrapper/Course";
import { newTimeTableManeger, TimeTableManeger } from "./datas_wrapper/TimeTable";
import { get_next_courses, get_day_courses } from "./datas_wrapper/CourseCollector";
import { days, Time, period_times } from "./datas_wrapper/Time";
import { require_reload } from "./chromeAPI_wrapper/message";
export { }


async function main() {
    const courses_promise = newCoursesManeger();
    const timetable_promise = newTimeTableManeger();
    var moodle_url = new QUMoodleURL(document.URL);
    const timetable = await timetable_promise;
    const courses = await courses_promise;
    const element = document.getElementById("nav-drawer");
    if (element == null) {
        return;
    }
    render_today_courses(element, timetable, courses);
    set_reload(timetable, moodle_url);
}


async function set_reload(timetable: TimeTableManeger, moodle_url: QUMoodleURL) {
    // console.log("set_reload");
    if (!moodle_url.searchParams.has("id")) {
        return false;
    }
    const id = Number(moodle_url.searchParams.get("id"));
    const today = new Date();
    const todays_courses = get_day_courses(today.getDay(), timetable);
    const now = new Time(today.getHours(), today.getMinutes());
    var period = 0;
    // console.log(todays_courses);
    for (; period < todays_courses.length; period++){
        if (now >= period_times[period]) {
            // console.log(period, period_times[period])
            continue;
        }
        if (todays_courses[period] != id) {
            // console.log(period, todays_courses[period])
            continue;
        }
        let time = period_times[period];
        const date = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            time.hours,
            time.minutes
        );
        require_reload(id, date);
        
    }

    
    
}


function render_today_courses(element: HTMLElement, timetable: TimeTableManeger, courses: CoursesManeger) {
    const today = new Date();
    const day_courses = get_day_courses(today.getDay(), timetable);
    let buf_dom: ChildNode | null = element.children[0];
    for (let period = 0; period < day_courses.length; period++) {
        let id = day_courses[period];
        if (id == undefined) {
            continue;
        }
        let course = courses.load(id);
        let target_dom = document.createElement("div");
        const day_formatter = ["日", "月", "火", "水", "木", "金", "土"];
        target_dom.className = "list-group-item";
        element.insertBefore(target_dom, buf_dom);
        ReactDOM.render(
            (
                <a href={id2url(id).href}>
                    {day_formatter[today.getDay()]}
                    {period}
                    &emsp;
                    {course?.name}
                </a>
            ),
            target_dom
        );
        buf_dom = target_dom.nextSibling;
    }
}


function render_next_courses(element: HTMLElement, timetable: TimeTableManeger, courses: CoursesManeger) {
    let nexts = get_next_courses(4, timetable);
    let buf_dom: ChildNode | null = element.children[0];
    for (let item of nexts) {
        let id = item.id;
        let course = courses.load(id);
        let target_dom = document.createElement("div");
        const day_formatter = ["日", "月", "火", "水", "木", "金", "土"];
        target_dom.className = "list-group-item";
        element.insertBefore(target_dom, buf_dom);
        ReactDOM.render(
            (
                <a href={id2url(id).href}>
                    {day_formatter[item.time.day]}
                    {item.time.period}
                    &emsp;
                    {course?.name}
                </a>
            ),
            target_dom
        );
        buf_dom = target_dom.nextSibling;
    }
}



main()
console.log("content_script.tsx");


