import './evaluation-detail.component.css';
import {useEffect, useState} from "react";
import EvaluationEndpoint from "../evaluation-endpoint";
import {Evaluation} from "../evaluation";
import Paper from "@mui/material/Paper";
import Markdown from "react-markdown";
import DeleteConfirmButtonComponent from "../../util/delete-confirm-button/delete-confirm-button.component";
import {EndpointResponeStatus} from "../../util/EndpointResponeStatus";
import {SnackbarVariant, useSnackbar} from "../../util/feedback/snackbar-hook";
import {useDispatch} from "react-redux";
import evaluationUpdateSlice from "../evaluation-update.slice";

interface ChatDetailComponentProps {
    chatId: string
}

export default function EvaluationDetailComponent(props: ChatDetailComponentProps) {
    // const [chat, setChat] = useState<Evaluation>();
    // const [openSnackbar, Snackbar] = useSnackbar()
    // const dispatch = useDispatch()
    //
    // const chatEndpoint = new EvaluationEndpoint();
    //
    // useEffect(() => {
    //     chatEndpoint.getById(props.chatId).then(chat =>
    //         setChat(chat)
    //     );
    // }, []);
    //
    //
    // const deleteChat = () => {
    //     chatEndpoint.delete(chat!._id)
    //         .then(state => {
    //             if(state === EndpointResponeStatus.SUCCESS) {
    //                 openSnackbar("Evaluation delete successful", SnackbarVariant.SUCCESS);
    //                 dispatch(evaluationUpdateSlice.actions.update());
    //             } else openSnackbar("Evaluation delete failed", SnackbarVariant.ERROR)
    //         });
    // }

    return (
        <div className={'chat-detail-main-div'}>
            {/*<Snackbar/>*/}
            {/*<div className={'chat-detail-button-div'}>*/}
            {/*    <DeleteConfirmButtonComponent delete={deleteChat}/>*/}
            {/*</div>*/}
            {/*{chat?.feedback.map((feedback, index) =>*/}
            {/*    <Paper key={index} className={'chat-detail-paper'}>*/}
            {/*        <Markdown>*/}
            {/*            {feedback}*/}
            {/*        </Markdown>*/}
            {/*    </Paper>*/}
            {/*)}*/}
        </div>
    )
}