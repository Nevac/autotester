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

export default function EvaluationGroupExportComponent() {

    const evaluationGroupsInput = useInputValue<string[]>([], {required: true});
    const isFormValid = useFormValidationHook([
        evaluationGroupsInput,
    ]);

    const [selectableEvaluationGroups, setSelectableEvaluationGroups] = useState<EvaluationGroupListItem[]>([]);

    const evaluationGroupEndpoint = new EvaluationGroupEndpoint();
    const [openSnackbar, Snackbar] = useSnackbar();

    useEffect(() => {
        evaluationGroupEndpoint.getListItems()
            .then(items => {
                setSelectableEvaluationGroups(items);
                console.log(items)
            })
            .catch(err => {
                openSnackbar("Failed to load Evaluation Group selection", SnackbarVariant.ERROR);
                console.error(err);
            });
    }, []);

    const downloadEvaluationGroups = () => {
        evaluationGroupEndpoint.export(
            evaluationGroupsInput.valueOrThrow()
        )
    }

    const evaluationGroupColumns: GridColDef[] = [
        {field: 'name', headerName: 'Name', width: 400},
    ];

    return (
        <PaperDefaultComponent className={'evaluation-group-export-modal-paper'}>
            <Snackbar/>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Export Evaluations
            </Typography>
            <div className={'evaluation-group-export-modal-text-area-container'}>
                <FormControl fullWidth>
                    <Paper sx={{height: 600, width: '100%'}}>
                        <DataGrid
                            rows={selectableEvaluationGroups}
                            getRowId={row => row._id}
                            columns={evaluationGroupColumns}
                            checkboxSelection
                            onRowSelectionModelChange={selection => evaluationGroupsInput.setRawValue(selection.map(String))}
                            rowSelectionModel={evaluationGroupsInput.value}
                            sx={{border: 0}}
                        />
                    </Paper>
                </FormControl>
            </div>
            <Button variant={"contained"} onClick={downloadEvaluationGroups} disabled={!isFormValid}>
                Export
            </Button>
        </PaperDefaultComponent>
    );
}