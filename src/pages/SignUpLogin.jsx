import { useEffect, useRef, useState } from "react";
import Input from "../Components/Input";
import { ValidateEmail, ValidateName, ValidatePassword } from "../functions/ValidateInputs";
import {OnSignUp,OnLoginClick} from "../functions/AuthOnClickHandler";
import ErrorDrop from "../Components/ErrorDrop";
import { AnimatePresence, motion} from "framer-motion";
import {useNavigate } from "react-router-dom";
import authService from "../functions/AppwriteUserAuth";
import { setCurrentUser } from "../features/UserSlice";
import { useDispatch,useSelector } from "react-redux";


function SignupLogin() {
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await authService.getCurrentUser();
        setUser(user);
      } catch (error) {
        if(error.code===401)
          setUser(null);
        else
          console.log(error);
      }
      finally{
        setLoading(false);
      }
    }
    fetchUser();
  }, []);


  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isRHS, setIsRHS] = useState(false);
  const [LoginEmail,setLoginEmail]=useState("");
  const [LoginPassword,setLoginPassword]=useState("");
  const [isSmallScreen,setIsSmallScreen]=useState(false);
  const [errorsLogin, setErrorsLogin] = useState(
    {
      LoginEmail:true,
      LoginPassword:true
    }
  );
  const [errorsSignUp, setErrorsSignUp] = useState({
    name: true,
    email: true,
    password: true,
  });
  const [target, setTarget] = useState(0);
  const SwitchContainerRef = useRef(null);
  const SwitchRef =useRef(null);
  const containerRef = useRef(null); 
  const [coverX, setCoverX] = useState(0);

  const navigate=useNavigate();
  const dispatch=useDispatch();

  useEffect(()=>{
    function handleResize(){
      if(window.innerWidth>1024)
      {
        setIsSmallScreen(false);
      }
      else
      {
        setIsSmallScreen(true);
      }
    }
    handleResize();
    window.addEventListener('resize',handleResize);
    return ()=>window.removeEventListener('resize',handleResize);
  },[])

  // Responsive cover panel logic
  useEffect(() => {
    const updatetarget=()=>
    {
      if (SwitchContainerRef.current) {
      const containerWidth = SwitchContainerRef.current.offsetWidth;
      const x = containerWidth / 2 - 2;
      setTarget(isRHS ? x : 2);
    }
    }
    const updateCoverX = () => {
      const width = containerRef.current?.offsetWidth || 0;
      setCoverX(isRHS ? width / 2 : 0);
    };
    updatetarget();
    updateCoverX();

    const resizeObserver = new ResizeObserver(updateCoverX);
    const resizeObserverSwitch =new ResizeObserver(updatetarget)
    if(SwitchContainerRef.current) resizeObserverSwitch.observe(SwitchContainerRef.current);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      resizeObserverSwitch.disconnect();
    }
  }, [isRHS]);

  useEffect(() => {
    if (isSmallScreen) {
      navigate('/login');
    }
  }, [isSmallScreen, navigate]);


  useEffect(() => {
    if (user) {
      navigate('/dashboard');
      dispatch(setCurrentUser(user));
    }
  }, [user, navigate]);
  

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin  border-cyan-700"></div>
          <p className="text-cyan-700 font-semibold text-lg">Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="lg:flex hidden  flex-col md:flex-row min-h-screen w-full bg-gray-300"
    >
      {/* Error Drop Message */}
      <AnimatePresence mode="wait">
        {message && <ErrorDrop message={message} close={() => setMessage("")} />}
      </AnimatePresence>

      {/* Cover Panel */}
      <motion.div
        animate={{ x: coverX }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="md:w-1/2 hidden md:flex bg-gradient-to-br from-orange-100 to-pink-200 flex-col justify-center items-center p-6 sm:p-8 text-center z-4 absolute left-0 top-0 min-h-screen"
      >
        <img
          src="/img.png"
          alt="Illustration"
          className="w-32 sm:w-48 md:w-56 lg:w-64 mb-6 rounded-xl"
        />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          TaskFlow
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl font-medium text-gray-700">
          Organize smart. Track better. Flow freely.
        </p>
        <p className="mt-4 text-gray-600 text-sm sm:text-base">
          Your best productivity begins here.
        </p>

        <div
          ref={SwitchContainerRef}
          className="bg-red-400 relative h-15 w-70 m-3 grid grid-cols-2 grid-rows-1 gap-1 p-1 rounded-4xl text-2xl font-bold text-white cursor-pointer"
        >
          <motion.div
            ref={SwitchRef}
            className="absolute top-1 left-1 rounded-4xl h-13 w-34 bg-yellow-500"
            animate={{ x: target }}
            transition={{duration:1.5,type:"tween"}}
          />
          <div 
           className="flex justify-center items-center"
           onClick={() => setIsRHS(false)}>
            <motion.h2
              animate={{ color: isRHS ? "#000000" : "#ffffff" }}
              transition={{ duration: 0.4 }}
              className="z-1 font-bold"
            >
              SignUp
            </motion.h2>
          </div>
          <div 
           className="flex justify-center items-center"
           onClick={() => setIsRHS(true)}
           >
            <motion.h2
              animate={{ color: !isRHS ? "#000000" : "#ffffff" }}
              transition={{ duration: 0.4 }}
              className="z-1 font-bold"
            >
              Login
            </motion.h2>
          </div>
        </div>
      </motion.div>

      {/* Login Form */}
      <motion.div
        className="min-h-screen md:w-1/2 flex flex-col justify-center items-center p-6 sm:p-8 bg-white w-full"
        animate={{ scale: isRHS ? 1 : 0.8 }}
        transition={{ duration: 1, type: "spring", damping: 100, stiffness: 400 }}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
          Log in to Your Account
        </h2>

        <form className="w-full max-w-md flex flex-col gap-4 sm:gap-5 relative">
          <Input
            Label="Email"
            Value={LoginEmail}
            Type="email"
            Id="LoginEmail"
            validate={ValidateEmail}
            IsError={setErrorsLogin}
            returnValue={setLoginEmail}
          />
          <Input
            Label="Password"
            Value={LoginPassword}
            Type="password"
            Id="LoginPassword"
            togglePassword={true}
            returnValue={setLoginPassword}
            IsError={setErrorsLogin}
          />

          <button
            type="submit"
            className="bg-cyan-800 hover:bg-cyan-700 text-white p-3 sm:p-4 rounded-xl font-semibold text-sm sm:text-base transition duration-300"
            onClick={async (e) => {
              e.preventDefault();
              const msg = await OnLoginClick(LoginEmail, LoginPassword, errorsLogin);
              setMessage(msg);
              if(msg==="Login Successfull")
              {
                const user= await authService.getCurrentUser();
                dispatch(setCurrentUser(user));
                navigate('/Dashboard');
              }
            }}
          >
            Log In
          </button>

          <div className="flex items-center justify-center gap-1 mt-2">
            <div className="h-px bg-gray-300 w-1/3" />
            <span className="text-gray-500 text-sm">OR</span>
            <div className="h-px bg-gray-300 w-1/3" />
          </div>

          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-300 p-3 rounded-xl hover:bg-gray-50 transition duration-300 text-sm sm:text-base"
          >
            <img
              src="https://img.icons8.com/color/16/google-logo.png"
              alt="Google"
            />
            <span>Log in with Google</span>
          </button>

          <p className="sm:flex md:hidden text-center mt-2 text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-cyan-700 hover:underline font-medium">
              Sign up
            </a>
          </p>
        </form>
      </motion.div>

      {/* Signup Form */}
      <motion.div
        className="md:w-1/2 flex flex-col justify-center items-center p-6 sm:p-8 bg-white w-full"
        animate={{ scale: isRHS ? 0.8 : 1 }}
        transition={{ duration: 1, type: "spring", damping: 100, stiffness: 400 }}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
          Create your Free Account
        </h2>

        <form className="w-full max-w-md flex flex-col gap-4 sm:gap-5 relative">
          <Input
            Label="Name"
            Value={name}
            Type="text"
            Id="name"
            validate={ValidateName}
            IsError={setErrorsSignUp}
            returnValue={setName}
          />
          <Input
            Label="Email"
            Value={email}
            Type="email"
            Id="email"
            validate={ValidateEmail}
            IsError={setErrorsSignUp}
            returnValue={setEmail}
          />
          <Input
            Label="Password"
            Value={password}
            Type="password"
            Id="password"
            togglePassword={true}
            validate={ValidatePassword}
            returnValue={setPassword}
            IsError={setErrorsSignUp}
          />
          <Input
            Label="Confirm Password"
            Value={confirmPassword}
            Type="password"
            Id="Confirmpassword"
            togglePassword={true}
            returnValue={setConfirmPassword}
          />

          <button
            type="submit"
            className="bg-cyan-800 hover:bg-cyan-700 text-white p-3 sm:p-4 rounded-xl font-semibold text-sm sm:text-base transition duration-300"
            onClick={async (e) => {
              e.preventDefault();
              const msg =  await OnSignUp(email,password, confirmPassword, errorsSignUp,name);
              setMessage(msg);
              if (msg === "Account Created Successfully") {
                setName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                const user=await authService.getCurrentUser();
                dispatch(setCurrentUser(user));
                navigate('/Dashboard');
              }
            }}
          >
            Sign Up
          </button>

          <div className="flex items-center justify-center gap-1 mt-2">
            <div className="h-px bg-gray-300 w-1/3" />
            <span className="text-gray-500 text-sm">OR</span>
            <div className="h-px bg-gray-300 w-1/3" />
          </div>

          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-300 p-3 rounded-xl hover:bg-gray-50 transition duration-300 text-sm sm:text-base"
          >
            <img
              src="https://img.icons8.com/color/16/google-logo.png"
              alt="Google"
            />
            <span>Sign up with Google</span>
          </button>

          <p className="sm:flex md:hidden text-center mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-cyan-700 hover:underline font-medium">
              Log in
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default SignupLogin;
