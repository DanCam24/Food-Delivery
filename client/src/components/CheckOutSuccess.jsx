import React from "react";
import { FaArrowLeft } from "../assets/icons";
import { NavLink } from "react-router-dom";
import { Bill } from "../assets";
import { Header } from "../components";
import { motion } from "framer-motion";
import { buttonClick } from "../animations";

const CheckoutSuccess = () => {
  return (
    <main className="w-screen min-h-screen flex items-center justify-center flex-col">
      <Header />
      <div className="w-full flex flex-col items-center justify-center mt-20 px-6 sm:px-12 md:px-24 lg:px-32 xl:px-48 2xl:px-96 gap-12 pb-24">
        <img src={Bill} className="w-full md:w-[656px]" alt="Imagen del producto" />

        <h1 className="text-[30px] text-headingColor font-bold sm:text-[40px] md:text-[50px] lg:text-[60px] xl:text-[70px]">
          Hemos recibido tu pago,
        </h1>
        <h6 className="text-[20px] text-headingColor font-semibold sm:text-[25px] md:text-[30px] lg:text-[35px] xl:text-[40px]">
          tu producto llegará pronto
        </h6>

        <motion.div {...buttonClick}>
          <NavLink
            to={"/"}
            className="flex items-center justify-center gap-4 cursor-pointer text-lg sm:text-xl md:text-2xl text-textColor font-semibold px-4 py-2 rounded-md border border-gray-300 hover:shadow-md"
          >
            <FaArrowLeft className="text-2xl sm:text-3xl md:text-4xl text-textColor" />
            Regresa para seguir comprando
          </NavLink>
        </motion.div>
      </div>
    </main>

  );
};

export default CheckoutSuccess;
