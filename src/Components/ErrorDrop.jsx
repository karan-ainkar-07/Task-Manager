import { motion } from "framer-motion";
import { useEffect } from "react";

function ErrorDrop({ message, close,color="bg-red-600" }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => close(), 3000);
      return () => clearTimeout(timer);
    }
  }, [message, close]);

  return (
    <motion.div
      className={`${color} z-5 w-[230px] md:w-[280px] lg:w-[350px] max-w-xs sm:max-w-sm text-white flex items-center justify-between rounded-md p-3 absolute top-4 left-1/2 transform -translate-x-1/2 shadow-lg`}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <span className="text-sm sm:text-base">{message}</span>
      <button onClick={close} className="font-bold ml-2 focus:outline-none">
        X
      </button>
    </motion.div>
  );
}

export default ErrorDrop;
