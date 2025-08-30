import './exercise-browser.component.css';
import {Divider, IconButton, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import React, {useEffect, useState} from 'react';
import {Add, FileDownload} from '@mui/icons-material';
import ExerciseEndpoint from "../exercise-endpoint";
import ExerciseListItem from "../exercise-list-item";
import {SnackbarVariant, useSnackbar} from "../../util/feedback/snackbar-hook";
import Routes from "../../routes/routes";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {EndpointResponeStatus} from "../../util/EndpointResponeStatus";
import DeleteConfirmButtonComponent from "../../util/delete-confirm-button/delete-confirm-button.component";
import {useAppSelector} from "../../../app/redux-hooks";
import {useDispatch} from "react-redux";
import {exerciseUpdateSlice} from "../exercise-update.slice";


export default function ExerciseBrowserComponent() {
    const endpoint = new ExerciseEndpoint();
    const [entries, setEntries] = useState<ExerciseListItem[]>([]);

    const navigate = useNavigate();

    const exercisesChanged = useAppSelector(state => state.exercisesUpdated.value)
    const dispatch = useDispatch()

    const [openSnackbar, Snackbar] = useSnackbar();

    const loadExercises = () => {
        endpoint.getListItems()
            .then(items =>
                setEntries(items)
            )
            .catch(
                err => {
                    console.log(err);
                    openSnackbar("Failed to load exercises", SnackbarVariant.ERROR);
                }
            )
    }

    useEffect(loadExercises, []);
    useEffect(loadExercises, [exercisesChanged]);

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
                    openSnackbar("Exercise delete successful", SnackbarVariant.SUCCESS);
                    dispatch(exerciseUpdateSlice.actions.update());
                } else openSnackbar("Exercise delete failed", SnackbarVariant.ERROR)
            });
    }

    return (
        <>
            <Snackbar/>
            <List
                subheader={
                <div style={{display: "flex", justifyContent: "end", background: "#121212"}}>
                    <IconButton aria-label="add" onClick={() => navigate(Routes.EXERCISE_CREATE)}>
                        <Add/>
                    </IconButton>
                </div>
                }
            >
                {entries.map(item =>
                    <div key={item._id}>
                        <ListItem disablePadding>
                            <Divider/>
                            <ListItemButton
                                selected={item._id === selectedItem}
                                onClick={() => navigate(Routes.exerciseEdit(item._id))}>
                                <ListItemText primary={item.name}/>
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