import './rag-document-create.component.css';
import {Box, Divider, Typography} from "@mui/material";
import RagDocumentFormComponent from "../rag-document-form/rag-document-form.component";
import RagDocumentUpdate from "../rag-document-update";
import {EndpointResponeStatus} from "../../../util/EndpointResponeStatus";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";
import RagDocumentEndpoint from "../rag-document-endpoint";
import {useDispatch} from "react-redux";
import {ragDocumentUpdateSlice} from "../rag-document-update.slice";
import React from "react";

export default function RagDocumentCreateComponent() {

    const [openSnackbar, Snackbar] = useSnackbar();
    const ragDocumentEndpoint = new RagDocumentEndpoint();

    const dispatch = useDispatch()

    const createRag = (update: RagDocumentUpdate) => {
        ragDocumentEndpoint.create(
            update
        ).then(state => {
            if(state == EndpointResponeStatus.SUCCESS) {
                openSnackbar("RagDocument created successfully", SnackbarVariant.SUCCESS);
                dispatch(ragDocumentUpdateSlice.actions.update());
            } else openSnackbar("Failed to create RagDocument", SnackbarVariant.ERROR);
        });
    }

    return (
        <Box className={'rag-document-create-box'}>
            <Snackbar/>
            <Typography id="create-rag-title" variant="h4">
                <div style={{padding: 20}}>
                    Create RAG Document
                </div>
                <Divider/>
            </Typography>
            <div style={{padding: 20}}>
                <RagDocumentFormComponent isIdEditEnabled={true} save={createRag}/>
            </div>
        </Box>
    )
}