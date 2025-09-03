import './evaluation-group-browser.component.css';
import {Divider, IconButton, List, ListItem, ListItemButton, ListItemText, Typography} from "@mui/material";
import React, {useEffect, useState} from 'react';
import EvaluationGroupListItem from "../evaluation-group-list-item";
import EvaluationGroupEndpoint from "../evaluation-group-endpoint";
import {Add, Assessment, FileDownload} from '@mui/icons-material';
import {useLocation, useNavigate} from "react-router-dom";
import Routes from "../../../routes/routes";
import {SnackbarVariant, useSnackbar} from "../../../util/feedback/snackbar-hook";
import DeleteConfirmButtonComponent from "../../../util/delete-confirm-button/delete-confirm-button.component";
import {EndpointResponeStatus} from "../../../util/EndpointResponeStatus";
import {useDispatch} from "react-redux";
import {useAppSelector} from "../../../../app/redux-hooks";
import {evaluationGroupsUpdateSlice} from "../evaluation-groups-update.slice";


export default function EvaluationGroupBrowserComponent() {

    const endpoint = new EvaluationGroupEndpoint();
    const [items, setItems] = useState<EvaluationGroupListItem[]>([])

    const [openSnackbar, Snackbar] = useSnackbar()

    const navigate = useNavigate();

    const evaluationGroupsChanged = useAppSelector(state => state.evaluationGroupsUpdated.value)
    const dispatch = useDispatch()

    const loadEvaluationGroups = () => {
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

    useEffect(loadEvaluationGroups, []);
    useEffect(loadEvaluationGroups, [evaluationGroupsChanged]);

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
                    openSnackbar("Evaluation delete successful", SnackbarVariant.SUCCESS);
                    dispatch(evaluationGroupsUpdateSlice.actions.update());
                } else openSnackbar("Evaluation delete failed", SnackbarVariant.ERROR)
            });
    }

    return (
        <>
            <Snackbar/>
            <List
                subheader={
                <div style={{display: "flex", justifyContent: "end", background: "#121212"}}>
                    <IconButton aria-label="add" onClick={() => navigate(Routes.EVALUATION_GROUP_STATISTICS)}>
                        <Assessment/>
                    </IconButton>
                    <IconButton aria-label="add" onClick={() => navigate(Routes.EVALUATION_GROUP_EXPORT)}>
                        <FileDownload/>
                    </IconButton>
                    <IconButton aria-label="add" onClick={() => navigate(Routes.EVALUATION_GROUP_CREATE)}>
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
                                            onClick={() => navigate(Routes.evaluationGroupDetails(item._id))}>
                                <div style={{display: "flex", flex: '1', flexDirection: "column"}}>
                                    <ListItemText primary={item.name}/>
                                    <Typography color={'textSecondary'} fontSize={'0.7em'}>STATE: {item.state}</Typography>
                                    {item.bestLlm?
                                        <Typography color={'textSecondary'} fontSize={'0.7em'}>Best LLM: {item.bestLlm} | SCORE: {item.bestScore?.toFixed(3)}</Typography> :
                                        <></>
                                    }
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