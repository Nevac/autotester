import './main.view.css';
import MainViewSideComponent from "./side/main-view-side.component";
import {BrowserRouter, Route, Routes as RoutesComponent} from "react-router-dom";
import React from "react";
import ChatGroupCreateComponent
    from "../../domains/chats/groups/chat-group-create/chat-group-create.component";
import Routes from "../../domains/routes/routes";
import ExerciseCreateComponent from "../../domains/exercises/exercise-create/exercise-create.component";
import ChatGroupDetailComponent from "../../domains/chats/groups/chat-group-details/chat-group-detail.component";
import ExerciseEditComponent from "../../domains/exercises/exercise-edit/exercise-edit.component";
import PromptGroupCreateComponent from "../../domains/prompts/groups/prompt-group-create/prompt-group-create.component";
import PromptGroupEditComponent from "../../domains/prompts/groups/prompt-group-edit/prompt-group-edit.component";
import PaperDefaultComponent from "../../domains/util/paper/paper-default.component";

export default function MainView() {

    return (
        <BrowserRouter basename={Routes.ROOT}>
            <div className={'main-view-container'}>
                <div className={'main-view-column main-view-side'}>
                    <MainViewSideComponent/>
                </div>
                <div className={'main-view-column main-view-content-column'}>
                    <PaperDefaultComponent className={'main-view-content'}>
                        <RoutesComponent>
                            <Route path={Routes.CHAT_GROUP_CREATE} element={<ChatGroupCreateComponent/>}/>
                            <Route path={Routes.CHAT_GROUP_DETAILS} element={<ChatGroupDetailComponent key={":id"}/>}/>
                            <Route path={Routes.CHAT_GROUP_DETAIL} element={<ChatGroupDetailComponent/>}/>
                            <Route path={Routes.EXERCISE_CREATE} element={<ExerciseCreateComponent/>}/>
                            <Route path={Routes.EXERCISE_EDIT} element={<ExerciseEditComponent/>}/>
                            <Route path={Routes.PROMPT_GROUP_CREATE} element={<PromptGroupCreateComponent/>}/>
                            <Route path={Routes.PROMPT_GROUP_EDIT} element={<PromptGroupEditComponent/>}/>
                        </RoutesComponent>
                    </PaperDefaultComponent>
                </div>
            </div>
        </BrowserRouter>
    );
}