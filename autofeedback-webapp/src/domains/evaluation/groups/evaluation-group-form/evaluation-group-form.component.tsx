import './evaluation-group-form.component.css';
import {
    Button, Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    MenuItem,
    TextField,
    TextFieldClasses,
    Typography
} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import EvaluationGroupEndpoint from "../evaluation-group-endpoint";
import EvaluationGroupUpdate from "../evaluation-group-update";
import {EndpointResponeStatus} from "../../../util/EndpointResponeStatus";
import PaperDefaultComponent from "../../../util/paper/paper-default.component";
import PromptGroupEndpoint from "../../../prompts/groups/prompt-group-endpoint";
import PromptGroupListItem from "../../../prompts/groups/prompt-group-list-item";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";
import useInputValue from "../../../util/forms/input-value-hook";
import useFormValidationHook from "../../../util/forms/form-validation-hook";
import {useDispatch} from "react-redux";
import {Llm} from "../../../llms/llm";
import AttemptEndpoint from "../../../attempts/attempt-endpoint";
import AttemptListItem from "../../../attempts/attempt-list-item";
import Paper from "@mui/material/Paper";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import EnumUtil from "../../../util/enum/EnumUtil";
import RagListItem from "../../../rag/groups/rag-list-item";
import RagEndpoint from "../../../rag/groups/rag-endpoint";
import {evaluationGroupsUpdateSlice} from "../evaluation-groups-update.slice";

interface ChatGroupFormProps {
    nameInit?: string,
    exerciseInit?: string,
    promptGroupInit?: string,
    attemptsInit?: string[],
    ragInit?: string,
    llmsInit?: Llm[],
    astInit?: boolean,
}

class SelectableLlm {
    constructor(
        public readonly id: string,
        public readonly value: Llm
    ) {

    }
    public static of(llm: Llm): SelectableLlm {
        return new SelectableLlm(
            llm.toString(),
            llm
        );
    }
}

