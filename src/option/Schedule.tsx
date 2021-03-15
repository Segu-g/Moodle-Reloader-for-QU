import React from "react";
import ReactDOM from "react-dom";
import { resolve } from "../../webpack.config";

import {　TimeTableSection } from "./components/Timetable"

import "../styles/content.scss";
/* global: chrome */




export function Schedule() {
    return (
        <div className="content">
            <div className="card">
                <div className="card-body">
                    <h1 className="content-heading">
                        Schedule
                    </h1>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <TimeTableSection />
                </div>
            </div>
        </div>
    );
}