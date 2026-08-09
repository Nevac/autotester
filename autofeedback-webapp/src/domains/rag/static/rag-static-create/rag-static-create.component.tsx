import './rag-static-create.component.css';
import {Box, Divider, Typography} from "@mui/material";
import RagStaticFormComponent from "../rag-static-form/rag-static-form.component";
import RagStaticUpdate from "../rag-static-update";
import {EndpointResponeStatus} from "../../../util/EndpointResponeStatus";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";
import RagStaticEndpoint from "../rag-static-endpoint";
import {useDispatch} from "react-redux";
import {ragStaticUpdateSlice} from "../rag-static-update.slice";
import React from "react";

export default function RagStaticCreateComponent() {

    const [openSnackbar, Snackbar] = useSnackbar();
    const ragEndpoint = new RagStaticEndpoint();

    const dispatch = useDispatch()

    const createRagStatic = (update: RagStaticUpdate) => {
        ragEndpoint.create(
            update
        ).then(state => {
            if(state == EndpointResponeStatus.SUCCESS) {
                openSnackbar("RagDocument created successfully", SnackbarVariant.SUCCESS);
                dispatch(ragStaticUpdateSlice.actions.update());
            } else openSnackbar("Failed to create RagDocument", SnackbarVariant.ERROR);
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
                <RagStaticFormComponent save={createRagStatic}/>
            </div>
        </Box>
    )
}