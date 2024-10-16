import Paper from '@mui/material/Paper';
import {Divider, IconButton, List, ListItem, ListItemButton, ListItemText, ListSubheader} from "@mui/material";
import { useState, useEffect } from 'react';
import ChatListEntry from "./chat-list-entry";
import ChatGroupEndpoint from "../groups/chat-group-endpoint";
import {Add} from '@mui/icons-material';
import ChatGroupCreateModalComponent from "../groups/chat-group-create/chat-group-create-modal.component";


export default function ChatBrowserComponent() {

    const endpoint = new ChatGroupEndpoint();
    const [entries, setEntries] = useState<ChatListEntry[]>([])
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

    useEffect(() => {
        endpoint.getListEntries()
            .then(entries =>
                setEntries(entries)
            )}, []);

    const handleCreateModalClose = () => {
        setIsCreateModalOpen(false);
    }

    return (
        <Paper elevation={20} style={{flex: 1, overflowY: "auto"}}>
            <ChatGroupCreateModalComponent open={isCreateModalOpen} handleClose={handleCreateModalClose}/>
            <List
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader" style={{
                        display: "flex",
                        flexDirection: "row"
                    }}>
                        <div style={{flex: 1}}>
                            Chats
                        </div>
                        <div>
                            <IconButton aria-label="delete" onClick={() => setIsCreateModalOpen(true)}>
                                <Add/>
                            </IconButton>
                        </div>
                    </ListSubheader>
                }
            >
                { entries.map(entry =>
                    <ListItem disablePadding key={entry._id}>
                        <Divider/>
                        <ListItemButton>
                            <ListItemText primary={entry.name} />
                        </ListItemButton>
                    </ListItem>
                ) }
            </List>
        </Paper>
    )
}