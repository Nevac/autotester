import EvaluationScore from "../../../../score/evaluation-score";
import React, {useEffect, useState} from "react";
import ReferencedCorrection from "../../../../score/correction/referenced-correction";
import UnreferencedCorrection from "../../../../score/correction/unreferenced-correction";
import OvergenerationCorrection from "../../../../score/correction/overgeneration-correction";
import {
    Button,
    Checkbox, Chip,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography
} from "@mui/material";
import FeedbackMetric from "../../../../../attempts/expected-feedback/feedback-metric";
import OvergenerationValidity from "../../../../score/metric/overgeneration-validity";
import {EvaluationScoreCorrection} from "../../../../score/correction/evaluation-score-correction";
import MetricScoreCorrection from "../../../../score/correction/metric-score-correction";
import MetricOvergenerationScoreCorrection from "../../../../score/correction/metric-overgeneration-score-correction";
import CorrectScoreDto from "../../../../score/correction/correct-score-dto";
import {EndpointResponeStatus} from "../../../../../util/EndpointResponeStatus";
import {SnackbarVariant, useSnackbar} from "../../../../../util/feedback/snackbar-hook";
import MetricScore from "../../../../score/metric/metric-score";
import Paper from "@mui/material/Paper";
import MetricOvergenerationScore from "../../../../score/metric/metric-overgeneration-score";
import Overgeneration from "../../../../score/metric/overgeneration";
import useInputValue from "../../../../../util/forms/input-value-hook";
import ReferenceAddressing from "../../../../score/reference/reference-addressing";
import MarkdownX from "../../../../../util/markdown-x/MarkdownX";
import UnreferencedFeedback from "../../../../score/reference/unreferenced-feedback";
import {Evaluation} from "../../../../evaluation";
import EvaluationGroupEndpoint from "../../../evaluation-group-endpoint";
import EvaluationEndpoint from "../../../../evaluation-endpoint";
import ConfusionDto from "../../../../score/confusion/confusion-dto";

