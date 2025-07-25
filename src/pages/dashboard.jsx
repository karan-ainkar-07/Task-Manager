import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link, Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ErrorDrop from "../Components/ErrorDrop";
import authService from "../functions/AppwriteUserAuth";
import { X, Menu } from "lucide-react";
import { useSelector,useDispatch } from "react-redux";
import { setCurrentUser } from "../features/UserSlice";
import { addTask, RemoveTasks } from "../features/TaskSlice";
import Database from "../functions/Database";

function DashBoard() {

  const user=useSelector((state)=>state.user.currentUser);
  const dispatch=useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser=async()=>{
      await authService
        .getCurrentUser()
        .then((User) => {
          if (User) dispatch(setCurrentUser(User));
        })
        .catch((err) => {
          console.log("No user:", err);
        })
    }
    if (!user) {
      getUser();
    }
  }, [dispatch]);

  useEffect(()=>{
    if(!user)
      {
       navigate('/');
       return;
      }  
      console.log("done")
    const fetchData=async()=>{
      const data=await Database.FetchTask(user.email);
      Object.values(data).forEach((value)=>
      {
        dispatch(addTask(value))
      });
    }
    fetchData()
  },[user,navigate,dispatch])

  const location = useLocation();
  const [sidebar,setSidebar]=useState(false);
  const [text, setText] = useState(" ");
  const [taskStatus, setTaskStatus] = useState(false);
  const [CommingSoon, setCommingSoon] = useState('');
  const [CompletedTaskNo,setCompletedTaskNo]=useState();
  
  const Task=useSelector((state)=>state.tasks.Tasks);

useEffect(()=>{

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); 
    const currentDay = currentDate.getDate();

    const thisYear = Object.values(Task).filter((task) => {
      const taskDate = new Date(task.CompleteDate);
      return taskDate.getFullYear() === currentYear;
    });

    const thisMonth = thisYear.filter((task) => {
      const taskDate = new Date(task.CompleteDate);
      return taskDate.getMonth() === currentMonth;
    });

    const today = thisMonth.filter((task) => {
      const taskDate = new Date(task.CompleteDate);
      return taskDate.getDate() === currentDay;
    });

    const array=[
      `${thisYear.length} tasks completed this Year`,
      `${thisMonth.length} tasks completed this Month`,
      `${today.length} tasks completed Today`
    ];
    setCompletedTaskNo(array);

},[Task])

    

  useEffect(() => {
    if (location.state?.from === "AddTask" && location.state?.AddedTaskStatus) {
      setTaskStatus(location.state.AddedTaskStatus);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    let render = CompletedTaskNo?.length;
    const interval = setInterval(() => {
      let index = render % CompletedTaskNo?.length;
      setText(CompletedTaskNo ? CompletedTaskNo[index] : null);
      render++;
    }, 3000);
    return () => clearInterval(interval);
  }, [CompletedTaskNo]);

  return (
    <div className="bg-gradient-to-br from-orange-200 to-purple-300 min-h-screen w-full flex justify-center items-center p-3 md:p-6">

      <AnimatePresence>
        {sidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Sidebar */}
            <motion.div 
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="fixed top-0 left-0 h-full w-56 bg-[#fff] backdrop-blur-md shadow-lg p-4 z-50 rounded-r-2xl       flex flex-col gap-5 lg:hidden"
            >
              <div className="flex justify-between">
                <p className="text-lg font-bold text-gray-800">Menu</p>
                <X className="h-5 w-5 mx-3" onClick={()=>{ setSidebar(prev=>!prev)}}>
        
                </X>
              </div>
        
              <div className="flex flex-col gap-3 mt-2">
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold text-left transition duration-300"
                onClick={()=>navigate('/AddTask')}
                >
                  + Add Task
                </button>
        
                <button className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold text-left transition duration-300"
                onClick={async()=>
                {
                  try{
                    await authService.signOut();
                    dispatch(setCurrentUser(null));
                    dispatch(RemoveTasks());
                    navigate('/');
                  }
                  catch(error){
                      console.log(error)
                  }
                }
                }
                >
                  Log Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Error*/}
      <AnimatePresence>
        {taskStatus && (
          <ErrorDrop
            message={taskStatus.message}
            color={taskStatus?.color}
            close={() => setTaskStatus(false)}
          />
        )}
        {CommingSoon && (
          <ErrorDrop
            message={CommingSoon?.message}
            color={CommingSoon?.color}
            close={() => setCommingSoon(false)}
          />
        )}
      </AnimatePresence>

      <button className="absolute lg:inline-block hidden top-4 right-4  bg-red-700 p-2 px-6 text-lg font-bold text-white rounded-2xl "
        onClick={async()=>
        {
          try{
            await authService.signOut();
            dispatch(setCurrentUser(null));
            dispatch(RemoveTasks());
            navigate('/');
          }
          catch(error){
              console.log(error)
          }
        }
        }
      >
        Log Out
      </button>

      {/* Dashboard Container */}
      <div className="w-full min-h-screen max-w-6xl bg-white/60 rounded-2xl backdrop-blur-xl p-5 md:p-10 shadow-lg">
        {/* Header */}
        <div className="flex  justify-between items-start md:items-center gap-2">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-semibold text-gray-800">
            👋 Welcome back, {user?.name ? user.name.split(" ")[0] : "User"}
          </h1>
          <Link to="/AddTask" className="cursor-pointer">
            <button className="hidden lg:block bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-sm md:text-base font-semibold transition duration-300">
              + New Task
            </button>
          </Link>
          <Menu className="lg:hidden inline-block h-5 w-5 "
                onClick={()=>{setSidebar((prev)=>!prev)}}
          >
          </Menu>
        </div>

        {/* Subtitle */}
        <p className="text-gray-600 text-sm md:text-base mt-1">
          Let’s get productive today. Here’s a quick overview of your tasks.
        </p>

        {/* Summary Cards */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          
          {/* Completed Tasks */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-xl shadow-md px-6 py-4 flex items-center gap-4 w-full sm:w-1/3 cursor-pointer"
            onClick={() => navigate('CompletedTasks')}
          >
            <div className="bg-green-100 p-2 rounded-full">✅</div>
            <div>
              <h3 className="font-semibold text-gray-800">Completed Tasks</h3>
              <p className="text-sm text-gray-600">{text}</p>
            </div>
          </motion.div>

          {/* Pending Tasks */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-xl shadow-md px-6 py-4 flex items-center gap-4 w-full sm:w-1/3 cursor-pointer"
            onClick={() => navigate('DueTasks')}
          >
            <div className="bg-yellow-100 p-2 rounded-full">⏳</div>
            <div>
              <h3 className="font-semibold text-gray-800">Pending Tasks</h3>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </motion.div>

          {/* Collab */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-xl shadow-md px-6 py-4 flex items-center gap-4 w-full sm:w-1/3 cursor-pointer"
            onClick={() => setCommingSoon({ message: 'Coming Soon', color: 'bg-[#FFC300]' })}
          >
            <div className="bg-red-100 p-2 rounded-full">🤝</div>
            <div>
              <h3 className="font-semibold text-gray-800">Collab</h3>
              <p className="text-sm text-gray-600">Collaborations</p>
            </div>
          </motion.div>
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default DashBoard;
