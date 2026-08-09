import './rag-static-form.component.css';
import {
    Button, FormControl,
    TextField,
    Typography
} from "@mui/material";
import useFormValidationHook from "../../../util/forms/form-validation-hook";
import useInputValue from "../../../util/forms/input-value-hook";
import RagStaticUpdate from "../rag-static-update";
import React, {useEffect, useState} from "react";
import Paper from "@mui/material/Paper";
import {DataGrid, GridColDef, GridRowSelectionModel, GridSortingInitialState, GridToolbar} from "@mui/x-data-grid";
import RagDocumentEndpoint from "../../document/rag-document-endpoint";
import ExerciseEndpoint from "../../../exercises/exercise-endpoint";
import AttemptEndpoint from "../../../attempts/attempt-endpoint";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";
import {Llm} from "../../../llms/llm";
import AttemptListItem from "../../../attempts/attempt-list-item";
import PromptGroupListItem from "../../../prompts/groups/prompt-group-list-item";
import RagListItem from "../../groups/rag-list-item";
import RagDocument from "../../document/rag-document";
import RagDocumentListItem from "../../document/rag-document-list-item";
import ExerciseListItem from "../../../exercises/exercise-list-item";

interface RagStaticFormProps {
    save: (update: RagStaticUpdate) => void,
    nameInit?: string,
    exerciseRagDocumentsInit?: Map<string, string[]>,
    attemptRagDocumentsInit?: Map<string, string[]>,
}

