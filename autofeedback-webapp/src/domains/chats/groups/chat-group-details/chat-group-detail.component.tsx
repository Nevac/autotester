import './chat-group-detail.component.css';
import {
    Box,
    Divider,
    IconButton,
    Tab,
    Tabs,
    Typography
} from "@mui/material";
import React, {SyntheticEvent, useEffect, useState} from "react";
import PaperDefaultComponent from "../../../util/paper/paper-default.component";
import TabPanel from "../../../util/tab-panel/tab-panel.ts";
import ChatGroupEndpoint from "../chat-group-endpoint";
import {useParams} from "react-router-dom";
import {ChatGroup} from "../chat-group";
import ChatEndpoint from "../../chat-endpoint";
import {ChatListItem} from "../../chat-list-item";
import {Add} from "@mui/icons-material";
import ChatGroupDetailsModelList from "./chat-group-details-model-list/chat-group-details-model-list";
import {Llm} from "../../../llms/llm";
import ChatUpdate from "../../chat-update";
import ChatDetailComponent from "../../chat-detail/chat-detail.component";

export default function ChatGroupDetailComponent() {
    let { id } = useParams();
    const [value, setValue] = useState(0);
    const [chatGroup, setChatGroup] = useState<ChatGroup>();
    const [chats, setChats] = useState<ChatListItem[]>([]);

    const [isModelListOpen, setIsModelListOpen] = useState<boolean>(false);
    const [isGptListOpen, setIsGptListOpen] = useState<boolean>(false);
    const [usedLlms, setUsedLlms] = useState<Set<Llm>>()

    const chatGroupEndpoint = new ChatGroupEndpoint();
    const chatEndpoint = new ChatEndpoint();

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        chatGroupEndpoint.getById(id!).then(chatGroup =>
            setChatGroup(chatGroup)
        );
        chatEndpoint.getListItemsByChatGroupId(id!).then(chats => {
            setUsedLlms(new Set<Llm>(chats.map(chat => chat.model)));
            setChats(chats);
        })
    }, [id]);

    const createChat = (llm: Llm) => {
        chatEndpoint.create(
            new ChatUpdate(
                llm.toString(),
                chatGroup!._id,
                llm
            )
        ).then(result => console.log(result));
    }

    const renderTabHeaders = () => {
        return chats.map((chat, index) =>
            <Tab label={chat.model} value={index}/>
        )
    }

    const renderTabContent = () => {
        return chats.map((chat, index) =>
            <TabPanel value={value} index={index}>
                <ChatDetailComponent chatId={chat._id}/>
            </TabPanel>
        )
    }

    return (
        <PaperDefaultComponent className={'chat-group-detail-paper'}>
            <Typography id="modal-modal-title" variant="h4">
                <div style={{padding: 20}}>
                    {chatGroup?.name}
                </div>
                <Divider/>
            </Typography>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <IconButton aria-label="add" onClick={() => setIsModelListOpen(!isModelListOpen)}>
                        <Add/>
                    </IconButton>
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
        </PaperDefaultComponent>
    )
}