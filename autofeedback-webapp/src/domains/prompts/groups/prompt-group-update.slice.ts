import {createSlice} from "@reduxjs/toolkit";

export const promptGroupUpdateSlice = createSlice({
    name: 'promptGroupsUpdated',
    initialState: {
        value: () => {},
    },
    reducers: {
        update: state => {
            state.value = () => {};
        }
    }
})