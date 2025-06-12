import { configureStore } from '@reduxjs/toolkit'
import {exerciseUpdateSlice} from "../domains/exercises/exercise-update.slice";
import chatGroupUpdateSlice from "../domains/chats/groups/chat-group-update.slice";
import {promptGroupUpdateSlice} from "../domains/prompts/groups/prompt-group-update.slice";
import chatUpdateSlice from "../domains/chats/chat-update.slice";
import {attemptUpdateSlice} from "../domains/attempts/attempt-update.slice";
import evaluationGroupUpdateSlice from "../domains/evaluation/groups/evaluation-group-update.slice";

export const store = configureStore({
    reducer: {
        exercisesUpdated: exerciseUpdateSlice.reducer,
        chatGroupsUpdated: chatGroupUpdateSlice.reducer,
        promptGroupsUpdated: promptGroupUpdateSlice.reducer,
        chatsUpdated: chatUpdateSlice.reducer,
        attemptsUpdated: attemptUpdateSlice.reducer,
        evaluationGroupsUpdated: evaluationGroupUpdateSlice.reducer,
    }
})

// Get the type of our store variable
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch']