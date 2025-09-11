import './evaluation-group-statistics.component.css';
import React, {useEffect, useState} from "react";
import {Bar} from "react-chartjs-2";
import {BarElement, CategoryScale, Chart, Legend, LinearScale, Title, Tooltip} from "chart.js";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Divider,
    FormControl,
    MenuItem,
    TextField,
    Typography
} from "@mui/material";
import ChartDataLabels from "chartjs-plugin-datalabels";
import useInputValue from "../../../util/forms/input-value-hook";
import useFormValidationHook from "../../../util/forms/form-validation-hook";
import EvaluationGroupListItem from "../evaluation-group-list-item";
import EvaluationGroupEndpoint from "../evaluation-group-endpoint";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";
import Paper from "@mui/material/Paper";
import {DataGrid, GridColDef, GridToolbar} from "@mui/x-data-grid";
import EvaluationGroupStatistic from "./statistic/evaluation-group-statistic";
import ScoreDelta from "./statistic/score-delta";
import ScoreDeltaData from "./statistic/score-delta-data";
import StatisticColors from "./statistic-colors";
import ScoreRanking from "./statistic/ranking/score-ranking";
import ScoreRankings from "./statistic/ranking/score-rankings";
import ScoreRankingEntry from "./statistic/ranking/score-ranking-entry";
import ScoreRankingAverage from "./statistic/ranking/score-ranking-average";
import {ExpandMore} from "@mui/icons-material";
import MarkdownX from "../../../util/markdown-x/MarkdownX";
import AttemptScoreEntry from "./statistic/attempt/attempt-score-entry";

Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

Chart.defaults.backgroundColor = '#9BD0F5';
Chart.defaults.borderColor = '#65696f';
Chart.defaults.color = '#fff';

export const options = (title: string) => {
    return {
        responsive: true,
        layout: { padding: { top: 24 } }, // gives labels room above bars
        plugins: {
            legend: { position: 'top' as const },
            title: { display: true, font: {size: 30}, text: title },
            datalabels: {
                anchor: 'end',
                align: 'top',
                offset: 4,
                formatter: (v: number) => `${v.toFixed(3)}`, // your data is 0..1; show as %
                font: { weight: 'bold' },
                color: '#fff',
                clamp: true, // keeps labels inside chart area if they would overflow
            },
        },
        scales: {
            y: { beginAtZero: true },
        },
    } as const;
}



