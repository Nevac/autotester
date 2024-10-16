import './chat-group-create-modal.component.css';
import {Button, IconButton, List, ListItem, ListItemButton, Modal, TextField, Typography} from "@mui/material";
import Paper from "@mui/material/Paper";
import {ArrowForward} from "@mui/icons-material";
import {useState} from "react";
import ChatGroupEndpoint from "../chat-group-endpoint";
import ChatGroupCreate from "./chat-group-create";
import {EndpointCreationStatus} from "../../../util/EndpointCreationStatus";

export interface ChatCreateModalProps {
    open: boolean,
    handleClose: () => void
}

export default function ChatGroupCreateModalComponent(props: ChatCreateModalProps) {

    const [task, setTask] = useState<string>("");
    const [solution, setSolution] = useState<string>("");
    const [attempt, setAttempt] = useState<string>("");
    const [prompt, setPrompt] = useState<string>("");
    const [prompts, setPrompts] = useState<string[]>([]);

    const endpoint = new ChatGroupEndpoint();

    const addPrompt = () => {
        setPrompts([...prompts, prompt])
    }

    const createChat = () => {
        endpoint.create(
            new ChatGroupCreate(
                task,
                solution,
                attempt,
                prompts
            )
        ).then(state =>
            state == EndpointCreationStatus.SUCCESS ?
                props.handleClose() :
                console.error("Couldn't create chat")
        )
    }

    return(
        <Modal
            open={props.open}
            onClose={props.handleClose}
            className={'chat-create-modal'}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Paper className={'chat-create-modal-paper'} elevation={20}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Create new Chat
                </Typography>
                <div className={'chat-create-modal-text-area-container'}>
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Task"
                        className='chat-create-modal-text-area'
                        multiline
                        rows={20}
                        maxRows={20}
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                    />
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Solution"
                        className='chat-create-modal-text-area'
                        multiline
                        rows={20}
                        maxRows={20}
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                    />
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Attempt"
                        className='chat-create-modal-text-area'
                        multiline
                        rows={20}
                        maxRows={20}
                        value={attempt}
                        onChange={(e) => setAttempt(e.target.value)}
                    />
                </div>
                <div className={'chat-create-modal-text-area-container'}>
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Prompt"
                        className='chat-create-modal-text-area'
                        multiline
                        rows={12}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                    <IconButton size={'large'} onClick={addPrompt}>
                        <ArrowForward/>
                    </IconButton>
                    <List className={'chat-create-modal-text-area'} style={{height: 300, overflowY: "scroll"}}>
                        {prompts.map(prompt =>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <Paper style={{padding: 20, boxSizing: "border-box"}}>
                                        {prompt}
                                    </Paper>
                                </ListItemButton>
                            </ListItem>
                        )}
                    </List>
                </div>
                <Button onClick={createChat}>
                    Save
                </Button>
            </Paper>
        </Modal>
    )
}