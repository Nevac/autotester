import './exercise-form.component.css';
import useInputValue from "../../util/forms/input-value-hook";
import useFormValidationHook from "../../util/forms/form-validation-hook";
import ExerciseUpdate from "../exercise-update";
import {Button, FormControl, InputLabel, TextField, Typography} from "@mui/material";
import MarkdownEditor from "../../util/markdown-editor/MarkdownEditor";

export interface ExerciseFormProps {
    save: (update: ExerciseUpdate) => void
    nameInit?: string,
    taskInit?: string,
    solutionInit?: string
}

export default function ExerciseFormComponent(props: ExerciseFormProps) {
    const nameInput = useInputValue<string>(props.nameInit, {required: true});
    const taskInput = useInputValue<string>(props.taskInit, {required: true});
    const solutionInput = useInputValue<string>(props.solutionInit, {required: false});
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
                solutionInput.value ? solutionInput.value : ""
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
                <FormControl
                    className='exercise-form-text-area'
                    required
                    error={taskInput.error}
                >
                    <InputLabel htmlFor="task-input">Task</InputLabel>
                    <MarkdownEditor id='task-input' input={taskInput}/>
                </FormControl>

                <FormControl
                    className='exercise-form-text-area'
                    error={taskInput.error}
                >
                    <InputLabel htmlFor="solution-input">Solution</InputLabel>
                    <MarkdownEditor id='solution-input' input={solutionInput}/>
                </FormControl>
            </div>
            <Button variant={"contained"} onClick={saveExercise} disabled={!isFormValid}>
                Save
            </Button>
        </div>
    )
}