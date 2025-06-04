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

const DBNewItem = ({ initialProduct, onClose = () => {}, onUpdate }) => {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [imageDownloadURL, setImageDownloadURL] = useState(null);
  const [quantity, setQuantity] = useState("");

  const [errors, setErrors] = useState({
    itemName: false,
    price: false,
    category: false,
    quantity: false,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (initialProduct) {
      setItemName(initialProduct.product_name);
      setPrice(initialProduct.product_price);
      setCategory(initialProduct.product_category);
      setImageDownloadURL(initialProduct.imageURL);
      setQuantity(initialProduct.product_quantity || "");
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
        setTimeout(() => dispatch(alertNULL()), 3000);
        setisLoading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageDownloadURL(downloadURL);
          setisLoading(false);
          setProgress(null);
          dispatch(alertSuccess("Imagen cargada con éxito."));
          setTimeout(() => dispatch(alertNULL()), 3000);
        });
      }
    );
  };

  const deleteImageFromFirebase = () => {
    if (!imageDownloadURL) return;
    setisLoading(true);
    const deleteRef = ref(storage, imageDownloadURL);

    deleteObject(deleteRef).then(() => {
      setImageDownloadURL(null);
      setisLoading(false);
      dispatch(alertSuccess("Imagen eliminada con éxito."));
      setTimeout(() => dispatch(alertNULL()), 3000);
    });
  };

  const handleSubmit = async () => {
    const newErrors = {
      itemName: !itemName,
      price: !price || Number(price) <= 0,
      category: !category,
      quantity: !quantity || Number(quantity) <= 0,
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => err);
    if (hasErrors) {
      dispatch(alertDanger("Por favor completa todos los campos correctamente."));
      setTimeout(() => dispatch(alertNULL()), 3000);
      return;
    }

    const data = {
      productId: initialProduct ? initialProduct.productId : undefined,
      product_name: itemName,
      product_category: category,
      product_price: price,
      product_quantity: quantity,
      imageURL: imageDownloadURL,
    };

    try {
      if (initialProduct) {
        await updateProduct(data);
        dispatch(alertSuccess("Producto actualizado con éxito"));
        onUpdate && onUpdate(data);
      } else {
        await addNewProduct(data);
        dispatch(alertSuccess("Nuevo producto añadido"));
      }

      setTimeout(() => dispatch(alertNULL()), 3000);

      setItemName("");
      setPrice("");
      setCategory(null);
      setImageDownloadURL(null);
      setQuantity("");
      setErrors({ itemName: false, price: false, category: false, quantity: false });
      onClose();
    } catch (error) {
      dispatch(alertDanger(`Error: ${error.message}`));
      setTimeout(() => dispatch(alertNULL()), 3000);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col pt-6 px-16 w-full">
      <div className="border border-gray-300 rounded-md p-4 w-full flex flex-col items-center justify-center gap-4">
        <div className="w-full flex items-center gap-4">
          <InputValueField
            type="text"
            placeHolder={"Nombre del producto"}
            stateFunc={setItemName}
            stateValue={itemName}
            error={errors.itemName}
          />
        </div>

        <div className="w-full flex items-center gap-4 mt-2">
          <span className="text-xl font-semibold text-gray-700">$</span>
          <InputValueField
            type="number"
            placeHolder={"Precio"}
            stateFunc={setPrice}
            stateValue={price}
            error={errors.price}
          />
          <span className="text-xl font-semibold text-gray-700">Cantidad:</span>
          <InputValueField
            type="number"
            placeHolder={"Disponible"}
            stateFunc={setQuantity}
            stateValue={quantity}
            error={errors.quantity}
          />
        </div>

        <div className="w-full flex items-center justify-around gap-3 flex-wrap">
          {statuses &&
            statuses?.map((data) => (
              <p
                key={data.id}
                onClick={() => setCategory(data.category)}
                className={`px-4 py-3 rounded-md text-xl text-textColor font-semibold cursor-pointer hover:shadow-md border 
                  ${data.category === category ? "bg-red-400 text-primary" : "bg-transparent"} 
                  ${errors.category && data.category !== category ? "border-red-500" : "border-gray-200"}`}
              >
                {data.title}
              </p>
            ))}
        </div>

        <div className="w-1/2 h-1/2 bg-card backdrop-blur-md rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
          {isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-evenly px-24">
              <Spinner />
              {Math.round(progress > 0) && (
                <div className="w-full flex flex-col items-center justify-center gap-2">
                  <div className="flex justify-between w-full">
                    <span className="text-base font-medium text-textColor">
                      En proceso
                    </span>
                    <span className="text-sm font-medium text-textColor">
                      {Math.round(progress) > 0 && `${Math.round(progress)}%`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-red-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                      style={{ width: `${Math.round(progress)}%` }}
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
                      <p className="text-lg text-textColor">Click para subir una imagen</p>
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

        {initialProduct && (
          <button
            onClick={onClose}
            className="w-9/12 py-2 rounded-md bg-gray-300 text-gray-700 cursor-pointer"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
};

const InputValueField = ({ placeHolder, stateFunc, stateValue, type, error }) => {
  return (
    <input
      type={type || "text"}
      value={stateValue}
      placeholder={placeHolder}
      onChange={(e) => stateFunc(e.target.value)}
      className={`w-full rounded-md border-2 p-2 focus:outline-none focus:border-red-400 transition-all ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
  );
};

export default DBNewItem;