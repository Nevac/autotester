import './rag-static-edit.component.css';
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Box, Divider, Typography} from "@mui/material";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";
import RagStaticEndpoint from "../rag-static-endpoint";
import RagStatic from "../rag-static";
import RagStaticFormComponent from "../rag-static-form/rag-static-form.component";
import RagStaticUpdate from "../rag-static-update";
import {EndpointResponeStatus} from "../../../util/EndpointResponeStatus";
import RagStaticDocuments from "../rag-static-documents";

export default function RagStaticEditComponent() {
    let { id } = useParams();
    const [ragStatic, setRagStatic] = useState<RagStatic | undefined>();
    const [openSnackbar, Snackbar] = useSnackbar();

    const ragEndpoint = new RagStaticEndpoint();

    useEffect(() => {
        ragEndpoint.getById(id!)
            .then(exercise =>
                setRagStatic(exercise)
            )
            .catch(err => {
                openSnackbar(`Could not load rag with id ${id}`, SnackbarVariant.ERROR);
                console.error(err);
            })
    }, [id]);

    const createRag = (update: RagStaticUpdate) => {
        ragEndpoint.update(
            id!,
            update
        ).then(state =>
            state == EndpointResponeStatus.SUCCESS ?
                openSnackbar("Attempt created successfully", SnackbarVariant.SUCCESS) :
                openSnackbar("Failed to create rag", SnackbarVariant.ERROR)
        )
    }

    const toRagDocumentsMap = (ragStaticDocuments: RagStaticDocuments[]): Map<string, string[]> => {
        return new Map(ragStaticDocuments.map(entry => [entry.entityId, entry.ragDocuments]));
    }

    return(
        <Box className={'rag-edit-box'}>
            <Snackbar/>
            <Typography id="edit-rag-title" variant="h4">
                <div style={{padding: 20}}>
                    Edit RAG
                </div>
                <Divider/>
            </Typography>
            {ragStatic ?
                <div style={{padding: 20}}>
                    <RagStaticFormComponent
                        save={createRag}
                        nameInit={ragStatic.name}
                        exerciseRagDocumentsInit={toRagDocumentsMap(ragStatic.exerciseRagDocuments)}
                        attemptRagDocumentsInit={toRagDocumentsMap(ragStatic.attemptRagDocuments)}
                        key={ragStatic._id}
                    />
                </div>
                :
                    "Could not load RagDocument"
                }
        </Box>
    )
}