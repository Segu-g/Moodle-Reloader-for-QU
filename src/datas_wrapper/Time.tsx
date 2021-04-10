export const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;


export class Time{
    public hours: number;
    public minutes: number;
    constructor(hours: number, minutes: number) {
        this.hours = hours;
        this.minutes = minutes;
    }

    valueOf() {
        return this.hours * 60 + this.minutes;
    }

    add(add_minute: number) {
        let hour = this.hours
        let minute = this.minutes;
        minute += add_minute;
        hour += Math.floor(minute / 60);
        minute %= 60
        return new Time(hour, minute);
    }
}

export interface CourseTime{
    day: number,
    period: number,
}


export const period_times = [
    new Time(6, 50),
    new Time(8, 40),
    new Time(10, 30),
    new Time(13, 0 ),
    new Time(14, 50),
    new Time(16, 40),
    new Time(18, 30),
    new Time(20, 20),
]





