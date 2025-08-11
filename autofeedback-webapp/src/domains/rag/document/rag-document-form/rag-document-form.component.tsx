import './rag-document-form.component.css';
import {
    Button, FormControl, InputLabel, List, ListItem, ListItemButton, ListItemText,
    TextField,
    Typography
} from "@mui/material";
import useFormValidationHook from "../../../util/forms/form-validation-hook";
import useInputValue, {InputValue} from "../../../util/forms/input-value-hook";
import RagDocumentUpdate from "../rag-document-update";
import React, {useState} from "react";
import RagDocumentMetadataUpdate from "../rag-document-metadata-update";
import MarkdownEditor from "../../../util/markdown-editor/MarkdownEditor";
import Paper from "@mui/material/Paper";

interface PromptGroupFormProps {
    isIdEditEnabled: boolean,
    save: (update: RagDocumentUpdate) => void,
    idInit?: string,
    textInit?: string,
    categoryInit?: string,
    languageInit?: string,
    topicInit?: string,
    typeInit?: string,
    constructsInit?: string[]
}

export default function RagDocumentFormComponent(props: PromptGroupFormProps) {
    const idInput = useInputValue<string>(props.idInit, {required: true});
    const textInput = useInputValue<string>(props.textInit, {required: true});
    const categoryInput = useInputValue<string>(props.categoryInit, {required: true});
    const languageInput = useInputValue<string>(props.languageInit, {required: true});
    const topicInput = useInputValue<string>(props.topicInit, {required: true});
    const typeInput = useInputValue<string>(props.typeInit, {required: true});
    const constructsInput = useInputValue<string[]>(props.constructsInit, {required: true});
    const isFormValid = useFormValidationHook([
        idInput,
        textInput,
        categoryInput,
        languageInput,
        topicInput,
        typeInput,
        constructsInput
    ]);

    const constructInput = useInputValue<string>("", {required: true});
    const isConstructValid = useFormValidationHook([
        constructInput
    ]);

    const [selectedConstructIndex, setSelectedConstructIndex] = useState<number>();

    const saveRagDocument = () => {
        props.save(
            new RagDocumentUpdate(
                idInput.valueOrThrow(),
                new RagDocumentMetadataUpdate(
                    idInput.valueOrThrow(),
                    categoryInput.valueOrThrow(),
                    languageInput.valueOrThrow(),
                    topicInput.valueOrThrow(),
                    typeInput.valueOrThrow(),
                    constructsInput.valueOrThrow()
                )
            )
        )
    }

    const renderTextInput = (id: string, label: string, input: InputValue<any>, isEnabled: boolean = true) => {
        return (
            <TextField
                id={id}
                label={label}
                className='rag-document-form-text-area'
                value={input.value}
                onChange={input.handleChange}
                required
                error={input.error}
                disabled={!isEnabled}
            />
        );
    }

    const addConstruct = () => {
        constructInput.setValue("");
        constructsInput.setValue([
            ...constructsInput.value ? constructsInput.value : [], constructInput.valueOrThrow()
        ])
    }

    const editConstruct = () => {
        if(selectedConstructIndex !== undefined && constructsInput.value && constructInput.value) {
            const prompts = [...constructsInput.value]
            prompts[selectedConstructIndex] = constructInput.value;
            constructsInput.setValue(prompts);
            constructInput.setValue("");
            setSelectedConstructIndex(undefined);
        }
    }

    const onClickConstructs = (prompt: string, index: number) => {
        if(index === selectedConstructIndex) {
            setSelectedConstructIndex(undefined);
            constructInput.setValue("");
        } else {
            setSelectedConstructIndex(index);
            constructInput.setValue(prompt);
        }
    }


    const renderConstructAddButton = () => {
        if(selectedConstructIndex !== undefined) {
            return (
                <Button variant={"contained"} onClick={editConstruct} disabled={!isConstructValid}>
                    Edit
                </Button>
            );
        }
        return (
            <Button variant={"contained"} onClick={addConstruct} disabled={!isConstructValid}>
                Add
            </Button>
        );
    }

    return (
        <div className={'rag-document-form-container'}>
            <div className={'rag-document-form-text-area-container'}>
                {renderTextInput("externalId", "External Id in RAG database", idInput, props.isIdEditEnabled)}
            </div>
            <Typography variant={'h5'}>Metadata</Typography>
            <div className={'rag-document-form-text-area-container'}>
                {renderTextInput("category", "Category", categoryInput)}
                {renderTextInput("language", "Language", languageInput)}
                {renderTextInput("topic", "Topic", topicInput)}
                {renderTextInput("type", "Type", typeInput)}
            </div>


            <div className={'rag-document-form-text-area-container'}>
                <div style={{display: "flex", flexDirection: "column", flex: 1, gap: 10, minHeight: 0}}>
                    <TextField
                        style={{overflowY: "scroll", flex: 1}}
                        id="task"
                        label="Add to Constructs"
                        className='prompt-group-form-text-area'
                        multiline
                        value={constructInput.value}
                        onChange={constructInput.handleChange}
                        fullWidth
                    />
                    {renderConstructAddButton()}
                </div>
                <div style={{flex: 1, display: "flex"}}>
                    <List
                        subheader={
                            <div style={{padding: 10, display: "flex", justifyContent: "start", background: "#121212"}}>
                                Instruction
                            </div>
                        }
                        style={{border: "1px solid gray", flex: 1, borderRadius: 5}}
                    >
                        {constructsInput.value ? constructsInput.valueOrThrow().map((item, index) =>
                            <ListItem disablePadding key={index}>
                                <ListItemButton
                                    selected={index === selectedConstructIndex}
                                    onClick={() => onClickConstructs(item, index)}>
                                    <Paper style={{padding: 10, flex: 1}}>
                                        <ListItemText primary={item}/>
                                    </Paper>
                                </ListItemButton>
                            </ListItem>
                        ) : <></>}
                    </List>
                </div>
            </div>

            <div className={'rag-document-form-text-area-container'}>
                <FormControl
                    className='rag-document-form-text-area'
                    error={textInput.error}
                >
                    <InputLabel htmlFor="attempt-input">Text</InputLabel>
                    <MarkdownEditor id='text-input' input={textInput}/>
                </FormControl>
            </div>

            <Button variant={"contained"} onClick={saveRagDocument} disabled={!isFormValid}>
                Save
            </Button>
        </div>
    )
}