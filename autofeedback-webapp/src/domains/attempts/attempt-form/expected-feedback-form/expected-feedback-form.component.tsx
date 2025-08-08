import "./expected-feedback-form.component.css";
import React, {useEffect, useState} from "react";
import {Accordion, AccordionDetails, AccordionSummary, Button, Typography} from "@mui/material";
import {ExpandMore} from "@mui/icons-material";
import FeedbackReferencesFormComponent from "../feedback-references-form/feedback-references-form.component";
import FeedbackReferenceFormModel from "../feedback-references-form/feedback-reference-form-model";
import ExpectedFeedbackFormModel from "./expected-feedback-form-model";
import FeedbackMetric from "../../expected-feedback/feedback-metric";

export interface ExpectedFeedbackForm {
    expectedFeedbackInit: ExpectedFeedbackFormModel
}

export default function ExpectedFeedbackFormComponent(props: ExpectedFeedbackForm) {

    const [correctnessEntries, setCorrectnessEntries] = useState<FeedbackReferenceFormModel[]>([]);
    const [suggestionEntries, setSuggestionEntries] = useState<FeedbackReferenceFormModel[]>([]);
    const [codeStyleEntries, setCodeStyleEntries] = useState<FeedbackReferenceFormModel[]>([]);

    const [correctnessSectionExpanded, setCorrectnessSectionExpanded] = useState<boolean>(false);
    const [suggestionSectionExpanded, setSuggestionSectionExpanded] = useState<boolean>(false);
    const [codeStyleSectionExpanded, setCodestyleSectionExpanded] = useState<boolean>(false);

    useEffect(() => {
        const expectedFeedback = props.expectedFeedbackInit;
        if(expectedFeedback) {
            setCorrectnessEntries([...expectedFeedback.correctness]);
            setSuggestionEntries([...expectedFeedback.suggestion]);
            setCodeStyleEntries([...expectedFeedback.codeStyle]);
        }
    }, [props.expectedFeedbackInit]);

    useEffect(() => {
        const expectedFeedback = props.expectedFeedbackInit;
        if(expectedFeedback) {
            expectedFeedback.correctness = correctnessEntries;
            expectedFeedback.suggestion = suggestionEntries;
            expectedFeedback.codeStyle = codeStyleEntries;
        }
    }, [
        correctnessEntries,
        suggestionEntries,
        codeStyleEntries,
    ]);

    function addNewReference(
        entries: FeedbackReferenceFormModel[],
        setEntries: (input: FeedbackReferenceFormModel[]) => void,
        metric: FeedbackMetric
    ): void {
        setEntries([
            ...entries,
            FeedbackReferenceFormModel.create(metric)
        ])
    }

    function removeReference(
        entries: FeedbackReferenceFormModel[],
        setEntries: (input: FeedbackReferenceFormModel[]) => void,
        index: number
    ): void {
        const newArray = [...entries];
        newArray.splice(index, 1);
        setEntries(newArray);
    }

    function FeedbackReferenceSection (
        props: {
            title: string,
            metric: FeedbackMetric,
            feedbackReferences: FeedbackReferenceFormModel[],
            setFeedbackReferences: (input: FeedbackReferenceFormModel[]) => void,
            expandFlag: boolean,
            setExpandFlag: (input: boolean) => void,
        }) {
        return (
            <Accordion
                expanded={props.expandFlag}
                onChange={() => props.setExpandFlag(!props.expandFlag)}>
                <AccordionSummary expandIcon={<ExpandMore/>}>
                    <Typography variant={'h4'}>
                        {props.title}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={"expected-feedback-form-container"}>
                        {props.feedbackReferences.map((feedbackReference, index) =>
                            <FeedbackReferencesFormComponent key={index}
                                                             feedbackReference={feedbackReference}
                                                             onDelete={() => removeReference(
                                                                 props.feedbackReferences,
                                                                 props.setFeedbackReferences,
                                                                 index)}
                            />
                        )}
                        <Button variant={"contained"} onClick={() => addNewReference(
                            props.feedbackReferences,
                            props.setFeedbackReferences,
                            props.metric
                        )}>
                            <Typography>
                                Add Feedback Reference
                            </Typography>
                        </Button>
                    </div>
                </AccordionDetails>
            </Accordion>
        )
    }

    return (
        <div className={'attempt-form-container'}>
            <FeedbackReferenceSection key={"correctness"}
                                      title={"Correctness"}
                                      metric={FeedbackMetric.CORRECTNESS}
                                      feedbackReferences={correctnessEntries}
                                      setFeedbackReferences={setCorrectnessEntries}
                                      expandFlag={correctnessSectionExpanded}
                                      setExpandFlag={setCorrectnessSectionExpanded}
            />
            <FeedbackReferenceSection key={"suggestion"}
                                      title={"Suggestion"}
                                      metric={FeedbackMetric.SUGGESTION}
                                      feedbackReferences={suggestionEntries}
                                      setFeedbackReferences={setSuggestionEntries}
                                      expandFlag={suggestionSectionExpanded}
                                      setExpandFlag={setSuggestionSectionExpanded}
            />
            <FeedbackReferenceSection key={"codeStyle"}
                                      title={"Code Style"}
                                      metric={FeedbackMetric.CODE_STYLE}
                                      feedbackReferences={codeStyleEntries}
                                      setFeedbackReferences={setCodeStyleEntries}
                                      expandFlag={codeStyleSectionExpanded}
                                      setExpandFlag={setCodestyleSectionExpanded}
            />
        </div>
    )
}