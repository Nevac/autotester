import {createSlice} from "@reduxjs/toolkit";

const chatUpdateSlice = createSlice({
    name: 'chatsUpdated',
    initialState: {
        value: () => {},
    },
    reducers: {
        update: state => {
            state.value = () => {};
        }
    }
})

export default chatUpdateSlice;