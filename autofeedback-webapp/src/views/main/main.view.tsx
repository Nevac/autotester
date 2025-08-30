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
import AttemptCreateComponent from "../../domains/attempts/attempt-create/attempt-create.component";
import AttemptEditComponent from "../../domains/attempts/attempt-edit/attempt-edit.component";
import EvaluationGroupCreateComponent
    from "../../domains/evaluation/groups/evaluation-group-create/evaluation-group-create.component";
import EvaluationGroupDetailComponent
    from "../../domains/evaluation/groups/chat-group-details/evaluation-group-detail.component";
import RagCreateComponent from "../../domains/rag/groups/rag-create/rag-create.component";
import RagEditComponent from "../../domains/rag/groups/rag-edit/rag-edit.component";
import RagDocumentCreateComponent from "../../domains/rag/document/rag-dcoument-create/rag-document-create.component";
import RagDocumentEditComponent from "../../domains/rag/document/rag-document-edit/rag-document-edit.component";
import AttemptExportComponent from "../../domains/attempts/attempt-export/attempt-export.component";

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
                            <Route path={Routes.ATTEMPT_CREATE} element={<AttemptCreateComponent/>}/>
                            <Route path={Routes.ATTEMPT_EDIT} element={<AttemptEditComponent/>}/>
                            <Route path={Routes.ATTEMPT_EXPORT} element={<AttemptExportComponent/>}/>
                            <Route path={Routes.CHAT_GROUP_CREATE} element={<ChatGroupCreateComponent/>}/>
                            <Route path={Routes.CHAT_GROUP_DETAILS} element={<ChatGroupDetailComponent key={":id"}/>}/>
                            <Route path={Routes.CHAT_GROUP_DETAIL} element={<ChatGroupDetailComponent/>}/>
                            <Route path={Routes.EXERCISE_CREATE} element={<ExerciseCreateComponent/>}/>
                            <Route path={Routes.EXERCISE_EDIT} element={<ExerciseEditComponent/>}/>
                            <Route path={Routes.PROMPT_GROUP_CREATE} element={<PromptGroupCreateComponent/>}/>
                            <Route path={Routes.PROMPT_GROUP_EDIT} element={<PromptGroupEditComponent/>}/>
                            <Route path={Routes.EVALUATION_GROUP_CREATE} element={<EvaluationGroupCreateComponent/>}/>
                            <Route path={Routes.EVALUATION_GROUP_DETAILS} element={<EvaluationGroupDetailComponent/>}/>
                            <Route path={Routes.RAG_CREATE} element={<RagCreateComponent/>}/>
                            <Route path={Routes.RAG_EDIT} element={<RagEditComponent/>}/>
                            <Route path={Routes.RAG_DOCUMENT_CREATE} element={<RagDocumentCreateComponent/>}/>
                            <Route path={Routes.RAG_DOCUMENT_EDIT} element={<RagDocumentEditComponent/>}/>
                        </RoutesComponent>
                    </PaperDefaultComponent>
                </div>
            </div>
        </BrowserRouter>
    );
}