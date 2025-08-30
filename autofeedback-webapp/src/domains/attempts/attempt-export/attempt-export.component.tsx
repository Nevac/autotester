import './attempt-export.component.css';
import {
    Button,
    FormControl,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import useInputValue from "../../util/forms/input-value-hook";
import useFormValidationHook from "../../util/forms/form-validation-hook";
import AttemptListItem from "../attempt-list-item";
import AttemptEndpoint from "../attempt-endpoint";
import {SnackbarVariant, useSnackbar} from "../../util/feedback/snackbar-hook";
import PaperDefaultComponent from "../../util/paper/paper-default.component";
import Paper from "@mui/material/Paper";
import {DataGrid, GridColDef} from "@mui/x-data-grid";

export default function AttemptExportComponent() {

    const attemptsInput = useInputValue<string[]>([], {required: true});
    const isFormValid = useFormValidationHook([
        attemptsInput,
    ]);

    const [selectableAttempts, setSelectableAttempts] = useState<AttemptListItem[]>([]);

    const attemptEndpoint = new AttemptEndpoint();
    const [openSnackbar, Snackbar] = useSnackbar();

    useEffect(() => {
        attemptEndpoint.getListItems()
            .then(items => {
                setSelectableAttempts(items);
                console.log(items)
            })
            .catch(err => {
                openSnackbar("Failed to load attempt selection", SnackbarVariant.ERROR);
                console.error(err);
            });
    }, []);

    const downloadAttempts = () => {
        attemptEndpoint.export(
            attemptsInput.valueOrThrow()
        )
        // ).then(state => {
        //     if (state == EndpointResponeStatus.SUCCESS) {
        //         openSnackbar("Export successful", SnackbarVariant.SUCCESS);
        //     } else openSnackbar("Export failed", SnackbarVariant.ERROR);
        // });
    }

    const attemptColumns: GridColDef[] = [
        {field: 'name', headerName: 'Name', width: 400},
        {field: 'exercise', headerName: 'Exercise', width: 500},
    ];

    return (
        <PaperDefaultComponent className={'attempt-export-modal-paper'}>
            <Snackbar/>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Export Attempts
            </Typography>
            <div className={'attempt-export-modal-text-area-container'}>
                <FormControl fullWidth>
                    <Paper sx={{height: 600, width: '100%'}}>
                        <DataGrid
                            rows={selectableAttempts}
                            getRowId={row => row._id}
                            columns={attemptColumns}
                            checkboxSelection
                            onRowSelectionModelChange={selection => attemptsInput.setRawValue(selection.map(String))}
                            rowSelectionModel={attemptsInput.value}
                            sx={{border: 0}}
                        />
                    </Paper>
                </FormControl>
            </div>
            <Button variant={"contained"} onClick={downloadAttempts} disabled={!isFormValid}>
                Export
            </Button>
        </PaperDefaultComponent>
    );
}