import './chat-group-detail.component.css';
import {Box, Tab, Tabs} from "@mui/material";
import React, {SyntheticEvent} from "react";
import PaperDefaultComponent from "../../../util/paper/paper-default.component";
import TabPanel from "../../../util/tab-panel/tab-panel.ts";


export default function ChatGroupDetailComponent() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <PaperDefaultComponent className={'chat-detail-paper'}>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="ChatGPT"/>
                        <Tab label="Gemini"/>
                        <Tab label="Claude"/>
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    ChatGPT
                </TabPanel>
                <TabPanel value={value} index={1}>
                    Gemini
                </TabPanel>
                <TabPanel value={value} index={2}>
                    Claude
                </TabPanel>
            </Box>
        </PaperDefaultComponent>
    )
}