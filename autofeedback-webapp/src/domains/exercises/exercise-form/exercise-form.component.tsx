import './exercise-form.component.css';
import useInputValue from "../../util/forms/input-value-hook";
import useFormValidationHook from "../../util/forms/form-validation-hook";
import ExerciseEndpoint from "../exercise-endpoint";
import {SnackbarVariant, useSnackbar} from "../../util/feedback/snackbar-hook";
import ExerciseUpdate from "../exercise-update";
import {EndpointCreationStatus} from "../../util/EndpointCreationStatus";
import {Button, TextField, Typography} from "@mui/material";

export interface ExerciseFormProps {
    save: (update: ExerciseUpdate) => void
    nameInit?: string,
    taskInit?: string,
    solutionInit?: string
}

export default function ExerciseFormComponent(props: ExerciseFormProps) {
    const nameInput = useInputValue<string>(props.nameInit, {required: true});
    const taskInput = useInputValue<string>(props.taskInit, {required: true});
    const solutionInput = useInputValue<string>(props.solutionInit, {required: true});
    const inputs = [
        nameInput,
        taskInput,
        solutionInput
    ]
    const isFormValid = useFormValidationHook([...inputs]);
    const textAreaRows: number = 12;

    const saveExercise = () => {
        props.save(
            new ExerciseUpdate(
                nameInput.valueOrThrow(),
                taskInput.valueOrThrow(),
                solutionInput.valueOrThrow()
            )
        );
    }

    return (
        <div className={'exercise-form-container'}>
            <div className={'exercise-form-text-area-container'}>
                <TextField
                    id="name"
                    label="Name"
                    className='exercise-form-text-area'
                    value={nameInput.value}
                    onChange={nameInput.handleChange}
                    required
                    error={nameInput.error}
                />
            </div>
            <div className={'exercise-form-text-area-container'}>
                <TextField
                    id="task"
                    required
                    label="Task"
                    className='exercise-form-text-area'
                    multiline
                    rows={textAreaRows}
                    value={taskInput.value}
                    onChange={taskInput.handleChange}
                    error={taskInput.error}
                />
                <TextField
                    id="solution"
                    required
                    label="Solution"
                    className='exercise-form-text-area'
                    multiline
                    rows={textAreaRows}
                    value={solutionInput.value}
                    onChange={solutionInput.handleChange}
                    error={solutionInput.error}
                />
            </div>
            <Button variant={"contained"} onClick={saveExercise} disabled={!isFormValid}>
                Save
            </Button>
        </div>
    )
}