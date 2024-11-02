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
import {EndpointResponeStatus} from "../../../util/EndpointResponeStatus";
import DeleteConfirmButtonComponent from "../../../util/delete-confirm-button/delete-confirm-button.component";
import {useAppSelector} from "../../../../app/redux-hooks";
import {useDispatch} from "react-redux";
import {exerciseUpdateSlice} from "../../../exercises/exercise-update.slice";
import {promptGroupUpdateSlice} from "../prompt-group-update.slice";

export default function PromptGroupBrowserComponent() {
    const endpoint = new PromptGroupEndpoint();
    const [items, setItems] = useState<PromptGroupListItem[]>([]);

    const navigate = useNavigate();

    const [openSnackbar, Snackbar] = useSnackbar();

    const promptGroupsChanged = useAppSelector(state => state.promptGroupsUpdated.value)
    const dispatch = useDispatch()

    const loadPromptGroups = () => {
        endpoint.getListItems()
            .then(items =>
                setItems(items)
            )
            .catch(
                err => {
                    console.log(err);
                    openSnackbar("Failed to load prompt groups", SnackbarVariant.ERROR);
                }
            );
    }

    useEffect(loadPromptGroups, []);
    useEffect(loadPromptGroups, [promptGroupsChanged]);

    const deleteItem = (id: string) => {
        endpoint.delete(id)
            .then(state => {
                if(state === EndpointResponeStatus.SUCCESS) {
                    openSnackbar("Chat delete successful", SnackbarVariant.SUCCESS);
                    dispatch(promptGroupUpdateSlice.actions.update());
                }
                else openSnackbar("Chat delete failed", SnackbarVariant.ERROR)
            });
    }

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
                    <>
                        <ListItem disablePadding key={item._id}>
                            <ListItemButton onClick={() => navigate(Routes.promptGroupEdit(item._id))}>
                                <ListItemText primary={item.name}/>
                                <DeleteConfirmButtonComponent delete={() => deleteItem(item._id)}/>
                            </ListItemButton>
                        </ListItem>
                        <Divider/>
                    </>
                    ) }
            </List>
        </>
    )
}