import './attempt-form.component.css';
import useInputValue from "../../util/forms/input-value-hook";
import useFormValidationHook from "../../util/forms/form-validation-hook";
import AttemptUpdate from "../attempt-update";
import {Button, FormControl, InputLabel, MenuItem, TextField, Typography} from "@mui/material";
import MarkdownEditor from "../../util/markdown-editor/MarkdownEditor";
import {useEffect, useState} from "react";
import ExerciseListItem from "../../exercises/exercise-list-item";
import {SnackbarVariant, useSnackbar} from "../../util/feedback/snackbar-hook";
import ExerciseEndpoint from "../../exercises/exercise-endpoint";
import ExpectedFeedbackFormComponent from "./expected-feedback-form/expected-feedback-form.component";
import ExpectedFeedback from "../expected-feedback/expected-feedback";
import ExpectedFeedbackFormModel from "./expected-feedback-form/expected-feedback-form-model";

export interface AttemptFormProps {
    save: (update: AttemptUpdate) => void
    nameInit?: string,
    exerciseIdInit?: string,
    attemptInit?: string,
    expectedFeedbackInit?: ExpectedFeedback
}

export default function AttemptFormComponent(props: AttemptFormProps) {
    const nameInput = useInputValue<string>(props.nameInit, {required: true});
    const exerciseInput = useInputValue<string>(props.exerciseIdInit, {required: true});
    const attemptInput = useInputValue<string>(props.attemptInit, {required: false});
    const expectedFeedbackInput = useInputValue<ExpectedFeedbackFormModel>(ExpectedFeedbackFormModel.create(), {required: false});
    const inputs = [
        nameInput,
        exerciseInput,
        attemptInput,
        expectedFeedbackInput
    ]
    const isFormValid = useFormValidationHook([...inputs]);

    const exerciseEndpoint = new ExerciseEndpoint();

    const [selectableExercises, setSelectableExercises] = useState<ExerciseListItem[]>([]);
    const [openSnackbar, Snackbar] = useSnackbar();

    useEffect(() => {
        exerciseEndpoint.getListItems()
            .then(items => setSelectableExercises(items))
            .catch(err => {
                openSnackbar("Failed to load exercise selection", SnackbarVariant.ERROR);
                console.error(err);
            });
    }, []);

    useEffect(() => {
        if(props.expectedFeedbackInit) {
            expectedFeedbackInput.setRawValue(props.expectedFeedbackInit)
        } else {
            expectedFeedbackInput.setRawValue(ExpectedFeedbackFormModel.create())
        }
    }, [props.expectedFeedbackInit]);

    const saveAttempt = () => {
        props.save(
            new AttemptUpdate(
                nameInput.valueOrThrow(),
                exerciseInput.valueOrThrow(),
                attemptInput.value ? attemptInput.value : "",
                expectedFeedbackInput.valueOrThrow()
            )
        );
    }

    return (
        <div className={'attempt-form-container'}>
            <Snackbar/>
            <div className={'attempt-form-text-area-container'}>
                <TextField
                    id="name"
                    label="Name"
                    className='attempt-form-text-area'
                    value={nameInput.value}
                    onChange={nameInput.handleChange}
                    required
                    error={nameInput.error}
                />
            </div>
            <div className={'attempt-form-text-area-container'}>
                <FormControl fullWidth>
                    <TextField
                        select
                        id="exercise-label"
                        value={exerciseInput.value}
                        label="Exercise"
                        onChange={exerciseInput.handleChange}
                        required
                        error={exerciseInput.error}
                    >
                        {selectableExercises.map(exercise =>
                            <MenuItem value={exercise._id}>{exercise.name}</MenuItem>
                        )}
                    </TextField>
                </FormControl>

                <FormControl
                    className='attempt-form-text-area'
                    error={attemptInput.error}
                >
                    <InputLabel htmlFor="attempt-input">Attempt</InputLabel>
                    <MarkdownEditor id='attempt-input' input={attemptInput}/>
                </FormControl>

                <Typography variant={'h4'}>
                    Expected Feedback
                </Typography>
                <ExpectedFeedbackFormComponent expectedFeedbackInit={expectedFeedbackInput.value!}/>
            </div>
            <Button variant={"contained"} onClick={saveAttempt} disabled={!isFormValid}>
                Save
            </Button>
        </div>
    )
}