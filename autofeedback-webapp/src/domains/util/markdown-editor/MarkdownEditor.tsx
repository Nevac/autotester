import './MarkdownEditor.css';
import MDEditor from "@uiw/react-md-editor";
import {InputValue} from "../forms/input-value-hook";


interface MarkdownEditorProps {
    id?: string,
    input: InputValue<string>,
}

export default function MarkdownEditor(props: MarkdownEditorProps) {
    return (
        <MDEditor
            id={props.id}
            className='markdown-editor'
            style={{marginTop: 50}}
            value={props.input.value}
            height={600}
            onChange={props.input.setValue}
        />
    )
}