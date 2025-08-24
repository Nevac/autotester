import './attempt-edit.component.css';
import React, {useEffect, useState} from "react";
import AttemptEndpoint from "../attempt-endpoint";
import {useParams} from "react-router-dom";
import Attempt from "../attempt";
import AttemptFormComponent from "../attempt-form/attempt-form.component";
import {SnackbarVariant, useSnackbar} from "../../util/feedback/snackbar-hook";
import {Box, Divider, Typography} from "@mui/material";
import PaperDefaultComponent from "../../util/paper/paper-default.component";
import AttemptUpdate from "../attempt-update";
import {EndpointResponeStatus} from "../../util/EndpointResponeStatus";

export default function AttemptEditComponent() {
    let { id } = useParams();
    const [attempt, setAttempt] = useState<Attempt | undefined>();
    const [openSnackbar, Snackbar] = useSnackbar();

    const endpoint = new AttemptEndpoint();

    useEffect(() => {
        endpoint.getById(id!)
            .then(attempt => {
                    setAttempt(attempt)
                }
            )
            .catch(err => {
                openSnackbar(`Could not load Attempt with id ${id}`, SnackbarVariant.ERROR);
                console.error(err);
            })
    }, [id]);

    const saveExercise = (update: AttemptUpdate) => {
        endpoint.update(
            id!,
            update
        ).then(state =>
            state == EndpointResponeStatus.SUCCESS ?
                openSnackbar("Attempt saved successfully", SnackbarVariant.SUCCESS) :
                openSnackbar("Failed to save Attempt", SnackbarVariant.ERROR)
        );
    }

    return(
        <Box className={'attempt-edit-box'}>
            <Snackbar/>
            <Typography id="edit-attempt-title" variant="h4">
                <div style={{padding: 20}}>
                    Edit attempt
                </div>
                <Divider/>
            </Typography>
            {attempt ?
                <div style={{padding: 20}}>
                    <AttemptFormComponent
                        save={saveExercise}
                        nameInit={attempt.name}
                        exerciseIdInit={attempt.exercise._id}
                        complexityInit={attempt.complexity}
                        attemptInit={attempt.attempt}
                        expectedFeedbackInit={attempt.expectedFeedback}
                        key={attempt._id}
                    />
                </div>
                :
                "Could not load Attempt"
            }
        </Box>
    )
}