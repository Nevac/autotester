import './main-view-side.component.css'
import ChatGroupBrowserComponent from "../../../domains/chats/groups/chat-group-browser/chat-group-browser.component";
import PaperDefaultComponent from "../../../domains/util/paper/paper-default.component";
import React, {ReactNode, useEffect, useState} from "react";
import {Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Tab, Tabs} from "@mui/material";
import TabPanel from "../../../domains/util/tab-panel/tab-panel.ts";
import ExerciseBrowserComponent from "../../../domains/exercises/exercise-browser/exercise-browser.component";
import PromptGroupBrowserComponent
    from "../../../domains/prompts/groups/prompt-group-browser/prompt-group-browser.component";
import {useLocation} from "react-router-dom";
import AttemptBrowserComponent from "../../../domains/attempts/attempt-browser/attempt-browser.component";
import EvaluationGroupBrowserComponent
    from "../../../domains/evaluation/groups/evaluation-group-browser/evaluation-group-browser.component";
import RagBrowserComponent from "../../../domains/rag/groups/rag-browser/rag-browser.component";
import RagDocumentBrowserComponent
    from "../../../domains/rag/document/rag-document-browser/rag-document-browser.component";

export default function MainViewSideComponent() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: SelectChangeEvent<number>, child: ReactNode) => {
        setValue(event.target.value as number);
    };

    const location = useLocation();
    const [selectedItem, setSelectedItem] = useState<string | undefined>(undefined);

    const tabs = new Map<string, number>([
        ["chat-group", 0],
        ["exercise", 1],
        ["prompt-group", 2],
        ["attempt", 3],
        ["evaluation-group", 4],
        ["rag", 5],
        ["rag-document", 6],
    ]);

    useEffect(() => {
        setValue(
            tabs.get(location.pathname.split("/")[1])!
        );
    }, [location]);

    return (
        <PaperDefaultComponent className={'main-view-side-entity-main-container'}>
            <FormControl fullWidth>
                <InputLabel id="entity-select">Entity</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={value}
                    label="Age"
                    onChange={handleChange}
                    defaultValue={0}
                >
                    <MenuItem value={0}>Chats</MenuItem>
                    <MenuItem value={1}>Exercises</MenuItem>
                    <MenuItem value={2}>Prompts</MenuItem>
                    <MenuItem value={3}>Attempt</MenuItem>
                    <MenuItem value={4}>Evaluation</MenuItem>
                    <MenuItem value={5}>RAG</MenuItem>
                    <MenuItem value={6}>RAG Documents</MenuItem>
                </Select>
            </FormControl>
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
            <TabPanel value={value} index={4} padding={0}>
                <EvaluationGroupBrowserComponent/>
            </TabPanel>
            <TabPanel value={value} index={5} padding={0}>
                <RagBrowserComponent/>
            </TabPanel>
            <TabPanel value={value} index={6} padding={0}>
                <RagDocumentBrowserComponent/>
            </TabPanel>
        </PaperDefaultComponent>
    )
}