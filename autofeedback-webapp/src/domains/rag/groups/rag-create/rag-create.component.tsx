import './rag-create.component.css';
import {Box, Divider, Typography} from "@mui/material";
import RagFormComponent from "../rag-form/rag-form.component";
import RagUpdate from "../rag-update";
import {EndpointResponeStatus} from "../../../util/EndpointResponeStatus";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";
import RagEndpoint from "../rag-endpoint";
import {useDispatch} from "react-redux";
import {ragUpdateSlice} from "../rag-update.slice";
import React from "react";

export default function RagCreateComponent() {

    const [openSnackbar, Snackbar] = useSnackbar();
    const ragEndpoint = new RagEndpoint();

    const dispatch = useDispatch()

    const createRag = (update: RagUpdate) => {
        ragEndpoint.create(
            update
        ).then(state => {
            if(state == EndpointResponeStatus.SUCCESS) {
                openSnackbar("Rag created successfully", SnackbarVariant.SUCCESS);
                dispatch(ragUpdateSlice.actions.update());
            } else openSnackbar("Failed to create Rag", SnackbarVariant.ERROR);
        });
    }

    return (
        <Box className={'rag-create-box'}>
            <Snackbar/>
            <Typography id="create-rag-title" variant="h4">
                <div style={{padding: 20}}>
                    Create Prompt Group
                </div>
                <Divider/>
            </Typography>
            <div style={{padding: 20}}>
                <RagFormComponent save={createRag}/>
            </div>
        </Box>
    )
}