import { Info } from "lucide-react";
import { useDispatch } from "react-redux";
import { UpdateStatus } from "../features/TaskSlice";
import { useState } from "react";
import Database from "../functions/Database";

function DropDownTasks({ infoClickedHandler = () => {}, taskInfoClickedID, TaskDetail }) {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(true);

  const PriorityColorsText = {
    High: "text-red-600",
    Medium: "text-yellow-600",
    Low: "text-green-600",
  };

  const CategoryColorsText = {
    Personal: "text-purple-600",
    Work: "text-blue-600",
    Other: "text-gray-600",
  };

  const PriorityColorsBG = {
    High: "bg-red-100",
    Medium: "bg-yellow-100",
    Low: "bg-green-100",
  };

  const CategoryColorsBG = {
    Personal: "bg-purple-100",
    Work: "bg-blue-100",
    Other: "bg-gray-100",
  };

  return (
    <div
      id={TaskDetail.ID}
      className={`relative transition-all duration-300 ease-in-out ${
        isVisible ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0 overflow-hidden"
      }`}
    >
      <div
        className={`bg-white flex justify-between items-center p-4 ${
          taskInfoClickedID === TaskDetail.ID ? "rounded-t-xl" : "rounded-xl"
        } shadow-sm transition-all duration-75 ease-in-out`}
      >
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            className="h-5 w-5"
            onClick={() => {
              const TodaysDate = new Date();
              const FormattedDate = TodaysDate.toISOString().split("T")[0];
              setIsVisible(false);
              setTimeout(async () => {
                try{
                  await Database.UpdateStatus(TaskDetail.ID,FormattedDate);
                  dispatch(
                    UpdateStatus({
                      UpdateStatusId: TaskDetail.ID,
                      CompleteDate: FormattedDate,
                    })
                  );
                }
                catch(err){
                  console.log("Cant update"+ err);
                }
              }, 300);
            }}
          />
          <span className="font-medium text-sm md:text-lg text-gray-800 truncate max-w-[120px] md:max-w-[300px] block">
            {TaskDetail.Title}
          </span>
        </div>

        <button
          className="w-8 h-8"
          onClick={() => infoClickedHandler(TaskDetail.ID, taskInfoClickedID)}
        >
          <Info className="w-5 h-5 mr-1 md:h-7 md:w-7 transition duration-100 ease-in-out" />
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          taskInfoClickedID === TaskDetail.ID
            ? "max-h-200 opacity-100 p-4"
            : "max-h-0 opacity-0 p-0"
        } bg-white rounded-b-xl shadow-sm w-full mt-0`}
      >
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-1">{TaskDetail.Title}</h2>
          <p className="text-sm text-gray-600 mb-3">{TaskDetail.Description}</p>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">{TaskDetail.DueDate}</span>
            <div className="flex gap-2">
              <span
                className={`${CategoryColorsBG[TaskDetail.Category]} ${CategoryColorsText[TaskDetail.Category]} px-3 py-1 rounded-full text-xs font-semibold`}
              >
                {TaskDetail.Category}
              </span>
              <span
                className={`${PriorityColorsBG[TaskDetail.Priority]} ${PriorityColorsText[TaskDetail.Priority]} px-3 py-1 rounded-full text-xs font-semibold`}
              >
                {TaskDetail.Priority}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DropDownTasks;