export default function EvaluationGroupStatisticsComponent() {

    const evaluationGroupsCompareInput = useInputValue<string[]>([], {required: true});
    const evaluationGroupsBaseInput = useInputValue<string>(undefined, {required: true});
    const isFormValid = useFormValidationHook([
        evaluationGroupsCompareInput,
    ]);
    const [selectableEvaluationGroups, setSelectableEvaluationGroups] = useState<EvaluationGroupListItem[]>([]);
    const [selectableEvaluationGroupsCompare, setSelectableEvaluationGroupsCompare] = useState<EvaluationGroupListItem[]>([]);
    const [evaluationGroupStatistics, setEvaluationGroupStatistics] = useState<EvaluationGroupStatistic>();
    const evaluationGroupEndpoint = new EvaluationGroupEndpoint();
    const [openSnackbar, Snackbar] = useSnackbar();

    useEffect(() => {
        evaluationGroupEndpoint.getListItems()
            .then(items => {
                setSelectableEvaluationGroups(items);
            })
            .catch(err => {
                openSnackbar("Failed to load Evaluation Group selection", SnackbarVariant.ERROR);
                console.error(err);
            });
    }, []);

    useEffect(() => {
        const baseEvaluation = evaluationGroupsBaseInput.value;
        if(baseEvaluation) {
            const selectableCompare = [...selectableEvaluationGroups]
                .filter(evaluationGroup => evaluationGroup._id !== baseEvaluation);
            setSelectableEvaluationGroupsCompare(selectableCompare);
        }
    }, [evaluationGroupsBaseInput.value]);

    return (
        <Box className={"evaluation-group-statistics-box"}>
            <Typography id="modal-modal-title" variant="h4">
                <div style={{padding: 20}}>
                    Generate Evaluation Statistic
                </div>
                <Divider/>
            </Typography>
            <Box className={'evaluation-group-export-modal-paper'} sx={{padding: "20px"}}>
                <EvaluationGroupSelectionComponent/>
                <RankingTablesComponent/>
                <AverageAttemptScoresComponent/>
                <EvaluationStatisticsComponent/>
            </Box>
        </Box>
    );

    function EvaluationGroupSelectionComponent() {
        const evaluationGroupColumns: GridColDef[] = [
            {field: 'name', headerName: 'Name', width: 400},
        ];
        function generateStatistics() {
            //setEvaluationGroupStatistics(generateDummyEvaluationStatistics())
            evaluationGroupEndpoint.statistics(
                evaluationGroupsBaseInput.valueOrThrow(),
                evaluationGroupsCompareInput.valueOrThrow()
            ).then(statistics => {
                console.log(statistics);
                setEvaluationGroupStatistics(statistics);
            }
            ).catch(err => {
                    openSnackbar("Could not generate statistics", SnackbarVariant.ERROR);
                    console.log(err);
            });
        }
        return (
            <div style={{display: "flex", flexDirection: "column", gap: 40}}>
                <Snackbar/>
                <div className={'evaluation-group-export-modal-text-area-container'}>
                    <FormControl fullWidth>
                        <TextField
                            select
                            id="exercise-label"
                            value={evaluationGroupsBaseInput.value}
                            label="Base Evaluation"
                            onChange={evaluationGroupsBaseInput.handleChange}
                            required
                            error={evaluationGroupsBaseInput.error}
                        >
                            {selectableEvaluationGroups.map(evaluationGroup =>
                                <MenuItem value={evaluationGroup._id}>{evaluationGroup.name}</MenuItem>
                            )}
                        </TextField>
                    </FormControl>
                    <FormControl fullWidth>
                        <Paper sx={{height: 600, width: '100%'}}>
                            <DataGrid
                                rows={selectableEvaluationGroupsCompare}
                                getRowId={row => row._id}
                                columns={evaluationGroupColumns}
                                checkboxSelection
                                onRowSelectionModelChange={selection => evaluationGroupsCompareInput.setRawValue(selection.map(String))}
                                rowSelectionModel={evaluationGroupsCompareInput.value}
                                sx={{border: 0}}
                            />
                        </Paper>
                    </FormControl>
                </div>
                <Button variant={"contained"} onClick={generateStatistics} disabled={!isFormValid}>
                    Generate
                </Button>
            </div>
        )
    }

    function RankingTablesComponent() {
        if(evaluationGroupStatistics) {
            return (
                <>
                    <AverageScoreRankingComponent ranking={evaluationGroupStatistics.rankings.rankingAverage}/>
                    <ScoreRankingComponent ranking={evaluationGroupStatistics.rankings.rankingBase}/>
                    {evaluationGroupStatistics.rankings.rankingCompares.map(ranking =>
                        <ScoreRankingComponent ranking={ranking}/>
                    )}
                </>
            );
        } else return <></>;
    }


    function AverageScoreRankingComponent(props: {ranking: ScoreRankingAverage}) {
        return (
            <RankingTableComponent title={"Durchschnitt"} entries={props.ranking.rankings}/>
        )
    }

    function ScoreRankingComponent(props: {ranking: ScoreRanking}) {
        return (
            <RankingTableComponent title={props.ranking.evaluationGroup.name} entries={props.ranking.rankings}/>
        )
    }

    function RankingTableComponent(props: {title: string, entries: ScoreRankingEntry[]}) {
        const colWidht = 120;
        const rankingGroupColumns: GridColDef[] = [
            {field: 'llm', headerName: 'Llm', width: 250},
            {field: 'totalScore', headerName: 'Total', width: colWidht},
            {field: 'correctness', headerName: 'Correctness', width: colWidht},
            {field: 'suggestion', headerName: 'Suggestion', width: colWidht},
            {field: 'codeStyle', headerName: 'Code Style', width: colWidht},
            {field: 'overgeneration', headerName: 'Overgeneration', width: colWidht},
        ];
        return (
            <Paper>
                <Typography variant={'h5'}>
                    {props.title}
                </Typography>
                <DataGrid
                    rows={props.entries}
                    getRowId={row => row.llm}
                    columns={rankingGroupColumns}
                    checkboxSelection={false}
                    hideFooter={true}
                    sx={{border: 0}}
                    slots={{ toolbar: GridToolbar }}
                />
            </Paper>
        )
    }

    function AverageAttemptScoresComponent() {
        if(evaluationGroupStatistics) {
            const attemptScores = evaluationGroupStatistics.attemptScores.averageScores;
            return (
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMore/>}
                        aria-controls={`attempt-accordion-content`}
                        id={`attempt-accordion-header`}
                    >
                        <Typography variant={"h5"}>Attempt Average Scores</Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{maxWidth: 1500}}>
                        {attemptScores.map(scores =>
                            <AverageAttemptScoreTableComponent title={scores[0].llm} scores={scores} />
                        )}
                    </AccordionDetails>
                </Accordion>
            );
        } else return <></>;

    }

    function AverageAttemptScoreTableComponent(props: {title: string, scores: AttemptScoreEntry[]}) {
        const colWidht = 120;
        const rankingGroupColumns: GridColDef[] = [
            {field: 'attemptName', headerName: 'Attempt', width: 250},
            {field: 'complexity', headerName: 'Complexity', width: colWidht},
            {field: 'totalScore', headerName: 'Total', width: colWidht},
            {field: 'correctness', headerName: 'Correctness', width: colWidht},
            {field: 'suggestion', headerName: 'Suggestion', width: colWidht},
            {field: 'codeStyle', headerName: 'Code Style', width: colWidht},
            {field: 'overgeneration', headerName: 'Overgeneration', width: colWidht},
        ];
        return (
            <Paper>
                <Typography variant={'h5'}>
                    {props.title}
                </Typography>
                <DataGrid
                    rows={props.scores}
                    getRowId={row => row.attemptId}
                    columns={rankingGroupColumns}
                    checkboxSelection={false}
                    hideFooter={true}
                    sx={{border: 0}}
                    slots={{ toolbar: GridToolbar }}
                />
            </Paper>
        )
    }

    function EvaluationStatisticsComponent() {
        if(evaluationGroupStatistics) {
            const scoreDelta = evaluationGroupStatistics.scoreDelta!;
            return (
                <div>
                    <Bar data={convertToDeltaBarData(scoreDelta, scoreDelta.totalScore)} options={options("Total Score")} title={"Total Score"}/>
                    <Bar data={convertToDeltaBarData(scoreDelta, scoreDelta.totalScore)} options={options("Correctness ")} title={"Total Score"}/>
                    <Bar data={convertToDeltaBarData(scoreDelta, scoreDelta.suggestion)} options={options("Suggestion")} title={"Correctness"}/>
                    <Bar data={convertToDeltaBarData(scoreDelta, scoreDelta.codeStyle)} options={options("Code Style")} title={"Suggestion"}/>
                    <Bar data={convertToDeltaBarData(scoreDelta, scoreDelta.overgeneration)} options={options("Overgeneration")} title={"Overgeneration"}/>
                </div>
            );
        } else return <></>;
    }

    function convertToDeltaBarData(
        deltas: ScoreDelta,
        deltaData: ScoreDeltaData[]
    ): any {

        const colorSet = StatisticColors.getColorSet();
        const datasetMap = new Map<string, any>();
        for(const evaluation of deltas.evaluationGroups) {
            datasetMap.set(
                evaluation.id,
                {
                    label: evaluation.name,
                    data: [],
                    backgroundColor: StatisticColors.pickAndRemoveRandomColor(colorSet),
                }
            );
        }

        for(const delta of deltaData) {
            datasetMap.get(delta.evaluationGroup.id)
                .data
                .push(delta.delta);
        }

        return {
            labels: deltas.llms,
            datasets: Array.from(datasetMap.values())
        }
    }
}
