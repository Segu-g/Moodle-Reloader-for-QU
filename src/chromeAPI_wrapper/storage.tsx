import { time } from "console";
import { rejects } from "node:assert";
import { useState, useReducer, useEffect } from "react";

export class ChromeStorage {
    public static _get<T>(key: string, def_val: T, storage: "local" | "sync" = "local"): Promise<T> {
        let arg_object: { [key: string]: T } = {};
        arg_object[key] = def_val;
        return new Promise<T>((resolve, reject) => {
            if (storage == "local") {
                chrome.storage.local.get(arg_object, (ret: { [key: string]: T }) => { resolve(ret[key]); })
            } else if (storage == "sync") {
                chrome.storage.sync.get(arg_object, (ret: { [key: string]: T }) => { resolve(ret[key]); })
            }
        });
    }
    public static _set<T>(obj: { [key: string]: T }, storage: "local" | "sync" = "local") {
        return new Promise<void>((resolve, reject) => {
            if (storage == "local") {
                chrome.storage.local.set(obj, resolve);
            } else if (storage == "sync") {
                chrome.storage.sync.set(obj, resolve);
            }
        });
    }
    public static _remove(key: string, storage: "local" | "sync" = "local") {
        return new Promise<void>((resolve, reject) => {
            if (storage == "local") {
                chrome.storage.local.remove(key, resolve);
            } else if (storage == "sync") {
                chrome.storage.sync.remove(key, resolve);
            }
        });
    }

    public static cheack_version() {
        return new Promise<number>(
            (resolve, reject) => {
                chrome.storage.local.get(
                    { version: 0 },
                    (ret: { [key: string]: number }) => {
                        resolve(ret.version);
                    }
                )
            }
        );
    }
    public static set_version(version: number) {
        return new Promise<void>(
            (resolve, reject) => {
                chrome.storage.local.set(
                    { version: version },
                    resolve
                )
            }
        )
    }

    public static clear_local() {
        return new Promise<void>((resolve, reject) => {
            chrome.storage.local.clear(resolve);
        });
    }
    public static clear_sync() {
        return new Promise<void>((resolve, reject) => {
            chrome.storage.sync.clear(resolve);
        });
    }

}