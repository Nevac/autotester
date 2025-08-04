import './feedback-references-form.component.css';
import {
    Button, FormControl, InputLabel, List, ListItem, ListItemButton, ListItemText,
    TextField, Typography,
} from "@mui/material";
import useFormValidationHook from "../../../util/forms/form-validation-hook";
import useInputValue from "../../../util/forms/input-value-hook";
import React, {useEffect, useState} from "react";
import Paper from "@mui/material/Paper";
import MarkdownEditor from "../../../util/markdown-editor/MarkdownEditor";
import {Delete} from "@mui/icons-material";
import FeedbackReferenceFormModel from "./feedback-reference-form-model";

interface PromptGroupFormProps {
    feedbackReference: FeedbackReferenceFormModel,
    onDelete: () => void
}

export default function FeedbackReferencesFormComponent(props: PromptGroupFormProps) {
    const idInput = useInputValue<string>(props.feedbackReference.id, {required: true});
    const referencesInput = useInputValue<string[]>(props.feedbackReference.references, {required: true});
    const isFormValid = useFormValidationHook([
        idInput,
        referencesInput
    ]);

    const referenceInput = useInputValue<string>("", {required: true});
    const isReferenceValid = useFormValidationHook([
        referenceInput
    ]);

    const [selectedReferenceIndex, setSelectedReferenceIndex] = useState<number>();

    useEffect(() => {
        props.feedbackReference.id = idInput.value!;
        props.feedbackReference.references = referencesInput.value!;
    }, [idInput.value, referencesInput.value]);

    const addReference = () => {
        referenceInput.setValue("");
        referencesInput.setValue([
            ...referencesInput.value ? referencesInput.value : [], referenceInput.valueOrThrow()
        ])
    }

    const editReference = () => {
        if(selectedReferenceIndex !== undefined && referencesInput.value && referenceInput.value) {
            const prompts = [...referencesInput.value]
            prompts[selectedReferenceIndex] = referenceInput.value;
            referencesInput.setValue(prompts);
            referenceInput.setValue("");
            setSelectedReferenceIndex(undefined);
        }
    }

    const removeReference = (index: number) => {
        if (referencesInput.value) {
            const newArray = referencesInput.value;
            newArray.splice(index, 1)
            referencesInput.setRawValue([...newArray]);
        }
    }

    const onClickReference = (prompt: string, index: number) => {
        if(index === selectedReferenceIndex) {
            setSelectedReferenceIndex(undefined);
            referenceInput.setValue("");
        } else {
            setSelectedReferenceIndex(index);
            referenceInput.setValue(prompt);
        }
    }

    const renderReferenceAddButton = () => {
        if(selectedReferenceIndex !== undefined) {
            return (
                <Button variant={"contained"} onClick={editReference} disabled={!isReferenceValid}>
                    Edit
                </Button>
            );
        }
        return (
            <Button variant={"contained"} onClick={addReference} disabled={!isReferenceValid}>
                Add
            </Button>
        );
    }

    return (
        <Paper elevation={0} className={'feedback-reference-form-container'}>
            <div className={'feedback-reference-form-text-area-container'}>
                <div style={{display: "flex", flexDirection: "row", gap: 10}}>
                    <TextField
                        id="name"
                        label="Name"
                        className='feedback-reference-form-text-area'
                        value={idInput.value}
                        onChange={idInput.handleChange}
                        required
                        error={idInput.error}
                    />
                    <Button variant={"contained"}
                            color={"error"}
                            onClick={props.onDelete}
                    >
                        <Typography>
                            DELETE
                        </Typography>
                    </Button>
                </div>
            </div>
            <div className={'feedback-reference-form-text-area-container'} style={{flex: 1}}>
                <div style={{display: "flex", flexDirection: "column", flex: 1, gap: 10,  minHeight: 0}}>
                    <FormControl
                        className='attempt-form-text-area'
                        error={referenceInput.error}
                    >
                        <InputLabel htmlFor="attempt-input">Reference</InputLabel>
                        <MarkdownEditor id='attempt-input' input={referenceInput} height={200}/>
                    </FormControl>
                    {renderReferenceAddButton()}
                </div>
                <div style={{flex: 1, display: "flex"}}>
                    <List
                        subheader={
                            <div style={{padding: 10, display: "flex", justifyContent: "start", background: "#121212"}}>
                                References
                            </div>
                        }
                        style={{border: "1px solid gray", flex: 1, borderRadius: 5}}
                    >
                        {referencesInput.value ? referencesInput.valueOrThrow().map((item, index) =>
                            <ListItem key={index} disablePadding style={{flex: 1, padding: 5}}>
                                <Paper className={"feedback-reference-form-reference-list-item"}>
                                    <ListItemButton
                                        selected={index === selectedReferenceIndex}
                                        onClick={() => onClickReference(item, index)}
                                    >
                                        <ListItemText primary={item}/>
                                    </ListItemButton>
                                    <Button variant={"contained"}
                                            onClick={() => removeReference(index)}>
                                        <Delete/>
                                    </Button>
                                </Paper>
                            </ListItem>
                        ) : <></>}
                    </List>
                </div>
            </div>
        </Paper>
    )
}