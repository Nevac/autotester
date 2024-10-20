import {Box} from "@mui/material";
import React from "react";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    padding?: number;
}

export default function TabPanel(props: TabPanelProps) {
    const { children, value, index, padding, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{p: padding != undefined ? padding : 2}}>{children}</Box>}
        </div>
    );
}