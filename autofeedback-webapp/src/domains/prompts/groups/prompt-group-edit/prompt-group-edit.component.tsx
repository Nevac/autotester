import './prompt-group-edit.component.css';
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import PaperDefaultComponent from "../../../util/paper/paper-default.component";
import {Divider, Typography} from "@mui/material";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";
import PromptGroupEndpoint from "../prompt-group-endpoint";
import PromptGroup from "../prompt-group";
import PromptGroupFormComponent from "../prompt-group-form/prompt-group-form.component";
import PromptGroupUpdate from "../prompt-group-update";
import {EndpointResponeStatus} from "../../../util/EndpointResponeStatus";

export default function PromptGroupEditComponent() {
    let { id } = useParams();
    const [promptGroup, setPromptGroup] = useState<PromptGroup | undefined>();
    const [openSnackbar, Snackbar] = useSnackbar();

    const promptGroupEndpoint = new PromptGroupEndpoint();

    useEffect(() => {
        promptGroupEndpoint.getById(id!)
            .then(exercise =>
                setPromptGroup(exercise)
            )
            .catch(err => {
                openSnackbar(`Could not load Exercise with id ${id}`, SnackbarVariant.ERROR);
                console.error(err);
            })
    }, [id]);

    const createPromptGroup = (update: PromptGroupUpdate) => {
        promptGroupEndpoint.update(
            id!,
            update
        ).then(state =>
            state == EndpointResponeStatus.SUCCESS ?
                openSnackbar("Exercise created successfully", SnackbarVariant.SUCCESS) :
                openSnackbar("Failed to create exercise", SnackbarVariant.ERROR)
        )
    }

    return(
        <PaperDefaultComponent className={'prompt-group-edit-paper'}>
            <Snackbar/>
            <Typography id="modal-modal-title" variant="h4">
                Edit exercise
                <Divider/>
            </Typography>
            {promptGroup ?
                    <PromptGroupFormComponent
                        save={createPromptGroup}
                        nameInit={promptGroup.name}
                        promptsInit={promptGroup.prompts}
                        key={promptGroup._id}
                    /> :
                    "Could not load Exercise"
                }
        </PaperDefaultComponent>
    )
}