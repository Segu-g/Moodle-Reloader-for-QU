import React from "react";
import styles from "./styles/utils.scss";

export { ToggleSwitch };


type InputProps = JSX.IntrinsicElements["input"];
type Props = {} & InputProps;


function ToggleSwitch(props: Props) {
    const { ...inputProps } = props;
    return (
        <label className={styles["switch"]}>
            <input {...inputProps}/>
            <span className={styles["slider"] + " " + styles["round"]}/>
        </label>
    );
}