export default function RagStaticFormComponent(props: RagStaticFormProps) {
    const nameInput = useInputValue<string>(props.nameInit, {required: true});
    const exerciseRagDocumentsInput = useInputValue<Map<string, string[]>>(
        props.exerciseRagDocumentsInit ? props.exerciseRagDocumentsInit : new Map(), {required: true}
    );
    const attemptRagDocumentsInput = useInputValue<Map<string, string[]>>(
        props.attemptRagDocumentsInit ? props.attemptRagDocumentsInit : new Map(), {required: true}
    );
    const isFormValid = useFormValidationHook([
        nameInput,
        exerciseRagDocumentsInput,
        attemptRagDocumentsInput
    ]);

    const [selectedExercise, setSelectedExercise] = useState<string>()
    const [selectedAttempt, setSelectedAttempt] = useState<string>()
    const [selectableExercises, setSelectableExercises] = useState<ExerciseListItem[]>([]);
    const [selectableAttempts, setSelectableAttempts] = useState<AttemptListItem[]>([]);
    const [selectableRagDocuments, setSelectableRagDocuments] = useState<RagDocumentListItem[]>([]);

    const exercisesEndpoint = new ExerciseEndpoint();
    const attemptEndpoint = new AttemptEndpoint();
    const ragDocumentsEndpoint = new RagDocumentEndpoint();


    const [openSnackbar, Snackbar] = useSnackbar();

    useEffect(() => {
        exercisesEndpoint.getListItems()
            .then(items => setSelectableExercises(items))
            .catch(err => {
                openSnackbar("Failed to load prompt group selection", SnackbarVariant.ERROR);
                console.error(err);
            });
        attemptEndpoint.getListItems()
            .then(items => { setSelectableAttempts(items); console.log(items) })
            .catch(err => {
                openSnackbar("Failed to load attempt selection", SnackbarVariant.ERROR);
                console.error(err);
            });
        ragDocumentsEndpoint.getListItems()
            .then(items => setSelectableRagDocuments(items))
            .catch(err => {
                openSnackbar("Failed to load rag selection", SnackbarVariant.ERROR);
                console.error(err);
            });
    }, []);

    const saveRagStatic = () => {
        props.save(
            RagStaticUpdate.of(
                nameInput.valueOrThrow(),
                exerciseRagDocumentsInput.valueOrThrow(),
                attemptRagDocumentsInput.valueOrThrow()
            )
        )
    }

    const renderSelection = () => {
        const ragDocumentsColumns: GridColDef[] = [
            { field: 'externalId', headerName: 'Name', width: 1000 },
        ];

        const attemptColumns: GridColDef[] = [
            { field: 'name', headerName: 'Name', width: 1000 },
        ];

        const exercisesColumns: GridColDef[] = [
            { field: 'name', headerName: 'Name', width: 1000 },
        ];

        const initialSorting: GridSortingInitialState = {
            sortModel: [
                {
                    field: 'name',
                    sort: 'asc'
                }
            ]
        }

        const onExerciseRagDocumentSelected = (selection: GridRowSelectionModel) => {
            if(selectedExercise) {
                const map = new Map(exerciseRagDocumentsInput.valueOrThrow());
                map.set(selectedExercise, selection.map(String))
                exerciseRagDocumentsInput.setRawValue(map);
            }
        }

        const getExerciseRagDocumentSelection = (): string[] => {
            const map = exerciseRagDocumentsInput.valueOrThrow();
            if(selectedExercise && map.has(selectedExercise)) {
                return map.get(selectedExercise)!!;
            }
            return [];
        }

        const onAttemptRagDocumentSelected = (selection: GridRowSelectionModel) => {
            if(selectedAttempt) {
                const map = new Map(exerciseRagDocumentsInput.valueOrThrow());
                map.set(selectedAttempt, selection.map(String))
                exerciseRagDocumentsInput.setRawValue(map);
            }
        }

        const getAttemptRagDocumentSelection = (): string[] => {
            const map = attemptRagDocumentsInput.valueOrThrow();
            if(selectedAttempt && map.has(selectedAttempt)) {
                return map.get(selectedAttempt)!!;
            }
            return [];
        }

        return (
            <div style={{display: "flex", flexDirection: "column", gap: "20px"}}>
                <div style={{display: "flex", flexDirection: "row", gap: "20px"}}>
                    <div className={'rag-static-form-modal-text-area-container'}>
                        <FormControl fullWidth>
                            <Paper sx={{height: 500}}>
                                <DataGrid
                                    getRowId={entry => entry._id}
                                    disableMultipleRowSelection
                                    rows={selectableExercises}
                                    columns={exercisesColumns}
                                    onRowSelectionModelChange={selection => setSelectedExercise(selection[0] as string)}
                                    rowSelectionModel={selectedExercise}
                                    sx={{border: 0}}
                                    initialState={{sorting: initialSorting}}
                                    slots={{ toolbar: GridToolbar }}
                                    hideFooterSelectedRowCount
                                />
                            </Paper>
                        </FormControl>
                    </div>
                    <div className={'rag-static-form-modal-text-area-container'}>
                        <FormControl fullWidth>
                            <Paper sx={{height: 500}}>
                                <DataGrid
                                    getRowId={entry => entry._id}
                                    rows={selectableRagDocuments}
                                    columns={ragDocumentsColumns}
                                    onRowSelectionModelChange={onExerciseRagDocumentSelected}
                                    rowSelectionModel={getExerciseRagDocumentSelection()}
                                    sx={{border: 0}}
                                    initialState={{sorting: initialSorting}}
                                    slots={{ toolbar: GridToolbar }}
                                    checkboxSelection
                                    hideFooterSelectedRowCount
                                />
                            </Paper>
                        </FormControl>
                    </div>
                </div>
                <div style={{display: "flex", flexDirection: "row", gap: "20px"}}>
                    <div className={'rag-static-form-modal-text-area-container'}>
                        <FormControl fullWidth>
                            <Paper sx={{height: 500}}>
                                <DataGrid
                                    getRowId={entry => entry._id}
                                    disableMultipleRowSelection
                                    rows={selectableAttempts}
                                    columns={attemptColumns}
                                    onRowSelectionModelChange={selection => setSelectedAttempt(selection[0] as string)}
                                    rowSelectionModel={selectedAttempt}
                                    sx={{border: 0}}
                                    initialState={{sorting: initialSorting}}
                                    slots={{ toolbar: GridToolbar }}
                                    hideFooterSelectedRowCount
                                />
                            </Paper>
                        </FormControl>
                    </div>
                    <div className={'rag-static-form-modal-text-area-container'}>
                        <FormControl fullWidth>
                            <Paper sx={{height: 500}}>
                                <DataGrid
                                    getRowId={entry => entry._id}
                                    rows={selectableRagDocuments}
                                    columns={ragDocumentsColumns}
                                    onRowSelectionModelChange={onAttemptRagDocumentSelected}
                                    rowSelectionModel={getAttemptRagDocumentSelection()}
                                    sx={{border: 0}}
                                    initialState={{sorting: initialSorting}}
                                    slots={{ toolbar: GridToolbar }}
                                    checkboxSelection
                                    hideFooterSelectedRowCount
                                />
                            </Paper>
                        </FormControl>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={'rag-static-form-container'}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Create new Prompt Group
            </Typography>
            <div className={'rag-static-form-text-area-container'}>
                <TextField
                    id="name"
                    label="Name"
                    className='rag-static-form-text-area'
                    value={nameInput.value}
                    onChange={nameInput.handleChange}
                    required
                    error={nameInput.error}
                />
            </div>
            {renderSelection()}
            <Button variant={"contained"} onClick={saveRagStatic} disabled={!isFormValid}>
                Save
            </Button>
        </div>
    )
}