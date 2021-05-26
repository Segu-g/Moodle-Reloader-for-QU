import React, { useState, useReducer, useEffect } from "react";
import { ChromeStorage } from "../chromeAPI_wrapper/storage";

export {
    ExtSettingsManeger, newExtSettingManeger,
    ExtSettingsImpl, useExtSettings
};

export interface ExtSettings{
    errorAlert?: boolean
}
    
class _ExtSettingsManeger{
    protected settings: ExtSettings;

    constructor(settings: ExtSettings) {
        this.settings = settings;
    }

    load<T extends keyof ExtSettings>(key: T){
        return this.settings[key];
    }

    write<T extends keyof ExtSettings>(key: T, value: ExtSettings[T]) {
        this.settings[key] = value;
    }
}

class ExtSettingsManeger extends _ExtSettingsManeger{
    private save() {
        ChromeStorage._set({ extSettings: this.settings });
    }

    write<T extends keyof ExtSettings>(key: T, value: ExtSettings[T]) {
        super.write(key, value);
        this.save();
    }
}

async function newExtSettingManeger() {
    const settings = await ChromeStorage._get<ExtSettings>("extSettings", {});
    return new ExtSettingsManeger(settings);
}


class ExtSettingsImpl extends _ExtSettingsManeger {
    private setExtSettings: React.Dispatch<React.SetStateAction<ExtSettings>>;
    private forceUpdate: React.DispatchWithoutAction;

    constructor(settings: ExtSettings, setExtSettings: React.Dispatch<React.SetStateAction<ExtSettings>>) {
        super(settings);
        const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
        this.forceUpdate = forceUpdate;
        this.setExtSettings = setExtSettings;
    }

    private setState() {
        ChromeStorage._set({ extSettings: this.settings });
        this.forceUpdate();
    }

    write<T extends keyof ExtSettings>(key: T, value: ExtSettings[T]) {
        super.write(key, value);
        this.setState();
    }
}

function useExtSettings(): [boolean, ExtSettingsImpl]{
    const [ready, setReady] = useState(false);
    const [settings, setSettings] = useState<ExtSettings>({});
    useEffect(
        () => {
            async function get_storage_settings() {
                setSettings(await ChromeStorage._get<ExtSettings>("extSettings", settings));
                setReady(true);
            }
            get_storage_settings();
        },
        []
    );
    return [ready, new ExtSettingsImpl(settings, setSettings)];
}