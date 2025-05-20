import React, { useEffect, useState, useCallback } from "react";
import ReactDOM from "react-dom";

const PopupModal = ({
  isOpen,
  closeModal,
  productImages = [],
  productName,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      const images = {};
      const promises = productImages.map((src, index) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            images[index] = src;
            setLoadedImages((prev) => ({ ...prev, [index]: src }));
            resolve();
          };
          img.onerror = () => {
            console.error(`Error loading image at ${src}`);
            resolve();
          };
        });
      });
      await Promise.all(promises);
      setLoading(false);
    };

    if (isOpen && productImages.length > 0) {
      setLoading(true);
      loadImages();
      setIsDragging(false);
      setCurrentIndex(0);
    } else {
      setLoading(false);
    }
  }, [isOpen, productImages]);

  const nextImage = useCallback(() => {
    if (currentIndex < productImages.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  }, [currentIndex, productImages.length]);

  const prevImage = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  }, [currentIndex]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "ArrowRight") {
        nextImage();
      } else if (event.key === "ArrowLeft") {
        prevImage();
      } else if (event.key === "Escape") {
        closeModal();
      }
    },
    [nextImage, prevImage, closeModal]
  );

  const handleMouseDown = (e) => {
    setIsDragging((prev) => !prev);
    if (!isDragging) {
      setStartX(e.clientX);
    }
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        const moveDistance = e.clientX - startX;
        const threshold = 24;

        if (moveDistance > threshold) {
          nextImage();
          setStartX(e.clientX);
        } else if (moveDistance < -threshold) {
          prevImage();
          setStartX(e.clientX);
        }
      }
    },
    [isDragging, startX, nextImage, prevImage]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isOpen, handleKeyDown, handleMouseMove]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onMouseDown={handleMouseDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-[40vw] h-[40vh] flex flex-col items-center justify-center">
        <h2 id="modal-title" className="text-2xl font-semibold mb-4">
          {productName}
        </h2>
        <div className="w-full h-full flex items-center justify-center">
          {loading ? (
            <p>Cargando imagen...</p>
          ) : productImages.length === 0 ? (
            <p>Sin imagen</p>
          ) : loadedImages[currentIndex] ? (
            <img
              src={loadedImages[currentIndex]}
              alt={`Producto ${currentIndex}`}
              className="w-2/3 h-full object-contain"
            />
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PopupModal;
