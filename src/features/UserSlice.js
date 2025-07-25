import { createSlice } from "@reduxjs/toolkit";
import { User } from "lucide-react";

const initialState={
    currentUser:null
}
const UserSlice=createSlice(
    {
        name:"Users",
        initialState,
        reducers:
        {
            setCurrentUser:(state,action)=>{
                state.currentUser=action.payload;
            }
        }
    }
)
export default UserSlice.reducer;
export const {setCurrentUser} =UserSlice.actions;