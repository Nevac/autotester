import {createSlice} from "@reduxjs/toolkit";

export const exerciseUpdateSlice = createSlice({
    name: 'exercisesUpdated',
    initialState: {
        value: () => {},
    },
    reducers: {
        update: state => {
            state.value = () => {};
        }
    }
})