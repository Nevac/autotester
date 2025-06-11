import {createSlice} from "@reduxjs/toolkit";

export const attemptUpdateSlice = createSlice({
    name: 'attemptsUpdated',
    initialState: {
        value: () => {},
    },
    reducers: {
        update: state => {
            state.value = () => {};
        }
    }
})