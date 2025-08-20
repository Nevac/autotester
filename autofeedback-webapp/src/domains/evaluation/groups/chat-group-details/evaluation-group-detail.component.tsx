import './evaluation-group-detail.component.css';
import {
    Accordion, AccordionDetails, AccordionSummary,
    Box, Button, Chip,
    Divider, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
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
import {DataGrid, GridColDef, GridSortingInitialState, GridSortModel} from "@mui/x-data-grid";
import {Llm} from "../../../llms/llm";
import Paper from "@mui/material/Paper";
import EvaluationEndpoint from "../../evaluation-endpoint";
import {EvaluationListItem} from "../../evaluation-list-item";
import EvaluationGroupLlm from "../llm/evaluation-group-llm";
import {Evaluation} from "../../evaluation";
import EvaluationScore from "../../score/evaluation-score";
import MetricScore from "../../score/metric-score";
import MetricBestHit from "../../score/metric-best-hit";
import EvaluationSemanticStatistic from "../../statistic/evaluation-semantic-statistic";
import MetricOvergenerationScore from "../../score/metric-overgeneration-score";
import Attempt from "../../../attempts/attempt";
import Ast from "../../../ast/ast";
import ReplayIcon from '@mui/icons-material/Replay';
import {EndpointResponeStatus} from "../../../util/EndpointResponeStatus";
import {useDispatch} from "react-redux";
import {evaluationGroupsUpdateSlice, evaluationGroupUpdateSlice} from "../evaluation-groups-update.slice";

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
            <EvaluationDetail evaluation={evaluation}/>
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
                            hideFooterSelectedRowCount
                        />
                    </Paper>
                </Box>
            </Box>
        );
    }

    function EvaluationDetail(props: {evaluation?: Evaluation}) {
        if(evaluation) {
            return (
                <div style={{display: "flex", flexDirection: "column", gap: 10, padding: 10}}>
                    <AttemptDetail attempt={evaluation.attempt}/>
                    <GeneratedFeedback generatedFeedback={evaluation.generatedFeedback}/>
                    <RagDocuments evaluation={evaluation}/>
                    <EvaluationScore evaluation={evaluation}/>
                    <SemanticStatistic semanticStatistic={evaluation.semanticStatistic}/>
                </div>
            )
        }
        return <></>;
    }

    function AttemptDetail(props: {attempt: Attempt}) {
        return (
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMore/>}
                    aria-controls={`attempt-accordion-content`}
                    id={`attempt-accordion-header`}
                >
                    <Typography variant={"h5"}>Attempt</Typography>
                </AccordionSummary>
                <AccordionDetails style={{maxWidth: 1500}}>
                    <MarkdownX>
                        {props.attempt.attempt}
                    </MarkdownX>
                </AccordionDetails>
            </Accordion>
        )
    }

    function GeneratedFeedback(props: {generatedFeedback: string}) {
        return (
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMore/>}
                    aria-controls={`generated-feedback-accordion-content`}
                    id={`generated-feedback-accordion-header`}
                >
                    <Typography variant={"h5"}>Generated Feedback</Typography>
                </AccordionSummary>
                <AccordionDetails style={{maxWidth: 1500}}>
                    <MarkdownX>
                        {props.generatedFeedback}
                    </MarkdownX>
                </AccordionDetails>
            </Accordion>
        )
    }

    function RagDocuments(props: {evaluation: Evaluation }) {
        const ragDocuments = props.evaluation.ragDocuments;
        const ast = props.evaluation.ast;

        if(ragDocuments) {
            return (
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMore/>}
                        aria-controls={`generated-feedback-accordion-content`}
                        id={`generated-feedback-accordion-header`}
                    >
                        <Typography variant={"h5"}>RagDocuments</Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{maxWidth: 1500}}>
                        <div style={{display: "flex", flexDirection: "column", gap: 10, padding: 10}}>
                            <Ast ast={ast}/>
                            {ragDocuments.map(ragDocument =>
                                <Paper elevation={10} style={{padding: 10}}>
                                    <Stack direction="row" spacing={1}>
                                        <Chip label={`id: ${ragDocument.id}`} size="small"/>
                                        <Chip label={`language: ${ragDocument.language}`} size="small"/>
                                        <Chip label={`category: ${ragDocument.category}`} size="small"/>
                                        <Chip label={`topic: ${ragDocument.topic}`} size="small"/>
                                        <Chip label={`type: ${ragDocument.type}`} size="small"/>
                                        <Chip label={`constructs: ${ragDocument.constructs}`} size="small"/>
                                    </Stack>
                                    <MarkdownX>
                                        {ragDocument.text.replace(/\\n/g, '\n')}
                                    </MarkdownX>
                                </Paper>
                            )}
                        </div>
                    </AccordionDetails>
                </Accordion>
            );
        } else {
            return (<></>);
        }
    }

    function Ast(props: {ast: Ast}) {
        const ast = props.ast;

        if(ast) {
            return (
                <div style={{display: "flex", flexDirection: "column", gap: 10, padding: 10}}>
                    <div>
                        <Typography fontWeight={'bold'}>Contructs</Typography>
                        <Stack direction="row" spacing={1}>
                            {ast.constructs.map(construct =>
                                <Chip label={construct} size="small"/>
                            )}
                        </Stack>
                    </div>
                </div>
            );
        } else {
            return (<></>);
        }
    }

    function SemanticStatistic(props: { semanticStatistic: EvaluationSemanticStatistic }) {
        return (
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMore/>}
                    aria-controls={`semantic-statistic-accordion-content`}
                    id={`semantic-statistic-accordion-header`}
                >
                    <Typography variant={"h5"}>Semantic Statistics</Typography>
                </AccordionSummary>
                <AccordionDetails style={{maxWidth: 1500}}>
                    <MarkdownX>
                        ```json
                        {JSON.stringify(props.semanticStatistic, null, 2)}
                        ```
                    </MarkdownX>
                </AccordionDetails>
            </Accordion>
        )
    }

    function EvaluationScore(props: { evaluation: Evaluation }) {
        if (evaluation?.score) {
            return (
                <div style={{display: "flex", gap: 10}}>
                    <ScoreTable score={evaluation.score}/>
                    <Accordion style={{flex: 1}}>
                        <AccordionSummary
                            expandIcon={<ExpandMore/>}
                            aria-controls={`evaluation-score-accordion-content`}
                            id={`evaluation-score-accordion-header`}
                        >
                            <Typography variant="h5">
                                Score
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div style={{display: "flex", flexDirection: "row", gap: 20}}>
                                <MetricScores evaluationScore={evaluation.score}/>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
            )
        }
        return <></>;
    }

    function ScoreTable(props: {score: EvaluationScore}) {
        return(
            <Paper elevation={3}>
                <TableContainer>
                    <Table size={"small"} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography align="right" fontWeight={"bold"}>Metric</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography align="right" fontWeight={"bold"}>Score</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell align="right">Correctness</TableCell>
                                <TableCell align="right">{props.score.correctness.score}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="right">Suggestion</TableCell>
                                <TableCell align="right">{props.score.suggestion.score}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="right">Code Style</TableCell>
                                <TableCell align="right">{props.score.codeStyle.score}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="right">Overgeneration</TableCell>
                                <TableCell align="right">{props.score.overgeneration.score}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="right">Total</TableCell>
                                <TableCell align="right">{props.score.total.toFixed(3)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        )
    }

    function MetricScores(props: {evaluationScore: EvaluationScore}) {
        return (
            <div style={{flex: 1, display: "flex", gap: 10, flexDirection: "column"}}>
                <MetricScore title={"Correctness"} metricScore={evaluation!.score.correctness}/>
                <MetricScore title={"Suggestion"} metricScore={evaluation!.score.suggestion}/>
                <MetricScore title={"Code Style"} metricScore={evaluation!.score.codeStyle}/>
                <MetricOvergenerationScore metricOvergenerationScore={evaluation!.score.overgeneration}/>
            </div>
        )
    }

    function MetricScore(props: {title: string, metricScore: MetricScore}) {
        return (
            <Paper elevation={3} style={{padding: 10}}>
                <Typography variant={"h5"}>{props.title}</Typography>
                {props.metricScore.bestHits.map(bestHit => {
                    if(bestHit) {
                        return <BestHit key={bestHit.id} bestHit={bestHit}/>
                    } else return <></>
                }
                )}
            </Paper>
        );
    }

    function MetricOvergenerationScore(props: {metricOvergenerationScore: MetricOvergenerationScore}) {
        return (
            <Paper elevation={3} style={{padding: 10}}>
                <Typography variant={"h5"}>Overgenerations</Typography>
                <div style={{display: "flex", flexDirection: "column", gap: 10, padding: 10}}>
                    {props.metricOvergenerationScore.overgenerations.map(overgenration =>
                        <Paper elevation={10} style={{padding: 10}}>
                            <Typography>{overgenration.sentence}</Typography>
                        </Paper>
                    )}
                </div>
            </Paper>
    );
    }

    function BestHit(props: {
        bestHit: MetricBestHit
    }) {
        return (
            <div style={{display: "flex", flexDirection: "column", gap: 10, padding: 10}}>
                <Paper elevation={10} style={{padding: 10}}>
                    <Typography variant={"h6"} fontWeight={"bold"}>{props.bestHit.id}</Typography>
                    <Typography>Semantic Similarity: {props.bestHit.similarityScore.toFixed(4)}</Typography>
                </Paper>
                <div style={{display: "flex", flexDirection: "row", gap: 10}}>
                    <Paper elevation={10} style={{padding: 10, flex: 1}}>
                        <Typography variant={"h6"}>Expected</Typography>
                        <MarkdownX>
                            {props.bestHit.expectedSentence}
                        </MarkdownX>
                    </Paper>
                    <Paper elevation={10} style={{padding: 10, flex: 1}}>
                        <Typography variant={"h6"}>Generated</Typography>
                        <MarkdownX>
                            {props.bestHit.generatedSentence}
                        </MarkdownX>
                    </Paper>
                </div>
            </div>
        );
    }
}