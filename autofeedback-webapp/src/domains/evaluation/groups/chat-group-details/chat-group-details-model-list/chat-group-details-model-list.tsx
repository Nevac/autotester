import './chat-group-details-model-list.css';
import {Llm} from "../../../../llms/llm";
import {Collapse, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import React, {useState} from "react";
import useOnClickOutside from "../../../../util/click/on-click-outside-hook";

export interface ChatGroupDetailsModelListProps {
    usedSelection: Set<Llm>,
    isOpen: boolean;
    setIsOpen: (value: boolean) => void,
    onSelected: (value: Llm) => void,
}

export default function ChatGroupDetailsModelList(props: ChatGroupDetailsModelListProps) {

    const [isGptListOpen, setIsGptListOpen] = useState<boolean>(false);
    const [isO1ListOpen, setIsO1ListOpen] = useState<boolean>(false);
    const [isClaudeListOpen, setIsClaudeListOpen] = useState<boolean>(false);
    const [isLlamaListOpen, setIsLlamaListOpen] = useState<boolean>(false);
    const [isGeminiListOpen, setIsGeminiListOpen] = useState<boolean>(false);
    const [isQwenListOpen, setIsQwenListOpen] = useState<boolean>(false);
    const ref = useOnClickOutside(() => props.setIsOpen(false));

    const removeUsedFromSelection = (modelMap: Map<Llm, string>): Map<Llm, string> => {
        props.usedSelection.forEach(selection =>
            modelMap.delete(selection)
        );
        return modelMap;
    }

    const gptModelMap = () => {
        return removeUsedFromSelection(
            new Map<Llm, string>([
                [Llm.GPT_5, Llm.GPT_5.toString()],
                //[Llm.GPT_4o, Llm.GPT_4o.toString()],
            ])
        );
    }

    const o1ModelMap = () => {
        return removeUsedFromSelection(
            new Map<Llm, string>([
                [Llm.O4_MINI, Llm.O4_MINI.toString()],
                [Llm.O3, Llm.O3.toString()],
                [Llm.O1_MINI, "o1-mini"]
            ])
        );
    }

    const claudeModelMap = () => {
        return removeUsedFromSelection(
            new Map<Llm, string>([
                [Llm.CLAUDE_4_1_OPUS, Llm.CLAUDE_4_1_OPUS.toString()],
                //[Llm.CLAUDE_4_SONNET, Llm.CLAUDE_4_SONNET.toString()]
            ])
        );
    }

    const llamaModelMap = () => {
        return removeUsedFromSelection(
            new Map<Llm, string>([
            ])
        );
    }

    const geminiModelMap = () => {
        return removeUsedFromSelection(
            new Map<Llm, string>([
                [Llm.GEMINI_2_5_PRO, Llm.GEMINI_2_5_PRO],
            ])
        );
    }

    if(props.isOpen) {
        return (
            <List
                ref={ref}
                sx={{ position: "absolute", width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Available Large Language Models
                    </ListSubheader>
                }
            >
                <ModelCategoryListItem
                    title={"GPT"}
                    models={gptModelMap()}
                    onSelected={props.onSelected}
                />
                <ModelCategoryListItem
                    title={"O1"}
                    models={o1ModelMap()}
                    onSelected={props.onSelected}
                />
                <ModelCategoryListItem
                    title={"Claude"}
                    models={claudeModelMap()}
                    onSelected={props.onSelected}
                />
                {/*<ModelCategoryListItem*/}
                {/*    title={"Llama"}*/}
                {/*    models={llamaModelMap()}*/}
                {/*    onSelected={props.onSelected}*/}
                {/*/>*/}
                <ModelCategoryListItem
                    title={"Gemini"}
                    models={geminiModelMap()}
                    onSelected={props.onSelected}
                />
            </List>
        )
    }

    return <></>;
}

function ModelCategoryListItem (
    props: {
        title: string,
        models: Map<Llm, string>,
        onSelected: (key: Llm) => void
    }
) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <>
            <ListItemButton key={props.title} onClick={() => setIsOpen(!isOpen)}>
                <ListItemIcon>
                    <AutoAwesomeIcon/>
                </ListItemIcon>
                <ListItemText primary={props.title} />
                {isOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {Array.from(props.models.entries()).map(([key, value]: [Llm, string]) =>
                        <ListItemButton key={key} sx={{ pl: 4 }} onClick={() => props.onSelected(key)}>
                            <ListItemText primary={value} />
                        </ListItemButton>
                    )}
                </List>
            </Collapse>
        </>
    );
}