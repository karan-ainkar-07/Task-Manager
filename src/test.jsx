import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function DraggableHighlightText() {
  const x = useMotionValue(0);
  const boxRef = useRef(null);
  const containerRef = useRef(null);
  const [clip, setClip] = useState("inset(0 100% 0 0)");

  useEffect(() => {
    const updateClip = () => {
      const box = boxRef.current?.getBoundingClientRect();
      const container = containerRef.current?.getBoundingClientRect();

      if (!box || !container) return;

      const left = Math.max(0, box.left - container.left);
      const right = Math.max(0, container.right - box.right);

      setClip(`inset(0 ${right}px 0 ${left}px)`);
    };

    const unsubscribe = x.on("change", updateClip);
    window.addEventListener("resize", updateClip);
    updateClip();

    return () => {
      unsubscribe();
      window.removeEventListener("resize", updateClip);
    };
  }, [x]);

  return (
    <div className="relative w-full max-w-3xl mx-auto mt-20 h-32">
      <div ref={containerRef} className="relative overflow-hidden select-none">
        {/* Base Text (gray) */}
        <h1 className="text-5xl font-bold text-gray-300 text-center">Drag to Highlight</h1>

        {/* Highlighted Text with dynamic clip */}
        <motion.h1
          className="absolute top-0 left-0 w-full text-5xl font-bold text-cyan-500 text-center pointer-events-none"
          style={{ clipPath: clip }}
        >
          Drag to Highlight
        </motion.h1>

        {/* Draggable Box */}
        <motion.div
          ref={boxRef}
          className="absolute top-0 h-full w-24 bg-cyan-300/40 backdrop-blur-sm rounded-xl cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={containerRef}
          style={{ x }}
        />
      </div>
    </div>
  );
}

export default DraggableHighlightText;
