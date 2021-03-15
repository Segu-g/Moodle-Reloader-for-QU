import React from "react";
import { Pages } from "./Pages";
import { Header } from "./components/Header";

function LoadingContent() {
    return (
        <div>
            Loading
        </div>
    );
}

export function Loading() {
    return (
        <div>
            <Header
                title="Moodel Reloader for QU"
                show={false}
                setPage={() => { }}
                pages={{}} />
            <div className="dummy-header" />
            <div className="page-wrapper show"></div>
            <LoadingContent />
        </div>
    );
}