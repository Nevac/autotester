import './evaluation-group-export.component.css';
import {
    Button,
    FormControl,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import Paper from "@mui/material/Paper";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import useFormValidationHook from '../../../util/forms/form-validation-hook';
import useInputValue from "../../../util/forms/input-value-hook";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";
import PaperDefaultComponent from "../../../util/paper/paper-default.component";
import EvaluationGroupListItem from "../evaluation-group-list-item";
import EvaluationGroupEndpoint from "../evaluation-group-endpoint";
import {it} from "node:test";

export default function EvaluationGroupExportComponent() {

    const ragDocumentsInput = useInputValue<string[]>([], {required: true});
    const isFormValid = useFormValidationHook([
        ragDocumentsInput,
    ]);

    const [selectableragDocuments, setSelectableEvaluationGroups] = useState<EvaluationGroupListItem[]>([]);

    const evaluationGroupEndpoint = new EvaluationGroupEndpoint();
    const [openSnackbar, Snackbar] = useSnackbar();

    useEffect(() => {
        evaluationGroupEndpoint.getListItems()
            .then(items => {
                setSelectableEvaluationGroups(items);
                console.log(items)
            })
            .catch(err => {
                openSnackbar("Failed to load RAG Document selection", SnackbarVariant.ERROR);
                console.error(err);
            });
    }, []);

    const downloadragDocuments = () => {
        evaluationGroupEndpoint.export(
            ragDocumentsInput.valueOrThrow()
        )
    }

    const evaluationGroupColumns: GridColDef[] = [
        {field: 'name', headerName: 'Name', width: 400},
    ];

    return (
        <PaperDefaultComponent className={'evaluation-group-export-modal-paper'}>
            <Snackbar/>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Export RAG Documents
            </Typography>
            <div className={'evaluation-group-export-modal-text-area-container'}>
                <FormControl fullWidth>
                    <Paper sx={{height: 600, width: '100%'}}>
                        <DataGrid
                            rows={selectableragDocuments}
                            getRowId={row => row._id}
                            columns={evaluationGroupColumns}
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