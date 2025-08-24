import './exercise-form.component.css';
import useInputValue from "../../util/forms/input-value-hook";
import useFormValidationHook from "../../util/forms/form-validation-hook";
import ExerciseUpdate from "../exercise-update";
import {Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography} from "@mui/material";
import MarkdownEditor from "../../util/markdown-editor/MarkdownEditor";
import ExerciseDifficulty from "../exercise-difficulty";
import OvergenerationValidity from "../../evaluation/score/metric/overgeneration-validity";
import React from "react";

export interface ExerciseFormProps {
    save: (update: ExerciseUpdate) => void
    nameInit?: string,
    taskInit?: string,
    difficultyInit?: ExerciseDifficulty,
    solutionInit?: string
}

export default function ExerciseFormComponent(props: ExerciseFormProps) {
    const nameInput = useInputValue<string>(props.nameInit, {required: true});
    const taskInput = useInputValue<string>(props.taskInit, {required: true});
    const difficultyInput = useInputValue<ExerciseDifficulty>(props.difficultyInit, {required: true});
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
                difficultyInput.valueOrThrow(),
                solutionInput.value ? solutionInput.value : ""
            )
        );
    }

    return (
        <div className={'exercise-form-container'}>
            <div style={{display: "flex", flexDirection: "row", gap: 10}}>
                <div className={'exercise-form-text-area-container'}>
                    <TextField
                        style={{width: 400}}
                        id="name"
                        label="Name"
                        className='exercise-form-text-area'
                        value={nameInput.value}
                        onChange={nameInput.handleChange}
                        required
                        error={nameInput.error}
                    />
                </div>
                <FormControl style={{width: 150}}>
                    <TextField
                        select
                        id="difficulty-label"
                        value={difficultyInput.value}
                        label="Difficulty"
                        onChange={difficultyInput.handleChange}
                    >
                        <MenuItem value={ExerciseDifficulty.EASY}>Easy</MenuItem>
                        <MenuItem value={ExerciseDifficulty.MEDIUM}>Medium</MenuItem>
                        <MenuItem value={ExerciseDifficulty.HARD}>Hard</MenuItem>
                    </TextField>
                </FormControl>
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