import './evaluation-group-detail.component.css';
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
import EvaluationGroupEndpoint from "../evaluation-group-endpoint";
import {useParams} from "react-router-dom";
import {EvaluationGroup} from "../evaluation-group";
import {Add, ExpandMore} from "@mui/icons-material";
import {useAppSelector} from "../../../../app/redux-hooks";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";
import {useDispatch} from "react-redux";
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import 'highlight.js/styles/vs2015.css';
import MarkdownX from "../../../util/markdown-x/MarkdownX";

SyntaxHighlighter.registerLanguage('java', java);

export default function EvaluationGroupDetailComponent() {
    let { id } = useParams();
    const [value, setValue] = useState(0);
    const [evaluationGroup, setEvaluationGroup] = useState<EvaluationGroup>();
    const [isCreatingChat, setIsCreatingChat] = useState<boolean>();

    const [isModelListOpen, setIsModelListOpen] = useState<boolean>(false);

    const [openSnackbar, Snackbar] = useSnackbar()
    const dispatch = useDispatch()
    const chatsChanged = useAppSelector(state => state.chatsUpdated.value)

    const evaluationGroupEndpoint = new EvaluationGroupEndpoint();

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const loadChatGroup = () => {
        evaluationGroupEndpoint.getById(id!).then(chatGroup =>
            setEvaluationGroup(chatGroup)
        );
    }

    useEffect(loadChatGroup, [id]);
    useEffect(loadChatGroup, [chatsChanged]);

    return (
        <Box className={'chat-group-detail-box'}>
            <Snackbar/>
            <Typography id="modal-modal-title" variant="h4">
                <div style={{padding: 20}}>
                    {evaluationGroup?.name}
                </div>
                <Divider/>
            </Typography>
            <Box sx={{ width: '100%', padding: '20px'}}>
                TEST
            </Box>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                </Box>
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
