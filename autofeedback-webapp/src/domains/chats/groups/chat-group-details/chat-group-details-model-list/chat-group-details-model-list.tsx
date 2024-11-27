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
                [Llm.GPT_4, "gpt-4"],
                [Llm.GPT_4_turbo, "gpt-4-turbo"],
                [Llm.GPT_4o, "gpt-4o"],
                [Llm.GPT_4o_mini, "gpt-4o-mini"],
                [Llm.GPT_3_5_turbo, "gpt-3.5-turbo"],
            ])
        );
    }

    const o1ModelMap = () => {
        return removeUsedFromSelection(
            new Map<Llm, string>([
                [Llm.O1_MINI, "o1-mini"],
                [Llm.O1_PREVIEW, "o1-preview"],
            ])
        );
    }

    const claudeModelMap = () => {
        return removeUsedFromSelection(
            new Map<Llm, string>([
                [Llm.CLAUDE_3_HAIKU, "claude-3-haiku"],
                [Llm.CLAUDE_3_SONNET, "claude-3-sonnet"],
                [Llm.CLAUDE_3_OPUS, "claude-3-opus"],
                [Llm.CLAUDE_3_5_HAIKU, "claude-3-5-haiku"],
                [Llm.CLAUDE_3_5_SONNET, "claude-3-5-sonnet"]
            ])
        );
    }

    const llamaModelMap = () => {
        return removeUsedFromSelection(
            new Map<Llm, string>([
                [Llm.LLAMA_3, "llama-3"],
                [Llm.LLAMA_3_1, "llama-3.1"],
                [Llm.LLAMA_3_2, "llama-3.2"],
            ])
        );
    }

    const geminiModelMap = () => {
        return removeUsedFromSelection(
            new Map<Llm, string>([
                [Llm.GEMINI_1_5_FLASH, "gemini-1.5-flash"],
                [Llm.GEMINI_1_5_FLASH_8B, "gemini-1.5-flash-8b"],
                [Llm.GEMINI_1_5_PRO, "gemini-1.5-pro"],
            ])
        );
    }

    const qwenModelMap = () => {
        return removeUsedFromSelection(
            new Map<Llm, string>([
                [Llm.QWEN_2_5_72B_INSTRUCT, "qwen-2.5-72B-instruct"],
                [Llm.QWEN_2_5_CODER_32B_INSTRUCT, "qwen-2.5-coder-32B-instruct"],
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
                <ListItemButton onClick={() => setIsGptListOpen(!isGptListOpen)}>
                    <ListItemIcon>
                        <AutoAwesomeIcon/>
                    </ListItemIcon>
                    <ListItemText primary="GPT" />
                    {isGptListOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={isGptListOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {Array.from(gptModelMap().entries()).map(([key, value]: [Llm, string]) =>
                            <ListItemButton sx={{ pl: 4 }} onClick={() => props.onSelected(key)}>
                                <ListItemText primary={value} />
                            </ListItemButton>
                        )}
                    </List>
                </Collapse>
                <ListItemButton onClick={() => setIsO1ListOpen(!isO1ListOpen)}>
                    <ListItemIcon>
                        <AutoAwesomeIcon/>
                    </ListItemIcon>
                    <ListItemText primary="O1" />
                    {isO1ListOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={isO1ListOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {Array.from(o1ModelMap().entries()).map(([key, value]: [Llm, string]) =>
                            <ListItemButton sx={{ pl: 4 }} onClick={() => props.onSelected(key)}>
                                <ListItemText primary={value} />
                            </ListItemButton>
                        )}
                    </List>
                </Collapse>
                <ListItemButton onClick={() => setIsClaudeListOpen(!isClaudeListOpen)}>
                    <ListItemIcon>
                        <AutoAwesomeIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Claude" />
                    {isClaudeListOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={isClaudeListOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {Array.from(claudeModelMap().entries()).map(([key, value]: [Llm, string]) =>
                            <ListItemButton sx={{ pl: 4 }} onClick={() => props.onSelected(key)}>
                                <ListItemText primary={value} />
                            </ListItemButton>
                        )}
                    </List>
                </Collapse>
                <ListItemButton onClick={() => setIsLlamaListOpen(!isLlamaListOpen)}>
                    <ListItemIcon>
                        <AutoAwesomeIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Llama" />
                    {isLlamaListOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={isLlamaListOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {Array.from(llamaModelMap().entries()).map(([key, value]: [Llm, string]) =>
                            <ListItemButton sx={{ pl: 4 }} onClick={() => props.onSelected(key)}>
                                <ListItemText primary={value} />
                            </ListItemButton>
                        )}
                    </List>
                </Collapse>
                <ListItemButton onClick={() => setIsGeminiListOpen(!isGeminiListOpen)}>
                    <ListItemIcon>
                        <AutoAwesomeIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Gemini" />
                    {isGeminiListOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={isGeminiListOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {Array.from(geminiModelMap().entries()).map(([key, value]: [Llm, string]) =>
                            <ListItemButton sx={{ pl: 4 }} onClick={() => props.onSelected(key)}>
                                <ListItemText primary={value} />
                            </ListItemButton>
                        )}
                    </List>
                </Collapse>
                <ListItemButton onClick={() => setIsQwenListOpen(!isQwenListOpen)}>
                    <ListItemIcon>
                        <AutoAwesomeIcon/>
                    </ListItemIcon>
                    <ListItemText primary="QWEN" />
                    {isQwenListOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={isQwenListOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {Array.from(qwenModelMap().entries()).map(([key, value]: [Llm, string]) =>
                            <ListItemButton sx={{ pl: 4 }} onClick={() => props.onSelected(key)}>
                                <ListItemText primary={value} />
                            </ListItemButton>
                        )}
                    </List>
                </Collapse>
            </List>
        )
    }

    return <></>;
}