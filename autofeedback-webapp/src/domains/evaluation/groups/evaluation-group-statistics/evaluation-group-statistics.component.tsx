import './evaluation-group-statistics.component.css';
import React, {useEffect, useState} from "react";
import {Bar} from "react-chartjs-2";
import {BarElement, CategoryScale, Chart, Legend, LinearScale, Title, Tooltip} from "chart.js";
import {Box, Button, Divider, FormControl, MenuItem, TextField, Typography} from "@mui/material";
import ChartDataLabels from "chartjs-plugin-datalabels";
import useInputValue from "../../../util/forms/input-value-hook";
import useFormValidationHook from "../../../util/forms/form-validation-hook";
import EvaluationGroupListItem from "../evaluation-group-list-item";
import EvaluationGroupEndpoint from "../evaluation-group-endpoint";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";
import Paper from "@mui/material/Paper";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import EvaluationGroupStatistic from "./statistic/evaluation-group-statistic";
import ScoreDelta from "./statistic/score-delta";
import EvaluationGroupStatKey from "./statistic/evaluation-group-stat-key";
import ScoreDeltaData from "./statistic/score-delta-data";
import {Llm} from "../../../llms/llm";
import StatisticColors from "./statistic-colors";

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

export const options = {
    responsive: true,
    layout: { padding: { top: 24 } }, // gives labels room above bars
    plugins: {
        legend: { position: 'top' as const },
        title: { display: true, text: 'Chart.js Bar Chart' },
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
            ).then(statistics =>
                setEvaluationGroupStatistics(statistics)
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

    function EvaluationStatisticsComponent() {
        if(evaluationGroupStatistics) {
            const scoreDelta = evaluationGroupStatistics.scoreDelta!;
            return (
                <div>
                    <Bar data={convertToDeltaBarData(scoreDelta, scoreDelta.totalScore)} options={options} title={"Total Score"}/>
                    <Bar data={convertToDeltaBarData(scoreDelta, scoreDelta.suggestion)} options={options} title={"Correctness"}/>
                    <Bar data={convertToDeltaBarData(scoreDelta, scoreDelta.codeStyle)} options={options} title={"Suggestion"}/>
                    <Bar data={convertToDeltaBarData(scoreDelta, scoreDelta.overgeneration)} options={options} title={"Overgeneration"}/>
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

    function generateDummyEvaluationStatistics() {
        return new EvaluationGroupStatistic(
            null!,
            [],
            [Llm.GPT_5, Llm.GEMINI_2_5_PRO, Llm.O3, Llm.DEEPSEEK_V3],
            [],
            new ScoreDelta(
                [Llm.GPT_5, Llm.GEMINI_2_5_PRO, Llm.O3, Llm.DEEPSEEK_V3, Llm.CLAUDE_4_1_OPUS, Llm.GPT_4o, Llm.O4_MINI],
                [
                    new EvaluationGroupStatKey("EvalGroup 1", "EvalGroup 1"),
                    new EvaluationGroupStatKey("EvalGroup 2", "EvalGroup 2"),
                    new EvaluationGroupStatKey("EvalGroup 3", "EvalGroup 3"),
                ],
                [
                    new ScoreDeltaData(
                        Llm.GPT_5,
                        new EvaluationGroupStatKey("EvalGroup 1", "EvalGroup 1"),
                        0.1
                    ),
                    new ScoreDeltaData(
                        Llm.GEMINI_2_5_PRO,
                        new EvaluationGroupStatKey("EvalGroup 1", "EvalGroup 1"),
                        -0.5
                    ),
                    new ScoreDeltaData(
                        Llm.O3,
                        new EvaluationGroupStatKey("EvalGroup 1", "EvalGroup 1"),
                        0.2
                    ),
                    new ScoreDeltaData(
                        Llm.DEEPSEEK_V3,
                        new EvaluationGroupStatKey("EvalGroup 1", "EvalGroup 1"),
                        0.3
                    ),
                    new ScoreDeltaData(
                        Llm.GPT_5,
                        new EvaluationGroupStatKey("EvalGroup 2", "EvalGroup 2"),
                        0.2
                    ),
                    new ScoreDeltaData(
                        Llm.GEMINI_2_5_PRO,
                        new EvaluationGroupStatKey("EvalGroup 2", "EvalGroup 2"),
                        0.3
                    ),
                    new ScoreDeltaData(
                        Llm.O3,
                        new EvaluationGroupStatKey("EvalGroup 2", "EvalGroup 2"),
                        0.1
                    ),
                    new ScoreDeltaData(
                        Llm.DEEPSEEK_V3,
                        new EvaluationGroupStatKey("EvalGroup 2", "EvalGroup 2"),
                        -0.1
                    ),
                    new ScoreDeltaData(
                        Llm.GPT_5,
                        new EvaluationGroupStatKey("EvalGroup 3", "EvalGroup 3"),
                        0.1
                    ),
                    new ScoreDeltaData(
                        Llm.GEMINI_2_5_PRO,
                        new EvaluationGroupStatKey("EvalGroup 3", "EvalGroup 3"),
                        -0.5
                    ),
                    new ScoreDeltaData(
                        Llm.O3,
                        new EvaluationGroupStatKey("EvalGroup 3", "EvalGroup 3"),
                        0.2
                    ),
                    new ScoreDeltaData(
                        Llm.DEEPSEEK_V3,
                        new EvaluationGroupStatKey("EvalGroup 3", "EvalGroup 3"),
                        0.3
                    ),
                ],
                [],
                [],
                [],
                []
            ),
        );
    }
}
