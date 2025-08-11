import './prompt-group-form.component.css';
import {
    Button, List, ListItem, ListItemButton, ListItemText,
    TextField,
    Typography
} from "@mui/material";
import useFormValidationHook from "../../../util/forms/form-validation-hook";
import useInputValue from "../../../util/forms/input-value-hook";
import PromptGroupUpdate from "../prompt-group-update";
import React, {useState} from "react";
import Paper from "@mui/material/Paper";

interface PromptGroupFormProps {
    save: (update: PromptGroupUpdate) => void,
    nameInit?: string,
    promptsInit?: string[]
}

export default function PromptGroupFormComponent(props: PromptGroupFormProps) {
    const nameInput = useInputValue<string>(props.nameInit, {required: true});
    const promptsInput = useInputValue<string[]>(props.promptsInit, {required: true});
    const isFormValid = useFormValidationHook([
        nameInput,
        promptsInput
    ]);

    const promptInput = useInputValue<string>("", {required: true});
    const isPromptValid = useFormValidationHook([
        promptInput
    ]);

    const [selectedPromptIndex, setSelectedPromptIndex] = useState<number>();

    const textAreaRows: number = 12;

    const savePromptGroup = () => {
        props.save(
            new PromptGroupUpdate(
                nameInput.valueOrThrow(),
                promptsInput.valueOrThrow()
            )
        )
    }

    const addPrompt = () => {
        promptInput.setValue("");
        promptsInput.setValue([
            ...promptsInput.value ? promptsInput.value : [], promptInput.valueOrThrow()
        ])
    }

    const editPrompt = () => {
        if(selectedPromptIndex !== undefined && promptsInput.value && promptInput.value) {
            const prompts = [...promptsInput.value]
            prompts[selectedPromptIndex] = promptInput.value;
            promptsInput.setValue(prompts);
            promptInput.setValue("");
            setSelectedPromptIndex(undefined);
        }
    }

    const onClickPrompt = (prompt: string, index: number) => {
        if(index === selectedPromptIndex) {
            setSelectedPromptIndex(undefined);
            promptInput.setValue("");
        } else {
            setSelectedPromptIndex(index);
            promptInput.setValue(prompt);
        }
    }

    const renderPromptAddButton = () => {
        if(selectedPromptIndex !== undefined) {
            return (
                <Button variant={"contained"} onClick={editPrompt} disabled={!isPromptValid}>
                    Edit
                </Button>
            );
        }
        return (
            <Button variant={"contained"} onClick={addPrompt} disabled={!isPromptValid}>
                Add
            </Button>
        );
    }

    return (
        <div className={'prompt-group-form-container'}>
            <div className={'prompt-group-form-text-area-container'}>
                <TextField
                    id="name"
                    label="Name"
                    className='prompt-group-form-text-area'
                    value={nameInput.value}
                    onChange={nameInput.handleChange}
                    required
                    error={nameInput.error}
                />
            </div>
            <div className={'prompt-group-form-text-area-container'} style={{flex: 1}}>
                <div style={{display: "flex", flexDirection: "column", flex: 1, gap: 10,  minHeight: 0}}>
                    <TextField
                        style={{overflowY: "scroll", flex: 1}}
                        id="task"
                        label="Add to Instruction"
                        className='prompt-group-form-text-area'
                        multiline
                        value={promptInput.value}
                        onChange={promptInput.handleChange}
                        fullWidth
                    />
                    {renderPromptAddButton()}
                </div>
                <div style={{flex: 1, display: "flex"}}>
                    <List
                        subheader={
                            <div style={{padding: 10, display: "flex", justifyContent: "start", background: "#121212"}}>
                                Instruction
                            </div>
                        }
                        style={{border: "1px solid gray", flex: 1, borderRadius: 5}}
                    >
                        {promptsInput.value ? promptsInput.valueOrThrow().map((item, index) =>
                            <ListItem disablePadding key={index}>
                                <ListItemButton
                                    selected={index === selectedPromptIndex}
                                    onClick={() => onClickPrompt(item, index)}>
                                    <Paper style={{padding: 10, flex: 1}}>
                                        <ListItemText primary={item}/>
                                    </Paper>
                                </ListItemButton>
                            </ListItem>
                        ) : <></>}
                    </List>
                </div>

            </div>
            <Button variant={"contained"} onClick={savePromptGroup} disabled={!isFormValid}>
                Save
            </Button>
        </div>
    )
}