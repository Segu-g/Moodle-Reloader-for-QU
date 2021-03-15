import React, { useState } from "react";
import { DndProvider} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { pages } from "./Pages";
import { Header } from "./components/Header";

export function App(props: { page: string }) {
    const [page, setPage] = useState(props.page);
    return (
        <DndProvider backend={HTML5Backend}>
            <div>
                <Header
                    title="Moodel Reloader for QU"
                    show={false}
                    setPage={setPage}
                    pages={pages} />
                <div className="dummy-header" />
                {pages[page].element}
            </div>
        </DndProvider> 
    );
}