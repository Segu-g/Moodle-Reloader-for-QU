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
        default:
            console.log("unknown message: " + message.operation);
            sendResponse();
            return;
    }
    sendResponse();
    return;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tb29kbGUtcmVsb2FkZXItZm9yLXF1Ly4vc3JjL01vb2RsZVV0aWxzL1VybFBhcnNlci50c3giLCJ3ZWJwYWNrOi8vbW9vZGxlLXJlbG9hZGVyLWZvci1xdS8uL3NyYy9jaHJvbWVBUElfd3JhcHBlci9zdG9yYWdlLnRzeCIsIndlYnBhY2s6Ly9tb29kbGUtcmVsb2FkZXItZm9yLXF1Ly4vc3JjL2V2ZW50LnRzeCIsIndlYnBhY2s6Ly9tb29kbGUtcmVsb2FkZXItZm9yLXF1L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL21vb2RsZS1yZWxvYWRlci1mb3ItcXUvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFFYSxnQkFBUSxHQUFHLHlCQUF5QixDQUFDO0FBTXJDLGlCQUFTLEdBQTJDO0lBQzdELE9BQU8sRUFBRSxPQUFPO0lBQ2hCLEVBQUUsRUFBRSxNQUFNO0lBQ1YsUUFBUSxFQUFFLFFBQVE7SUFDbEIsS0FBSyxFQUFFLFFBQVE7SUFDZixJQUFJLEVBQUUsVUFBVTtJQUNoQixVQUFVLEVBQUUsVUFBVTtJQUN0QixPQUFPLEVBQUUsWUFBWTtJQUNyQixRQUFRLEVBQUUsUUFBUTtJQUNsQixRQUFRLEVBQUUsWUFBWTtJQUN0QixPQUFPLEVBQUUsT0FBTztJQUNoQixNQUFNLEVBQUUsYUFBYTtDQUN4QixDQUFDO0FBR0YsTUFBYSxXQUFZLFNBQVEsR0FBRztJQUtoQyxZQUFZLEdBQVcsRUFBRSxXQUFtQix5QkFBeUI7UUFDakUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBTFIsU0FBSSxHQUF1QixTQUFTLENBQUM7UUFDckMsU0FBSSxHQUFXLEVBQUUsQ0FBQztRQUNqQixVQUFLLEdBQWEsRUFBRSxDQUFDO1FBSXpCLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxRQUFRLEVBQUU7WUFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1NBQ2hFO1FB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TSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUk7UUFDcEIsTUFBTSxFQUFFLEtBQUs7S0FDaEIsRUFDRCxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ0osTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUN0QixJQUFJLE1BQU0sSUFBSSxTQUFTLEVBQUU7WUFDckIsVUFBVSxDQUNOLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFDLENBQUMsRUFDcEMsSUFBSSxDQUNQO1NBQ0o7SUFDTCxDQUFDLENBQ0osQ0FBQztBQUNOLENBQUM7QUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDOzs7Ozs7O1VDMUZ6QjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVQ3JCQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJldmVudC9ldmVudC5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcblxuZXhwb3J0IGNvbnN0IEhPU1ROQU1FID0gXCJtb29kbGUucy5reXVzaHUtdS5hYy5qcFwiO1xuICAgIFxuXG50eXBlIFBhdGhEaWN0ID0geyBbcGF0aDogc3RyaW5nXTogc3RyaW5nIHwgdW5kZWZpbmVkIH07XG5cblxuZXhwb3J0IGNvbnN0IFBBR0VUWVBFUzoge1tzZWdtZW50OiBzdHJpbmddOiBzdHJpbmcgfCB1bmRlZmluZWR9PSB7XG4gICAgXCJsb2dpblwiOiBcIkxPR0lOXCIsXG4gICAgXCJcIjogXCJIT01FXCIsXG4gICAgXCJjb3Vyc2VcIjogXCJDT1VSU0VcIixcbiAgICBcIm1vZFwiOiBcIk1PRFVMRVwiLFxuICAgIFwibXlcIjogXCJEQVNIQk9SRFwiLFxuICAgIFwiY2FsZW5kYXJcIjogXCJDQUxFTkRBUlwiLFxuICAgIFwiYWRtaW5cIjogXCJDT01QRVRFTkNZXCIsXG4gICAgXCJiYWRnZXNcIjogXCJCQURHRVNcIixcbiAgICBcImJsb2Nrc1wiOiBcIkFVVE9BVFRFTkRcIixcbiAgICBcImVucm9sXCI6IFwiRU5ST0xcIixcbiAgICBcInVzZXJcIjogXCJQUklWQVRFRklMRVwiLFxufTtcblxuXG5leHBvcnQgY2xhc3MgUVVNb29kbGVVUkwgZXh0ZW5kcyBVUkwge1xuICAgIHB1YmxpYyB0eXBlOiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgcHVibGljIGZpbGU6IHN0cmluZyA9IFwiXCI7XG4gICAgcHJpdmF0ZSBwYXRoczogc3RyaW5nW10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCBob3N0bmFtZTogc3RyaW5nID0gXCJtb29kbGUucy5reXVzaHUtdS5hYy5qcFwiKSB7XG4gICAgICAgIHN1cGVyKHVybCk7XG4gICAgICAgIGlmICh0aGlzLmhvc3RuYW1lICE9IGhvc3RuYW1lKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIHBhZ2UgaXMgbm90IGZyb20gdGhlIHNwZWNpZmllZCBob3N0LlwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhdGhzID0gdGhpcy5wYXRobmFtZS5zcGxpdChcIi9cIik7XG4gICAgICAgIHRoaXMudHlwZSA9IFBBR0VUWVBFU1t0aGlzLnBhdGhzWzFdXTtcbiAgICAgICAgdGhpcy5maWxlID0gdGhpcy5wYXRoc1t0aGlzLnBhdGhzLmxlbmd0aCAtIDFdO1xuICAgICAgICBpZiAodGhpcy5maWxlID09IFwiXCIpIHtcbiAgICAgICAgICAgIHRoaXMuZmlsZSA9IFwiaW5kZXgucGhwXCJcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gaWQydXJsKGlkOiBudW1iZXIpIHtcbiAgICBsZXQgdXJsID0gbmV3IFVSTChcImh0dHBzOi8vbW9vZGxlLnMua3l1c2h1LXUuYWMuanAvY291cnNlL3ZpZXcucGhwXCIpO1xuICAgIHVybC5zZWFyY2hQYXJhbXMuYXBwZW5kKFwiaWRcIiwgU3RyaW5nKGlkKSk7XG4gICAgcmV0dXJuIHVybDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzX21vb2RsZV91cmwodXJsOiBVUkwpe1xuICAgIHJldHVybiB1cmwuaG9zdG5hbWUgPT0gXCJtb29kbGUucy5reXVzaHUtdS5hYy5qcFwiO1xufSIsImltcG9ydCB7IHRpbWUgfSBmcm9tIFwiY29uc29sZVwiO1xuaW1wb3J0IHsgcmVqZWN0cyB9IGZyb20gXCJub2RlOmFzc2VydFwiO1xuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZVJlZHVjZXIsIHVzZUVmZmVjdCB9IGZyb20gXCJyZWFjdFwiO1xuXG5leHBvcnQgY2xhc3MgQ2hyb21lU3RvcmFnZXtcbiAgICBwdWJsaWMgc3RhdGljIF9nZXQ8VD4oa2V5OiBzdHJpbmcsIGRlZl92YWw6IFQsIHN0b3JhZ2U6IFwibG9jYWxcInxcInN5bmNcIiA9IFwibG9jYWxcIik6IFByb21pc2U8VD4ge1xuICAgICAgICBsZXQgYXJnX29iamVjdDogeyBba2V5OiBzdHJpbmddOiBUIH0gPSB7fTtcbiAgICAgICAgYXJnX29iamVjdFtrZXldID0gZGVmX3ZhbDtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPFQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGlmIChzdG9yYWdlID09IFwibG9jYWxcIikge1xuICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChhcmdfb2JqZWN0LCAocmV0OiB7IFtrZXk6IHN0cmluZ106IFQgfSkgPT4geyByZXNvbHZlKHJldFtrZXldKTsgfSlcbiAgICAgICAgICAgIH0gZWxzZSBpZihzdG9yYWdlID09IFwic3luY1wiKXtcbiAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChhcmdfb2JqZWN0LCAocmV0OiB7IFtrZXk6IHN0cmluZ106IFQgfSkgPT4geyByZXNvbHZlKHJldFtrZXldKTsgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHB1YmxpYyBzdGF0aWMgX3NldDxUPihvYmo6IHsgW2tleTogc3RyaW5nXTogVCB9LCBzdG9yYWdlOiBcImxvY2FsXCIgfCBcInN5bmNcIiA9IFwibG9jYWxcIikge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgaWYgKHN0b3JhZ2UgPT0gXCJsb2NhbFwiKSB7XG4gICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KG9iaiwgcmVzb2x2ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0b3JhZ2UgPT0gXCJzeW5jXCIpIHtcbiAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldChvYmosIHJlc29sdmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcHVibGljIHN0YXRpYyByZW1vdmUoa2V5OiBcInN0cmluZ1wiLCBzdG9yYWdlOiBcImxvY2FsXCIgfCBcInN5bmNcIiA9IFwibG9jYWxcIikge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgaWYgKHN0b3JhZ2UgPT0gXCJsb2NhbFwiKSB7XG4gICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKGtleSwgcmVzb2x2ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0b3JhZ2UgPT0gXCJzeW5jXCIpIHtcbiAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnJlbW92ZShrZXksIHJlc29sdmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGNoZWFja192ZXJzaW9uKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8bnVtYmVyPihcbiAgICAgICAgICAgIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoXG4gICAgICAgICAgICAgICAgICAgIHsgdmVyc2lvbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICAocmV0OiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJldC52ZXJzaW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG4gICAgcHVibGljIHN0YXRpYyBzZXRfdmVyc2lvbih2ZXJzaW9uOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KFxuICAgICAgICAgICAgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldChcbiAgICAgICAgICAgICAgICAgICAgeyB2ZXJzaW9uOiB2ZXJzaW9uIH0sXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUgICAgIFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgY2xlYXJfbG9jYWwoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5jbGVhcihyZXNvbHZlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHB1YmxpYyBzdGF0aWMgY2xlYXJfc3luYygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuY2xlYXIocmVzb2x2ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufSIsIi8qIVxuICogZXZlbnQuanMuIHYxLjAuMFxuICpcbiAqIENvcHlyaWdodCAoYykgMjAyMCBTZWd1XG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiBzZWUgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcbiAqL1xuaW1wb3J0IHsgSE9TVE5BTUUsIGlkMnVybCB9IGZyb20gXCIuL01vb2RsZVV0aWxzL1VybFBhcnNlclwiO1xuaW1wb3J0IHsgQ2hyb21lU3RvcmFnZSB9IGZyb20gXCIuL2Nocm9tZUFQSV93cmFwcGVyL3N0b3JhZ2VcIjtcbmltcG9ydCB7IG1lc3NhZ2UsIHJlbG9hZCwgcmVxdWlyZV9yZWxvYWQgfSBmcm9tIFwiLi9jaHJvbWVBUElfd3JhcHBlci9tZXNzYWdlXCI7XG5leHBvcnQgeyB9XG5cbmNocm9tZS5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKGFzeW5jIChkZXRhaWxzKSA9PiB7XG4gICAgY29uc3QgdmVyc2lvbiA9IDI7XG4gICAgY29uc3Qgb2xkX3ZlcnNpb24gPSBhd2FpdCBDaHJvbWVTdG9yYWdlLmNoZWFja192ZXJzaW9uKCk7XG4gICAgaWYgKG9sZF92ZXJzaW9uIDwgdmVyc2lvbikge1xuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICBDaHJvbWVTdG9yYWdlLmNsZWFyX3N5bmMoKSxcbiAgICAgICAgICAgIENocm9tZVN0b3JhZ2UuY2xlYXJfbG9jYWwoKVxuICAgICAgICBdKTtcbiAgICAgICAgYXdhaXQgQ2hyb21lU3RvcmFnZS5zZXRfdmVyc2lvbih2ZXJzaW9uKTtcbiAgICB9XG4gICAgcmV0dXJuO1xufSk7XG5cbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihcbiAgICAobWVzc2FnZTogbWVzc2FnZSwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgICAgICAgc3dpdGNoIChtZXNzYWdlLm9wZXJhdGlvbikge1xuICAgICAgICAgICAgY2FzZSBcInJlbG9hZFwiOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0aW1lID0gbmV3IERhdGUobWVzc2FnZS5kYXRhLnRpbWUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlbGF5X21zID0gdGltZS5nZXRUaW1lKCkgLSBub3cuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlbGF5X21pbiA9IChkZWxheV9tcyArIDMwMDAwKSAvIDEwMDAgLyA2MDtcbiAgICAgICAgICAgICAgICBjaHJvbWUuYWxhcm1zLmNyZWF0ZShcbiAgICAgICAgICAgICAgICAgICAgXCJyZWxvYWQtXCJcbiAgICAgICAgICAgICAgICAgICAgKyBTdHJpbmcobWVzc2FnZS5kYXRhLmlkKVxuICAgICAgICAgICAgICAgICAgICArIFwiLVwiXG4gICAgICAgICAgICAgICAgICAgICsgU3RyaW5nKHRpbWUuZ2V0VGltZSgpKSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsYXlJbk1pbnV0ZXM6IGRlbGF5X21pblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImdldFwiOlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInVua25vd24gbWVzc2FnZTogXCIgKyBtZXNzYWdlLm9wZXJhdGlvbik7XG4gICAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIHNlbmRSZXNwb25zZSgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuKTtcblxuY2hyb21lLmFsYXJtcy5vbkFsYXJtLmFkZExpc3RlbmVyKFxuICAgIChhbGFybSkgPT4ge1xuICAgICAgICBjb25zdCBuYW1lID0gYWxhcm0ubmFtZTtcbiAgICAgICAgY29uc3Qgb3BlcmF0aW9uID0gbmFtZS5zcGxpdChcIi1cIilbMF07XG4gICAgICAgIHN3aXRjaCAob3BlcmF0aW9uKSB7XG4gICAgICAgICAgICBjYXNlIFwicmVsb2FkXCI6XG4gICAgICAgICAgICAgICAgY29uc3QgaWQgPSBOdW1iZXIobmFtZS5zcGxpdChcIi1cIilbMV0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRpbWUgPSBOdW1iZXIobmFtZS5zcGxpdChcIi1cIilbMl0pO1xuICAgICAgICAgICAgICAgIHJlbG9hZF9wcm9jZXNzKGlkLCB0aW1lKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbilcblxuXG5mdW5jdGlvbiByZWxvYWRfcHJvY2VzcyhpZDogbnVtYmVyLCB0aW1lOiBudW1iZXIpIHtcbiAgICBjaHJvbWUudGFicy5jcmVhdGUoXG4gICAgICAgIHtcbiAgICAgICAgICAgIHVybDogaWQydXJsKGlkKS5ocmVmLFxuICAgICAgICAgICAgYWN0aXZlOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICAodGFiKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0YWJfaWQgPSB0YWIuaWQ7XG4gICAgICAgICAgICBpZiAodGFiX2lkICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoXG4gICAgICAgICAgICAgICAgICAgICgpID0+IHsgY2hyb21lLnRhYnMucmVtb3ZlKHRhYl9pZCkgfSxcbiAgICAgICAgICAgICAgICAgICAgNTAwMFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICk7XG59XG5cbmNvbnNvbGUubG9nKFwiRXZlbnQudHN4XCIpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvZXZlbnQudHN4XCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==