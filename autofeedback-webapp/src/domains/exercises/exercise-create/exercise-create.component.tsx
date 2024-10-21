import './exercise-create.component.css';
import ExerciseFormComponent from "../exercise-form/exercise-form.component";
import {Divider, Typography} from "@mui/material";
import PaperDefaultComponent from "../../util/paper/paper-default.component";
import ExerciseUpdate from "../exercise-update";
import {EndpointResponeStatus} from "../../util/EndpointResponeStatus";
import {SnackbarVariant, useSnackbar} from "../../util/feedback/snackbar-hook";
import ExerciseEndpoint from "../exercise-endpoint";

export default function ExerciseCreateComponent() {
    const [openSnackbar, Snackbar] = useSnackbar();
    const exerciseEndpoint = new ExerciseEndpoint();

    const saveExercise = (update: ExerciseUpdate) => {
        exerciseEndpoint.create(
            update
        ).then(state =>
            state == EndpointResponeStatus.SUCCESS ?
                openSnackbar("Exercise saved successfully", SnackbarVariant.SUCCESS) :
                openSnackbar("Failed to saved exercise", SnackbarVariant.ERROR)
        )
    }

    return(
        <PaperDefaultComponent className={'exercise-create-paper'}>
            <Snackbar/>
            <Typography id="modal-modal-title" variant="h4">
                Create exercise
                <Divider/>
            </Typography>
            <ExerciseFormComponent save={saveExercise}/>
        </PaperDefaultComponent>
    )
}