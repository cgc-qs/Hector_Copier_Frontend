import { createSlice } from "@reduxjs/toolkit";
export const slice = createSlice({
    name: "variableList",
    initialState: {
        showProgressBar: false,  
    },
    reducers: {
        setShowProgressBar: (state, action) =>{
            state.showProgressBar = action.payload;        
        },        
    }
});

export const {
    setShowProgressBar,
} = slice.actions;

export const getShowProgressBar = (state) => state.variable_Group.showProgressBar;

export default slice.reducer;