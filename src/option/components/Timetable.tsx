import React, { useRef, useState } from "react";
import { DndProvider, DropTargetMonitor , useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Loading } from "../Loading";
import { useCourses, Course, CoursesImpl } from "../../datas_wrapper/Course";
import { useTimetable, TimeTableImpl } from "../../datas_wrapper/TimeTable";
import { days } from "../../datas_wrapper/Time";
import { id2url } from "../../MoodleUtils/UrlParser";
import styles from "../../styles/timetable.scss";
const TYPES = {
    COURSE: "COUESE",
    DELCOURSE: "DELCOURSE"
};

function TimeTableCell(props: {
    timetable: TimeTableImpl,
    courses: CoursesImpl,
    day: (typeof days)[number],
    period: number
}) {
    let id = props.timetable.load(props.day, props.period);
    let course = props.courses.load(id);
    const [collected, ref] = useDrop<
        { type: string, id: number },
        void,
        { isOver: boolean }
        >
        (() => ({
            accept: [TYPES.COURSE, TYPES.DELCOURSE],
            collect(monitor) {
                return {
                    isOver: monitor.isOver()
                }
            },
            drop(item, monitor) {
                if (item.type == TYPES.DELCOURSE) {
                    props.timetable.delete(props.day, props.period);
                } else if (item.type == TYPES.COURSE) {
                    props.timetable.write(props.day, props.period, item.id);
                }
            }
        }));
    
    return (
        <td ref={ref} style={{ background: collected.isOver ? "rgba(0, 0, 0, 0.2)" : "white" , maxWidth: "12vw"}} className="phalf">
            <div>
                {
                    (course == undefined) ?
                        <div /> :
                        <div className="row-center">
                            <div style={{overflowWrap:"break-word"}}>
                                {course.id}<br />
                                {course.name}
                            </div>
                            <a href={id2url(course.id).href}>
                                <div className={styles["gg-external"] }/>
                            </a>
                        </div>
                }
            </div>
        </td>
    );
}

function TimetableComponent(props:{ timetable: TimeTableImpl, courses: CoursesImpl }) {
    let table_rows: JSX.Element[] = [];
    table_rows.push(
        <tr key="table-0" style={{height: "2rem"}}>
            <th></th>
            {days.map((day) => { return <th key={"daylabel-" + day}>{day}</th> })}
        </tr>
    );
    for (let period = 1; period < 7; period++) {
        table_rows.push(
            <tr key={"table-" + String(period)}>
                <th>{period}</th>
                {days.map((day) => {
                    return (
                        <TimeTableCell
                            key={"course-" + day + String(period)}
                            timetable={props.timetable}
                            courses={props.courses}
                            day={day}
                            period={period}
                        />
                    );
                })}
            </tr>
        );
    }

    const table_style: React.CSSProperties = {
        minWidth: "600px",
        maxWidth: "65vw",
        minHeight: "400px"
    }
    return (
        <table style={table_style}>
            <tbody>
                {table_rows}
            </tbody>
        </table>
    );
}



function CourseModal(props: { courses: CoursesImpl, show: boolean, close: () => void }) {
    
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
        return false;
    }
    const label_style : React.CSSProperties = {
        width: "60px"
    }
    const input_style: React.CSSProperties = {
        
    }
    

    return (
        <div className={props.show ? "modal-body show" : "modal-body"} >
            <div className="card">
                <div className="card-body">
                    <h1 className="content-heading">
                        コースの登録
                    </h1>
                </div>
            </div>
            <div className="card" style={{ height: "246px" }}>
                <div className="card-body">
                    <form onSubmit={onSubmit}>
                        <p className="row">
                            <label style={label_style}>
                                id:
                            </label>
                            <input type="number" min="0" ref={id_ref} style={input_style} defaultValue={0}/>
                        </p>
                        <p className="row">
                            <label style={label_style}>
                                name:
                            </label>
                            <input type="text" ref={name_ref} style={input_style} defaultValue=""/>
                        </p>
                        <div className="posright" >
                            <input type="submit" value="Add" className="mr"/>
                            <button onClick={props.close} className="mr">Close</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function CourseComponent(props: { id: number, courses: CoursesImpl }) {
    const [drag_collected, drag_ref] = useDrag(() => ({
        item: { type: TYPES.COURSE, id: props.id }
    }));
    const [drop_collected, drop_ref] = useDrop<
        { type: string, id: number },
        void,
        { isOver: boolean }
    >(() => ({
        accept: TYPES.COURSE,
        collect(monitor) {
            return {
                isOver: monitor.isOver()
            }
        },
        hover(item, monitor) {
            if (item.id != props.id) {
                props.courses.swap(item.id, props.id);
            }
        }
    }));
    const course = props.courses.load(props.id);
    return (
        <div className={styles["course-element"]} ref={drop_ref}>
            <div ref={drag_ref} className={styles["flex-last"]}>
                <div>
                    <div>
                        id: {course?.id}
                    </div>
                    <div>
                        {course?.name}
                    </div>
                </div>
                <button onClick={() => {props.courses.delete(props.id)} }>
                    remove
                </button>
            </div>
        </div>
    );

}

function CourseListComponent(props: { courses: CoursesImpl }) {
    const [show_modal, setModal] = useState(false);
    let page_wrapper_class: string = "page-wrapper";
    if (show_modal) {
        page_wrapper_class += " show";
    }

    const [collected, ref] = useDrag(() => ({
        item: { type: TYPES.DELCOURSE, id: 0 }
    }));
    
    let course_list: JSX.Element[] =
        props.courses.ids().map(
            (id) => {
                return (
                    <CourseComponent
                        key={"course-element-" + String(id)}
                        id={id}
                        courses={props.courses} />
                );
            }
        );

    return (
        <div className={styles["course-control"] + " slave"}>
            <div className={page_wrapper_class} />
            <CourseModal
                courses={props.courses}
                show={show_modal}
                close={() => {setModal(!show_modal)}}
            />
            <div className={styles["course-list"] + " slave-inner"}>
                <div className={styles["course-menu"]}>
                    <div onClick={() => {setModal(!show_modal);}}>
                        <div className="cross" />
                    </div>
                </div>
                <div className={styles["course-element"]} ref={ ref }>
                    講義無し
                </div>
                { course_list }
            </div>
        </div>
        
    );
}

export function TimeTableSection() {
    const [ready_course, courses] = useCourses();
    const [ready_timetable, timetable] = useTimetable();
    const [fontsize, setFontsize] = useState("16");
    return (
        
        <div className="timetable">
            <span className="text-heading">
                時間割
            </span>
            <br/>
            <div className="card-body">
                font size: <input type="range" value={fontsize} min="1" max="50"
                    onChange={(event) => { setFontsize(event.target.value);}}></input> {fontsize}
                <div style={{fontSize: fontsize+"px"}}>
                    {
                        (ready_course && ready_timetable) ?
                            <div className="row" style={{ alignItems: "flex-start" }}>
                                <div className="mr">
                                    <TimetableComponent timetable={timetable} courses={courses} />
                                </div>
                                <CourseListComponent courses={courses} />
                            </div> :
                            <Loading />
                    }
                </div>
            </div>
        </div>
    );
}