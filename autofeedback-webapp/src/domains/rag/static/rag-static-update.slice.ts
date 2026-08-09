import {createSlice} from "@reduxjs/toolkit";

export const ragStaticUpdateSlice = createSlice({
    name: 'ragStaticUpdated',
    initialState: {
        value: () => {},
    },
    reducers: {
        update: state => {
            state.value = () => {};
        }
    }
})