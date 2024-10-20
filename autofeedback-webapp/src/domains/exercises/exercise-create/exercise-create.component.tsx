import './exercise-create.component.css';
import {
    Button,
    TextField,
    Typography
} from "@mui/material";
import ExerciseUpdate from "../exercise-update";
import PaperDefaultComponent from "../../util/paper/paper-default.component";
import {SnackbarVariant, useSnackbar} from "../../util/feedback/snackbar-hook";
import {EndpointCreationStatus} from "../../util/EndpointCreationStatus";
import ExerciseEndpoint from "../exercise-endpoint";
import useInputValue from "../../util/forms/input-value-hook";
import useFormValidationHook from "../../util/forms/form-validation-hook";


export default function ExerciseCreateComponent() {

    const nameInput = useInputValue<string>("", {required: true});
    const taskInput = useInputValue<string>("", {required: true});
    const solutionInput = useInputValue<string>("", {required: true});
    const isFormValid = useFormValidationHook([
        nameInput,
        taskInput,
        solutionInput
    ]);

    const exerciseEndpoint = new ExerciseEndpoint();

    const [openSnackbar, Snackbar] = useSnackbar();
    const textAreaRows: number = 12;

    const createExercise = () => {
        exerciseEndpoint.create(
            new ExerciseUpdate(
                nameInput.value,
                taskInput.value,
                solutionInput.value
            )
        ).then(state =>
            state == EndpointCreationStatus.SUCCESS ?
                openSnackbar("Exercise created successfully", SnackbarVariant.SUCCESS) :
                openSnackbar("Failed to create exercise", SnackbarVariant.ERROR)
        )
    }

    return (
        <PaperDefaultComponent className={'chat-create-modal-paper'}>
            <Snackbar/>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Create new Exercise
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
            <div className={'chat-create-modal-text-area-container'}>
                <TextField
                    id="task"
                    required
                    label="Task"
                    className='chat-create-modal-text-area'
                    multiline
                    rows={textAreaRows}
                    value={taskInput.value}
                    onChange={taskInput.handleChange}
                    error={taskInput.error}
                />
                <TextField
                    id="solution"
                    required
                    label="Solution"
                    className='chat-create-modal-text-area'
                    multiline
                    rows={textAreaRows}
                    value={solutionInput.value}
                    onChange={solutionInput.handleChange}
                    error={solutionInput.error}
                />
            </div>
            <Button variant={"contained"} onClick={createExercise} disabled={!isFormValid}>
                Save
            </Button>
        </PaperDefaultComponent>
    )
}