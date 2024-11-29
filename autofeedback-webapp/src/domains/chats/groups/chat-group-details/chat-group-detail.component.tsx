import './chat-group-detail.component.css';
import {
    Accordion, AccordionDetails, AccordionSummary,
    Box, CircularProgress,
    Divider,
    IconButton,
    Tab,
    Tabs,
    Typography
} from "@mui/material";
import React, {SyntheticEvent, useEffect, useState} from "react";
import TabPanel from "../../../util/tab-panel/tab-panel.ts";
import ChatGroupEndpoint from "../chat-group-endpoint";
import {useParams} from "react-router-dom";
import {ChatGroup} from "../chat-group";
import ChatEndpoint from "../../chat-endpoint";
import {ChatListItem} from "../../chat-list-item";
import {Add, ExpandMore} from "@mui/icons-material";
import ChatGroupDetailsModelList from "./chat-group-details-model-list/chat-group-details-model-list";
import {Llm} from "../../../llms/llm";
import ChatUpdate from "../../chat-update";
import ChatDetailComponent from "../../chat-detail/chat-detail.component";
import {useAppSelector} from "../../../../app/redux-hooks";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";
import {EndpointResponeStatus} from "../../../util/EndpointResponeStatus";
import chatUpdateSlice from "../../chat-update.slice";
import {useDispatch} from "react-redux";
import Markdown from "react-markdown";
import rehypeHighlight from 'rehype-highlight'
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'highlight.js/styles/vs2015.css';
import MarkdownX from "../../../util/markdown-x/MarkdownX";

SyntaxHighlighter.registerLanguage('java', java);

export default function ChatGroupDetailComponent() {
    let { id } = useParams();
    const [value, setValue] = useState(0);
    const [chatGroup, setChatGroup] = useState<ChatGroup>();
    const [chats, setChats] = useState<ChatListItem[]>([]);
    const [isCreatingChat, setIsCreatingChat] = useState<boolean>();

    const [isModelListOpen, setIsModelListOpen] = useState<boolean>(false);
    const [usedLlms, setUsedLlms] = useState<Set<Llm>>()

    const [openSnackbar, Snackbar] = useSnackbar()
    const dispatch = useDispatch()
    const chatsChanged = useAppSelector(state => state.chatsUpdated.value)

    const chatGroupEndpoint = new ChatGroupEndpoint();
    const chatEndpoint = new ChatEndpoint();

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const loadChatGroup = () => {
        chatGroupEndpoint.getById(id!).then(chatGroup =>
            setChatGroup(chatGroup)
        );
        chatEndpoint.getListItemsByChatGroupId(id!).then(chats => {
            setUsedLlms(new Set<Llm>(chats.map(chat => chat.model)));
            setChats(chats);
        })
    }

    useEffect(loadChatGroup, [id]);
    useEffect(loadChatGroup, [chatsChanged]);

    const createChat = (llm: Llm) => {
        setIsModelListOpen(false);
        setIsCreatingChat(true);
        chatEndpoint.create(
            new ChatUpdate(
                llm.toString(),
                chatGroup!._id,
                llm
            )
        ).then(state => {
            setIsCreatingChat(false);
            if(state === EndpointResponeStatus.SUCCESS) {
                openSnackbar("Chat create successful", SnackbarVariant.SUCCESS);
                dispatch(chatUpdateSlice.actions.update());
            } else openSnackbar("Chat create failed", SnackbarVariant.ERROR)
        });
    }

    const renderTabHeaders = () => {
        return chats.map((chat, index) =>
            <Tab label={chat.model} value={index}/>
        )
    }

    const renderTabContent = () => {
        return chats.map((chat, index) =>
            <TabPanel value={value} index={index}>
                <ChatDetailComponent key={chat._id} chatId={chat._id}/>
            </TabPanel>
        )
    }

    const renderAddButton = () => {
        if(isCreatingChat) {
            return (
                <CircularProgress/>
            )
        } else {
            return (
                <IconButton aria-label="add" onClick={() => setIsModelListOpen(!isModelListOpen)}>
                    <Add/>
                </IconButton>
            )
        }
    }

    return (
        <Box className={'chat-group-detail-box'}>
            <Snackbar/>
            <Typography id="modal-modal-title" variant="h4">
                <div style={{padding: 20}}>
                    {chatGroup?.name}
                </div>
                <Divider/>
            </Typography>

            <Box sx={{ width: '100%', padding: '20px'}}>
                <AccordionComponent
                    title={"Task"}
                    id={"task"}
                    content={chatGroup?.exercise.task}
                />
                <AccordionComponent
                    title={"Attempt"}
                    id={"attempt"}
                    content={chatGroup?.attempt}
                />
                <AccordionComponent
                    title={"Solution"}
                    id={"solution"}
                    content={chatGroup?.exercise.solution}
                />
            </Box>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    {renderAddButton()}
                    <ChatGroupDetailsModelList
                        usedSelection={usedLlms!}
                        onSelected={createChat}
                        isOpen={isModelListOpen}
                        setIsOpen={setIsModelListOpen}/>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        {renderTabHeaders()}
                    </Tabs>
                </Box>
                {renderTabContent()}
            </Box>
        </Box>
    )
}

function AccordionComponent (props: {title: string, id: string, content: string | undefined}) {
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore/>}
                aria-controls={`${props.id}-accordion-content`}
                id={`${props.id}-accordion-header`}
            >
                <Typography variant="h5">
                    {props.title}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <MarkdownX>
                    {props.content}
                </MarkdownX>
            </AccordionDetails>
        </Accordion>
    );
}
