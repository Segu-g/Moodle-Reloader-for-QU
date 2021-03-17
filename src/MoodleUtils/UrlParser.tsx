

export const HOSTNAME = "moodle.s.kyushu-u.ac.jp";
    

type PathDict = { [path: string]: string | undefined };


export const PAGETYPES: {[segment: string]: string | undefined}= {
    "login": "LOGIN",
    "": "HOME",
    "course": "COURSE",
    "mod": "MODULE",
    "my": "DASHBORD",
    "calendar": "CALENDAR",
    "admin": "COMPETENCY",
    "badges": "BADGES",
    "blocks": "AUTOATTEND",
    "enrol": "ENROL",
    "user": "PRIVATEFILE",
};


export class QUMoodleURL extends URL {
    public type: string | undefined = undefined;
    public file: string = "";
    private paths: string[] = [];

    constructor(url: string, hostname: string = "moodle.s.kyushu-u.ac.jp") {
        super(url);
        if (this.hostname != hostname) {
            throw new Error("This page is not from the specified host.");
        }
        this.paths = this.pathname.split("/");
        this.type = PAGETYPES[this.paths[1]];
        this.file = this.paths[this.paths.length - 1];
        if (this.file == "") {
            this.file = "index.php"
        }
    }
}


export function id2url(id: number) {
    let url = new URL("https://moodle.s.kyushu-u.ac.jp/course/view.php");
    url.searchParams.append("id", String(id));
    return url;
}

export function is_moodle_url(url: URL){
    return url.hostname == "moodle.s.kyushu-u.ac.jp";
}