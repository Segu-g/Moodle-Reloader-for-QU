import React from "react";

import icon from "../lib/icon.png";
import home_icon from "../lib/home_icon.svg";
import time_icon from "../lib/time_icon.svg";
import setting_icon from "../lib/setting_icon.svg";
import usage_icon from "../lib/question_mark.svg";
import { Route } from 'react-router-dom';

import { Home } from "./Home";
import { Settings } from "./Settings";
import { Schedule } from "./Schedule";
import { Usage } from "./Usage";


interface Page {
    name: string,
    path: string,
    element: JSX.Element,
    icon: string
}

export type Pages = Page[]

export const pages: Pages = [
    { name: "Home", path: "/", element: <Route path="/" key="Home" exact component={Home} />, icon: home_icon },
    { name: "Schedule", path: "/schedule", element: <Route path="/schedule" key="Schedule" component={Schedule} />, icon: time_icon },
    { name: "Settings", path: "/settings", element: <Route path="/settings" key="Settings" component={Settings} />, icon: setting_icon },
    { name: "Usage", path: "/usage", element: <Route path={"/usage"} key="Usage" component={Usage} />, icon: usage_icon }
];