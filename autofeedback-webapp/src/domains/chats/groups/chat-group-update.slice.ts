import {createSlice} from "@reduxjs/toolkit";

const chatGroupUpdateSlice = createSlice({
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

export default chatGroupUpdateSlice;