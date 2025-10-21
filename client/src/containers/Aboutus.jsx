import React from "react";
import { Cart, Header } from "../components";
import { AboutImage } from "../assets";
import { motion } from "framer-motion";
import { buttonClick } from "../animations";
import { useSelector } from "react-redux";

const AboutUs = () => {
  const isCart = useSelector((state) => state.isCart);
  const aboutInfo = {
    mission:
      "Nuestra misión es ofrecer alimentos frescos y saludables, promoviendo un estilo de vida equilibrado y sostenible. Creemos en el comercio justo y en apoyar a los productores locales.",
    values: [
      "Calidad",
      "Sostenibilidad",
      "Transparencia",
      "Compromiso con la comunidad",
    ],
    products: [
      "Frutas frescas y orgánicas",
      "Verduras de calidad premium",
      "Carnes seleccionadas de productores locales",
      "Alimentos para mascotas naturales",
      "Dulces y bebidas artesanales",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.7216135502897!2d-74.2301456847846!3d4.7197604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f78055a0dcdcf%3A0xbaa9f09d3104f516!2sV%C3%ADveres%20El%20Buen%20Gusto!5e0!3m2!1ses!2sco!4v1631234567890!5m2!1ses!2sco",
  };

  return (
    <main className="w-screen min-h-screen flex flex-col bg-primary">
      <Header />
      <div className="w-full flex md:flex-row flex-col-reverse items-start justify-between mt-40 px-6 md:px-24 2xl:px-96 gap-12 pb-24">
        <div className="flex-1 md:max-w-[70%]">
          <motion.div className="flex flex-col items-start justify-start gap-6">
            <div className="px-4 py-1 flex items-center justify-center gap-2 bg-orange-100 rounded-full">
              <p className="text-lg font-semibold text-orange-500">
                Desde 2010
              </p>
            </div>

            <h1 className="text-[40px] text-headingColor md:text-[72px] font-sans font-extrabold tracking-wider">
              Calidad y Sabor en{" "}
              <span className="text-orange-600">Frutas y Verduras</span>
            </h1>

            <p className="text-textColor text-lg">
              En <strong>Viveres El Buen Gusto</strong>, nos dedicamos a ofrecer
              la mejor selección de carne, verduras, frutas, bebidas, dulces y
              alimentos para mascotas. Nuestro compromiso con la calidad y el
              servicio al cliente garantiza que cada compra sea una experiencia
              gratificante.
            </p>
          </motion.div>

          <section className="mt-8">
            <h2 className="text-[40px] text-headingColor md:text-[52px] font-sans font-extrabold tracking-wider">
              <span className="text-orange-600">Nuestra </span>
              Misión
            </h2>
            <p className="text-lg text-textColor">{aboutInfo.mission}</p>
          </section>

          <section className="mt-8">
            <h2 className="text-[40px] text-headingColor md:text-[52px] font-sans font-extrabold tracking-wider">
              <span className="text-orange-600">Nuestros </span>
              Valores
            </h2>
            <ul className="list-disc ml-5 text-lg text-textColor">
              {aboutInfo.values.map((value, index) => (
                <li key={index}>{value}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-[40px] text-headingColor md:text-[52px] font-sans font-extrabold tracking-wider">
              <span className="text-orange-600">Nuestros </span>
              Productos
            </h2>
            <ul className="list-disc ml-5 text-lg text-textColor">
              {aboutInfo.products.map((product, index) => (
                <li key={index}>{product}</li>
              ))}
            </ul>
          </section>

          <motion.a
            href={aboutInfo.mapLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.button
              {...buttonClick}
              className="bg-gradient-to-bl from-orange-400 to-orange-600 px-4 py-2 rounded-xl text-black text-base font-semibold mt-8"
            >
              Visítanos
            </motion.button>
          </motion.a>

          <div className="mt-8 w-full">
            <iframe
              src={aboutInfo.mapLink}
              className="w-full h-[450px] border-0"
              allowFullScreen=""
              loading="lazy"
              title="Mapa de Viveres El Buen Gusto"
            ></iframe>
          </div>
        </div>

        <div className="flex-10 md:max-w-[30%] relative">
          <img
            src={AboutImage}
            alt="Sobre Nosotros"
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-primary to-transparent opacity-70"></div>
        </div>
      </div>
      {isCart && <Cart />}
    </main>
  );
};

export default AboutUs;
