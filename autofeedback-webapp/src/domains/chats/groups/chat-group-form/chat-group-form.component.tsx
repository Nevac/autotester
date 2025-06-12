import './chat-group-form.component.css';
import {Button, FormControl, MenuItem, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import ChatGroupEndpoint from "../chat-group-endpoint";
import ChatGroupUpdate from "../chat-group-update";
import {EndpointResponeStatus} from "../../../util/EndpointResponeStatus";
import PaperDefaultComponent from "../../../util/paper/paper-default.component";
import ExerciseEndpoint from "../../../exercises/exercise-endpoint";
import PromptGroupEndpoint from "../../../prompts/groups/prompt-group-endpoint";
import ExerciseListItem from "../../../exercises/exercise-list-item";
import PromptGroupListItem from "../../../prompts/groups/prompt-group-list-item";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";
import useInputValue from "../../../util/forms/input-value-hook";
import useFormValidationHook from "../../../util/forms/form-validation-hook";
import {useDispatch} from "react-redux";
import chatGroupUpdateSlice from "../chat-group-update.slice";

interface ChatGroupFormProps {
    nameInit?: string,
    exerciseInit?: string,
    promptGroupInit?: string,
    attemptInit?: string
}

export default function ChatGroupFormComponent(props: ChatGroupFormProps) {

    const nameInput = useInputValue<string>(props.nameInit, {required: true});
    const exerciseInput = useInputValue<string>(props.exerciseInit, {required: true});
    const promptGroupInput = useInputValue<string>(props.promptGroupInit, {required: true});
    const attemptInput = useInputValue<string>(props.attemptInit, {required: true});
    const isFormValid = useFormValidationHook([
        nameInput,
        exerciseInput,
        attemptInput,
        attemptInput
    ]);

    const [selectableExercises, setSelectableExercises] = useState<ExerciseListItem[]>([]);
    const [selectablePromptGroups, setSelectablePromptGroups] = useState<PromptGroupListItem[]>([]);

    const chatGroupEndpoint = new ChatGroupEndpoint();
    const exerciseEndpoint = new ExerciseEndpoint();
    const promptGroupEndpoint = new PromptGroupEndpoint();

    const [openSnackbar, Snackbar] = useSnackbar();
    const textAreaRows: number = 12;

    const dispatch = useDispatch()

    useEffect(() => {
        exerciseEndpoint.getListItems()
            .then(items => setSelectableExercises(items))
            .catch(err => {
                openSnackbar("Failed to load exercise selection", SnackbarVariant.ERROR);
                console.error(err);
            });
        promptGroupEndpoint.getListItems()
            .then(items => setSelectablePromptGroups(items))
            .catch(err => {
                openSnackbar("Failed to load prompt group selection", SnackbarVariant.ERROR);
                console.error(err);
            });
    }, []);

    const createChat = () => {
        chatGroupEndpoint.create(
            new ChatGroupUpdate(
                nameInput.valueOrThrow(),
                exerciseInput.valueOrThrow(),
                promptGroupInput.valueOrThrow(),
                attemptInput.valueOrThrow()
            )
        ).then(state => {
            if(state == EndpointResponeStatus.SUCCESS) {
                openSnackbar("Evaluation created successfully", SnackbarVariant.SUCCESS);
                dispatch(chatGroupUpdateSlice.actions.update());
            } else openSnackbar("Failed to create chat", SnackbarVariant.ERROR);

        });
    }

    return (
        <PaperDefaultComponent className={'chat-create-modal-paper'}>
            <Snackbar/>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Create new Chat
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
                <FormControl fullWidth>
                    <TextField
                        select
                        id="exercise-label"
                        value={exerciseInput.value}
                        label="Attempt"
                        onChange={exerciseInput.handleChange}
                        required
                        error={exerciseInput.error}
                    >
                        {selectableExercises.map(exercise =>
                            <MenuItem value={exercise._id}>{exercise.name}</MenuItem>
                        )}
                    </TextField>
                </FormControl>
                <FormControl fullWidth>
                    <TextField
                        select
                        id="prompt-group-label"
                        value={promptGroupInput.value}
                        label="Instruction Prompt"
                        onChange={promptGroupInput.handleChange}
                        required
                        error={promptGroupInput.error}
                    >
                        {selectablePromptGroups.map(promptGroups =>
                            <MenuItem value={promptGroups._id}>{promptGroups.name}</MenuItem>
                        )}
                    </TextField>
                </FormControl>

            </div>
            <div className={'chat-create-modal-text-area-container'}>
                <TextField
                    id="outlined-multiline-flexible"
                    label="Attempt"
                    className='chat-create-modal-text-area'
                    multiline
                    rows={textAreaRows}
                    value={attemptInput.value}
                    onChange={attemptInput.handleChange}
                    error={attemptInput.error}
                />
            </div>
            <Button variant={"contained"} onClick={createChat} disabled={!isFormValid}>
                Save
            </Button>
        </PaperDefaultComponent>
    )
}