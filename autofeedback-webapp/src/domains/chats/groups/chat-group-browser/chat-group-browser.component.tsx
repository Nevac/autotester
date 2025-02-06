import './chat-group-browser.component.css';
import {Divider, IconButton, List, ListItem, ListItemButton, ListItemText, Typography} from "@mui/material";
import React, {useEffect, useState} from 'react';
import ChatGroupListItem from "../chat-group-list-item";
import ChatGroupEndpoint from "../chat-group-endpoint";
import {Add} from '@mui/icons-material';
import {useLocation, useNavigate} from "react-router-dom";
import Routes from "../../../routes/routes";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";
import DeleteConfirmButtonComponent from "../../../util/delete-confirm-button/delete-confirm-button.component";
import {EndpointResponeStatus} from "../../../util/EndpointResponeStatus";
import {useDispatch} from "react-redux";
import chatGroupUpdateSlice from "../chat-group-update.slice";
import {useAppSelector} from "../../../../app/redux-hooks";


export default function ChatGroupBrowserComponent() {

    const endpoint = new ChatGroupEndpoint();
    const [items, setItems] = useState<ChatGroupListItem[]>([])

    const [openSnackbar, Snackbar] = useSnackbar()

    const navigate = useNavigate();

    const exercisesChanged = useAppSelector(state => state.chatGroupsUpdated.value)
    const dispatch = useDispatch()

    const loadChatGroups = () => {
        endpoint.getListItems()
            .then(items =>
                setItems(items)
            )
            .catch(
                err => {
                    console.log(err);
                    openSnackbar("Failed to load chat groups", SnackbarVariant.ERROR);
                }
            );
    }

    useEffect(loadChatGroups, []);
    useEffect(loadChatGroups, [exercisesChanged]);

    const location = useLocation();
    const [selectedItem, setSelectedItem] = useState<string | undefined>(undefined);

    useEffect(() => {
        setSelectedItem(
            location.pathname.split("/")[2]
        );
    }, [location]);

    const deleteItem = (id: string) => {
        endpoint.delete(id)
            .then(state => {
                if(state === EndpointResponeStatus.SUCCESS) {
                    openSnackbar("Chat delete successful", SnackbarVariant.SUCCESS);
                    dispatch(chatGroupUpdateSlice.actions.update());
                } else openSnackbar("Chat delete failed", SnackbarVariant.ERROR)
            });
    }

    return (
        <>
            <Snackbar/>
            <List
                subheader={
                <div style={{display: "flex", justifyContent: "end", background: "#121212"}}>
                    <IconButton aria-label="add" onClick={() => navigate(Routes.CHAT_GROUP_CREATE)}>
                        <Add/>
                    </IconButton>
                </div>
                }
            >
                {items.map(item =>
                    <div key={item._id}>
                        <ListItem disablePadding >
                            <Divider/>
                            <ListItemButton selected={item._id === selectedItem}
                                            onClick={() => navigate(Routes.chatGroupDetails(item._id))}>
                                <div style={{display: "flex", flex: '1', flexDirection: "column"}}>
                                    <ListItemText primary={item.name}/>
                                    <Typography color={'textSecondary'} fontSize={'0.7em'}>EX: {item.exercise}</Typography>
                                    <Typography color={'textSecondary'} fontSize={'0.7em'}>PR: {item.promptGroup}</Typography>
                                </div>
                                <DeleteConfirmButtonComponent delete={() => deleteItem(item._id)}/>
                            </ListItemButton>
                        </ListItem>
                        <Divider/>
                    </div>
                ) }
            </List>
        </>
    )
}