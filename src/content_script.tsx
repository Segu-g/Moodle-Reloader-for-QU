/*!
 * content_script.tsx v0.1.0
 *
 * Copyright (c) 2020 Segu
 * Released under the MIT license.
 * see https://opensource.org/licenses/MIT
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { QUMoodleURL , id2url} from "./MoodleUtils/UrlParser";
import { newCoursesManeger, CoursesManeger } from "./datas_wrapper/Course";
import { newTimeTableManeger, TimeTableManeger } from "./datas_wrapper/TimeTable";
import { get_next_courses } from "./datas_wrapper/CourseCollector";
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
    render_next_courses(element, timetable, courses);
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


