import {  useState } from "react";
import { onSubmitHandlerNewTask } from "../functions/TaskFunction";
import { useDispatch } from "react-redux";
import { addTask } from "../features/TaskSlice";
import { AnimatePresence } from "motion/react";
import ErrorDrop from "../Components/ErrorDrop";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Database from "../functions/Database";
import { nanoid } from "@reduxjs/toolkit";

function AddTask() {

  const dispatch=useDispatch();
  const navigate=useNavigate();
  const user=useSelector((state)=>state.user.currentUser);
  const [Error,setError]=useState("");

  const initialState={
    Title: "",
    Description: "",
    DueDate: "",
    Category: "Personal",
    Priority: "Low",
    ID: "",
    Status:"Incomplete",
  }
  const [TaskDetail, setTaskDetail] = useState(initialState);

  if(!user)
  {
    return(
      <div>
        Please login
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 to-purple-300 flex items-center justify-center p-4 md:p-6 lg:p-8">
      {
        Error && (
      <AnimatePresence>
        <ErrorDrop message={Error} close={()=>{setError("")}}  />
      </AnimatePresence>
        )
      }
      <div className="w-full max-w-4xl bg-white/60 backdrop-blur-xl shadow-xl rounded-2xl p-4 md:p-8 lg:p-10">
        <h2 className="text-xl md:text-2xl lg:text-4xl font-semibold text-gray-800 mb-6 lg:mb-10">
          📝 Add New Objective
        </h2>

        <form className="space-y-6 w-full">
          {/* Mission Title & Priority */}
          <div className="flex flex-wrap gap-6">
            <div className="flex-1 min-w-[250px]">
              <label className="block text-sm md:text-base lg:text-xl font-medium text-gray-700 mb-1 lg:mb-2">
                🎯 Task Title
              </label>
              <input
                type="text"
                placeholder="e.g. Finalize Pitch Deck"
                className="w-full border border-gray-300 rounded-md bg-gray-100 p-2 text-sm md:text-base lg:text-lg"
                value={TaskDetail.Title}
                onChange={(e) =>
                  setTaskDetail((prev) => ({ ...prev, Title: e.target.value }))
                }
              />
            </div>

            <div className="flex-1 min-w-[250px]">
              <label className="block text-sm md:text-base lg:text-xl font-medium text-gray-700 mb-1 lg:mb-2">
                ⚡ Priority
              </label>
              <select
                className="w-full border border-gray-300 rounded-md bg-gray-100 p-2 text-sm md:text-base lg:text-lg"
                value={TaskDetail.Priority}
                onChange={(e) =>
                  setTaskDetail((prev) => ({ ...prev, Priority: e.target.value }))
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm md:text-base lg:text-xl font-medium text-gray-700 mb-1 lg:mb-2">
              📋 Description
            </label>
            <textarea
              placeholder="Describe the task briefly..."
              className="w-full border border-gray-300 rounded-md bg-gray-100 p-2 text-sm md:text-base lg:text-lg resize-none min-h-[6.5rem] lg:min-h-[10rem] max-h-[10rem] lg:max-h-[15rem]"
              rows="3"
              value={TaskDetail.Description}
              onChange={(e) =>
                setTaskDetail((prev) => ({ ...prev, Description: e.target.value }))
              }
            />
          </div>

          {/* Due Date & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm md:text-base lg:text-xl font-medium text-gray-700 mb-1 lg:mb-2">
                📅 Due Date
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md bg-gray-100 p-2 text-sm md:text-base lg:text-lg"
                value={TaskDetail.DueDate}
                onChange={(e) =>
                  setTaskDetail((prev) => ({ ...prev, DueDate: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm md:text-base lg:text-xl font-medium text-gray-700 mb-1 lg:mb-2">
                📁 Category
              </label>
              <select
                className="w-full border border-gray-300 rounded-md bg-gray-100 p-2 text-sm md:text-base lg:text-lg"
                value={TaskDetail.Category}
                onChange={(e) =>
                  setTaskDetail((prev) => ({ ...prev, Category: e.target.value }))
                }
              >
                <option>Personal</option>
                <option>Work</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-md text-sm md:text-base lg:text-xl font-semibold"
              onClick={(e)=>
              {
                e.preventDefault();
                setTaskDetail(initialState);
                const AddedTaskStatus={
                  message:"No Task is added",
                };
                  navigate('/dashboard',{state:{from:"AddTask",AddedTaskStatus}});
              }
              }
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-rounded-md text-sm md:text-base lg:text-xl font-semibold rounded-md lg:rounded-xl"
              onClick={async(e) => {
                e.preventDefault();
                const newTask={...TaskDetail,ID:nanoid()};
                const message=onSubmitHandlerNewTask(newTask);
                setError(message)
                if(!message)
                {
                  try{
                    const DBnewTask={...newTask,User:user.email};
                    await Database.AddTask(DBnewTask);
                    dispatch(addTask(newTask));
                    const AddedTaskStatus={
                      message:"New Task is added",
                      color:"bg-[#1abc9c]",
                    }
                    Database.DeleteTasks();
                    navigate('/dashboard',{state:{from:"AddTask",AddedTaskStatus}});
                  }
                  catch(error){
                    console.log(error);
                  }
                }
              }}
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTask;
