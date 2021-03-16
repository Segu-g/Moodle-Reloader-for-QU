import { useEffect, useState, useReducer } from "react";
import { ChromeStorage } from "../chromeAPI_wrapper/storage";


export interface Course {
    id: number;
    name: string;
}


export class _CoursesManeger {
    protected courses: Course[];
    constructor(courses: Course[]) {
        this.courses = courses;
    }

    length() {
        return this.courses.length;
    }

    load_index(index: number) {
        return this.courses[index];
    }

    delete(id: number) {
        this.courses = this.courses.filter(
            (element: Course) => { return element.id != id }
        );
    }

    load(id: number | undefined) {
        if (id == undefined) {
            return undefined;
        }
        return this.courses.find(
            (element: Course) => { return element.id == id }
        );
    }

    write(id: number, course: Course) {
        const index = this.courses.findIndex((element) => { return element.id == id });
        if (index == -1) {
            this.courses.unshift(course);
        } else {
            this.courses[index] = course;
        }
    }

    ids() {
        return this.courses.map((value) => { return value.id });
    }

    swap(from_id: number, to_id: number) {
        const from_index = this.courses.findIndex((element) => { return element.id == from_id });
        const from_course = this.courses[from_index];
        const to_index = this.courses.findIndex((element) => { return element.id == to_id });
        const to_course = this.courses[to_index];
        this.courses[from_index] = to_course;
        this.courses[to_index] = from_course;
    }
}

export class CoursesManeger extends _CoursesManeger{
    save() {
        ChromeStorage._set({ courses: this.courses });
    };
    delete(id: number) {
        super.delete(id);
        this.save();
    }
    write(id: number, course: Course) {
        super.write(id, course);
        this.save();
    }
    swap(from_id: number, to_id: number) {
        super.swap(from_id, to_id);
        this.save();
    }
}

export async function newCoursesManeger() {
    const courses = await ChromeStorage._get<Course[]>("courses", new Array());
    return new CoursesManeger(courses);
}

export class CoursesImpl extends _CoursesManeger {
    private setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
    private forceUpdate: React.DispatchWithoutAction;
    constructor(courses: Course[], setCourses: React.Dispatch<React.SetStateAction<Course[]>>) {
        super(courses);
        const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
        this.forceUpdate = forceUpdate
        this.setCourses = setCourses;
    }

    private setState() {
        ChromeStorage._set({ courses: this.courses })
        this.setCourses(this.courses);
        this.forceUpdate();
    }

    delete(id: number) {
        super.delete(id);
        this.setState();
    }

    write(id: number, course: Course) {
        super.write(id, course);
        this.setState();
    }

    swap(from_id: number, to_id: number) {
        super.swap(from_id, to_id);
        this.setState();
    }
}

export function useCourses(): [boolean, CoursesImpl] {
    const [ready, setReady] = useState(false);
    const [courses, setCourses] = useState<Course[]>(new Array());
    useEffect(
        () => {
            async function get_storage_courses() {
                setCourses(await ChromeStorage._get<Course[]>("courses", courses));
                setReady(true);
            }
            get_storage_courses();
        },
        []
    );
    return [ready, new CoursesImpl(courses, setCourses)];
}