import { motion } from "framer-motion";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { buttonClick } from "../animations";
import { addNewItemToCart, getAllCartItems } from "../api";
import { IoBasket } from "../assets/icons";
import { alertNULL, alertSuccess } from "../context/actions/alertActions";
import { setCartItems } from "../context/actions/cartAction";
import { RAicon } from "../assets";
import PopupModal from "./PopupModal";

const SliderCard = ({ data }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [setProductImages] = useState([]);

  const sendToCart = () => {
    dispatch(alertSuccess("Añadido al Carrito"));
    addNewItemToCart(user?.user_id, data).then((res) => {
      getAllCartItems(user?.user_id).then((items) => {
        dispatch(setCartItems(items));
      });
      setInterval(() => {
        dispatch(alertNULL());
      }, 3000);
    });
  };

  const AbrirCamaraRA = () => {
    if (data.images && data.images.length > 0) {
      setProductImages(data.images);
    }
    setIsModalOpen(true);
    setInterval(() => {
      dispatch(alertNULL());
    }, 3000);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-lightOverlay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center justify-between relative px-4 py-2 w-full md:w-340 md:min-w-350 gap-3">
      <img
        src={data.imageURL}
        className="w-40 h-40 object-contain"
        alt={data.product_name}
      />
      <div className="relative pt-12">
        <p className="text-xl text-headingColor font-semibold">
          {data.product_name}
        </p>
        <p className="text-lg font-semibold text-orange-500 flex items-center justify-center gap-1">
          $ {parseFloat(data.product_price)}
        </p>

        {user?.user_id && (
          <motion.div
            {...buttonClick}
            onClick={sendToCart}
            className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center absolute -top-4 right-12 cursor-pointer"
          >
            <IoBasket className="text-2xl text-primary" />
          </motion.div>
        )}

        <motion.div
          {...buttonClick}
          onClick={AbrirCamaraRA}
          className="w-8 h-8 bg-white-500 flex items-center justify-center absolute -top-4 right-2 cursor-pointer"
        >
          <img src={RAicon} className="text-2xl text-primary" alt="RA icon" />
        </motion.div>
      </div>

      <PopupModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        productImages={data.productImages}
        productName={data.product_name}
      />
    </div>
  );
};

export default SliderCard;
