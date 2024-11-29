import './chat-detail.component.css';
import {useEffect, useState} from "react";
import ChatEndpoint from "../chat-endpoint";
import {Chat} from "../chat";
import Paper from "@mui/material/Paper";
import Markdown from "react-markdown";
import DeleteConfirmButtonComponent from "../../util/delete-confirm-button/delete-confirm-button.component";
import {EndpointResponeStatus} from "../../util/EndpointResponeStatus";
import {SnackbarVariant, useSnackbar} from "../../util/feedback/snackbar-hook";
import {useDispatch} from "react-redux";
import chatUpdateSlice from "../chat-update.slice";

interface ChatDetailComponentProps {
    chatId: string
}

export default function ChatDetailComponent(props: ChatDetailComponentProps) {
    const [chat, setChat] = useState<Chat>();
    const [openSnackbar, Snackbar] = useSnackbar()
    const dispatch = useDispatch()

    const chatEndpoint = new ChatEndpoint();

    useEffect(() => {
        chatEndpoint.getById(props.chatId).then(chat =>
            setChat(chat)
        );
    }, []);


    const deleteChat = () => {
        chatEndpoint.delete(chat!._id)
            .then(state => {
                if(state === EndpointResponeStatus.SUCCESS) {
                    openSnackbar("Chat delete successful", SnackbarVariant.SUCCESS);
                    dispatch(chatUpdateSlice.actions.update());
                } else openSnackbar("Chat delete failed", SnackbarVariant.ERROR)
            });
    }

    return (
        <div className={'chat-detail-main-div'}>
            <Snackbar/>
            <div className={'chat-detail-button-div'}>
                <DeleteConfirmButtonComponent delete={deleteChat}/>
            </div>
            {chat?.feedback.map(feedback =>
                <Paper className={'chat-detail-paper'}>
                    <Markdown>
                        {feedback}
                    </Markdown>
                </Paper>
            )}
        </div>
    )
}