import DashBoard from "./pages/dashboard";
import SignUpLogin from "./pages/SignUpLogin";
import DueTask from "./pages/DueTask";
import AddTask from "./pages/AddTask";
import { createBrowserRouter,RouterProvider } from "react-router-dom"
import CompletedTasks from "./pages/CompletedTasks";
import Login from "./pages/login";
import SignUp from "./pages/signUp";
function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <SignUpLogin />
    },
    {
      path:'/login',
      element:<Login/>
    },
    {
      path:'/signup',
      element:<SignUp/>
    },
    {
      path: '/Dashboard',
      element: <DashBoard/>,
      children:[
        {
        path:'DueTasks',
        element:<DueTask/>
        },
        {
          path:'CompletedTasks',
          element:<CompletedTasks/>
        },
      ]
    },
    {
      path: '/AddTask',
      element:<AddTask/>
    }
  ]);
    
  return (
    <RouterProvider router={router} />
  )
}

export default App;
