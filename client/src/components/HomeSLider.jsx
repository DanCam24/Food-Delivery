import { motion } from "framer-motion";
import React from "react";
import { Slider } from "../components";

const HomeSlider = () => {
  return (
    <motion.div className="w-full flex items-start justify-start flex-col mb-2">
      <div className="w-full flex items-center justify-between mb-2"> 
        <div className="flex flex-col items-start justify-start gap-1">
          <p className="text-2xl text-headingColor font-bold">
            Nuestras frutas frescas y saludables
          </p>
          <div className="w-40 h-1 rounded-md bg-orange-500"></div>
        </div>
      </div>

      <Slider category="Frutas" />

      <div className="w-full flex items-center justify-between mt-10"> 
        <div className="flex flex-col items-start justify-start gap-1">
          <p className="text-2xl text-headingColor font-bold">
            Nuestras verduras frescas y saludables
          </p>
          <div className="w-40 h-1 rounded-md bg-orange-500"></div>
        </div>
      </div>

      <Slider category="Verduras" />
    </motion.div>
  );
};

export default HomeSlider;
