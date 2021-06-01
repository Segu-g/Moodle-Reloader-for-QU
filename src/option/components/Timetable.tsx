import React, { useRef, useState } from "react";
import { DndProvider, DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Loading } from "../Loading";
import { Course, Folder, FolderManeger, useCourseFolder } from "../../datas_wrapper/Course";
import { useTimetable, TimeTableImpl } from "../../datas_wrapper/TimeTable";
import { days } from "../../datas_wrapper/Time";
import { id2url } from "../../MoodleUtils/UrlParser";
import styles from "../../styles/timetable.scss";

import folderIcon from "../../lib/folder_icon.svg";
import minusIcon from "../../lib/minus.svg";


enum TYPES {
    COURSE = "COUESE",
    FOLDER = "FOLDER",
    DELCOURSE = "DELCOURSE"
};


function TimeTableCell(props: {
    timetable: TimeTableImpl,
    rootFolder: FolderManeger,
    day: (typeof days)[number],
    period: number
}) {
    let id = props.timetable.load(props.day, props.period);
    let course: Course | undefined;

    if (id != undefined) {
        course = props.rootFolder.searchCourse(id);
    } else {
        course = undefined;
    }

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
        <td ref={ref} style={{ background: collected.isOver ? "rgba(0, 0, 0, 0.2)" : "white", maxWidth: "12vw" }} className="phalf">
            <div>
                {
                    (course == undefined) ?
                        <div /> :
                        <div className="row-center">
                            <div style={{ overflowWrap: "break-word" }}>
                                {course.id}<br />
                                {course.name}
                            </div>
                            <a href={id2url(course.id).href}>
                                <div className={styles["gg-external"]} />
                            </a>
                        </div>
                }
            </div>
        </td>
    );
}

function TimetableComponent(props: { timetable: TimeTableImpl, rootFolder: FolderManeger }) {
    let table_rows: JSX.Element[] = [];
    table_rows.push(
        <tr key="table-0" style={{ height: "2rem" }}>
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
                            rootFolder={props.rootFolder}
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

function FolderAddForm(props: {
    rootFolder: FolderManeger,
    close: () => void
}) {
    const name_ref = useRef<HTMLInputElement>(null);

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const name_current = name_ref.current;
        if (name_current == null) {
            return false;
        }
        const name = name_current.value;
        props.rootFolder.makeFolder(name);
        return false;
    }
    const label_style: React.CSSProperties = {
        width: "60px"
    }
    const input_style: React.CSSProperties = {

    }
    return <form onSubmit={onSubmit}>
        <p className="row">
            <label style={label_style}>
                name:
            </label>
            <input type="text" ref={name_ref} style={input_style} defaultValue="" />
        </p>
        <div className="posright" >
            <input type="submit" value="Add" className="mr" />
            <button onClick={props.close} className="mr">Close</button>
        </div>
    </form>
}

function CourseAddForm(props: {
    rootFolder: FolderManeger,
    close: () => void
}) {
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
        props.rootFolder.setCourse(
            id,
            {
                id: id,
                name: name
            }
        );
        return false;
    }
    const label_style: React.CSSProperties = {
        width: "60px"
    }
    const input_style: React.CSSProperties = {

    }
    return <form onSubmit={onSubmit}>
        <p className="row">
            <label style={label_style}>
                id:
                            </label>
            <input type="number" min="0" ref={id_ref} style={input_style} defaultValue={0} />
        </p>
        <p className="row">
            <label style={label_style}>
                name:
                            </label>
            <input type="text" ref={name_ref} style={input_style} defaultValue="" />
        </p>
        <div className="posright" >
            <input type="submit" value="Add" className="mr" />
            <button onClick={props.close} className="mr">Close</button>
        </div>
    </form>
}

function CourseModal(props: {
    rootFolder: FolderManeger,
    show: boolean,
    close: () => void
}) {
    let keys = ["Course", "Folder", /* test, */];
    const [selected_key, set_key] = useState(keys[0]);
    const tabs = keys.map(
        (key) => {
            return (
                <div
                    key={key}
                    className={styles["tab"] + " " + ((selected_key == key) ? styles["selected"] : "")}
                    onClick={() => { set_key(key); }}>
                    { key}
                </div>
            );
        }
    )


    let form: JSX.Element;
    if (selected_key == "Course") {
        form = <CourseAddForm
            rootFolder={props.rootFolder}
            close={props.close}
        />
    } else {
        form = <FolderAddForm
            rootFolder={props.rootFolder}
            close={props.close}
        />
    }


    return (
        <div className={props.show ? "modal-body show" : "modal-body"} >
            <div className="card">
                <div className="card-body">
                    <h1 className="content-heading">
                        登録
                    </h1>
                </div>
            </div>

            <div className="card" style={{ height: "246px" }}>
                <div>{tabs}</div>
                <div className="card-body">
                    {form}
                </div>
            </div>
        </div>
    );
}


function CourseComponent(props: {
    folder: FolderManeger,
    course: Course,
    timetable: TimeTableImpl
}) {
    const [drag_collected, drag_ref] = useDrag(() => ({
        item: { type: TYPES.COURSE, id: props.course.id, folder: props.folder }
    }));
    return <div ref={drag_ref} className={styles["course-element"]}>
        <a className={styles["course-link"]} href={id2url(props.course.id).href}>
            {props.course.name}
        </a>
        <div>
            <div></div>
            <div onClick={() => {
                props.folder.removeCourse(props.course.id);
                props.timetable.removeCourse(props.course.id);
            }}>
                <img src={minusIcon} alt="remove course Icon" style={{ height: "1rem", fill: "red" }} />
            </div>
        </div>
    </div>
}

