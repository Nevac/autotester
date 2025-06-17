import './evaluation-group-detail.component.css';
import {
    Accordion, AccordionDetails, AccordionSummary,
    Box,
    Divider,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import EvaluationGroupEndpoint from "../evaluation-group-endpoint";
import {useParams} from "react-router-dom";
import {EvaluationGroup} from "../evaluation-group";
import {Add, ExpandMore} from "@mui/icons-material";
import {useAppSelector} from "../../../../app/redux-hooks";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import 'highlight.js/styles/vs2015.css';
import MarkdownX from "../../../util/markdown-x/MarkdownX";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {Llm} from "../../../llms/llm";
import Paper from "@mui/material/Paper";
import EvaluationEndpoint from "../../evaluation-endpoint";
import {EvaluationListItem} from "../../evaluation-list-item";
import EvaluationGroupLlm from "../llm/evaluation-group-llm";

SyntaxHighlighter.registerLanguage('java', java);

class SelectableLlmState {
    constructor(
        public readonly id: string,
        public readonly value: EvaluationGroupLlm
    ) {

    }
    public static of(state: EvaluationGroupLlm): SelectableLlmState {
        return new SelectableLlmState(
            state.llm.toString(),
            state
        );
    }
}

export default function EvaluationGroupDetailComponent() {
    let { id } = useParams();
    const [evaluationGroup, setEvaluationGroup] = useState<EvaluationGroup>();

    const [selectableLlmStates, setSelectableLlmStates] = useState<SelectableLlmState[]>([]);
    const [selectedLlm, setSelectedLlm] = useState<string>()
    const [selectableEvaluations, setSelectableEvaluations] = useState<EvaluationListItem[]>([]);
    const [selectedEvaluation, setSelectedEvaluation] = useState<string>();

    const [openSnackbar, Snackbar] = useSnackbar()
    const chatsChanged = useAppSelector(state => state.chatsUpdated.value)

    const evaluationGroupEndpoint = new EvaluationGroupEndpoint();
    const evaluationEndpoint = new EvaluationEndpoint();


    const loadChatGroup = () => {
        evaluationGroupEndpoint.getById(id!).then(evaluationGroup =>
            setEvaluationGroup(evaluationGroup)
        );
    }

    useEffect(loadChatGroup, [id]);
    useEffect(loadChatGroup, [chatsChanged]);

    useEffect(() => {
        if(evaluationGroup) {
            console.log(evaluationGroup.llms)
            setSelectableLlmStates(
                Array.from(evaluationGroup.llms.values())
                    .map(state => SelectableLlmState.of(state))
            )
        }
    }, [evaluationGroup]);

    useEffect(() => {
        if(evaluationGroup) {
            evaluationEndpoint.getListItemsByEvaluationGroupId(evaluationGroup!._id, selectedLlm as Llm)
                .then(items =>
                    setSelectableEvaluations(items)
                )
                .catch(err => {
                    openSnackbar("Failed to load evaluation selection", SnackbarVariant.ERROR);
                    console.error(err);
                });

        }
    }, [selectedLlm]);

    const llmColumns: GridColDef[] = [
        { field: 'llm', headerName: 'Llm', width: 200, valueGetter: (value, row) => row.value.llm },
        { field: 'state', headerName: 'State', width: 200, valueGetter: (value, row) => row.value.state },
        { field: 'score', headerName: 'Score', width: 200, valueGetter: (value, row) => row.value.score.totalScore },
    ];

    const evaluationColumns: GridColDef[] = [
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'state', headerName: 'State', width: 200 },
        { field: 'score', headerName: 'Score', width: 200, valueGetter: (value, row) => row.score },
    ];

    return (
        <Box className={'evaluation-group-detail-box'}>
            <Snackbar/>
            <Typography id="modal-modal-title" variant="h4">
                <div style={{padding: 20}}>
                    {evaluationGroup?.name}
                </div>
                <Divider/>
            </Typography>
            <Box className={'evaluation-group-selection-tables-box'}>
                <Box sx={{width: 700, padding: '20px'}}>
                    <Paper sx={{height: 300}}>
                        <DataGrid
                            disableMultipleRowSelection
                            rows={selectableLlmStates}
                            columns={llmColumns}
                            onRowSelectionModelChange={selection => setSelectedLlm(selection[0] as string)}
                            rowSelectionModel={selectedLlm}
                            sx={{border: 0}}
                        />
                    </Paper>
                </Box>
                <Box sx={{width: 700, padding: '20px'}}>
                    <Paper sx={{height: 300}}>
                        <DataGrid
                            disableMultipleRowSelection
                            rows={selectableEvaluations}
                            getRowId={row => row._id}
                            columns={evaluationColumns}
                            onRowSelectionModelChange={selection => setSelectedEvaluation(selection[0] as string)}
                            rowSelectionModel={selectedEvaluation}
                            sx={{border: 0}}
                        />
                    </Paper>
                </Box>
            </Box>
            <Box sx={{ width: '100%', padding: '20px'}}>
                TODO: EVALUATION
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
