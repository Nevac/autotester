import './rag-document-browser.component.css';
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
import RagDocumentEndpoint from "../rag-document-endpoint";
import RagListItem from "../rag-document-list-item";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";
import {useLocation, useNavigate} from "react-router-dom";
import Routes from "../../../routes/routes";
import {EndpointResponeStatus} from "../../../util/EndpointResponeStatus";
import DeleteConfirmButtonComponent from "../../../util/delete-confirm-button/delete-confirm-button.component";
import {useAppSelector} from "../../../../app/redux-hooks";
import {useDispatch} from "react-redux";
import {ragDocumentUpdateSlice} from "../rag-document-update.slice";
import RagDocumentListItem from "../rag-document-list-item";

export default function RagDocumentBrowserComponent() {
    const endpoint = new RagDocumentEndpoint();
    const [items, setItems] = useState<RagDocumentListItem[]>([]);

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
                    openSnackbar("Failed to load Rag Documents", SnackbarVariant.ERROR);
                }
            );
    }

    useEffect(loadRags, []);
    useEffect(loadRags, [ragChanged]);

    useEffect(() => {
        console.log(items)
    }, [items]);

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
                    openSnackbar("Rag Document delete successful", SnackbarVariant.SUCCESS);
                    dispatch(ragDocumentUpdateSlice.actions.update());
                }
                else openSnackbar("Rag Document delete failed", SnackbarVariant.ERROR)
            });
    }

    return (
        <>
            <Snackbar/>
            <List
                subheader={
                <div style={{display: "flex", justifyContent: "end", background: "#121212"}}>
                    <IconButton aria-label="add" onClick={() => navigate(Routes.RAG_DOCUMENT_CREATE)}>
                        <Add/>
                    </IconButton>
                </div>
                }
            >
                {items.map(item =>
                    <>
                        <ListItem disablePadding key={item._id}>
                            <ListItemButton selected={item._id === selectedItem}
                                            onClick={() => navigate(Routes.ragDocumentEdit(item._id))}>
                                <ListItemText primary={item.externalId}/>
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