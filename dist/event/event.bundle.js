/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/MoodleUtils/UrlParser.tsx":
/*!***************************************!*\
  !*** ./src/MoodleUtils/UrlParser.tsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.is_moodle_url = exports.id2url = exports.QUMoodleURL = exports.PAGETYPES = exports.HOSTNAME = void 0;
exports.HOSTNAME = "moodle.s.kyushu-u.ac.jp";
exports.PAGETYPES = {
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
class QUMoodleURL extends URL {
    constructor(url, hostname = "moodle.s.kyushu-u.ac.jp") {
        super(url);
        this.type = undefined;
        this.file = "";
        this.paths = [];
        if (this.hostname != hostname) {
            throw new Error("This page is not from the specified host.");
        }
        this.paths = this.pathname.split("/");
        this.type = exports.PAGETYPES[this.paths[1]];
        this.file = this.paths[this.paths.length - 1];
        if (this.file == "") {
            this.file = "index.php";
        }
    }
}
exports.QUMoodleURL = QUMoodleURL;
function id2url(id) {
    let url = new URL("https://moodle.s.kyushu-u.ac.jp/course/view.php");
    url.searchParams.append("id", String(id));
    return url;
}
exports.id2url = id2url;
function is_moodle_url(url) {
    return url.hostname == "moodle.s.kyushu-u.ac.jp";
}
exports.is_moodle_url = is_moodle_url;


/***/ }),

/***/ "./src/chromeAPI_wrapper/storage.tsx":
/*!*******************************************!*\
  !*** ./src/chromeAPI_wrapper/storage.tsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChromeStorage = void 0;
class ChromeStorage {
    static _get(key, def_val, storage = "local") {
        let arg_object = {};
        arg_object[key] = def_val;
        return new Promise((resolve, reject) => {
            if (storage == "local") {
                chrome.storage.local.get(arg_object, (ret) => { resolve(ret[key]); });
            }
            else if (storage == "sync") {
                chrome.storage.sync.get(arg_object, (ret) => { resolve(ret[key]); });
            }
        });
    }
    static _set(obj, storage = "local") {
        return new Promise((resolve, reject) => {
            if (storage == "local") {
                chrome.storage.local.set(obj, resolve);
            }
            else if (storage == "sync") {
                chrome.storage.sync.set(obj, resolve);
            }
        });
    }
    static remove(key, storage = "local") {
        return new Promise((resolve, reject) => {
            if (storage == "local") {
                chrome.storage.local.remove(key, resolve);
            }
            else if (storage == "sync") {
                chrome.storage.sync.remove(key, resolve);
            }
        });
    }
    static cheack_version() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get({ version: 0 }, (ret) => {
                resolve(ret.version);
            });
        });
    }
    static set_version(version) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set({ version: version }, resolve);
        });
    }
    static clear_local() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.clear(resolve);
        });
    }
    static clear_sync() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.clear(resolve);
        });
    }
}
exports.ChromeStorage = ChromeStorage;


/***/ }),

/***/ "./src/event.tsx":
/*!***********************!*\
  !*** ./src/event.tsx ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/*!
 * event.js. v1.0.0
 *
 * Copyright (c) 2020 Segu
 * Released under the MIT license.
 * see https://opensource.org/licenses/MIT
 */
