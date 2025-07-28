import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Database from "../functions/Database";

function CompletedTask() {
  const Tasks = useSelector((state) => state.tasks.Tasks);
  const [activeTab, setActiveTab] = useState("Completed");
  const [isSticky, setIsSticky] = useState(false);
  const [underLineX, setUnderLineX] = useState(0);
  const [underLineWidth, setUnderLineWidth] = useState(0);
  const [completed,setCompleted]=useState(0);
  const [missedTask,setMissedTask]=useState(0);

  const completedRefd = useRef(null);
  const missedRef = useRef(null);
  const navRef=useRef(null);

  const UpdateMissed=async(date)=>{
    await Database.UpdateStatusMissed(date)
  }

  const getCompleted=()=>{
      const completed = Object.values(Tasks).filter(
      (task) => task.Status === "Completed"
    );
    return completed;
  }

  const getMissed =()=>{
    const missed = Object.values(Tasks).filter(
      (task) => task.Status === "Missed"
    );
    return missed;
  }

  useEffect(()=>{
    setCompleted(getCompleted());
    setMissedTask(getMissed());
  },[Tasks])

  useEffect(()=>{
    const date = new Date().toISOString();

    UpdateMissed(date);
  },[])

  useEffect(()=>{
    const observer = new IntersectionObserver(
    ([entry]) => {
      setIsSticky(!entry.isIntersecting); 
    },
    { threshold: 0,
      rootMargin: "-30px 0px 0px 0px"
     }
    );

    if (navRef.current) {
      observer.observe(navRef.current);
    }

    return () => {
      if (navRef.current) observer.unobserve(navRef.current);
    };
  },[])

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    const ref = tab === "Completed" ? completedRefd : missedRef;
    if (ref.current) {
      const { offsetLeft, offsetWidth } = ref.current;
      setUnderLineX(offsetLeft);
      setUnderLineWidth(offsetWidth);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    handleTabClick(activeTab);
    const handleResize = () => handleTabClick(activeTab);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeTab]);

  const tasksToDisplay = activeTab === "Completed" ? completed : missedTask;

  return (
    <div className="min-h-[100vh] w-full px-4 md:px-16 py-8 ">
      <div ref={navRef}>

      </div>
      <div className={`sticky top-0 rounded-2xl transition-all duration-200 ease-in-out z-10 pb-6 flex items-center justify-center ${isSticky? "backdrop-blur-xl":""}`}>
        <div className="relative w-fit flex gap-8 text-lg font-semibold mt-2">
          <button
            ref={completedRefd}
            className={`pb-1 transition-colors ${
              activeTab === "Completed" ? "text-black" : "text-gray-400"
            } `}
            onClick={() => handleTabClick("Completed")}
          >
            Completed Tasks
          </button>
          <button
            ref={missedRef}
            className={`pb-1 transition-colors ${
              activeTab === "Missed" ? "text-black" : "text-gray-400"
            } `}
            onClick={() => handleTabClick("Missed")}
          >
            Missed Tasks
          </button>

          <motion.div
            layoutId="underline"
            className={`absolute bottom-0 h-[3px] bg-black rounded-full `}
            animate={{ x: underLineX, width: underLineWidth }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasksToDisplay.length > 0 ? (
          tasksToDisplay.map((task, index) => (
            <TaskComp key={task.id || index} task={task} />
          ))
        ) : (
          <div className="col-span-2 text-center text-gray-400 text-lg">
            No {activeTab.toLowerCase()} tasks found.
          </div>
        )}
      </div>
    </div>
  );
}

function TaskComp({ task }) {
  return (
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: "easeInOut", damping: 0.2 }}
      className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-medium text-gray-800">{task.Title}</h3>
        <span className="text-sm text-gray-500">
          {task.Status === "Completed" ? task.CompleteDate.split('T')[0] : task.DueDate.split('T')[0] }
        </span>
      </div>
      <p className="text-gray-600 mb-4">{task.Description}</p>
      <div className="flex justify-between text-sm text-gray-500">
        <span className="px-3 py-1 bg-gray-100 rounded-full">
          {task.Category}
        </span>
        <span
          className={`px-3 py-1 rounded-full ${
            task.Status === "Completed"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {task.Status}
        </span>
      </div>
    </motion.div>
  );
}

export default CompletedTask;
