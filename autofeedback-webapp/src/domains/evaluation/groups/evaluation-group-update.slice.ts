import {createSlice} from "@reduxjs/toolkit";

const evaluationGroupUpdateSlice = createSlice({
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

export default evaluationGroupUpdateSlice;