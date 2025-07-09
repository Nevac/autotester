import './rag-form.component.css';
import {
    Button,
    TextField,
    Typography
} from "@mui/material";
import useFormValidationHook from "../../../util/forms/form-validation-hook";
import useInputValue from "../../../util/forms/input-value-hook";
import RagUpdate from "../rag-update";
import React from "react";

interface PromptGroupFormProps {
    save: (update: RagUpdate) => void,
    nameInit?: string,
    apiIdInit?: string
}

export default function RagFormComponent(props: PromptGroupFormProps) {
    const nameInput = useInputValue<string>(props.nameInit, {required: true});
    const apiIdInput = useInputValue<string>(props.apiIdInit, {required: true});
    const isFormValid = useFormValidationHook([
        nameInput,
        apiIdInput
    ]);

    const savePromptGroup = () => {
        props.save(
            new RagUpdate(
                nameInput.valueOrThrow(),
                apiIdInput.valueOrThrow()
            )
        )
    }

    return (
        <div className={'rag-form-container'}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Create new Prompt Group
            </Typography>
            <div className={'rag-form-text-area-container'}>
                <TextField
                    id="name"
                    label="Name"
                    className='rag-form-text-area'
                    value={nameInput.value}
                    onChange={nameInput.handleChange}
                    required
                    error={nameInput.error}
                />
            </div>
            <div className={'rag-form-text-area-container'}>
                <TextField
                    id="apiId"
                    label="Api Id"
                    className='rag-form-text-area'
                    value={apiIdInput.value}
                    onChange={apiIdInput.handleChange}
                    required
                    error={apiIdInput.error}
                />
            </div>
            <Button variant={"contained"} onClick={savePromptGroup} disabled={!isFormValid}>
                Save
            </Button>
        </div>
    )
}