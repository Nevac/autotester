import {createSlice} from "@reduxjs/toolkit";

export const ragDocumentUpdateSlice = createSlice({
    name: 'ragDocumentUpdated',
    initialState: {
        value: () => {},
    },
    reducers: {
        update: state => {
            state.value = () => {};
        }
    }
})