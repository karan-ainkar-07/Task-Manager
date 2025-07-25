import { useEffect, useState } from "react";
import Input from "../Components/Input";
import { ValidateEmail, ValidateName, ValidatePassword } from "../functions/ValidateInputs";
import {OnSignUp} from "../functions/AuthOnClickHandler";
import ErrorDrop from "../Components/ErrorDrop";
import { AnimatePresence,} from "framer-motion";
import {useNavigate } from "react-router-dom";
import authService from "../functions/AppwriteUserAuth";
import { Link } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { setCurrentUser } from "../features/UserSlice";

function SignUp(){

    const user=useSelector((state)=>state.user.currentUser);
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
    const [errorsSignUp, setErrorsSignUp] = useState({
    name: true,
    email: true,
    password: true,
    });
  const navigate=useNavigate();
  const dispatch=useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(setCurrentUser(user))
      navigate('/dashboard');
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
  <>
    <AnimatePresence mode="wait">
      {message && <ErrorDrop message={message} close={() => setMessage("")} />}
    </AnimatePresence>

    <div className="lg:hidden min-h-screen flex flex-col justify-center items-center p-6 sm:p-8 md:p-12 bg-white w-full md:w-3/4 mx-auto">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-6 text-center">
        Create your Free Account
      </h2>

      <form className="w-full max-w-lg flex flex-col gap-4 sm:gap-5 relative">
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
          className="bg-cyan-800 hover:bg-cyan-700 text-white p-3 sm:p-4 md:p-5 rounded-xl font-semibold text-sm sm:text-base md:text-lg transition duration-300"
          onClick={async (e) => {
            e.preventDefault();
            const msg = await OnSignUp(email, password, confirmPassword, errorsSignUp, name);
            setMessage(msg);
            if (msg === "Account Created Successfully") {
              setName("");
              setEmail("");
              setPassword("");
              setConfirmPassword("");
              const user=await authService.getCurrentUser();
              dispatch(setCurrentUser(user))
              navigate("/dashboard");
            }
          }}
        >
          Sign Up
        </button>

        <div className="flex items-center justify-center gap-1 mt-2">
          <div className="h-px bg-gray-300 w-1/3" />
          <span className="text-gray-500 text-sm md:text-base">OR</span>
          <div className="h-px bg-gray-300 w-1/3" />
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 border border-gray-300 p-3 md:p-4 rounded-xl hover:bg-gray-50 transition duration-300 text-sm sm:text-base md:text-lg"
        >
          <img src="https://img.icons8.com/color/24/google-logo.png" alt="Google" />
          <span>Sign up with Google</span>
        </button>

        <p className="text-center mt-4 text-sm sm:text-base text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-700 hover:underline font-medium">
            Log in
          </Link>
        </p>
      </form>
    </div>
  </>
);

}
export default SignUp;