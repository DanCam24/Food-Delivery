import React, { useEffect, useState } from "react";
import { Header } from "../components";

const frutas = ["papaya", "banano", "zanahoria"];
const carnicos = ["cerdo", "pollo", "hueso"];

const posicionesPorNombre = {
  cerdo: "4.3  6.5 -1",
  pollo: "4.3  6.5 -1",
  hueso: "4.3 4.5 -1",
  papaya: "-0.3 3 -1.5",
  banano: "-0.8 3 -1.5",
};

const rotacionesPorNombre = {
  papaya: "180 180 0",
  banano: "180 180 0",
  zanahoria: "180 180 0",
};

const Ubicate = () => {
  const [inputValue, setInputValue] = useState("");
  const [posicionModelo, setPosicionModelo] = useState("1 3 -1");
  const [rotacionModelo, setRotacionModelo] = useState("0 0 0");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const videoElement = document.querySelector("#arjs-video");
      if (videoElement) {
        Object.assign(videoElement.style, {
          position: "absolute",
          transform: "translate(0%, 20%)",
          width: "100%",
          height: "100%",
          zIndex: "-1",
          margin: "0",
        });
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const handleInputChange = (e) => {
    const valor = e.target.value.toLowerCase().trim();
    setInputValue(valor);

    const esValido =
      frutas.includes(valor) ||
      carnicos.includes(valor) ||
      valor in posicionesPorNombre;

    if (!esValido || valor === "") {
      setPosicionModelo("1 3 -1");
      setRotacionModelo("0 0 0");
      return;
    }

    const nuevaPosicion = posicionesPorNombre[valor] || "1 3 -1";
    const nuevaRotacion = rotacionesPorNombre[valor] || "0 0 0";

    setPosicionModelo(nuevaPosicion);
    setRotacionModelo(nuevaRotacion);
  };

  return (
    <div>
      <Header />
      <div className="w-full flex justify-center mt-40 mb-6">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Escribe un producto"
          className="border-2 border-gray-300 rounded-full px-6 py-2 text-lg shadow-sm focus:outline-none focus:border-green-400 transition-all"
        />
      </div>
      <div
        style={{
          width: "85vw",
          height: "55vh",
          margin: "2rem auto",
          border: "2px solid #ccc",
          borderRadius: "100px",
          overflow: "hidden",
        }}
      >
        <a-scene
          embedded
          arjs="sourceType: webcam; debugUIEnabled: false;"
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <a-marker preset="hiro">
            <a-entity
              gltf-model="url(/tienda3D.glb)"
              scale="1.2 1.2 1.2"
              position={posicionModelo}
              rotation={rotacionModelo}
            />
          </a-marker>
        </a-scene>
      </div>
    </div>
  );
};

export default Ubicate;
