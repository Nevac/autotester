import './exercise-browser.component.css';
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
import ExerciseEndpoint from "../exercise-endpoint";
import ExerciseListItem from "../exercise-list-item";
import {SnackbarVariant, useSnackbar} from "../../util/feedback/snackbar-hook";
import Routes from "../../routes/routes";
import {useNavigate} from "react-router-dom";


export default function ExerciseBrowserComponent() {
    const endpoint = new ExerciseEndpoint();
    const [entries, setEntries] = useState<ExerciseListItem[]>([]);

    const navigate = useNavigate();

    const [openSnackbar, Snackbar] = useSnackbar();

    useEffect(() => {
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
    }, []);

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
                    <ListItem disablePadding key={item._id}>
                        <Divider/>
                        <ListItemButton onClick={() => navigate(Routes.exerciseEdit(item._id))}>
                            <ListItemText primary={item.name}/>
                        </ListItemButton>
                    </ListItem>
                ) }
            </List>
        </>
    )
}