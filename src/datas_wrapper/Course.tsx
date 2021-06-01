import { useEffect, useState, useReducer } from "react";
import { ChromeStorage } from "../chromeAPI_wrapper/storage";


export interface Course {
    id: number;
    name: string;
}


export interface Folder {
    courses: Course[]
    folders: { [courseName: string]: Folder | undefined }
}

export class _FolderManeger {
    courses: Course[]
    folders: { [courseName: string]: Folder | undefined }
    constructor(self: Folder) {
        this.courses = self.courses
        this.folders = self.folders
    }


    hasCourse(id: number) {
        return this.courses.find((element) => element.id == id) != undefined;
    }

    courseIds() {
        return this.courses.map((element) => element.id);
    }

    getCourse(id: number) {
        return this.courses.find(
            (element: Course) => { return element.id == id }
        );;
    }

    getCourseIndex(id: number) {
        return this.courses.findIndex((element) => { return element.id == id });
    }

    setCourse(id: number, course: Course) {
        const index = this.getCourseIndex(id)
        if (index == -1) {
            this.courses.unshift(course);
        } else {
            this.courses[index] = course;
        }
    }

    swapCourses(id0: number, id1: number) {
        let index0 = this.getCourseIndex(id0);
        let index1 = this.getCourseIndex(id1);
        let course0 = this.courses[index0];
        let course1 = this.courses[index1];
        this.courses[index0] = course1;
        this.courses[index1] = course0;
    }

    removeCourse(id: number) {
        const index = this.getCourseIndex(id);
        let course: Course | undefined = undefined;
        if (index != -1) {
            course = this.courses.splice(index, 1)[0];
        }
        return course;
    }

    searchCourse(id: number): Course | undefined {
        if (this.hasCourse(id)) {
            return this.getCourse(id);
        }
        for (let [folderName, folder] of Object.entries(this.folders)) {
            if (folder == undefined) {
                continue;
            }
            let folderManeger = new _FolderManeger(folder);
            let ret = folderManeger.searchCourse(id);
            if (ret != undefined) {
                return ret;
            }
        }
        return undefined;
    }

    hasFolder(folderName: string) {
        return this.folders[folderName] != undefined;
    }

    folderNames() {
        return Object.keys(this.folders).filter(
            (folderName) => {
                return this.folders[folderName] != undefined
            });
    }

    getFolder(name: string) {
        return new _FolderManeger(this.folders[name]!);
    }

    setFolder(folderName: string, folder: Folder) {
        if (!this.hasFolder(folderName)) {
            this.folders[folderName] = folder;
            return true;
        }
        return false;
    }

    renameFolder(fromName: string, toName: string) {
        if (!this.hasFolder(toName)) {
            let folder = this.folders[fromName];
            this.folders[fromName] = undefined;
            this.folders[toName] = folder;
            return true;
        }
        return false;
    }

    removeFolder(folderName: string) {
        let folder = this.folders[folderName];
        this.folders[folderName] = undefined;
        return folder;
    }

    makeFolder(folderName: string) {
        if (!this.hasFolder(folderName)) {
            this.folders[folderName] = { courses: new Array(), folders: Object() };
            return true;
        }
        return false;
    }
}


export class FolderManeger extends _FolderManeger {
    save: () => void
    constructor(self: Folder, save: () => void) {
        super(self);
        this.save = save
    }

    setCourse(id: number, course: Course, update: Boolean = true) {
        super.setCourse(id, course);
        if (update) {
            this.save();
        }
    }

    removeCourse(id: number, update: Boolean = true) {
        let ret = super.removeCourse(id);
        if (update) {
            this.save();
        }
        return ret;
    }

    swapCourses(id0: number, id1: number, update: boolean = true) {
        super.swapCourses(id0, id1);
        if (update) {
            this.save();
        }
    }

    getFolder(name: string) {
        return new FolderManeger(this.folders[name]!, this.save);
    }

    setFolder(folderName: string, folder: Folder, update: Boolean = true) {
        let res = super.setFolder(folderName, folder);
        if (res && update) {
            this.save();
        }
        return res;
    }

    renameFolder(fromName: string, toName: string, update: Boolean = true) {
        let res = super.renameFolder(fromName, toName);
        if (res && update) {
            this.save();
        }
        return res;
    }