const UrlParser_1 = __webpack_require__(/*! ./MoodleUtils/UrlParser */ "./src/MoodleUtils/UrlParser.tsx");
const storage_1 = __webpack_require__(/*! ./chromeAPI_wrapper/storage */ "./src/chromeAPI_wrapper/storage.tsx");
chrome.runtime.onInstalled.addListener((details) => __awaiter(void 0, void 0, void 0, function* () {
    const version = 2;
    const old_version = yield storage_1.ChromeStorage.cheack_version();
    if (old_version < version) {
        yield Promise.all([
            storage_1.ChromeStorage.clear_sync(),
            storage_1.ChromeStorage.clear_local()
        ]);
        yield storage_1.ChromeStorage.set_version(version);
    }
    return;
}));
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.operation) {
        case "reload":
            console.log(message);
            const now = new Date();
            const time = new Date(message.data.time);
            const delay_ms = time.getTime() - now.getTime();
            const delay_min = (delay_ms + 30000) / 1000 / 60;
            chrome.alarms.create("reload-"
                + String(message.data.id)
                + "-"
                + String(time.getTime()), {
                delayInMinutes: delay_min
            });
            break;
        case "get":
            break;
    }
});
chrome.alarms.onAlarm.addListener((alarm) => {
    const name = alarm.name;
    const operation = name.split("-")[0];
    switch (operation) {
        case "reload":
            const id = Number(name.split("-")[1]);
            const time = Number(name.split("-")[2]);
            reload_process(id, time);
            break;
    }
});
function reload_process(id, time) {
    chrome.tabs.create({
        url: UrlParser_1.id2url(id).href,
        active: false
    }, (tab) => {
        const tab_id = tab.id;
        if (tab_id != undefined) {
            setTimeout(() => { chrome.tabs.remove(tab_id); }, 5000);
        }
    });
}
console.log("Event.tsx");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/event.tsx");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tb29kbGUtcmVsb2FkZXItZm9yLXF1Ly4vc3JjL01vb2RsZVV0aWxzL1VybFBhcnNlci50c3giLCJ3ZWJwYWNrOi8vbW9vZGxlLXJlbG9hZGVyLWZvci1xdS8uL3NyYy9jaHJvbWVBUElfd3JhcHBlci9zdG9yYWdlLnRzeCIsIndlYnBhY2s6Ly9tb29kbGUtcmVsb2FkZXItZm9yLXF1Ly4vc3JjL2V2ZW50LnRzeCIsIndlYnBhY2s6Ly9tb29kbGUtcmVsb2FkZXItZm9yLXF1L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL21vb2RsZS1yZWxvYWRlci1mb3ItcXUvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFFYSxnQkFBUSxHQUFHLHlCQUF5QixDQUFDO0FBTXJDLGlCQUFTLEdBQTJDO0lBQzdELE9BQU8sRUFBRSxPQUFPO0lBQ2hCLEVBQUUsRUFBRSxNQUFNO0lBQ1YsUUFBUSxFQUFFLFFBQVE7SUFDbEIsS0FBSyxFQUFFLFFBQVE7SUFDZixJQUFJLEVBQUUsVUFBVTtJQUNoQixVQUFVLEVBQUUsVUFBVTtJQUN0QixPQUFPLEVBQUUsWUFBWTtJQUNyQixRQUFRLEVBQUUsUUFBUTtJQUNsQixRQUFRLEVBQUUsWUFBWTtJQUN0QixPQUFPLEVBQUUsT0FBTztJQUNoQixNQUFNLEVBQUUsYUFBYTtDQUN4QixDQUFDO0FBR0YsTUFBYSxXQUFZLFNBQVEsR0FBRztJQUtoQyxZQUFZLEdBQVcsRUFBRSxXQUFtQix5QkFBeUI7UUFDakUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBTFIsU0FBSSxHQUF1QixTQUFTLENBQUM7UUFDckMsU0FBSSxHQUFXLEVBQUUsQ0FBQztRQUNqQixVQUFLLEdBQWEsRUFBRSxDQUFDO1FBSXpCLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxRQUFRLEVBQUU7WUFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1NBQ2hFO1FB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SSxNQUFNLElBQUksU0FBUyxFQUFFO1lBQ3JCLFVBQVUsQ0FDTixHQUFHLEVBQUUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBQyxDQUFDLEVBQ3BDLElBQUksQ0FDUDtTQUNKO0lBQ0wsQ0FBQyxDQUNKLENBQUM7QUFDTixDQUFDO0FBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7Ozs7OztVQ25GekI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUNyQkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoiZXZlbnQvZXZlbnQuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5cbmV4cG9ydCBjb25zdCBIT1NUTkFNRSA9IFwibW9vZGxlLnMua3l1c2h1LXUuYWMuanBcIjtcbiAgICBcblxudHlwZSBQYXRoRGljdCA9IHsgW3BhdGg6IHN0cmluZ106IHN0cmluZyB8IHVuZGVmaW5lZCB9O1xuXG5cbmV4cG9ydCBjb25zdCBQQUdFVFlQRVM6IHtbc2VnbWVudDogc3RyaW5nXTogc3RyaW5nIHwgdW5kZWZpbmVkfT0ge1xuICAgIFwibG9naW5cIjogXCJMT0dJTlwiLFxuICAgIFwiXCI6IFwiSE9NRVwiLFxuICAgIFwiY291cnNlXCI6IFwiQ09VUlNFXCIsXG4gICAgXCJtb2RcIjogXCJNT0RVTEVcIixcbiAgICBcIm15XCI6IFwiREFTSEJPUkRcIixcbiAgICBcImNhbGVuZGFyXCI6IFwiQ0FMRU5EQVJcIixcbiAgICBcImFkbWluXCI6IFwiQ09NUEVURU5DWVwiLFxuICAgIFwiYmFkZ2VzXCI6IFwiQkFER0VTXCIsXG4gICAgXCJibG9ja3NcIjogXCJBVVRPQVRURU5EXCIsXG4gICAgXCJlbnJvbFwiOiBcIkVOUk9MXCIsXG4gICAgXCJ1c2VyXCI6IFwiUFJJVkFURUZJTEVcIixcbn07XG5cblxuZXhwb3J0IGNsYXNzIFFVTW9vZGxlVVJMIGV4dGVuZHMgVVJMIHtcbiAgICBwdWJsaWMgdHlwZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgIHB1YmxpYyBmaWxlOiBzdHJpbmcgPSBcIlwiO1xuICAgIHByaXZhdGUgcGF0aHM6IHN0cmluZ1tdID0gW107XG5cbiAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgaG9zdG5hbWU6IHN0cmluZyA9IFwibW9vZGxlLnMua3l1c2h1LXUuYWMuanBcIikge1xuICAgICAgICBzdXBlcih1cmwpO1xuICAgICAgICBpZiAodGhpcy5ob3N0bmFtZSAhPSBob3N0bmFtZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyBwYWdlIGlzIG5vdCBmcm9tIHRoZSBzcGVjaWZpZWQgaG9zdC5cIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYXRocyA9IHRoaXMucGF0aG5hbWUuc3BsaXQoXCIvXCIpO1xuICAgICAgICB0aGlzLnR5cGUgPSBQQUdFVFlQRVNbdGhpcy5wYXRoc1sxXV07XG4gICAgICAgIHRoaXMuZmlsZSA9IHRoaXMucGF0aHNbdGhpcy5wYXRocy5sZW5ndGggLSAxXTtcbiAgICAgICAgaWYgKHRoaXMuZmlsZSA9PSBcIlwiKSB7XG4gICAgICAgICAgICB0aGlzLmZpbGUgPSBcImluZGV4LnBocFwiXG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGlkMnVybChpZDogbnVtYmVyKSB7XG4gICAgbGV0IHVybCA9IG5ldyBVUkwoXCJodHRwczovL21vb2RsZS5zLmt5dXNodS11LmFjLmpwL2NvdXJzZS92aWV3LnBocFwiKTtcbiAgICB1cmwuc2VhcmNoUGFyYW1zLmFwcGVuZChcImlkXCIsIFN0cmluZyhpZCkpO1xuICAgIHJldHVybiB1cmw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc19tb29kbGVfdXJsKHVybDogVVJMKXtcbiAgICByZXR1cm4gdXJsLmhvc3RuYW1lID09IFwibW9vZGxlLnMua3l1c2h1LXUuYWMuanBcIjtcbn0iLCJpbXBvcnQgeyB0aW1lIH0gZnJvbSBcImNvbnNvbGVcIjtcbmltcG9ydCB7IHJlamVjdHMgfSBmcm9tIFwibm9kZTphc3NlcnRcIjtcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VSZWR1Y2VyLCB1c2VFZmZlY3QgfSBmcm9tIFwicmVhY3RcIjtcblxuZXhwb3J0IGNsYXNzIENocm9tZVN0b3JhZ2V7XG4gICAgcHVibGljIHN0YXRpYyBfZ2V0PFQ+KGtleTogc3RyaW5nLCBkZWZfdmFsOiBULCBzdG9yYWdlOiBcImxvY2FsXCJ8XCJzeW5jXCIgPSBcImxvY2FsXCIpOiBQcm9taXNlPFQ+IHtcbiAgICAgICAgbGV0IGFyZ19vYmplY3Q6IHsgW2tleTogc3RyaW5nXTogVCB9ID0ge307XG4gICAgICAgIGFyZ19vYmplY3Rba2V5XSA9IGRlZl92YWw7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxUPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAoc3RvcmFnZSA9PSBcImxvY2FsXCIpIHtcbiAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoYXJnX29iamVjdCwgKHJldDogeyBba2V5OiBzdHJpbmddOiBUIH0pID0+IHsgcmVzb2x2ZShyZXRba2V5XSk7IH0pXG4gICAgICAgICAgICB9IGVsc2UgaWYoc3RvcmFnZSA9PSBcInN5bmNcIil7XG4gICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoYXJnX29iamVjdCwgKHJldDogeyBba2V5OiBzdHJpbmddOiBUIH0pID0+IHsgcmVzb2x2ZShyZXRba2V5XSk7IH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwdWJsaWMgc3RhdGljIF9zZXQ8VD4ob2JqOiB7IFtrZXk6IHN0cmluZ106IFQgfSwgc3RvcmFnZTogXCJsb2NhbFwiIHwgXCJzeW5jXCIgPSBcImxvY2FsXCIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGlmIChzdG9yYWdlID09IFwibG9jYWxcIikge1xuICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldChvYmosIHJlc29sdmUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdG9yYWdlID09IFwic3luY1wiKSB7XG4gICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQob2JqLCByZXNvbHZlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHB1YmxpYyBzdGF0aWMgcmVtb3ZlKGtleTogXCJzdHJpbmdcIiwgc3RvcmFnZTogXCJsb2NhbFwiIHwgXCJzeW5jXCIgPSBcImxvY2FsXCIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGlmIChzdG9yYWdlID09IFwibG9jYWxcIikge1xuICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShrZXksIHJlc29sdmUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdG9yYWdlID09IFwic3luY1wiKSB7XG4gICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5yZW1vdmUoa2V5LCByZXNvbHZlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBjaGVhY2tfdmVyc2lvbigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPG51bWJlcj4oXG4gICAgICAgICAgICAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFxuICAgICAgICAgICAgICAgICAgICB7IHZlcnNpb246IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgKHJldDogeyBba2V5OiBzdHJpbmddOiBudW1iZXIgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXQudmVyc2lvbik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuICAgIHB1YmxpYyBzdGF0aWMgc2V0X3ZlcnNpb24odmVyc2lvbjogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPihcbiAgICAgICAgICAgIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoXG4gICAgICAgICAgICAgICAgICAgIHsgdmVyc2lvbjogdmVyc2lvbiB9LFxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlICAgICBcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGNsZWFyX2xvY2FsKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuY2xlYXIocmVzb2x2ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwdWJsaWMgc3RhdGljIGNsZWFyX3N5bmMoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLmNsZWFyKHJlc29sdmUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn0iLCIvKiFcbiAqIGV2ZW50LmpzLiB2MS4wLjBcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMjAgU2VndVxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogc2VlIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4gKi9cbmltcG9ydCB7IEhPU1ROQU1FLCBpZDJ1cmwgfSBmcm9tIFwiLi9Nb29kbGVVdGlscy9VcmxQYXJzZXJcIjtcbmltcG9ydCB7IENocm9tZVN0b3JhZ2UgfSBmcm9tIFwiLi9jaHJvbWVBUElfd3JhcHBlci9zdG9yYWdlXCI7XG5pbXBvcnQgeyBtZXNzYWdlLCByZWxvYWQsIHJlcXVpcmVfcmVsb2FkIH0gZnJvbSBcIi4vY2hyb21lQVBJX3dyYXBwZXIvbWVzc2FnZVwiO1xuZXhwb3J0IHsgfVxuXG5jaHJvbWUucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcihhc3luYyAoZGV0YWlscykgPT4ge1xuICAgIGNvbnN0IHZlcnNpb24gPSAyO1xuICAgIGNvbnN0IG9sZF92ZXJzaW9uID0gYXdhaXQgQ2hyb21lU3RvcmFnZS5jaGVhY2tfdmVyc2lvbigpO1xuICAgIGlmIChvbGRfdmVyc2lvbiA8IHZlcnNpb24pIHtcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgQ2hyb21lU3RvcmFnZS5jbGVhcl9zeW5jKCksXG4gICAgICAgICAgICBDaHJvbWVTdG9yYWdlLmNsZWFyX2xvY2FsKClcbiAgICAgICAgXSk7XG4gICAgICAgIGF3YWl0IENocm9tZVN0b3JhZ2Uuc2V0X3ZlcnNpb24odmVyc2lvbik7XG4gICAgfVxuICAgIHJldHVybjtcbn0pO1xuXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoXG4gICAgKG1lc3NhZ2U6IG1lc3NhZ2UsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XG4gICAgICAgIHN3aXRjaCAobWVzc2FnZS5vcGVyYXRpb24pIHtcbiAgICAgICAgICAgIGNhc2UgXCJyZWxvYWRcIjpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhtZXNzYWdlKVxuICAgICAgICAgICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGltZSA9IG5ldyBEYXRlKG1lc3NhZ2UuZGF0YS50aW1lKTtcbiAgICAgICAgICAgICAgICBjb25zdCBkZWxheV9tcyA9IHRpbWUuZ2V0VGltZSgpIC0gbm93LmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBkZWxheV9taW4gPSAoZGVsYXlfbXMgKyAzMDAwMCkgLyAxMDAwIC8gNjA7XG4gICAgICAgICAgICAgICAgY2hyb21lLmFsYXJtcy5jcmVhdGUoXG4gICAgICAgICAgICAgICAgICAgIFwicmVsb2FkLVwiXG4gICAgICAgICAgICAgICAgICAgICsgU3RyaW5nKG1lc3NhZ2UuZGF0YS5pZClcbiAgICAgICAgICAgICAgICAgICAgKyBcIi1cIlxuICAgICAgICAgICAgICAgICAgICArIFN0cmluZyh0aW1lLmdldFRpbWUoKSksXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGF5SW5NaW51dGVzOiBkZWxheV9taW5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJnZXRcIjpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbik7XG5cbmNocm9tZS5hbGFybXMub25BbGFybS5hZGRMaXN0ZW5lcihcbiAgICAoYWxhcm0pID0+IHtcbiAgICAgICAgY29uc3QgbmFtZSA9IGFsYXJtLm5hbWU7XG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbiA9IG5hbWUuc3BsaXQoXCItXCIpWzBdO1xuICAgICAgICBzd2l0Y2ggKG9wZXJhdGlvbikge1xuICAgICAgICAgICAgY2FzZSBcInJlbG9hZFwiOlxuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gTnVtYmVyKG5hbWUuc3BsaXQoXCItXCIpWzFdKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0aW1lID0gTnVtYmVyKG5hbWUuc3BsaXQoXCItXCIpWzJdKTtcbiAgICAgICAgICAgICAgICByZWxvYWRfcHJvY2VzcyhpZCwgdGltZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4pXG5cblxuZnVuY3Rpb24gcmVsb2FkX3Byb2Nlc3MoaWQ6IG51bWJlciwgdGltZTogbnVtYmVyKSB7XG4gICAgY2hyb21lLnRhYnMuY3JlYXRlKFxuICAgICAgICB7XG4gICAgICAgICAgICB1cmw6IGlkMnVybChpZCkuaHJlZixcbiAgICAgICAgICAgIGFjdGl2ZTogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgKHRhYikgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGFiX2lkID0gdGFiLmlkO1xuICAgICAgICAgICAgaWYgKHRhYl9pZCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KFxuICAgICAgICAgICAgICAgICAgICAoKSA9PiB7IGNocm9tZS50YWJzLnJlbW92ZSh0YWJfaWQpIH0sXG4gICAgICAgICAgICAgICAgICAgIDUwMDBcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICApO1xufVxuXG5jb25zb2xlLmxvZyhcIkV2ZW50LnRzeFwiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2V2ZW50LnRzeFwiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=