import './main.view.css';
import ChatGroupBrowserComponent from "../../domains/chats/groups/chat-group-browser/chat-group-browser.component";
import ChatGroupDetailComponent from "../../domains/chats/groups/chat-group-details/chat-group-detail.component";
import Paper from "@mui/material/Paper";
import PaperDefaultComponent from "../../domains/util/paper/paper-default.component";
import MainViewSideComponent from "./side/main-view-side.component";
import {BrowserRouter, createBrowserRouter, Route, Routes as RoutesComponent, RouterProvider} from "react-router-dom";
import React from "react";
import ChatGroupCreateComponent
    from "../../domains/chats/groups/chat-group-create/chat-group-create.component";
import Routes from "../../domains/routes/routes";
import ExerciseCreateComponent from "../../domains/exercises/exercise-create/exercise-create.component";
import PromptGroupCreateComponent from "../../domains/prompts/groups/prompt-group-create/prompt-group-create.component";

export default function MainView() {

    return (
        <BrowserRouter basename={Routes.ROOT}>
            <div className={'main-view-container'}>
                <div className={'main-view-column main-view-side'}>
                    <MainViewSideComponent/>
                </div>
                <div className={'main-view-column main-view-content'}>
                    <RoutesComponent>
                        <Route path={Routes.CHAT_CREATE} element={<ChatGroupCreateComponent/>}/>
                        <Route path={Routes.CHAT_DETAILS} element={<ChatGroupDetailComponent/>}/>
                        <Route path={Routes.EXERCISE_CREATE} element={<ExerciseCreateComponent/>}/>
                        <Route path={Routes.PROMPT_GROUP_CREATE} element={<PromptGroupCreateComponent/>}/>
                    </RoutesComponent>
                </div>
            </div>
        </BrowserRouter>
    );
}