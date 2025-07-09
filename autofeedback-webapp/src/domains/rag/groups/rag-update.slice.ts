import {createSlice} from "@reduxjs/toolkit";

export const ragUpdateSlice = createSlice({
    name: 'ragUpdated',
    initialState: {
        value: () => {},
    },
    reducers: {
        update: state => {
            state.value = () => {};
        }
    }
})