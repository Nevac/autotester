import './exercise-create.component.css';
import ExerciseFormComponent from "../exercise-form/exercise-form.component";
import {Divider, Typography} from "@mui/material";
import PaperDefaultComponent from "../../util/paper/paper-default.component";
import ExerciseUpdate from "../exercise-update";
import {EndpointResponeStatus} from "../../util/EndpointResponeStatus";
import {SnackbarVariant, useSnackbar} from "../../util/feedback/snackbar-hook";
import ExerciseEndpoint from "../exercise-endpoint";
import {useDispatch} from "react-redux";
import {exerciseUpdateSlice} from "../exercise-update.slice";

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