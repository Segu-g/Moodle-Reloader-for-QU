import { Time } from "../datas_wrapper/Time";


export const OPERATIONS = ["reload", "get"] as const;
export type op = typeof OPERATIONS[number];


export interface message{
    operation: op,
    data?: any
}

export interface reload extends message{
    operation: "reload",
    data: {
        id: number,
        time: Date 
    }
}

export class Message{
    static async send<M, R>(message: M) {
        return new Promise<R>(
            (resolve, reject) => {
                chrome.runtime.sendMessage(
                    message,
                    (respond: R) => {
                        resolve(respond);
                    }
                );
            });
    }
}


export function require_reload(id: number, date: Date){
    const message: reload = {
        operation: "reload",
        data: {
            id: id,
            time: date
        }
    };
    chrome.runtime.sendMessage(
        message,
        () => { }
    );

}