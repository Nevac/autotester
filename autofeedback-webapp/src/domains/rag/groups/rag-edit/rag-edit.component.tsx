import './rag-edit.component.css';
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Box, Divider, Typography} from "@mui/material";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";
import RagEndpoint from "../rag-endpoint";
import Rag from "../rag";
import RagFormComponent from "../rag-form/rag-form.component";
import RagUpdate from "../rag-update";
import {EndpointResponeStatus} from "../../../util/EndpointResponeStatus";

export default function RagEditComponent() {
    let { id } = useParams();
    const [rag, setRag] = useState<Rag | undefined>();
    const [openSnackbar, Snackbar] = useSnackbar();

    const ragEndpoint = new RagEndpoint();

    useEffect(() => {
        ragEndpoint.getById(id!)
            .then(exercise =>
                setRag(exercise)
            )
            .catch(err => {
                openSnackbar(`Could not load rag with id ${id}`, SnackbarVariant.ERROR);
                console.error(err);
            })
    }, [id]);

    const createRag = (update: RagUpdate) => {
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
                    Edit RAG
                </div>
                <Divider/>
            </Typography>
            {rag ?
                <div style={{padding: 20}}>
                    <RagFormComponent
                        save={createRag}
                        nameInit={rag.name}
                        apiIdInit={rag.apiId}
                        key={rag._id}
                    />
                </div>
                :
                    "Could not load Rag"
                }
        </Box>
    )
}