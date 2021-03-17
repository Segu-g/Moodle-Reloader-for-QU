import React from "react";

import icon from "../lib/icon.png";
import home_icon from "../lib/home_icon.svg";
import time_icon from "../lib/time_icon.svg";
import setting_icon from "../lib/setting_icon.svg";


import { Home } from "./Home";
import { Settings } from "./Settings";
import { Schedule } from "./Schedule";

interface PageInfo{
    element: JSX.Element,
    icon: string
}

export interface Pages{
    [page: string]: PageInfo
}

export const pages: Pages = {
    Home: { element: <Home key="Home" />, icon: home_icon },
    Schedule: { element: <Schedule key="Schedule" />, icon: time_icon },
    Settings: { element: <Settings key="Settings" />, icon: setting_icon }
};