import './rag-document-edit.component.css';
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Box, Divider, Typography} from "@mui/material";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";
import RagDocumentEndpoint from "../rag-document-endpoint";
import RagDocument from "../rag-document";
import RagDocumentFormComponent from "../rag-document-form/rag-document-form.component";
import RagDocumentUpdate from "../rag-document-update";
import {EndpointResponeStatus} from "../../../util/EndpointResponeStatus";

export default function RagDocumentEditComponent() {
    let { id } = useParams();
    const [ragDocument, setRagDocument] = useState<RagDocument | undefined>();
    const [openSnackbar, Snackbar] = useSnackbar();

    const ragEndpoint = new RagDocumentEndpoint();

    useEffect(() => {
        ragEndpoint.getById(id!)
            .then(exercise =>
                setRagDocument(exercise)
            )
            .catch(err => {
                openSnackbar(`Could not load rag with id ${id}`, SnackbarVariant.ERROR);
                console.error(err);
            })
    }, [id]);

    const createRag = (update: RagDocumentUpdate) => {
        console.log(update);

        ragEndpoint.update(
            id!,
            update
        ).then(state =>
            state == EndpointResponeStatus.SUCCESS ?
                openSnackbar("Attempt created successfully", SnackbarVariant.SUCCESS) :
                openSnackbar("Failed to create rag", SnackbarVariant.ERROR)
        )
    }

    return(
        <Box className={'rag-edit-box'}>
            <Snackbar/>
            <Typography id="edit-rag-title" variant="h4">
                <div style={{padding: 20}}>
                    Edit RAG Document
                </div>
                <Divider/>
            </Typography>
            {ragDocument ?
                <div style={{padding: 20}}>
                    <RagDocumentFormComponent
                        isIdEditEnabled={false}
                        save={createRag}
                        key={ragDocument._id}
                        idInit={ragDocument.externalId}
                        externallyManged={ragDocument.externallyManaged}
                        textInit={ragDocument.metadata.text}
                        categoryInit={ragDocument.metadata.category}
                        languageInit={ragDocument.metadata.language}
                        topicInit={ragDocument.metadata.topic}
                        typeInit={ragDocument.metadata.type}
                        constructsInit={ragDocument.metadata.constructs}
                    />
                </div>
                :
                    "Could not load RagDocument"
                }
        </Box>
    )
}