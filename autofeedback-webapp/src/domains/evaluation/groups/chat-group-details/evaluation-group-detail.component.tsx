import './evaluation-group-detail.component.css';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Checkbox,
    Chip,
    Divider,
    FormControl,
    FormControlLabel,
    InputLabel, MenuItem, Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import EvaluationGroupEndpoint from "../evaluation-group-endpoint";
import {useParams} from "react-router-dom";
import {EvaluationGroup} from "../evaluation-group";
import {useAppSelector} from "../../../../app/redux-hooks";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import 'highlight.js/styles/vs2015.css';
import {DataGrid, GridColDef, GridSortingInitialState, GridSortModel, GridToolbar} from "@mui/x-data-grid";
import {Llm} from "../../../llms/llm";
import Paper from "@mui/material/Paper";
import EvaluationEndpoint from "../../evaluation-endpoint";
import {EvaluationListItem} from "../../evaluation-list-item";
import EvaluationGroupLlm from "../llm/evaluation-group-llm";
import {Evaluation} from "../../evaluation";
import ReplayIcon from '@mui/icons-material/Replay';
import {EndpointResponeStatus} from "../../../util/EndpointResponeStatus";
import {useDispatch} from "react-redux";
import {evaluationGroupsUpdateSlice, evaluationGroupUpdateSlice} from "../evaluation-groups-update.slice";
import EvaluationDetailsComponent from "./evaluation-details/evaluation-details.component";

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
    const [evaluation, setEvaluation] = useState<Evaluation>();

    const [selectableLlmStates, setSelectableLlmStates] = useState<SelectableLlmState[]>([]);
    const [selectedLlm, setSelectedLlm] = useState<string>()
    const [selectableEvaluations, setSelectableEvaluations] = useState<EvaluationListItem[]>([]);
    const [selectedEvaluation, setSelectedEvaluation] = useState<string>();

    const [openSnackbar, Snackbar] = useSnackbar()
    const evaluationGroupChanged = useAppSelector(state => state.evaluationGroupUpdated.value)
    const dispatch = useDispatch()

    const evaluationGroupEndpoint = new EvaluationGroupEndpoint();
    const evaluationEndpoint = new EvaluationEndpoint();

    const loadEvaluationGroup = () => {
        evaluationGroupEndpoint.getById(id!).then(evaluationGroup =>
            setEvaluationGroup(evaluationGroup)
        );
    }

    useEffect(loadEvaluationGroup, [id]);
    useEffect(loadEvaluationGroup, [evaluationGroupChanged]);

    useEffect(() => {
        if(evaluationGroup) {
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

    useEffect(() => {
        if(selectedEvaluation) {
            evaluationEndpoint.getById(selectedEvaluation)
                .then(evaluation =>
                    setEvaluation(evaluation)
                )
        }
    }, [selectedEvaluation]);

    const llmColumns: GridColDef[] = [
        { field: 'llm', headerName: 'Llm', width: 200, valueGetter: (value, row) => row.value.llm },
        { field: 'state', headerName: 'State', width: 80, valueGetter: (value, row) => row.value.state },
        { field: 'score', headerName: 'Score', width: 100, valueGetter: (value, row) => row.value.score.total.toFixed(3) },
    ];

    const evaluationColumns: GridColDef[] = [
        { field: 'name', headerName: 'Name', width: 450 },
        { field: 'state', headerName: 'State', width: 80 },
        { field: 'score', headerName: 'Score', width: 100, valueGetter: (value, row) => row.score.toFixed(3) },
    ];

    const initialSorting: GridSortingInitialState = {
        sortModel: [
            {
                field: 'score',
                sort: 'desc'
            }
        ]
    }

    return (
        <Box className={'evaluation-group-detail-box'}>
            <Snackbar/>
            <Typography id="modal-modal-title" variant="h4">
                <div style={{padding: 20}}>
                    {evaluationGroup?.name}
                </div>
                <Divider/>
            </Typography>
            <EvaluationActions/>
            <EvaluationSelection/>
            <EvaluationDetailsComponent evaluation={evaluation}/>
        </Box>
    )

    function EvaluationActions() {
        return (
            <Box style={{display: "flex", flexDirection: "row", gap: 10}} sx={{padding: '10px'}}>
                <Button color={'warning'} variant={'contained'} onClick={retryFailed}>
                    <ReplayIcon/> <Typography>Retry Failed</Typography>
                </Button>
                <Button variant={'contained'} onClick={calculateScore}>
                    <ReplayIcon/> <Typography>Recalculate Score</Typography>
                </Button>
                <Button variant={'contained'} onClick={generateSemanticStatistics}>
                    <ReplayIcon/> <Typography>Regenerate Semantic Statistics</Typography>
                </Button>
            </Box>
        )
    }

    function retryFailed(): void {
        if(evaluationGroup) {
            evaluationGroupEndpoint.retryFailed(evaluationGroup._id)
                .then(state => {
                    if(state == EndpointResponeStatus.SUCCESS) {
                        openSnackbar("Retry for failed evaluations started", SnackbarVariant.SUCCESS);
                    } else openSnackbar("Failed to perform retry", SnackbarVariant.ERROR);
                });
        }
    }

    function calculateScore(): void {
        if(evaluationGroup) {
            evaluationGroupEndpoint.calculateScore(evaluationGroup._id)
                .then(state => {
                    if(state == EndpointResponeStatus.SUCCESS) {
                        openSnackbar("Recalculation Successful", SnackbarVariant.SUCCESS);
                        dispatch(evaluationGroupUpdateSlice.actions.update())
                    } else openSnackbar("Failed to perform retry", SnackbarVariant.ERROR);
                });
        }
    }

    function generateSemanticStatistics(): void {
        if(evaluationGroup) {
            evaluationGroupEndpoint.generateSemanticStatistics(evaluationGroup._id)
                .then(state => {
                    if(state == EndpointResponeStatus.SUCCESS) {
                        openSnackbar("Recalculation Successful", SnackbarVariant.SUCCESS);
                        dispatch(evaluationGroupUpdateSlice.actions.update())
                    } else openSnackbar("Failed to perform retry", SnackbarVariant.ERROR);
                });
        }
    }

    function EvaluationSelection() {
        return (
            <Box className={'evaluation-group-selection-tables-box'}>
                <Box sx={{width: 500, padding: '20px'}}>
                    <Paper sx={{height: 300}}>
                        <DataGrid
                            disableMultipleRowSelection
                            rows={selectableLlmStates}
                            columns={llmColumns}
                            onRowSelectionModelChange={selection => setSelectedLlm(selection[0] as string)}
                            rowSelectionModel={selectedLlm}
                            sx={{border: 0}}
                            initialState={{sorting: initialSorting}}
                            slots={{ toolbar: GridToolbar }}
                            hideFooterSelectedRowCount
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
                            initialState={{sorting: initialSorting}}
                            slots={{ toolbar: GridToolbar }}
                            hideFooterSelectedRowCount
                        />
                    </Paper>
                </Box>
            </Box>
        );
    }
}