import React, { useState } from "react";

import hamburger from "../../lib/menu.svg";
import { pages } from "../Pages";
import { History } from "history";
import { useHistory } from "react-router-dom";
import styles from "../../styles/header.scss";

export { Header };


function Navigation(props: { setShow: React.Dispatch<React.SetStateAction<boolean>> }) {
    let history = useHistory();
    const nav_items = pages.map(
        page => {
            const handleClick = () => {
                history.push(page.path);
                props.setShow(false);
            };
            return (
                <button
                    key={page.name}
                    onClick={handleClick}
                    className="list-group-item hover-button">
                    <div className="button-item">
                        <img src={page.icon} className="icon" />
                        <div className="font-weight-bold">
                            {page.name}
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


function Header(props: { title: string, show: boolean }) {
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
            <Navigation setShow={setShow} />
        </div>
    </div>
}


