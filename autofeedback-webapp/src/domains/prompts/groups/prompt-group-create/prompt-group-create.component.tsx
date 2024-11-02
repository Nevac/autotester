import './prompt-group-create.component.css';
import PaperDefaultComponent from "../../../util/paper/paper-default.component";
import {Divider, Typography} from "@mui/material";
import PromptGroupFormComponent from "../prompt-group-form/prompt-group-form.component";
import PromptGroupUpdate from "../prompt-group-update";
import {EndpointResponeStatus} from "../../../util/EndpointResponeStatus";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";
import PromptGroupEndpoint from "../prompt-group-endpoint";
import {useDispatch} from "react-redux";
import {promptGroupUpdateSlice} from "../prompt-group-update.slice";

export default function PromptGroupCreateComponent() {

    const [openSnackbar, Snackbar] = useSnackbar();
    const promptGroupEndpoint = new PromptGroupEndpoint();

    const dispatch = useDispatch()

    const createPromptGroup = (update: PromptGroupUpdate) => {
        promptGroupEndpoint.create(
            update
        ).then(state => {
            if(state == EndpointResponeStatus.SUCCESS) {
                openSnackbar("Exercise created successfully", SnackbarVariant.SUCCESS);
                dispatch(promptGroupUpdateSlice.actions.update());
            } else openSnackbar("Failed to create exercise", SnackbarVariant.ERROR);
        });
    }

    return (
        <PaperDefaultComponent className={'prompt-group-create-paper'}>
            <Snackbar/>
            <Typography id="modal-modal-title" variant="h4">
                Create exercise
                <Divider/>
            </Typography>
            <PromptGroupFormComponent save={createPromptGroup}/>
        </PaperDefaultComponent>
    )
}