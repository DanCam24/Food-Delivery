import React, { useEffect, useRef } from 'react';
import * as THREE from "aframe";
import { MindARThree } from "aframe";

function AR() {
  const containerRef = useRef(null);

  useEffect(() => {
    const mindarThree = new MindARThree({
      container: containerRef.current,
    });

    const { renderer, scene, camera } = mindarThree;

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    const faceMesh = mindarThree.addFaceMesh();
    const texture = new THREE.TextureLoader().load(
      "https://cdn.glitch.global/664045c5-4e0c-44e2-8344-b306cf4e1971/Dise%C3%B1o_sin_t%C3%ADtulo__3_-removebg-preview.png?v=1684098818744"
    );
    faceMesh.material.map = texture;
    faceMesh.material.transparent = true;
    faceMesh.material.needsUpdate = true;
    scene.add(faceMesh);

    const start = async () => {
      await mindarThree.start();
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });
    };

    start();

    // cleanup function
    return () => {
      renderer.dispose();
      scene.dispose();
      camera.dispose();
      mindarThree.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}></div>
  );
}

export default AR;