export default function MetricScoresComponent(props: {evaluation: Evaluation}) {
    const endpoint = new EvaluationGroupEndpoint();
    const evaluationEndpoint = new EvaluationEndpoint();
    const [openSnackbar, Snackbar] = useSnackbar();

    const [evaluation, setEvaluation] = useState<Evaluation>(props.evaluation);
    const evaluationScore = evaluation.score;

    const referencedCorrections = new Map<string, ReferencedCorrection>();
    const unreferencedCorrections = new Map<number, UnreferencedCorrection>();
    const overgenerationCorrections = new Map<number, OvergenerationCorrection>();

    const confusionInput = useInputValue(evaluation.score.confusion, { required: false });

    useEffect(() => {
        setEvaluation(props.evaluation);
    }, [props.evaluation]);

    function handleConfusionChange(value: boolean) {
        confusionInput.setRawValue(value);

        evaluationEndpoint.confusion(
            evaluation!._id,
            new ConfusionDto(value)
        ).then(evaluation => {
            setEvaluation(evaluation);
            openSnackbar("Successfully saved Confusion", SnackbarVariant.SUCCESS);
        }).catch(err => {
            console.error(err);
            openSnackbar("Failed to save Confusion", SnackbarVariant.ERROR);
        });
    }

    return (
        <div style={{flex: 1, display: "flex", gap: 10, flexDirection: "column"}}>
            <Snackbar/>
            <div>
                <FormControlLabel control={
                    <Checkbox checked={confusionInput.value}
                              onChange={e => handleConfusionChange(e.target.checked)}
                    />
                } label={"Confusion"}/>
            </div>
            <MetricScoreComponent key={"correctness"}
                                  title={"Correctness"}
                                  metric={FeedbackMetric.CORRECTNESS}
                                  metricScore={evaluationScore.correctness}/>
            <MetricScoreComponent key={"suggestion"}
                                  title={"Suggestion"}
                                  metric={FeedbackMetric.SUGGESTION}
                                  metricScore={evaluationScore.suggestion}/>
            <MetricScoreComponent key={"codeStyle"}
                                  title={"Code Style"}
                                  metric={FeedbackMetric.CODE_STYLE}
                                  metricScore={evaluationScore.codeStyle}/>
            <MetricOvergenerationScoreComponent metricOvergenerationScore={evaluationScore.overgeneration}/>
            <Button variant={"contained"}
                    onClick={onSaveCorrection}
            >
                <Typography>Save corrections</Typography>
            </Button>
        </div>
    );

    function addReferencedCorrection(
        id: string,
        metric: FeedbackMetric,
        ignore: boolean
    ): void {
        if(referencedCorrections.has(id)) {
            referencedCorrections
                .get(id)!
                .setIgnore(ignore);
        } else {
            referencedCorrections.set(
                id,
                new ReferencedCorrection(
                    id,
                    metric,
                    ignore
                )
            );
        }
    }

    function addUnreferencedCorrection(
        generatedFeedbackIndex: number,
        metric: FeedbackMetric,
        ignore: boolean
    ): void {
        console.log(generatedFeedbackIndex);
        if(unreferencedCorrections.has(generatedFeedbackIndex)) {
            unreferencedCorrections
                .get(generatedFeedbackIndex)!
                .setIgnore(ignore);
        } else {
            unreferencedCorrections.set(
                generatedFeedbackIndex,
                new UnreferencedCorrection(
                    generatedFeedbackIndex,
                    metric,
                    ignore
                )
            );
        }
    }

    function addOvergenerationCorrection(
        generatedFeedbackIndex: number,
        validity: OvergenerationValidity
    ): void {
        if(overgenerationCorrections.has(generatedFeedbackIndex)) {
            overgenerationCorrections
                .get(generatedFeedbackIndex)!
                .setValidity(validity);
        } else {
            overgenerationCorrections.set(
                generatedFeedbackIndex,
                new OvergenerationCorrection(
                    generatedFeedbackIndex,
                    validity
                )
            );
        }
    }

    function onSaveCorrection() {
        const correction = new EvaluationScoreCorrection(
            new MetricScoreCorrection(
                extractReferencedCorrectionsForMetric(referencedCorrections, FeedbackMetric.CORRECTNESS),
                extractUnreferencedCorrectionsForMetric(unreferencedCorrections, FeedbackMetric.CORRECTNESS)
            ),
            new MetricScoreCorrection(
                extractReferencedCorrectionsForMetric(referencedCorrections, FeedbackMetric.SUGGESTION),
                extractUnreferencedCorrectionsForMetric(unreferencedCorrections, FeedbackMetric.SUGGESTION)
            ),
            new MetricScoreCorrection(
                extractReferencedCorrectionsForMetric(referencedCorrections, FeedbackMetric.CODE_STYLE),
                extractUnreferencedCorrectionsForMetric(unreferencedCorrections, FeedbackMetric.CODE_STYLE)
            ),
            new MetricOvergenerationScoreCorrection(
                Array.from(overgenerationCorrections.values())
            )
        );

        const correctScoreDto = new CorrectScoreDto(
            evaluation!._id,
            correction
        );

        endpoint.correctScore(
            evaluation!.evaluationGroup,
            correctScoreDto
        ).then(evaluation => {
            setEvaluation(evaluation);
            openSnackbar("Successfully saved Correction", SnackbarVariant.SUCCESS);
        }).catch(err => {
                console.error(err);
                openSnackbar("Failed to save Correction", SnackbarVariant.ERROR);
        });
    }

    function extractReferencedCorrectionsForMetric(
        referencedCorrections: Map<string, ReferencedCorrection>,
        metric: FeedbackMetric
    ): ReferencedCorrection[] {
        return Array.from(referencedCorrections.values())
            .filter(correction => correction.metric === metric);
    }

    function extractUnreferencedCorrectionsForMetric(
        unreferencedCorrections: Map<number, UnreferencedCorrection>,
        metric: FeedbackMetric
    ): UnreferencedCorrection[] {
        return Array.from(unreferencedCorrections.values())
            .filter(correction => correction.metric === metric);
    }

    function MetricScoreComponent(props: { title: string, metricScore: MetricScore, metric: FeedbackMetric}) {
        return (
            <Paper elevation={3} style={{padding: 10}}>
                <Typography variant={"h5"}>{props.title}</Typography>
                <div style={{display: "flex", flexDirection: "column", gap: 20}}>
                    {props.metricScore.referenceAddressings.map(reference => {
                            if(reference) {
                                return <ReferenceAddressingComponent key={reference.id}
                                                                     referenceAddressing={reference}
                                                                     metric={props.metric}
                                />
                            } else return <></>
                        }
                    )}
                </div>
                {props.metricScore.unreferencedFeedbacks.length === 0 ? <></> :
                    <Typography style={{marginTop: 20}} fontWeight={"bold"}>Wrong Feedback</Typography>
                }
                {props.metricScore.unreferencedFeedbacks.map(unrefFeedback => {
                        if(unrefFeedback) {
                            return <UnreferencedFeedbackComponent key={unrefFeedback.generatedFeedbackIndex}
                                                                  unreferencedFeedback={unrefFeedback}
                                                                  metric={props.metric}/>
                        } else return <></>
                    }
                )}
            </Paper>
        );
    }

    function MetricOvergenerationScoreComponent(props: {metricOvergenerationScore: MetricOvergenerationScore}) {
        return (
            <Paper elevation={3} style={{padding: 10}}>
                <Typography variant={"h5"}>Overgenerations</Typography>
                <div style={{display: "flex", flexDirection: "column", gap: 10, padding: 10}}>
                    {props.metricOvergenerationScore.overgenerations.map(overgenration =>
                        <OvergenerationComponent overgeneration={overgenration}/>
                    )}
                </div>
            </Paper>
        );
    }

    function OvergenerationComponent(props: {
        overgeneration: Overgeneration
    }) {
        const overgeneration = props.overgeneration;
        const validityInput = useInputValue<OvergenerationValidity>(overgeneration.validity, { required: false })

        function handleCountChange(value: OvergenerationValidity) {
            validityInput.setRawValue(value);
            addOvergenerationCorrection(overgeneration.generatedFeedbackIndex, value);
        }

        return (
            <Paper key={overgeneration.generatedFeedbackIndex}
                   elevation={10}
                   style={{padding: 10, display: "flex", flexDirection: "column", gap: 10}}
            >
                <FormControl fullWidth>
                    <InputLabel id="validity-select-label">Validity</InputLabel>
                    <Select
                        labelId="validity-select-label"
                        id="validity-simple-select"
                        value={validityInput.value}
                        label="Age"
                        onChange={e => handleCountChange(e.target.value as OvergenerationValidity)}
                    >
                        <MenuItem value={OvergenerationValidity.VALID}>Valid</MenuItem>
                        <MenuItem value={OvergenerationValidity.IGNORE}>Ignore</MenuItem>
                        <MenuItem value={OvergenerationValidity.CODE_STYLE}>Count to Code Style</MenuItem>
                    </Select>
                </FormControl>
                <Stack direction="row" spacing={1}>
                    <Chip label={`index: ${overgeneration.generatedFeedbackIndex}`} size="small"/>
                    <Chip label={`validity: ${overgeneration.validity}`} size="small"/>
                </Stack>
                <Typography>{overgeneration.sentence}</Typography>
            </Paper>
        );
    }

    function ReferenceAddressingComponent(props: {
        referenceAddressing: ReferenceAddressing,
        metric: FeedbackMetric
    }) {
        const refAddressing = props.referenceAddressing;

        const countInput = useInputValue<boolean>(!refAddressing.ignore, { required: false })

        function handleCountChange(value: boolean) {
            countInput.setRawValue(value);
            addReferencedCorrection(refAddressing.id, props.metric, !value);
        }

        return (
            <div style={{display: "flex", flexDirection: "column", gap: 10, padding: 10}}>
                <Paper elevation={10} style={{padding: 10}}>
                    <div>
                        <FormControlLabel control={
                            <Checkbox checked={countInput.value}
                                      onChange={e => handleCountChange(e.target.checked)}
                            />
                        }
                                          label={"Count"}/>
                    </div>
                    <Typography variant={"h6"} fontWeight={"bold"}>{refAddressing.id}</Typography>
                    <Typography>Semantic Similarity: {refAddressing.similarityScore.toFixed(4)}</Typography>
                </Paper>
                <div style={{display: "flex", flexDirection: "row", gap: 10}}>
                    <Paper elevation={10} style={{padding: 10, flex: 1}}>
                        <Typography variant={"h6"}>Expected</Typography>
                        <MarkdownX>
                            {refAddressing.expectedSentence}
                        </MarkdownX>
                    </Paper>
                    <Paper elevation={10} style={{padding: 10, flex: 1}}>
                        <Typography variant={"h6"}>Generated</Typography>
                        <MarkdownX>
                            {refAddressing.addressed ? refAddressing.generatedSentence : "Not Addressed"}
                        </MarkdownX>
                    </Paper>
                </div>
            </div>
        );
    }

    function UnreferencedFeedbackComponent(props: {
        unreferencedFeedback: UnreferencedFeedback,
        metric: FeedbackMetric
    }) {
        const unreferencedFeedback = props.unreferencedFeedback;
        const countInput = useInputValue<boolean>(!unreferencedFeedback.ignore, { required: false })

        function handleCountChange(value: boolean) {
            countInput.setValue(value);
            addUnreferencedCorrection(unreferencedFeedback.generatedFeedbackIndex, props.metric, !value);
        }

        return (
            <div style={{display: "flex", flexDirection: "column", gap: 10, padding: 10}}>
                <Paper elevation={10} style={{padding: 10}}>
                    <div>
                        <FormControlLabel control={
                            <Checkbox checked={countInput.value}
                                      onChange={e => handleCountChange(e.target.checked)}
                            />
                        }
                                          label={"Count"}/>
                    </div>
                    <Stack direction="row" spacing={1}>
                        <Chip label={`index: ${unreferencedFeedback.generatedFeedbackIndex}`} size="small"/>
                    </Stack>
                    <MarkdownX>{unreferencedFeedback.generatedSentence}</MarkdownX>
                </Paper>
            </div>
        );
    }
}