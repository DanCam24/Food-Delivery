import { motion } from "framer-motion";
import React from "react";
import { buttonClick, staggerFadeInOut } from "../animations";
import { Delivery, HeroBg } from "../assets";
import { randomData } from "../utils/styles";
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <motion.div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div className="flex flex-col items-start justify-start gap-6">
        <div className="px-4 py-2 flex items-center justify-center gap-2 bg-orange-100 rounded-full">
          <p className="text-base md:text-lg font-semibold text-orange-500">
            Domicilio Gratis
          </p>
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary shadow-md">
            <img
              src={Delivery}
              alt="Domicilio Gratis"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <p className="text-3xl md:text-5xl font-sans font-extrabold tracking-wide">
          La Mejor Calidad y Precio en{" "}
          <span className="text-orange-600">Tu Barrio</span>
        </p>

        <p className="text-base md:text-lg">
          Bienvenido a El Buen Gusto, donde encuentras la calidad al mejor
          precio! En nuestro supermercado, nos enorgullece ofrecerte los
          productos de más alta calidad a precios que se adaptan a tu
          presupuesto. Explora nuestro amplio catálogo de alimentos frescos.
        </p>

        <NavLink to={"/menu"}>
          <motion.button
            {...buttonClick}
            className="bg-gradient-to-bl from-orange-400 to-orange-600 px-4 py-2 rounded-xl text-black text-base font-semibold hover:scale-105 transition-transform duration-300"
          >
            Ordena Ahora
          </motion.button>
        </NavLink>
      </div>

      <div className="py-2 flex-1 flex items-center justify-center relative">
        <img
          className="absolute top-0 right-0 w-full h-auto hidden md:block md:w-auto md:h-auto"
          src={HeroBg}
          alt="Fondo Hero"
        />

        <div className="grid grid-cols-2 gap-4">
          {randomData &&
            randomData.map((data, i) => (
              <motion.div
                key={i}
                {...staggerFadeInOut(i)}
                className="w-32 h-36 md:h-auto md:w-44 p-4 bg-lightOverlay backdrop-blur-md rounded-3xl flex flex-col items-center justify-center drop-shadow-lg"
              >
                <img
                  src={data.imageURL}
                  className="w-12 h-12 md:w-32 md:h-32 md:-mt-16 object-contain"
                  alt={data.product_name}
                />
                <p className="text-sm md:text-lg font-semibold text-orange-600 text-center">
                  {data.product_name.slice(0, 14)}
                </p>

                <p className="text-xs md:text-base text-center text-gray-800 font-semibold capitalize">
                  {data.product_category}
                </p>

                <p className="text-sm font-semibold text-headingColor">
                  <span className="text-xs text-red-600">$</span>{" "}
                  {data.product_price}
                </p>
              </motion.div>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
