import './exercise-create.component.css';
import ExerciseFormComponent from "../exercise-form/exercise-form.component";
import {Box, Divider, Typography} from "@mui/material";
import PaperDefaultComponent from "../../util/paper/paper-default.component";
import ExerciseUpdate from "../exercise-update";
import {EndpointResponeStatus} from "../../util/EndpointResponeStatus";
import {SnackbarVariant, useSnackbar} from "../../util/feedback/snackbar-hook";
import ExerciseEndpoint from "../exercise-endpoint";
import {useDispatch} from "react-redux";
import {exerciseUpdateSlice} from "../exercise-update.slice";
import React from "react";

export default function ExerciseCreateComponent() {
    const [openSnackbar, Snackbar] = useSnackbar();
    const exerciseEndpoint = new ExerciseEndpoint();

    const dispatch = useDispatch()

    const saveExercise = (update: ExerciseUpdate) => {
        exerciseEndpoint.create(
            update
        ).then(state => {
            if(state == EndpointResponeStatus.SUCCESS) {
                openSnackbar("Exercise saved successfully", SnackbarVariant.SUCCESS);
                dispatch(exerciseUpdateSlice.actions.update());
            } else {
                openSnackbar("Failed to saved exercise", SnackbarVariant.ERROR);
            }
        })
    }

    return(
        <Box className={'exercise-create-box'}>
            <Snackbar/>
            <Typography id="create-exercise-title" variant="h4">
                <div style={{padding: 20}}>
                    Create exercise
                </div>
                <Divider/>
            </Typography>
            <div style={{padding: 20}}>
                <ExerciseFormComponent save={saveExercise}/>
            </div>
        </Box>
    )
}