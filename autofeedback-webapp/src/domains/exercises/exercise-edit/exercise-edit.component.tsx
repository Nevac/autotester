import './exercise-edit.component.css';
import React, {useEffect, useState} from "react";
import ExerciseEndpoint from "../exercise-endpoint";
import {useParams} from "react-router-dom";
import Exercise from "../exercise";
import ExerciseFormComponent from "../exercise-form/exercise-form.component";
import {SnackbarVariant, useSnackbar} from "../../util/feedback/snackbar-hook";
import {Box, Divider, Typography} from "@mui/material";
import PaperDefaultComponent from "../../util/paper/paper-default.component";
import ExerciseUpdate from "../exercise-update";
import {EndpointResponeStatus} from "../../util/EndpointResponeStatus";

export default function ExerciseEditComponent() {
    let { id } = useParams();
    const [exercise, setExercise] = useState<Exercise | undefined>();
    const [openSnackbar, Snackbar] = useSnackbar();

    const exerciseEndpoint = new ExerciseEndpoint();

    useEffect(() => {
        exerciseEndpoint.getById(id!)
            .then(exercise =>
                setExercise(exercise)
            )
            .catch(err => {
                openSnackbar(`Could not load Exercise with id ${id}`, SnackbarVariant.ERROR);
                console.error(err);
            })
    }, [id]);

    const saveExercise = (update: ExerciseUpdate) => {
        exerciseEndpoint.update(
            id!,
            update
        ).then(state =>
            state == EndpointResponeStatus.SUCCESS ?
                openSnackbar("Exercise saved successfully", SnackbarVariant.SUCCESS) :
                openSnackbar("Failed to saved exercise", SnackbarVariant.ERROR)
        )
    }

    return(
        <Box className={'exercise-edit-box'}>
            <Snackbar/>
            <Typography id="edit-exercise-title" variant="h4">
                <div style={{padding: 20}}>
                    Edit exercise
                </div>
                <Divider/>
            </Typography>
            {exercise ?
                <div style={{padding: 20}}>
                    <ExerciseFormComponent
                        save={saveExercise}
                        nameInit={exercise.name}
                        taskInit={exercise.task}
                        solutionInit={exercise.solution}
                        key={exercise._id}
                    />
                </div>
                :
                "Could not load Exercise"
            }
        </Box>
    )
}