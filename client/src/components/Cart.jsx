import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { buttonClick, slideIn, staggerFadeInOut } from "../animations";
import { baseURL, getAllCartItems, increaseItemQuantity } from "../api";
import { BiChevronsRight } from "../assets/icons";
import { alertNULL, alertSuccess } from "../context/actions/alertActions";
import { setCartItems } from "../context/actions/cartAction";
import { setCartOff } from "../context/actions/displayCartAction";

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let tot = 0;
    if (cart) {
      cart.forEach((data) => {
        tot += data.product_price * data.quantity;
      });
      setTotal(tot);
    }
  }, [cart]);

  const handleCheckOut = () => {
    const data = { user, cart, total };
    axios
      .post(`${baseURL}/api/products/create-checkout-session`, { data })
      .then((res) => {
        if (res.data.url) {
          window.location.href = res.data.url;
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <motion.div
      {...slideIn}
      className="fixed z-50 top-0 right-0 w-300 md:w-508 h-screen bg-lightOverlay backdrop-blur-md shadow-md rounded-l-3xl overflow-hidden flex flex-col"
    >
      <div className="w-full flex items-center justify-between py-4 px-6 bg-zinc-100 shadow-md">
        <motion.i
          {...buttonClick}
          className="cursor-pointer"
          onClick={() => dispatch(setCartOff())}
        >
          <BiChevronsRight className="text-[40px] text-textColor" />
        </motion.i>
        <p className="text-2xl text-headingColor font-bold">Tu Carrito</p>
      </div>

      {cart && cart.length > 0 ? (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-track-zinc-200">
            {cart.map((item, i) => (
              <CartItemCard key={i} index={i} data={item} />
            ))}
          </div>
          <div className="bg-zinc-100 flex flex-col items-center justify-center px-6 py-6 gap-6">
            <div className="w-full flex items-center justify-center gap-16">
              <p className="text-xl text-zinc-800 font-bold">Total:</p>
              <p className="text-2xl text-red-600 font-bold">
                ${" "}
                {new Intl.NumberFormat("es-ES", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                }).format(total)}
              </p>
            </div>
            <motion.button
              {...buttonClick}
              className="bg-red-600 w-full py-3 rounded-xl text-white font-semibold text-lg hover:bg-orange-600 transition-all duration-200"
              onClick={handleCheckOut}
            >
              Pagar
            </motion.button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center w-full bg-zinc-200">
          <h1 className="text-3xl text-black font-bold">Carrito Vacío</h1>
        </div>
      )}
    </motion.div>
  );
};

export const CartItemCard = ({ index, data }) => {
  const user = useSelector((state) => state.user);
  const [itemTotal, setItemTotal] = useState(0);
  const dispatch = useDispatch();
  const decrementCart = (productId) => {
    dispatch(alertSuccess("Un producto menos :("));
    increaseItemQuantity(user?.user_id, productId, "decrement").then(() => {
      getAllCartItems(user?.user_id).then((items) => {
        dispatch(setCartItems(items));
        dispatch(alertNULL());
      });
    });
  };

  const incrementCart = (productId) => {
    dispatch(alertSuccess("Un producto mas :)"));
    increaseItemQuantity(user?.user_id, productId, "increment").then(() => {
      getAllCartItems(user?.user_id).then((items) => {
        dispatch(setCartItems(items));
        dispatch(alertNULL());
      });
    });
  };

  useEffect(() => {
    setItemTotal(data.product_price * data.quantity);
  }, [data.product_price, data.quantity]);

  return (
    <motion.div
      key={index}
      {...staggerFadeInOut(index)}
      className="w-full flex items-center justify-start bg-zinc-200 rounded-md drop-shadow-md px-4 gap-4"
    >
      <img
        src={data?.imageURL}
        className="w-24 min-w-[94px] h-24 object-contain"
        alt=""
      />
      <div className="flex items-center justify-start gap-1 w-full">
        <p className="text-lg text-black font-semibold flex-1">
          {data?.product_name}
          <span className="text-sm block capitalize text-gray-500">
            {data?.product_category}
          </span>
        </p>
        <p className="text-sm flex items-center justify-center gap-1 font-bold text-red-600 ml-auto">
          $ {new Intl.NumberFormat("es-ES").format(itemTotal)}
        </p>
      </div>
      <div className="ml-auto flex items-center justify-center gap-3">
        <motion.div
          {...buttonClick}
          onClick={() => decrementCart(data?.productId)}
          className="w-8 h-8 flex items-center justify-center rounded-md drop-shadow-md bg-zinc-400 cursor-pointer"
        >
          <p className="text-xl font-semibold text-primary">–</p>
        </motion.div>
        <p className="text-lg text-black font-semibold">{data?.quantity}</p>
        <motion.div
          {...buttonClick}
          className="w-8 h-8 flex items-center justify-center rounded-md drop-shadow-md bg-zinc-400 cursor-pointer"
          onClick={() => incrementCart(data?.productId)}
        >
          <p className="text-xl font-semibold text-primary">+</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Cart;
