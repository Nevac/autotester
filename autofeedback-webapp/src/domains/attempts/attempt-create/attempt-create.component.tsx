import './attempt-create.component.css';
import AttemptFormComponent from "../attempt-form/attempt-form.component";
import {Box, Divider, Typography} from "@mui/material";
import PaperDefaultComponent from "../../util/paper/paper-default.component";
import AttemptUpdate from "../attempt-update";
import {EndpointResponeStatus} from "../../util/EndpointResponeStatus";
import {SnackbarVariant, useSnackbar} from "../../util/feedback/snackbar-hook";
import AttemptEndpoint from "../attempt-endpoint";
import {useDispatch} from "react-redux";
import {attemptUpdateSlice} from "../attempt-update.slice";
import React from "react";

export default function AttemptCreateComponent() {
    const [openSnackbar, Snackbar] = useSnackbar();
    const exerciseEndpoint = new AttemptEndpoint();

    const dispatch = useDispatch()

    const saveAttempt = (update: AttemptUpdate) => {
        exerciseEndpoint.create(
            update
        ).then(state => {
            if(state == EndpointResponeStatus.SUCCESS) {
                openSnackbar("Attempt saved successfully", SnackbarVariant.SUCCESS);
                dispatch(attemptUpdateSlice.actions.update());
            } else {
                openSnackbar("Failed to saved attempt", SnackbarVariant.ERROR);
            }
        })
    }

    return(
        <Box className={'attempt-create-box'}>
            <Snackbar/>
            <Typography id="create-attempt-title" variant="h4">
                <div style={{padding: 20}}>
                    Create attempt
                </div>
                <Divider/>
            </Typography>
            <div style={{padding: 20}}>
                <AttemptFormComponent save={saveAttempt}/>
            </div>
        </Box>
    )
}