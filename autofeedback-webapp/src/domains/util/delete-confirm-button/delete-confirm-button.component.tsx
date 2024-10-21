import {useState} from "react";
import {IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


interface DeleteConfirmButtonProps {
    delete: () => void;
}

enum DeleteButtonState {
    INITIAL,
    CONFIRMATION
}

export default function DeleteConfirmButtonComponent(props: DeleteConfirmButtonProps) {
    const [state, setState] = useState<DeleteButtonState>(DeleteButtonState.INITIAL);

    const renderDeleteButton = () => {
        if(state === DeleteButtonState.INITIAL) {
            return (
                <IconButton aria-label="delete">
                    <DeleteIcon onClick={() => setState(DeleteButtonState.CONFIRMATION)}/>
                </IconButton>
            );
        } else {
            return (
                <IconButton aria-label="delete" onMouseLeave={() => setState(DeleteButtonState.INITIAL)}>
                    <CheckCircleIcon onClick={() => {
                        setState(DeleteButtonState.INITIAL);
                        props.delete();
                    }}/>
                </IconButton>
            )
        }
    }

    return (
        <>
            {renderDeleteButton()}
        </>
    )
}