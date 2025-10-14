import { motion } from "framer-motion";
import React from "react";
import { buttonClick, staggerFadeInOut } from "../animations";
import { getAllOrder, updateOrderSts } from "../api";
import { setOrders } from "../context/actions/ordersAction";
import { useDispatch } from "react-redux";

const OrderData = ({ index, data, admin }) => {
  const dispatch = useDispatch();

  const handleClick = (orderId, sts) => {
    updateOrderSts(orderId, sts).then(() => {
      getAllOrder().then((data) => {
        dispatch(setOrders(data));
      });
    });
  };

  return (
    <motion.div
      {...staggerFadeInOut(index)}
      className="w-full flex flex-col items-start justify-start px-3 py-2 border relative border-gray-300 bg-lightOverlay drop-shadow-md rounded-md gap-4"
    >
      <div className="w-full flex items-center justify-between">
        <h1 className="text-xl text-headingColor font-semibold">Ordenes</h1>

        <div className="flex items-center gap-4">
          <p className="flex items-center gap-1 text-textColor">
            Total: $
            <span className="text-headingColor font-bold">
              {data?.total || "No disponible"}
            </span>
          </p>

          <p className="px-2 py-[2px] text-sm text-headingColor font-semibold capitalize rounded-md bg-emerald-400 drop-shadow-md">
            {data?.status === "paid"
              ? "Pagado"
              : data?.status || "Estado no disponible"}
          </p>

          <p
            className={`text-base font-semibold capitalize border border-gray-300 px-2 py-[2px] rounded-md ${
              (data?.sts === "empacando" && "text-orange-500 bg-orange-100") ||
              (data?.sts === "cancelado" && "text-red-500 bg-red-100") ||
              (data?.sts === "entregado" && "text-emerald-500 bg-emerald-100")
            }`}
          >
            {data?.sts || "Estado de envío no disponible"}
          </p>

          {admin && (
            <div className="flex items-center justify-center gap-2">
              <p className="text-lg font-semibold text-headingColor">Estado</p>

              <motion.p
                {...buttonClick}
                onClick={() => handleClick(data.orderId, "empacando")}
                className="text-orange-500 text-base font-semibold capitalize border border-gray-300 px-2 py-[2px] rounded-md cursor-pointer"
              >
                Empacando
              </motion.p>

              <motion.p
                {...buttonClick}
                onClick={() => handleClick(data.orderId, "cancelado")}
                className="text-red-500 text-base font-semibold capitalize border border-gray-300 px-2 py-[2px] rounded-md cursor-pointer"
              >
                Cancelado
              </motion.p>

              <motion.p
                {...buttonClick}
                onClick={() => handleClick(data.orderId, "entregado")}
                className="text-emerald-500 text-base font-semibold capitalize border border-gray-300 px-2 py-[2px] rounded-md cursor-pointer"
              >
                Entregado
              </motion.p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-start flex-wrap w-full">
        <div className="flex items-center justify-center gap-4">
          {data?.items?.map((item, j) => (
            <motion.div
              {...staggerFadeInOut(j)}
              key={j}
              className="flex items-center justify-center gap-1"
            >
              <img
                src={item?.imageURL || "default-image.png"}
                className="w-32 h-28 object-contain"
                alt={item?.product_name || "Producto sin imagen"}
              />

              <div className="flex items-start flex-col">
                <p className="text-base font-semibold text-headingColor">
                  {item?.product_name || "Nombre del producto no disponible"}
                </p>
                <div className="flex items-start gap-2">
                  <p className="text-sm text-textColor">
                    Cantidad: {item?.quantity || "N/A"}
                  </p>
                  <p className="flex items-center gap-1 text-textColor">
                    Precio ${parseFloat(item?.product_price) || "N/A"}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-start justify-start flex-col gap-4 px-6 ml-auto w-full md:w-460">
          <h1 className="text-xl font-semibold text-headingColor">
            {data?.customer?.name || "Nombre de envío no disponible"}
          </h1>

          <div className="flex flex-col gap-0">
            <p className="text-base text-headingColor">
              <span className="font-semibold">Email:</span>{" "}
              {data?.customer?.email || "Email no disponible"}
            </p>
            <p className="text-base text-headingColor">
              <span className="font-semibold">Teléfono:</span>{" "}
              {data?.customer?.phone || "Teléfono no disponible"}
            </p>
            <p className="text-base text-headingColor">
              <span className="font-semibold">Dirección:</span>
              {data?.customer?.address?.line1 || "Dirección no disponible"},
              {data?.customer?.address?.line2 &&
                `${data?.customer?.address?.line2}, `}
              {data?.customer?.address?.country || "País no disponible"},
              {data?.customer?.address?.state || "Estado no disponible"} -
              {data?.customer?.address?.postal_code ||
                "Código postal no disponible"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderData;
