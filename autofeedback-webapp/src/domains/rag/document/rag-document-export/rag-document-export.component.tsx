import './rag-document-export.component.css';
import {
    Button,
    FormControl,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import Paper from "@mui/material/Paper";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import useFormValidationHook from "../../../util/forms/form-validation-hook";
import useInputValue from "../../../util/forms/input-value-hook";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";
import PaperDefaultComponent from "../../../util/paper/paper-default.component";
import RagDocumentEndpoint from "../rag-document-endpoint";
import RagDocumentListItem from "../rag-document-list-item";

export default function RagDocumentExportComponent() {

    const ragDocumentsInput = useInputValue<string[]>([], {required: true});
    const isFormValid = useFormValidationHook([
        ragDocumentsInput,
    ]);

    const [selectableragDocuments, setSelectableragDocuments] = useState<RagDocumentListItem[]>([]);

    const ragDocumentEndpoint = new RagDocumentEndpoint();
    const [openSnackbar, Snackbar] = useSnackbar();

    useEffect(() => {
        ragDocumentEndpoint.getListItems()
            .then(items => {
                setSelectableragDocuments(items);
                console.log(items)
            })
            .catch(err => {
                openSnackbar("Failed to load RAG Document selection", SnackbarVariant.ERROR);
                console.error(err);
            });
    }, []);

    const downloadragDocuments = () => {
        ragDocumentEndpoint.export(
            ragDocumentsInput.valueOrThrow()
        )
    }

    const ragDocumentColumns: GridColDef[] = [
        {field: 'externalId', headerName: 'External RAG ID', width: 400},
    ];

    return (
        <PaperDefaultComponent className={'rag-document-export-modal-paper'}>
            <Snackbar/>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Export RAG Documents
            </Typography>
            <div className={'rag-document-export-modal-text-area-container'}>
                <FormControl fullWidth>
                    <Paper sx={{height: 600, width: '100%'}}>
                        <DataGrid
                            rows={selectableragDocuments}
                            getRowId={row => row._id}
                            columns={ragDocumentColumns}
                            checkboxSelection
                            onRowSelectionModelChange={selection => ragDocumentsInput.setRawValue(selection.map(String))}
                            rowSelectionModel={ragDocumentsInput.value}
                            sx={{border: 0}}
                        />
                    </Paper>
                </FormControl>
            </div>
            <Button variant={"contained"} onClick={downloadragDocuments} disabled={!isFormValid}>
                Export
            </Button>
        </PaperDefaultComponent>
    );
}