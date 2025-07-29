import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { handleSetTaskInfo } from "../functions/TaskFunction";
import DropDownTasks from "../Components/dropDown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays, Search, SortAsc, Filter } from "lucide-react";

function DueTask() {
  const Tasks = useSelector((state) => state.tasks.Tasks);
  const [filterValue, setFilterValue] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [searchedValue,setSearchValue] =useState("");
  const [taskInfoClickedID, setTaskInfoClickedID] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(new Date().toISOString().split("T")[0]);
  const [clickedAction,setClickedAction]=useState(null);

  const handleFilter = (e) => setFilterValue(e.target.value);
  const handleSort = (e) => setSortValue(e.target.value);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 564);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const TasksOfDate = useMemo(() => {
    let filtered = Object.values(Tasks).filter(
      (task) => task.Status === "Incomplete" && task.DueDate.split('T')[0] === selectedDay
    );

    if (filterValue) {
      filtered = filtered.filter((task) => {
        return (
          task.Priority === filterValue ||
          task.Type === filterValue 
        );
      });
    }

    if(searchedValue)
    {
      filtered =filtered.filter((task)=>
      {
        return task.Title.toLowerCase().includes(searchedValue.toLowerCase());
      })
    }

    if (sortValue === "Priority") {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      filtered.sort((a, b) => priorityOrder[a.Priority] - priorityOrder[b.Priority]);
    }

    return filtered;
  }, [Tasks, selectedDay, filterValue, sortValue,searchedValue]);
  
  const sharedStyle = `relative transition-all duration-300 ease-in-out ${
    isSmallScreen ? "focus-within:max-w-full" : "w-full"
  } overflow-hidden border border-gray-300 rounded-lg pl-10 pr-3 py-2 bg-white text-sm font-semibold shadow-sm focus-within:ring-2 focus-within:ring-blue-500`;

  const sharedInputClass = `w-full focus:outline-none ${isSmallScreen ? "bg-transparent" : ""}`;

  return (
    <div>
      <div className="mt-8 flex flex-col gap-4">
        <div className="flex items-center gap-4 mb-4 px-2">
          <h2 className="text-sm md:text-lg lg:text-xl font-semibold text-gray-800">
            Due Tasks | {selectedDay}
          </h2>
          <DatePicker
            selected={new Date(selectedDay)}
            onChange={(date) => setSelectedDay(date.toISOString().split("T")[0])}
            customInput={
              <button className="p-2 rounded-full hover:bg-gray-100 transition">
                <CalendarDays className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
              </button>
            }
            minDate={new Date()}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            dateFormat="yyyy-MM-dd"
          />
        </div>

        <div
          className={`flex items-center gap-4 mb-6 px-2 ${
            isSmallScreen ? "justify-start" : "justify-between"
          }`}
        >
          {console.log(clickedAction)}
          <div 
            className={`${sharedStyle} ${(clickedAction==="Search") ? "w-full" : "max-w-12" }`}
            onClick={()=>{
              if(clickedAction==="Search")
              {
                setClickedAction("");
                return;
              }
              setClickedAction("Search")
            }}
            >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            {searchedValue && (
              <button onClick={() => setSearchValue("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
                ×
              </button>
            )}
            <input
              type="text"
              placeholder="Search..."
              className={sharedInputClass}
              value={searchedValue}
              onChange={(e)=>{setSearchValue(e.target.value)}}
            />
          </div>

          <div 
            className={`${sharedStyle} ${(clickedAction==="Sort") ? "w-full" : "max-w-12" }`}
            onClick={()=>{
              if(clickedAction==="Sort")
              {
                setClickedAction("");
                return;
              }
              setClickedAction("Sort")
            }}
            >
            <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <select value={sortValue} onChange={handleSort} className={sharedInputClass}>
              <option value="" disabled hidden>Sort</option>
              {
                sortValue!=="" &&
                (
                  <option value="" className="font-semibold bg-amber-100">Clear Sort</option>                  
                )
              }
              <option value="Priority">Priority</option>
            </select>
          </div>

          <div 
            className={`${sharedStyle} ${(clickedAction==="Filter") ? "w-full" : "max-w-12" }`}
            onClick={()=>{
              if(clickedAction==="Filter")
              {
                setClickedAction("");
                return;
              }
              setClickedAction("Filter")
            }}
            >
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <select value={filterValue} onChange={handleFilter} className={sharedInputClass}>
              <option value="" disabled hidden>Filter</option>
              {
                filterValue!=="" && 
                (
                  <option value="" className="font-semibold bg-amber-100">Clear Filter</option>
                )
              }
              <option value="Low">Low Priority Tasks</option>
              <option value="High">High Priority Tasks</option>
              <option value="Medium">Medium Priority</option>
              <option value="Personal">Personal Tasks</option>
              <option value="Work">Professional Tasks</option>
              <option value="Other">Other Tasks</option>
            </select>
          </div>
        </div>

        {TasksOfDate.length > 0 ? (
          TasksOfDate.map((task) => (
            <DropDownTasks
              key={task.ID}
              TaskDetail={task}
              infoClickedHandler={() =>
                handleSetTaskInfo(task.ID, taskInfoClickedID, setTaskInfoClickedID)
              }
              taskInfoClickedID={taskInfoClickedID}
            />
          ))
        ) : (
          <div className="flex flex-row justify-center text-md md:text-lg lg:text-xl text-gray-700 font-semibold mt-10">
            <h2>No Task on {selectedDay}</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default DueTask;
