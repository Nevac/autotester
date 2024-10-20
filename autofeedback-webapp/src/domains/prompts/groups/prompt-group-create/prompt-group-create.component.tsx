import './prompt-group-create.component.css';
import {
    Button, Divider, IconButton, List, ListItem, ListItemButton, ListItemText,
    TextField,
    Typography
} from "@mui/material";
import useFormValidationHook from "../../../util/forms/form-validation-hook";
import useInputValue from "../../../util/forms/input-value-hook";
import {EndpointCreationStatus} from "../../../util/EndpointCreationStatus";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";
import PaperDefaultComponent from "../../../util/paper/paper-default.component";
import PromptGroupEndpoint from "../prompt-group-endpoint";
import PromptGroupUpdate from "../prompt-group-update";
import Routes from "../../../routes/routes";
import {Add} from "@mui/icons-material";
import React from "react";
import Paper from "@mui/material/Paper";


export default function PromptGroupCreateComponent() {

    const nameInput = useInputValue<string>("", {required: true});
    const promptsInput = useInputValue<string[]>([], {required: true});
    const isFormValid = useFormValidationHook([
        nameInput,
        promptsInput
    ]);

    const promptInput = useInputValue<string>("", {required: true});
    const isPromptValid = useFormValidationHook([
        promptInput
    ]);

    const promptGroupEndpoint = new PromptGroupEndpoint();

    const [openSnackbar, Snackbar] = useSnackbar();
    const textAreaRows: number = 12;

    const createPromptGroup = () => {
        promptGroupEndpoint.create(
            new PromptGroupUpdate(
                nameInput.value,
                promptsInput.value
            )
        ).then(state =>
            state == EndpointCreationStatus.SUCCESS ?
                openSnackbar("Exercise created successfully", SnackbarVariant.SUCCESS) :
                openSnackbar("Failed to create exercise", SnackbarVariant.ERROR)
        )
    }

    const addPrompt = () => {
        promptsInput.setValue([...promptsInput.value, promptInput.value])
    }

    return (
        <PaperDefaultComponent className={'chat-create-modal-paper'}>
            <Snackbar/>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Create new Prompt Group
            </Typography>
            <div className={'chat-create-modal-text-area-container'}>
                <TextField
                    id="name"
                    label="Name"
                    className='chat-create-modal-text-area'
                    value={nameInput.value}
                    onChange={nameInput.handleChange}
                    required
                    error={nameInput.error}
                />
            </div>
            <div className={'chat-create-modal-text-area-container'} style={{flex: 1}}>
                <div style={{display: "flex", flexDirection: "column", flex: 1, gap: 10,  minHeight: 0}}>
                    <TextField
                        style={{overflowY: "scroll", flex: 1}}
                        id="task"
                        label="Add Prompt"
                        className='chat-create-modal-text-area'
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
                        {promptsInput.value.map((item, index) =>
                            <ListItem disablePadding key={index}>
                                <Divider/>
                                <ListItemButton>
                                    <Paper style={{padding: 10, flex: 1}}>
                                        <ListItemText primary={item}/>
                                    </Paper>
                                </ListItemButton>
                            </ListItem>
                        ) }
                    </List>
                </div>

            </div>
            <Button variant={"contained"} onClick={createPromptGroup} disabled={!isFormValid}>
                Save
            </Button>
        </PaperDefaultComponent>
    )
}