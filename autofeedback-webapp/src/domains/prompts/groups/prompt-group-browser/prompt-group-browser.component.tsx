import './prompt-group-browser.component.css';
import {
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText
} from "@mui/material";
import React, { useState, useEffect } from 'react';
import {Add} from '@mui/icons-material';
import PromptGroupEndpoint from "../prompt-group-endpoint";
import PromptGroupListItem from "../prompt-group-list-item";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";
import {useNavigate} from "react-router-dom";
import Routes from "../../../routes/routes";

export default function PromptGroupBrowserComponent() {
    const endpoint = new PromptGroupEndpoint();
    const [items, setItems] = useState<PromptGroupListItem[]>([]);

    const navigate = useNavigate();

    const [openSnackbar, Snackbar] = useSnackbar();

    useEffect(() => {
        endpoint.getListItems()
            .then(items =>
                setItems(items)
            )
            .catch(
                err => {
                    console.log(err);
                    openSnackbar("Failed to load prompt groups", SnackbarVariant.ERROR);
                }
        )}, []);

    return (
        <>
            <Snackbar/>
            <List
                subheader={
                <div style={{display: "flex", justifyContent: "end", background: "#121212"}}>
                    <IconButton aria-label="add" onClick={() => navigate(Routes.PROMPT_GROUP_CREATE)}>
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