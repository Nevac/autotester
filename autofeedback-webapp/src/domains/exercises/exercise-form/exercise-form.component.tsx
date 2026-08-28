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
        difficultyInput,
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

    const tablePattern: RegExp =
        /^\[(?=[^\]\r\n]*\bcols\s*=)(?=[^\]\r\n]*\boptions\s*=\s*"header")[^\]\r\n]*\][ \t]*\r?\n^\|={4,}[ \t]*\r?\n([\s\S]*?)^\|={4,}[ \t]*(?=\r?$)/gm;

    type TableRow = string[];

    function convertAsciiDocTables(text: string): string {
        return text.replace(
            tablePattern,
            (_match: string, body: string): string => {
                const rows: TableRow[] = body
                    .split(/\r?\n/)
                    .map((line: string): string => line.trim())
                    .filter((line: string): boolean => line.startsWith('|'))
                    .map(
                        (line: string): TableRow =>
                            line
                                .slice(1)
                                .split(/(?<!\\)\|/)
                                .map((cell: string): string => cell.trim())
                    );

                if (rows.length === 0) return '';

                const columnCount: number = Math.max(
                    ...rows.map((row: TableRow): number => row.length)
                );

                const markdownRow = (row: TableRow): string => {
                    const cells: string[] = row.concat(
                        Array<string>(columnCount - row.length).fill('')
                    );

                    return `| ${cells.join(' | ')} |`;
                };

                return [
                    markdownRow(rows[0]),
                    `| ${Array<string>(columnCount).fill('---').join(' | ')} |`,
                    ...rows.slice(1).map(markdownRow)
                ].join('\n');
            }
        );
    }

    const convertAsciidoc = () => {
        taskInput.setRawValue(
            taskInput.valueOrThrow()
                .replace(/:stem: latexmath\n\n/g, "")
                .replace(/:sectnums:\n\n/g, "")
                .replace(/stem:/g, "")
                .replace(
                    /\[source\,java\][ \t]*\r?\n----[ \t]*\r?\n([\s\S]*?)\r?\n----[ \t]*(?=\r?\n|$)/g,
                    '```java\n$1\n```'
                )
                .replace(
                    /\[source\][ \t]*\r?\n----[ \t]*\r?\n([\s\S]*?)\r?\n----[ \t]*(?=\r?\n|$)/g,
                    '```\n$1\n```'
                )
                .replace(
                    /\[stem\][ \t]*\r?\n\+\+\+\+[ \t]*\r?\n([\s\S]*?)\r?\n\+\+\+\+[ \t]*(?=\r?\n|$)/g,
                    '```math\n$1\n```'
                )
                .replace(
                    /\[%collapsible\][ \t]*\r?\n====[ \t]*\r?\n([\s\S]*?)\r?\n====[ \t]*(?=\r?\n|$)/g,
                    '$1'
                )
                .replace(
                    /\[underline\]#([^#]*?)#/g,
                    '**$1**'
                )
                .replace(/\[.text-center\]/g, "")
                .replace(/\[loweralpha\]/g, "")
                .replace(/\+\n/g, "\n")
                .replace(/^\. /gm, '')
                .replace(/^\./gm, '')
                .replace(/^\+/gm, "\n")
                .replace(/\[%collapsible\]/g, "")
                .replace(/====/g, "\n")
                .replace(/===/g, "#")
                .replace(/==/g, "#")
                .replace(/----/g, "")
                .replace(/&nbsp;/g, " ")
                .replace(/&nbs;/g, " ")
                .replace(
                    /^(Exercise Code:[ \t]*\r?\n)([\s\S]*?)(?:\r?\n)?(?![\s\S])/m,
                    '$1```java\n$2\n```'
                )
                .replace(
                    tablePattern,
                    convertAsciiDocTables
                )
        );
    }

    const wrapSolution = () => {
        solutionInput.setRawValue(
`\`\`\`java
    ${solutionInput.value}
\`\`\``
        )
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
            <Button onClick={convertAsciidoc}>Convert from asciidoc</Button>
            <div className={'exercise-form-text-area-container'}>
                <FormControl
                    className='exercise-form-text-area'
                    required
                    error={taskInput.error}
                >
                    <InputLabel htmlFor="task-input">Task</InputLabel>
                    <MarkdownEditor id='task-input' input={taskInput}/>
                </FormControl>
                <Button onClick={wrapSolution}>Wrap Solution</Button>
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