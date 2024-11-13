import './chat-detail.component.css';
import {useEffect, useState} from "react";
import ChatEndpoint from "../chat-endpoint";
import {Chat} from "../chat";
import Paper from "@mui/material/Paper";
import Markdown from "react-markdown";

interface ChatDetailComponentProps {
    chatId: string
}

export default function ChatDetailComponent(props: ChatDetailComponentProps) {
    const [chat, setChat] = useState<Chat>();

    const chatEndpoint = new ChatEndpoint();

    useEffect(() => {
        chatEndpoint.getById(props.chatId).then(chat =>
            setChat(chat)
        );
    }, []);

    return (
        <>
        {chat?.feedback.map(feedback =>
            <Paper className={'chat-detail-paper'}>
                <Markdown>
                    {feedback}
                </Markdown>
            </Paper>
        )}
        </>
    )
}