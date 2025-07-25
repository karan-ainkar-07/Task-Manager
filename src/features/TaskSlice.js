import { createSlice } from "@reduxjs/toolkit";

const initialState={
    Tasks:{},
    TaskOrder:[]
}

const TaskSlice=createSlice(
    {
        name:"Task",
        initialState,
        reducers:
        {
            addTask:(state,action)=>
            {
                const fields=["Title","Description","DueDate","Category","Priority","ID","Status","CompleteDate"];
                state.Tasks={...state.Tasks,[action.payload.ID]:fields.reduce((addedValues,field)=>
                {
                    addedValues[field]= field in action.payload ? action.payload[field] :null
                    return addedValues;
                },{})
                }

                state.TaskOrder.push(action.payload["ID"]);
            },
            UpdateStatus:(state,action)=>
            {
                const {UpdateStatusId,CompleteDate}=action.payload;
                if(state.Tasks[UpdateStatusId])
                {
                    state.Tasks[UpdateStatusId]={
                        ...state.Tasks[UpdateStatusId],
                        Status:"Complete",
                        CompleteDate:CompleteDate
                    }
                }
            },

            RemoveTasks:()=>initialState
        }
    }
)

export default TaskSlice.reducer;
export const{addTask ,UpdateStatus,RemoveTasks}=TaskSlice.actions ;