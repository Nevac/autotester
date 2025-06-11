import './main-view-side.component.css'
import ChatGroupBrowserComponent from "../../../domains/chats/groups/chat-group-browser/chat-group-browser.component";
import PaperDefaultComponent from "../../../domains/util/paper/paper-default.component";
import React, {useEffect, useState} from "react";
import {Box, Tab, Tabs} from "@mui/material";
import TabPanel from "../../../domains/util/tab-panel/tab-panel.ts";
import ExerciseBrowserComponent from "../../../domains/exercises/exercise-browser/exercise-browser.component";
import PromptGroupBrowserComponent
    from "../../../domains/prompts/groups/prompt-group-browser/prompt-group-browser.component";
import {useLocation} from "react-router-dom";
import AttemptBrowserComponent from "../../../domains/attempts/attempt-browser/attempt-browser.component";

export default function MainViewSideComponent() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const location = useLocation();
    const [selectedItem, setSelectedItem] = useState<string | undefined>(undefined);

    const tabs = new Map<string, number>([
        ["chat-group", 0],
        ["exercise", 1],
        ["prompt-group", 2]
    ]);

    useEffect(() => {
        setValue(
            tabs.get(location.pathname.split("/")[1])!
        );
    }, [location]);

    return (
        <PaperDefaultComponent className={'main-view-side-entity-tabs'}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab style={{flex: 1}} label="Chats"/>
                    <Tab style={{flex: 1}} label="Exercises"/>
                    <Tab style={{flex: 1}} label="Prompts"/>
                    <Tab style={{flex: 1}} label="Attempt"/>
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
            <TabPanel value={value} index={3} padding={0}>
                <AttemptBrowserComponent/>
            </TabPanel>
        </PaperDefaultComponent>
    )
}