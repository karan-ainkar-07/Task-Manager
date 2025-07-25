import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";

function Input({ Label, Type = "text", Id, togglePassword = false, validate = () => ({ isValid: true, errorMessage: "" }), returnValue = () => {}, IsError = () => {}, Value }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [type, setType] = useState(Type);
  const InputRef=useRef(null);
  useEffect(() => {
    setType(showPassword ? "text" : Type);
  }, [showPassword, Type]);

  return (
    <div className="relative w-full min-h-[80px]">
      <input
        id={Id}
        type={type}
        placeholder={Label}
        value={Value}
        ref={InputRef}
        className="peer border rounded-xl w-full outline-none focus:ring-2 focus:ring-cyan-400 placeholder-transparent text-base sm:text-lg h-12 sm:h-14 px-3 py-2 transition"
        onChange={(e) => {
          const value = e.target.value;
          const { isValid, errorMessage } = validate(value);
          setIsError(!isValid);
          IsError(prev => ({ ...prev, [Id]: !isValid }));
          setErrorMessage(errorMessage);
          returnValue(value);
        }}
      />
      <label
        htmlFor={Id}
        className="absolute -top-3 left-3 bg-white px-1 text-gray-500 transition-all duration-200 cursor-text
          peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
          peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-600  "
        onClick={()=>{
          InputRef.current.focus();
          console.log("clicked");
        }}
      >
        {Label}
      </label>

      {togglePassword && (
        showPassword ? (
          <Eye
            className="absolute top-4 right-3 h-6 w-6 cursor-pointer"
            onClick={() => setShowPassword(false)}
          />
        ) : (
          <EyeOff
            className="absolute top-4 right-3 h-6 w-6 cursor-pointer"
            onClick={() => setShowPassword(true)}
          />
        )
      )}

      <p className={`mt-1 text-sm text-red-600 ${isError ? "opacity-100" : "opacity-0"}`}>{errorMessage}</p>
    </div>
  );
}

export default Input;