import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Checkbox,
    Chip,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {ExpandMore} from "@mui/icons-material";
import MarkdownX from "../../../../util/markdown-x/MarkdownX";
import Paper from "@mui/material/Paper";
import React from "react";
import {Evaluation} from "../../../evaluation";
import Attempt from "../../../../attempts/attempt";
import EvaluationSemanticStatistic from "../../../statistic/evaluation-semantic-statistic";
import Ast from '../../../../ast/ast';
import EvaluationScore from "../../../score/evaluation-score";
import MetricScoresComponent from "./metric-scores-details/metric-scores-details.component";

export default function EvaluationDetailsComponent(props: {evaluation?: Evaluation}) {

    const evaluation = props.evaluation;

    if(evaluation) {
        return (
            <div style={{display: "flex", flexDirection: "column", gap: 10, padding: 10}}>
                <AttemptDetail attempt={evaluation.attempt}/>
                <GeneratedFeedback generatedFeedback={evaluation.generatedFeedback}/>
                <RagDocuments evaluation={evaluation}/>
                <EvaluationScoreComponent evaluation={evaluation}/>
                <SemanticStatisticComponent semanticStatistic={evaluation.semanticStatistic}/>
            </div>
        )
    }
    return <></>;

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
                            <AstComponent ast={ast}/>
                            {ragDocuments.map(ragDocument =>
                                <Paper key={ragDocument.id} elevation={10} style={{padding: 10}}>
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

    function AstComponent(props: {ast: Ast}) {
        const ast = props.ast;

        if(ast) {
            return (
                <div style={{display: "flex", flexDirection: "column", gap: 10, padding: 10}}>
                    <div>
                        <Typography fontWeight={'bold'}>Contructs</Typography>
                        <Stack direction="row" spacing={1}>
                            {ast.constructs.map(construct =>
                                <Chip key={construct} label={construct} size="small"/>
                            )}
                        </Stack>
                    </div>
                </div>
            );
        } else {
            return (<></>);
        }
    }

    function SemanticStatisticComponent(props: { semanticStatistic: EvaluationSemanticStatistic }) {
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

    function EvaluationScoreComponent(props: { evaluation: Evaluation }) {
        const evaluation = props.evaluation;
        if (evaluation) {
            return (
                <div style={{display: "flex", gap: 10}}>
                    <ScoreTableComponent score={evaluation.score}/>
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
                                <MetricScoresComponent evaluation={evaluation}/>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
            )
        }
        return <></>;
    }

    function ScoreTableComponent(props: {score: EvaluationScore}) {
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

}

