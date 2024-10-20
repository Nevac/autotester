import './paper-default.component.css';
import React from "react";
import Paper from "@mui/material/Paper";

export interface PaperDefaultProps {
    children?: React.ReactNode,
    className?: string
}

export default function PaperDefaultComponent(props: PaperDefaultProps) {
    return (
        <Paper className={'paper-default ' + props.className} elevation={20}>
            {props.children}
        </Paper>
    )
}