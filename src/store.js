import { configureStore } from "@reduxjs/toolkit";
import TaskReducers from "./features/TaskSlice";
import UserReducer from "./features/UserSlice"

const Store = configureStore({
  reducer: {
    tasks: TaskReducers,
    user: UserReducer
  },
});

export default Store;
