import './prompt-group-form.component.css';
import {
    Button, List, ListItem, ListItemButton, ListItemText,
    TextField,
    Typography
} from "@mui/material";
import useFormValidationHook from "../../../util/forms/form-validation-hook";
import useInputValue from "../../../util/forms/input-value-hook";
import PromptGroupUpdate from "../prompt-group-update";
import React from "react";
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
        promptsInput.setValue([
            ...promptsInput.value ? promptsInput.value : [], promptInput.valueOrThrow()
        ])
    }

    return (
        <div className={'prompt-group-form-container'}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Create new Prompt Group
            </Typography>
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
                        label="Add Prompt"
                        className='prompt-group-form-text-area'
                        multiline
                        value={promptInput.value}
                        onChange={promptInput.handleChange}
                        fullWidth
                    />
                    <Button variant={"contained"} onClick={addPrompt} disabled={!isPromptValid}>
                        Add
                    </Button>
                </div>
                <div style={{flex: 1, display: "flex"}}>
                    <List
                        subheader={
                            <div style={{padding: 10, display: "flex", justifyContent: "start", background: "#121212"}}>
                                Prompts
                            </div>
                        }
                        style={{border: "1px solid gray", flex: 1, borderRadius: 5}}
                    >
                        {promptsInput.value ? promptsInput.valueOrThrow().map((item, index) =>
                            <ListItem disablePadding key={index}>
                                <ListItemButton>
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