import './main-view-side.component.css'
import ChatGroupBrowserComponent from "../../../domains/chats/groups/chat-group-browser/chat-group-browser.component";
import PaperDefaultComponent from "../../../domains/util/paper/paper-default.component";
import React from "react";
import {Box, Tab, Tabs} from "@mui/material";
import TabPanel from "../../../domains/util/tab-panel/tab-panel.ts";
import ExerciseBrowserComponent from "../../../domains/exercises/exercise-browser/exercise-browser.component";
import PromptGroupBrowserComponent
    from "../../../domains/prompts/groups/prompt-group-browser/prompt-group-browser.component";

export default function MainViewSideComponent() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <PaperDefaultComponent className={'main-view-side-entity-tabs'}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab style={{flex: 1}} label="Chats"/>
                    <Tab style={{flex: 1}} label="Exercises"/>
                    <Tab style={{flex: 1}} label="Prompts"/>
                </Tabs>
            </Box>
            <TabPanel value={value} index={0} padding={0}>
                <ChatGroupBrowserComponent/>
            </TabPanel>
            <TabPanel value={value} index={1} padding={0}>
                <ExerciseBrowserComponent/>
            </TabPanel>
            <TabPanel value={value} index={2} padding={0}>
                <PromptGroupBrowserComponent/>
            </TabPanel>
        </PaperDefaultComponent>
    )
}