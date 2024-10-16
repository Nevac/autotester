import Paper from "@mui/material/Paper";
import {Box, Tab, Tabs} from "@mui/material";
import React from "react";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


export default function ChatDetailComponent() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Paper elevation={20} style={{flex: 1}}>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="ChatGPT" {...a11yProps(0)} />
                        <Tab label="Gemini" {...a11yProps(1)} />
                        <Tab label="Claude" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    ChatGPT
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    Gemini
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    Claude
                </CustomTabPanel>
            </Box>
        </Paper>
    )
}