import './exercise-edit.component.css';
import {useEffect, useState} from "react";
import ExerciseEndpoint from "../exercise-endpoint";
import {useParams} from "react-router-dom";
import Exercise from "../exercise";
import ExerciseFormComponent from "../exercise-form/exercise-form.component";
import {SnackbarVariant, useSnackbar} from "../../util/feedback/snackbar-hook";
import {Divider, Typography} from "@mui/material";
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
        <PaperDefaultComponent className={'prompt-group-edit-paper'}>
            <Snackbar/>
            <Typography id="modal-modal-title" variant="h4">
                Edit exercise
                <Divider/>
            </Typography>
            {exercise ?
                    <ExerciseFormComponent
                        save={saveExercise}
                        nameInit={exercise.name}
                        taskInit={exercise.task}
                        solutionInit={exercise.solution}
                        key={exercise._id}
                    /> :
                    "Could not load Exercise"
                }
        </PaperDefaultComponent>
    )
}