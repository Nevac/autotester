import {createSlice} from "@reduxjs/toolkit";

export const evaluationGroupsUpdateSlice = createSlice({
    name: 'evaluationGroupsUpdated',
    initialState: {
        value: () => {},
    },
    reducers: {
        update: state => {
            state.value = () => {};
        }
    }
})

export const evaluationGroupUpdateSlice = createSlice({
    name: 'evaluationGroupUpdated',
    initialState: {
        value: () => {},
    },
    reducers: {
        update: state => {
            state.value = () => {};
        }
    }
})