export default function EvaluationGroupFormComponent(props: ChatGroupFormProps) {

    const nameInput = useInputValue<string>(props.nameInit, {required: true});
    const promptGroupInput = useInputValue<string>(props.promptGroupInit, {required: true});
    const attemptsInput = useInputValue<string[]>(props.attemptsInit, {required: true});
    const ragInput = useInputValue<string | undefined>(props.ragInit, {required: false});
    const llmsInput = useInputValue<string[]>(props.llmsInit, {required: true});
    const astInput = useInputValue<boolean>(props.astInit ? props.astInit : true, {required: true});
    const isFormValid = useFormValidationHook([
        nameInput,
        promptGroupInput,
        attemptsInput,
        llmsInput
    ]);

    const [selectableAttempts, setSelectableAttempts] = useState<AttemptListItem[]>([]);
    const [selectablePromptGroups, setselectablePromptGroups] = useState<PromptGroupListItem[]>([]);
    const [selectableRags, setSelectableRags] = useState<RagListItem[]>([]);
    const ragSelectRef = useRef<HTMLInputElement>(null)
    const [selectableLlms, setSelectableLlms] = useState<SelectableLlm[]>([]);

    const evaluationGroupEndpoint = new EvaluationGroupEndpoint();
    const attemptEndpoint = new AttemptEndpoint();
    const promptGroupEndpoint = new PromptGroupEndpoint();
    const ragEndpoint = new RagEndpoint();

    const [openSnackbar, Snackbar] = useSnackbar();

    const dispatch = useDispatch()

    useEffect(() => {
        attemptEndpoint.getListItems()
            .then(items => { setSelectableAttempts(items); console.log(items) })
            .catch(err => {
                openSnackbar("Failed to load attempt selection", SnackbarVariant.ERROR);
                console.error(err);
            });
        promptGroupEndpoint.getListItems()
            .then(items => setselectablePromptGroups(items))
            .catch(err => {
                openSnackbar("Failed to load prompt group selection", SnackbarVariant.ERROR);
                console.error(err);
            });
        ragEndpoint.getListItems()
            .then(items => setSelectableRags(items))
            .catch(err => {
                openSnackbar("Failed to load rag selection", SnackbarVariant.ERROR);
                console.error(err);
            });
        const llms = Object.values(Llm).map(llm => SelectableLlm.of(llm));
        setSelectableLlms(llms);
    }, []);

    const createChat = () => {
        evaluationGroupEndpoint.create(
            new EvaluationGroupUpdate(
                nameInput.valueOrThrow(),
                promptGroupInput.valueOrThrow(),
                attemptsInput.valueOrThrow(),
                llmsInput.valueOrThrow(),
                astInput.valueOrThrow(),
                ragInput.valueOrUndefined()
            )
        ).then(state => {
            if(state == EndpointResponeStatus.SUCCESS) {
                openSnackbar("Evaluation created successfully", SnackbarVariant.SUCCESS);
                dispatch(evaluationGroupsUpdateSlice.actions.update());
            } else openSnackbar("Failed to create chat", SnackbarVariant.ERROR);

        });
    }

    const resetRagSelection = () => {
        console.log("RESET")
        if(ragSelectRef?.current) {
            ragSelectRef.current.value = "";
        }
        ragInput.setRawValue(undefined);
    }

    const llmColumns: GridColDef[] = [
        { field: 'id', headerName: 'LLM', width: 200 },
    ];

    const attemptColumns: GridColDef[] = [
        { field: 'name', headerName: 'Name', width: 400 },
        { field: 'exercise', headerName: 'Exercise', width: 500 },
    ];

    return (
        <PaperDefaultComponent className={'evaluation-group-form-modal-paper'}>
            <Snackbar/>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Create new Evaluation
            </Typography>
            <div className={'evaluation-group-form-modal-text-area-container'}>
                <TextField
                    id="name"
                    label="Name"
                    className='evaluation-group-form-modal-text-area'
                    value={nameInput.value}
                    onChange={nameInput.handleChange}
                    required
                    error={nameInput.error}
                />
                <div>
                    <FormControl fullWidth style={{display: "flex", flexDirection: "row"}}>
                        <TextField
                            fullWidth
                            select
                            id="rag-label"
                            value={ragInput.value}
                            label="RAG"
                            onChange={ragInput.handleChange}
                            error={ragInput.error}
                            ref={ragSelectRef}
                        >
                            {selectableRags.map(rags =>
                                <MenuItem value={rags._id}>{rags.name}</MenuItem>
                            )}
                        </TextField>
                        <Button variant={"outlined"} onClick={resetRagSelection}>
                            Reset
                        </Button>
                    </FormControl>
                    <FormControl style={{width: 400}}>
                        <FormControlLabel control={<Checkbox defaultChecked />} label="Use AST" />
                    </FormControl>
                </div>
                <FormControl fullWidth>
                    <TextField
                        select
                        id="prompt-group-label"
                        value={promptGroupInput.value}
                        label="Instruction Prompt"
                        onChange={promptGroupInput.handleChange}
                        required
                        error={promptGroupInput.error}
                    >
                        {selectablePromptGroups.map(promptGroups =>
                            <MenuItem value={promptGroups._id}>{promptGroups.name}</MenuItem>
                        )}
                    </TextField>
                </FormControl>
            </div>
            <div className={'evaluation-group-form-modal-text-area-container'}>
                <FormControl fullWidth>
                    <FormControl fullWidth>
                        <Paper sx={{height: 200, width: '100%'}}>
                            <DataGrid
                                rows={selectableLlms}
                                columns={llmColumns}
                                onRowSelectionModelChange={selection => llmsInput.setRawValue(selection.map(String))}
                                rowSelectionModel={llmsInput.value}
                                checkboxSelection
                                sx={{ border: 0 }}
                            />
                        </Paper>
                    </FormControl>
                </FormControl>
            </div>
            <div className={'evaluation-group-form-modal-text-area-container'}>
                <FormControl fullWidth>
                    <Paper sx={{height: 300, width: '100%'}}>
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
            <Button variant={"contained"} onClick={createChat} disabled={!isFormValid}>
                Save
            </Button>
        </PaperDefaultComponent>
    )
}