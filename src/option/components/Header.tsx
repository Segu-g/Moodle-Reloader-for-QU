import React, { useState } from "react";

import hamburger from "../../lib/menu.svg";
import { Pages } from "../Pages";
import styles from "../../styles/header.scss";

export { Header };


function Navigation(props: { setPage: (page: string) => void, setShow: (show: boolean) => void, pages: Pages }) {
    const nav_items = Object.keys(props.pages).map(
        (page: string) => {
            return (
                <button
                    className="list-group-item hover-button"
                    key={page}
                    onClick={
                        () => {
                            props.setPage(page);
                            props.setShow(false);
                        }
                    }
                >
                    <div className="button-item">
                        <img src={props.pages[page].icon} className="icon" />
                        <div className="font-weight-bold">
                            {page}
                        </div>
                    </div>
                </button>
            );
        }
    );
    return (
        <nav className="list-group">
            {nav_items}
        </nav>
    );
}


function Header(props: { title: string, show: boolean, setPage: (key: string)=>void, pages: Pages }) {
    const [show, setShow] = useState(props.show);
    const header = (
        <div id="header" className="header-bar row-nowrap">
            <button type="button" id="hamburger-menu" className="header-bar-items img-button-wrapper">
                <img src={hamburger}
                    className="svg-img"
                    width="30pt" height="30pt"
                    onClick={() => { setShow(!show) }} />
            </button>
            <div className="title">
                {props.title}
            </div>
        </div>
    );

    let page_wrapper_class: string = "page-wrapper";
    let site_nav_style: string = "site-nav";
    if (show) {
        page_wrapper_class += " show";
        site_nav_style += " show";
    }
    return <div className="fixed">
        {header}
        <div className={page_wrapper_class}></div>
        <div className={site_nav_style}>
            <Navigation setPage={props.setPage} setShow={setShow} pages={ props.pages }/>
        </div>
    </div>
}


