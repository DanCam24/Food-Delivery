import React, { useState, useEffect } from "react";
import { statuses } from "../utils/styles";
import { Spinner } from "../components";
import { FaCloudUploadAlt, MdDelete } from "../assets/icons";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../config/firebase.config";
import { useDispatch } from "react-redux";
import {
  alertDanger,
  alertNULL,
  alertSuccess,
} from "../context/actions/alertActions";
import { motion } from "framer-motion";
import { buttonClick } from "../animations";
import { addNewProduct, updateProduct } from "../api";

const DBNewItem = ({ initialProduct, onClose, onUpdate }) => {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [imageDownloadURL, setImageDownloadURL] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (initialProduct) {
      setItemName(initialProduct.product_name);
      setPrice(initialProduct.product_price);
      setCategory(initialProduct.product_category);
      setImageDownloadURL(initialProduct.imageURL);
    }
  }, [initialProduct]);

  const uploadImage = (e) => {
    setisLoading(true);
    const imageFile = e.target.files[0];
    const storageRef = ref(storage, `Images/${Date.now()}_${imageFile.name}`);

    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => {
        dispatch(alertDanger(`Error: ${error.message}`));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageDownloadURL(downloadURL);
          setisLoading(false);
          setProgress(null);
          dispatch(alertSuccess("Imagen cargada con éxito."));
          setTimeout(() => {
            dispatch(alertNULL());
          }, 3000);
        });
      }
    );
  };

  const deleteImageFromFirebase = () => {
    setisLoading(true);
    const deleteRef = ref(storage, imageDownloadURL);

    deleteObject(deleteRef).then(() => {
      setImageDownloadURL(null);
      setisLoading(false);
      dispatch(alertSuccess("Imagen eliminada con éxito."));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    });
  };

  const handleSubmit = async () => {
    const data = {
      productId: initialProduct ? initialProduct.productId : undefined,
      product_name: itemName,
      product_category: category,
      product_price: price,
      imageURL: imageDownloadURL,
    };
  
    try {
      if (initialProduct) {
        // Actualiza el producto existente
        await updateProduct(data);
        dispatch(alertSuccess("Producto actualizado con éxito"));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
        onUpdate(data); // Llama a la función de actualización
      } else {
        // Agrega un nuevo producto
        await addNewProduct(data);
        dispatch(alertSuccess("Nuevo producto añadido"));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
      }
      
      // Limpia los campos y cierra el modal
      setItemName("");
      setPrice("");
      setCategory(null);
      setImageDownloadURL(null);
      onClose(); // Cierra el modal
  
    } catch (error) {
      dispatch(alertDanger(`Error: ${error.message}`));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    }
  };
  

  return (
    <div className="flex items-center justify-center flex-col pt-6 px-24 w-full">
      <div className="border border-gray-300 rounded-md p-4 w-full flex flex-col items-center justify-center gap-4">
        <InputValueField
          type="text"
          placeHolder={"Nombre del item"}
          stateFunc={setItemName}
          stateValue={itemName}
        />

        <div className="w-full flex items-center justify-around gap-3 flex-wrap">
          {statuses &&
            statuses?.map((data) => (
              <p
                key={data.id}
                onClick={() => setCategory(data.category)}
                className={`px-4 py-3 rounded-md text-xl text-textColor font-semibold cursor-pointer hover:shadow-md border border-gray-200 backdrop-blur-md ${
                  data.category === category
                    ? "bg-red-400 text-primary"
                    : "bg-transparent"
                }`}
              >
                {data.title}
              </p>
            ))}
        </div>
        <InputValueField
          type="number"
          placeHolder={"Precio del item"}
          stateFunc={setPrice}
          stateValue={price}
        />

        <div className="w-full bg-card backdrop-blur-md h-370 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
          {isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-evenly px-24">
              <Spinner />
              {Math.round(progress > 0) && (
                <div className="w-full flex flex-col items-center justify-center gap-2">
                  <div className="flex justify-between w-full">
                    <span className="text-base font-medium text-textColor">
                      Progress
                    </span>
                    <span className="text-sm font-medium text-textColor">
                      {Math.round(progress) > 0 && (
                        <>{`${Math.round(progress)}%`}</>
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-red-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                      style={{
                        width: `${Math.round(progress)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {!imageDownloadURL ? (
                <label>
                  <div className="flex flex-col items-center justify-center h-full w-full cursor-pointer">
                    <div className="flex flex-col justify-center items-center cursor-pointer">
                      <p className="font-bold text-4xl">
                        <FaCloudUploadAlt className="-rotate-0" />
                      </p>
                      <p className="text-lg text-textColor">
                        Click para subir una imagen
                      </p>
                    </div>
                  </div>
                  <input
                    type="file"
                    name="upload-image"
                    accept="image/*"
                    onChange={uploadImage}
                    className="w-0 h-0"
                  />
                </label>
              ) : (
                <>
                  <div className="relative w-full h-full overflow-hidden rounded-md">
                    <motion.img
                      whileHover={{ scale: 1.15 }}
                      src={imageDownloadURL}
                      className="w-full h-full object-cover"
                    />
                    <motion.button
                      {...buttonClick}
                      type="button"
                      className="absolute top-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md duration-500 transition-all ease-in-out"
                      onClick={deleteImageFromFirebase}
                    >
                      <MdDelete className="-rotate-0" />
                    </motion.button>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <motion.button
          onClick={handleSubmit}
          {...buttonClick}
          className="w-9/12 py-2 rounded-md bg-red-400 text-primary hover:bg-red-500 cursor-pointer"
        >
          {initialProduct ? "Actualizar" : "Guardar"}
        </motion.button>
        <button
          onClick={onClose}
          className="mt-4 w-9/12 py-2 rounded-md bg-gray-300 text-black cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export const InputValueField = ({ type, placeHolder, stateValue, stateFunc }) => {
  return (
    <input
      type={type}
      placeholder={placeHolder}
      className="w-full px-4 py-3 bg-lightOverlay shadow-md outline-none rounded-md border border-gray-200 focus:border-red-400"
      value={stateValue}
      onChange={(e) => stateFunc(e.target.value)}
    />
  );
};

export default DBNewItem;