function FolderComponent(props: {
    folderName: string,
    folder: FolderManeger,
    parent?: FolderManeger
    rootFolder: FolderManeger,
    timetable: TimeTableImpl
}) {
    const [open, changeOpen] = useState<boolean>(false);
    const courseIds = props.folder.courseIds();

    const [drag_collected, drag_ref] = useDrag(
        () => ({
            item: {
                type: TYPES.FOLDER,
                folderName: props.folderName,
                folder: props.folder,
                parent: props.parent
            },
            canDrag() {
                return parent != undefined;
            }
        })
    )
    const [drop_collected, drop_ref] = useDrop<
        { type: TYPES.COURSE, id: number, folder: FolderManeger } |
        { type: TYPES.FOLDER, folderName: string, folder: FolderManeger, parent: FolderManeger },
        void,
        { isOver: boolean }
    >(() => ({
        accept: [TYPES.COURSE, TYPES.FOLDER],
        collect(monitor) {
            return {
                isOver: monitor.isOver()
            }
        },
        drop(item, monitor) {
            if (item.type == TYPES.COURSE) {
                if (props.folder != item.folder) {
                    let course = item.folder.removeCourse(item.id, false)!;
                    props.folder.setCourse(item.id, course);
                }
            } else if (item.type == TYPES.FOLDER) {
                if (!item.folder.isDescentFolder(props.folder)) {
                    let folder = item.parent.removeFolder(item.folderName, false)!;
                    props.folder.setFolder(item.folderName, folder);
                }
            }
        }
    }));
    let folderStyle: React.CSSProperties = {};
    if (drop_collected.isOver) {
        folderStyle = { background: "rgba(0, 0, 0, 0.2)" }
    }

    return (

        < div style={folderStyle} >
            <div
                className={styles["folderTitle"]}
                onClick={(event) => { changeOpen(!open); }}
                ref={drop_ref}>
                {open ? "▾" : "▸"}
                <img src={folderIcon} alt="folder icon" style={{ height: "1rem", paddingRight: ".5rem" }} ref={drag_ref} />
                {props.folderName}
                {props.parent != undefined ? <div
                    onClick={() => {
                        if (props.folder.isEmpty()) {
                            props.parent?.removeFolder(props.folderName);
                        }
                    }}
                    style={{ marginLeft: "auto" }}>
                    <img src={minusIcon} alt="remove course Icon" style={{ height: "1rem", fill: "red" }} />
                </div> : null
                }

            </div>
            <div
                className={styles["folderComponent"]}
                style={{ display: open ? "block" : "none" }}
            >
                <div>
                    {props.folder.folderNames().map(
                        (folderName) => <FolderComponent
                            folderName={folderName}
                            folder={props.folder.getFolder(folderName)}
                            rootFolder={props.rootFolder}
                            parent={props.folder}
                            key={folderName}
                            timetable={props.timetable}
                        />)
                    }
                </div>
                <div>
                    {courseIds.map(
                        (id) => {
                            return <CourseComponent
                                folder={props.folder}
                                course={props.folder.getCourse(id)!}
                                timetable={props.timetable}
                                key={id}
                            />
                        }
                    )}
                </div>
            </div>
        </div >
    );

}

function CourseExploreComponent(props: { rootFolder: FolderManeger, timetable: TimeTableImpl }) {
    const [show_modal, setModal] = useState(false);
    let page_wrapper_class: string = "page-wrapper";
    if (show_modal) {
        page_wrapper_class += " show";
    }

    const [collected, ref] = useDrag(() => ({
        item: { type: TYPES.DELCOURSE, id: 0 }
    }));


    return (
        <div className={styles["course-control"] + " slave"}>
            <div className={page_wrapper_class} />
            <CourseModal
                rootFolder={props.rootFolder}
                show={show_modal}
                close={() => { setModal(!show_modal) }}
            />
            <div className={styles["courseExplore"] + " slave-inner"}>
                <div className={styles["course-menu"]}>
                    <div onClick={() => { setModal(!show_modal); }}>
                        <div className="cross" />
                    </div>
                </div>
                <div className={styles["course-element"]} ref={ref}>
                    <div className={styles["course-link"]} >
                        講義無し
                    </div>
                </div>
                <FolderComponent
                    folderName="root"
                    folder={props.rootFolder}
                    rootFolder={props.rootFolder}
                    timetable={props.timetable}
                />
            </div>
        </div>

    );
}

export function TimeTableSection() {
    const [ready_course, rootFolder] = useCourseFolder();
    const [ready_timetable, timetable] = useTimetable();
    const [fontsize, setFontsize] = useState("16");
    return (

        <div className="timetable">
            <span className="text-heading">
                時間割
            </span>
            <br />
            <div className="card-body">
                font size: <input type="range" value={fontsize} min="1" max="50"
                    onChange={(event) => { setFontsize(event.target.value); }}></input> {fontsize}
                <div style={{ fontSize: fontsize + "px" }}>
                    {
                        (ready_course && ready_timetable) ?
                            <div className="row" style={{ alignItems: "flex-start" }}>
                                <div className="mr">
                                    <TimetableComponent timetable={timetable} rootFolder={rootFolder} />
                                </div>
                                <CourseExploreComponent rootFolder={rootFolder} timetable={timetable} />
                            </div> :
                            <Loading />
                    }
                </div>
            </div>
        </div>
    );
}