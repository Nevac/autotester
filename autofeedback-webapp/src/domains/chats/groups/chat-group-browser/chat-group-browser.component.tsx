import './chat-group-browser.component.css';
import {Divider, IconButton, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import React, {useEffect, useState} from 'react';
import ChatGroupListItem from "../chat-group-list-item";
import ChatGroupEndpoint from "../chat-group-endpoint";
import {Add} from '@mui/icons-material';
import {useNavigate} from "react-router-dom";
import Routes from "../../../routes/routes";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";


export default function ChatGroupBrowserComponent() {

    const endpoint = new ChatGroupEndpoint();
    const [items, setItems] = useState<ChatGroupListItem[]>([])

    const [openSnackbar, Snackbar] = useSnackbar()

    const navigate = useNavigate();

    useEffect(() => {
        endpoint.getListItems()
            .then(items =>
                setItems(items)
            )
            .catch(
                err => {
                    console.log(err);
                    openSnackbar("Failed to load chat groups", SnackbarVariant.ERROR);
                }
            )
    }, []);

    return (
        <>
            <Snackbar/>
            <List
                subheader={
                <div style={{display: "flex", justifyContent: "end", background: "#121212"}}>
                    <IconButton aria-label="add" onClick={() => navigate(Routes.CHAT_CREATE)}>
                        <Add/>
                    </IconButton>
                </div>
                }
            >
                {items.map(item =>
                    <ListItem disablePadding key={item._id}>
                        <Divider/>
                        <ListItemButton>
                            <ListItemText primary={item.name}/>
                        </ListItemButton>
                    </ListItem>
                ) }
            </List>
        </>
    )
}