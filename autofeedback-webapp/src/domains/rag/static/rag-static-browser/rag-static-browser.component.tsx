import './rag-static-browser.component.css';
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
import RagStaticEndpoint from "../rag-static-endpoint";
import RagStaticListItem from "../rag-static-list-item";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";
import {useLocation, useNavigate} from "react-router-dom";
import Routes from "../../../routes/routes";
import {EndpointResponeStatus} from "../../../util/EndpointResponeStatus";
import DeleteConfirmButtonComponent from "../../../util/delete-confirm-button/delete-confirm-button.component";
import {useAppSelector} from "../../../../app/redux-hooks";
import {useDispatch} from "react-redux";
import {ragStaticUpdateSlice} from "../rag-static-update.slice";

export default function RagStaticBrowserComponent() {
    const endpoint = new RagStaticEndpoint();
    const [items, setItems] = useState<RagStaticListItem[]>([]);

    const navigate = useNavigate();

    const [openSnackbar, Snackbar] = useSnackbar();

    const ragChanged = useAppSelector(state => state.ragsUpdated.value)
    const dispatch = useDispatch()

    const loadRags = () => {
        endpoint.getListItems()
            .then(items =>
                setItems(items)
            )
            .catch(
                err => {
                    console.log(err);
                    openSnackbar("Failed to load RAG Statics", SnackbarVariant.ERROR);
                }
            );
    }

    useEffect(loadRags, []);
    useEffect(loadRags, [ragChanged]);

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
                    openSnackbar("RAG Static delete successful", SnackbarVariant.SUCCESS);
                    dispatch(ragStaticUpdateSlice.actions.update());
                }
                else openSnackbar("RAG Static delete failed", SnackbarVariant.ERROR)
            });
    }

    return (
        <>
            <Snackbar/>
            <List
                subheader={
                <div style={{display: "flex", justifyContent: "end", background: "#121212"}}>
                    <IconButton aria-label="add" onClick={() => navigate(Routes.RAG_STATIC_CREATE)}>
                        <Add/>
                    </IconButton>
                </div>
                }
            >
                {items.map(item =>
                    <>
                        <ListItem disablePadding key={item._id}>
                            <ListItemButton selected={item._id === selectedItem}
                                            onClick={() => navigate(Routes.ragStaticEdit(item._id))}>
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