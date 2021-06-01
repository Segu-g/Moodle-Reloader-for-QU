import { useEffect, useState, useReducer } from "react";
import { days } from "../datas_wrapper/Time";
import { ChromeStorage } from "../chromeAPI_wrapper/storage";



type timetable_type = { [day in (typeof days)[number]]: Array<number | undefined> };

export class _TimeTableManeger {
    protected timetable: timetable_type;

    constructor(timetable: timetable_type) {
        this.timetable = timetable;
    }

    delete(day: (typeof days)[number], period: number) {
        this.timetable[day][period] = undefined;
    }

    load(day: (typeof days)[number], period: number) {
        return this.timetable[day][period];
    }

    write(day: (typeof days)[number], period: number, id: number) {
        this.timetable[day][period] = id;
    }

    removeCourse(id: number) {
        for (let day of days) {
            for (let period = 0; period < this.timetable[day].length; period++) {
                if (this.timetable[day][period] == id) {
                    this.timetable[day][period] = undefined;
                }
            }
        }
    }
}

export class TimeTableManeger extends _TimeTableManeger {
    save() {
        ChromeStorage._set({ timetable: this.timetable });
    }
    delete(day: (typeof days)[number], period: number) {
        super.delete(day, period);
        this.save();
    }

    write(day: (typeof days)[number], period: number, id: number) {
        super.write(day, period, id);
        this.save();
    }

    removeCourse(id: number) {
        super.removeCourse(id);
        this.save();
    }
}

export async function newTimeTableManeger() {
    return new TimeTableManeger(
        await ChromeStorage._get(
            "timetable",
            days.reduce<timetable_type>(
                (acc, curr) => (acc[curr] = Array(10).fill(undefined), acc),
                Object()
            )
        )
    );
}


export class TimeTableImpl extends _TimeTableManeger {
    private setTimetable: React.Dispatch<React.SetStateAction<timetable_type>>;
    private forceUpdate: React.DispatchWithoutAction;
    constructor(
        timetable: timetable_type,
        setTimetable: React.Dispatch<React.SetStateAction<timetable_type>>
    ) {
        super(timetable)
        const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
        this.forceUpdate = forceUpdate
        this.setTimetable = setTimetable;
    }

    setState() {
        ChromeStorage._set({ timetable: this.timetable });
        this.setTimetable(this.timetable);
        this.forceUpdate();
    }

    delete(day: (typeof days)[number], period: number) {
        super.delete(day, period);
        this.setState();
    }

    write(day: (typeof days)[number], period: number, id: number) {
        super.write(day, period, id);
        this.setState();
    }

    removeCourse(id: number) {
        super.removeCourse(id);
        this.setState();
    }

}

export function useTimetable(): [boolean, TimeTableImpl] {
    const [ready, setReady] = useState(false);
    const [timetable, setTimetable] = useState<timetable_type>(
        days.reduce<timetable_type>((acc, curr) => (acc[curr] = Array(10).fill(undefined), acc), Object())
    );
    useEffect(
        () => {
            async function get_storage_timetable() {
                setTimetable(
                    await ChromeStorage._get<timetable_type>(
                        "timetable",
                        timetable
                    ));
                setReady(true);
            }
            get_storage_timetable();
        },
        []
    );
    return [ready, new TimeTableImpl(timetable, setTimetable)];
}
