import React, { useEffect } from 'react';
import { Header } from '../components';

const Ubicate = () => {
  useEffect(() => {
  // Esperar un poco para que AR.js termine de configurar
  const timeout = setTimeout(() => {
    const videoElement = document.querySelector('#arjs-video');
    if (videoElement) {
      videoElement.style.position = 'absolute';
      videoElement.style.transform = 'translate(0%, 20%)';
      videoElement.style.width = '100%';
      videoElement.style.height = '100%';
      videoElement.style.zIndex = '-1';
      videoElement.style.margin = '0';
    }
  }, 1000); // Espera 1 segundo para asegurarte de que AR.js terminó

  return () => clearTimeout(timeout);
}, []);
  
  return (
    <div>
      <Header />

      {/* Contenedor que ocupa el 45% del ancho de la pantalla y 35% de la altura */}
      <div
        style={{
          width: '85vw',
          height: '45vh',
          margin: '2rem auto',
          border: '2px solid #ccc',
          borderRadius: '100px',
          overflow: 'hidden',
        }}
      >
        <a-scene
          embedded
          arjs="sourceType: webcam; debugUIEnabled: false;"
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <a-marker preset="hiro">
            <a-entity
              gltf-model="url(/tienda3D.glb)"
              scale="1.2 1.2 1.2"
              position="0 2 -1"
              rotation="0 0 0"
              animation__rotation="property: rotation; to: 15 45 360; dur: 7000; loop: true"
            />
          </a-marker>
        </a-scene>
      </div>
    </div>
  );
};

export default Ubicate;