    removeFolder(folderName: string, update: Boolean = true) {
        let ret = super.removeFolder(folderName);
        if (update) {
            this.save();
        }
        return ret;
    }

    makeFolder(folderName: string, update: Boolean = true) {
        let res = super.makeFolder(folderName);
        if (res && update) {
            this.save();
        }
        return res;
    }
}






export function useCourseFolder(): [boolean, FolderManeger] {
    const [ready, setReady] = useState(false);
    const [rootFolder, setRoot] = useState<Folder>({ courses: new Array(), folders: Object() });
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    useEffect(
        () => {
            async function get_storage_root() {
                setRoot(await ChromeStorage._get<Folder>("root", rootFolder));
                setReady(true);
            }
            get_storage_root();
        },
        []
    );

    function save() {
        if (ready) {
            ChromeStorage._set({ "root": rootFolder });
            forceUpdate();
        }
    }

    return [ready, new FolderManeger(rootFolder, save)];
}

export async function newCourseFolder() {
    let rowFolder = await ChromeStorage._get<Folder>("root", { courses: new Array(), folders: Object() });
    function save() {
        ChromeStorage._set({ "root": rowFolder });
    }
    return new FolderManeger(rowFolder, save);
}


// export class _CoursesManeger {
//     protected courses: Course[];
//     constructor(courses: Course[]) {
//         this.courses = courses;
//     }

//     length() {
//         return this.courses.length;
//     }

//     load_index(index: number) {
//         return this.courses[index];
//     }

//     delete(id: number) {
//         this.courses = this.courses.filter(
//             (element: Course) => { return element.id != id }
//         );
//     }

//     load(id: number | undefined) {
//         if (id == undefined) {
//             return undefined;
//         }
//         return this.courses.find(
//             (element: Course) => { return element.id == id }
//         );
//     }

//     write(id: number, course: Course) {
//         const index = this.courses.findIndex((element) => { return element.id == id });
//         if (index == -1) {
//             this.courses.unshift(course);
//         } else {
//             this.courses[index] = course;
//         }
//     }

//     ids() {
//         return this.courses.map((value) => { return value.id });
//     }

//     swap(from_id: number, to_id: number) {
//         const from_index = this.courses.findIndex((element) => { return element.id == from_id });
//         const from_course = this.courses[from_index];
//         const to_index = this.courses.findIndex((element) => { return element.id == to_id });
//         const to_course = this.courses[to_index];
//         this.courses[from_index] = to_course;
//         this.courses[to_index] = from_course;
//     }
// }

// export class CoursesManeger extends _CoursesManeger {
//     save() {
//         ChromeStorage._set({ courses: this.courses });
//     };
//     delete(id: number) {
//         super.delete(id);
//         this.save();
//     }
//     write(id: number, course: Course) {
//         super.write(id, course);
//         this.save();
//     }
//     swap(from_id: number, to_id: number) {
//         super.swap(from_id, to_id);
//         this.save();
//     }
// }

// export async function newCoursesManeger() {
//     const courses = await ChromeStorage._get<Course[]>("courses", new Array());
//     return new CoursesManeger(courses);
// }

// export class CoursesImpl extends _CoursesManeger {
//     private setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
//     private forceUpdate: React.DispatchWithoutAction;
//     constructor(courses: Course[], setCourses: React.Dispatch<React.SetStateAction<Course[]>>) {
//         super(courses);
//         const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
//         this.forceUpdate = forceUpdate
//         this.setCourses = setCourses;
//     }

//     private setState() {
//         ChromeStorage._set({ courses: this.courses })
//         this.setCourses(this.courses);
//         this.forceUpdate();
//     }

//     delete(id: number) {
//         super.delete(id);
//         this.setState();
//     }

//     write(id: number, course: Course) {
//         super.write(id, course);
//         this.setState();
//     }

//     swap(from_id: number, to_id: number) {
//         super.swap(from_id, to_id);
//         this.setState();
//     }
// }

// export function useCourses(): [boolean, CoursesImpl] {
//     const [ready, setReady] = useState(false);
//     const [courses, setCourses] = useState<Course[]>(new Array());
//     useEffect(
//         () => {
//             async function get_storage_courses() {
//                 setCourses(await ChromeStorage._get<Course[]>("courses", courses));
//                 setReady(true);
//             }
//             get_storage_courses();
//         },
//         []
//     );
//     return [ready, new CoursesImpl(courses, setCourses)];
// }