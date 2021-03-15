/*!
 * options.js. v2.0.0
 *
 * Copyright (c) 2021 Segu
 * Released under the MIT license.
 * see https://opensource.org/licenses/MIT
 */

import React from "react";
import ReactDOM from "react-dom";
import "../styles/options.scss";
import { App } from "./App";
import { Loading } from "./Loading";
import { ChromeStorage } from "../chromeAPI_wrapper/storage"

export { }
(async () => {
    const root = document.getElementById("root");
    ReactDOM.render(
        <Loading />,
        root
    );
    const version = 2;
    const old_version = await ChromeStorage.cheack_version();
    if (old_version < version) {
        await Promise.all([
            ChromeStorage.clear_sync(),
            ChromeStorage.clear_local()
        ]);
        await ChromeStorage.set_version(version);
    }

    ReactDOM.render(
        <App page="Home" />,
        root
    )
})()







console.log("options.tsx")
