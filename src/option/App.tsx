import React, { useState } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { HashRouter, Switch, Redirect } from 'react-router-dom';
import { pages } from "./Pages";
import { Header } from "./components/Header";

export function App() {
    return (
        <DndProvider backend={HTML5Backend}>
            <HashRouter>
                <Header
                    title="Moodel Reloader for QU"
                    show={false} />
                <div className="dummy-header" />
                <Switch>
                    {pages.map(value => value.element)}
                    <Redirect to="/" />
                </Switch>
            </HashRouter>
        </DndProvider>
    );
}