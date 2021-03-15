import { TimeTableManeger } from "./TimeTable";
import { days, period_times, Time,  CourseTime } from "./Time";
import { time } from "node:console";

function next_period() {
    const date = new Date();
    const now = new Time(date.getHours(), date.getMinutes());
    let period = 0;
    for (; period < period_times.length; period++) {
        if (now < period_times[period]) {
            break;
        }
    }
    return period;
}


export function get_next_courses(n: number, timetable: TimeTableManeger) {
    let ans: { id: number, time: CourseTime }[] = [];
    const date = new Date();
    const now_day = date.getDay();
    const next = next_period();
    for (var i = 0; i < days.length * period_times.length; i++) {
        if (ans.length == n) {
            break;
        }
        let day_index = (now_day + Math.floor((i + next) / period_times.length)) % days.length
        let day = days[day_index];
        let period = (next + i) % period_times.length;
        let id = timetable.load(day, period);
        if (id != undefined) {
            ans.push({
                id: id,
                time: {
                    day: day_index,
                    period: period
                }
            });
        }
    }
    return ans;
}


function get_current_period() {
    let ret_list: number[] = []
    const now = new Date();
    const now_time = new Time(now.getHours(), now.getMinutes());
    for (let i = 0; i < period_times.length; i++){
        if (period_times[i] <= now_time &&
            now_time < period_times[i].add(90)) {
            ret_list.push(i);
        }
    }
    return ret_list;
}

export function get_current_course(timetable: TimeTableManeger) {
    const periods = get_current_period();
    const now = new Date();
    if (periods.length == 0) {
        return undefined;
    }
    return timetable.load(days[now.getDay()], periods[0]);
}