import './prompt-group-create.component.css';
import {Box, Divider, Typography} from "@mui/material";
import PromptGroupFormComponent from "../prompt-group-form/prompt-group-form.component";
import PromptGroupUpdate from "../prompt-group-update";
import {EndpointResponeStatus} from "../../../util/EndpointResponeStatus";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";
import PromptGroupEndpoint from "../prompt-group-endpoint";
import {useDispatch} from "react-redux";
import {promptGroupUpdateSlice} from "../prompt-group-update.slice";
import React from "react";

export default function PromptGroupCreateComponent() {

    const [openSnackbar, Snackbar] = useSnackbar();
    const promptGroupEndpoint = new PromptGroupEndpoint();

    const dispatch = useDispatch()

    const createPromptGroup = (update: PromptGroupUpdate) => {
        promptGroupEndpoint.create(
            update
        ).then(state => {
            if(state == EndpointResponeStatus.SUCCESS) {
                openSnackbar("Attempt created successfully", SnackbarVariant.SUCCESS);
                dispatch(promptGroupUpdateSlice.actions.update());
            } else openSnackbar("Failed to create exercise", SnackbarVariant.ERROR);
        });
    }

    return (
        <Box className={'prompt-group-create-box'}>
            <Snackbar/>
            <Typography id="create-prompt-group-title" variant="h4">
                <div style={{padding: 20}}>
                    Create Prompt Group
                </div>
                <Divider/>
            </Typography>
            <div style={{padding: 20}}>
                <PromptGroupFormComponent save={createPromptGroup}/>
            </div>
        </Box>
    )
}