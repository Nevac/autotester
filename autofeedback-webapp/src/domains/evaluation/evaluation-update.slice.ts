import {createSlice} from "@reduxjs/toolkit";

const evaluationUpdateSlice = createSlice({
    name: 'evaluationsUpdated',
    initialState: {
        value: () => {},
    },
    reducers: {
        update: state => {
            state.value = () => {};
        }
    }
})

export default evaluationUpdateSlice;