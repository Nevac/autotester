import './prompt-group-create.component.css';
import PaperDefaultComponent from "../../../util/paper/paper-default.component";
import {Divider, Typography} from "@mui/material";
import PromptGroupFormComponent from "../prompt-group-form/prompt-group-form.component";
import PromptGroupUpdate from "../prompt-group-update";
import {EndpointCreationStatus} from "../../../util/EndpointCreationStatus";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";
import PromptGroupEndpoint from "../prompt-group-endpoint";

export default function PromptGroupCreateComponent() {

    const [openSnackbar, Snackbar] = useSnackbar();
    const promptGroupEndpoint = new PromptGroupEndpoint();

    const createPromptGroup = (update: PromptGroupUpdate) => {
        promptGroupEndpoint.create(
            update
        ).then(state =>
            state == EndpointCreationStatus.SUCCESS ?
                openSnackbar("Exercise created successfully", SnackbarVariant.SUCCESS) :
                openSnackbar("Failed to create exercise", SnackbarVariant.ERROR)
        )
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