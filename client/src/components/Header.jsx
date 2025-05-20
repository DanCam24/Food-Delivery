import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Avatar, Logo } from "../assets";
import { isActiveStyles, isNotActiveStyles } from "../utils/styles";
import { motion } from "framer-motion";
import { buttonClcik, slideTop } from "../animations";
import { MdLogout, MdShoppingCart } from "../assets/icons";
import { useDispatch, useSelector } from "react-redux";
import { getAuth } from "firebase/auth";
import { app } from "../config/firebase.config";
import { setUserNull } from "../context/actions/userActions";
import { setCartOn } from "../context/actions/displayCartAction";

const Header = () => {
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);

  const [isMenu, setIsMenu] = useState(false); // Estado para controlar el menú de usuario
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Estado para controlar el menú móvil
  const firebaseAuth = getAuth(app);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signOut = () => {
    firebaseAuth
      .signOut()
      .then(() => {
        dispatch(setUserNull());
        navigate("/login", { replace: true });
      })
      .catch((err) => console.log(err));
  };

  return (
    <header className="fixed z-50 inset-x-0 top-0 flex items-center justify-between px-12 md:px-20 py-6 backdrop-blur-lg bg-white/5">
      <NavLink to={"/"} className="flex items-center justify-center gap-4">
        <img src={Logo} className="w-20" alt="Logo" />
        <p className="font-semibold text-3xl">El Buen Gusto</p>
      </NavLink>

      {/* Menú de navegación para pantallas grandes */}
      <nav className="hidden md:flex items-center justify-center gap-8">
        <ul className="flex items-center gap-16">
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={"/"}
          >
            Inicio
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={"/menu"}
          >
            Menú
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              isActive ? "text-2xl text-green-700 font-semibold hover:text-red-700 px-4 py-2 duration-100 transition-all ease-in-out" : isNotActiveStyles
            }
            to={"/aboutus"}
          >
            Acerca De Nosotros
          </NavLink>
        </ul>
      </nav>

      {/* Carrito de compras (Siempre visible) */}
      <motion.div
        {...buttonClcik}
        onClick={() => dispatch(setCartOn())}
        className="relative cursor-pointer"
      >
        <MdShoppingCart className="text-3xl text-textColor" />
        {cart?.length > 0 && (
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center absolute -top-4 -right-1">
            <p className="text-primary text-base font-semibold">
              {cart?.length}
            </p>
          </div>
        )}
      </motion.div>

      {/* Menú de usuario en pantallas grandes */}
      <div className="hidden md:block relative cursor-pointer">
        {user ? (
          <div
            className="w-12 h-12 rounded-full shadow-md cursor-pointer overflow-hidden flex items-center justify-center"
            onClick={() => setIsMenu((prevState) => !prevState)} // Alternar el menú con clic
          >
            <motion.img
              className="w-full h-full object-cover"
              src={user?.picture ? user?.picture : Avatar}
              whileHover={{ scale: 1.15 }}
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <NavLink to="/login">
            <motion.button
              {...buttonClcik}
              className="px-4 py-2 rounded-md shadow-md bg-lightOverlay border border-red-300 cursor-pointer"
            >
              Iniciar Sesión
            </motion.button>
          </NavLink>
        )}

        {/* Menú de usuario cuando está abierto (por clic) */}
        {isMenu && (
          <motion.div
            {...slideTop}
            className="px-6 py-4 w-48 bg-white rounded-md shadow-md absolute top-12 right-0 flex flex-col gap-4"
          >
            {user?.user_id === process.env.REACT_APP_ADMIN_ID && (
              <Link
                className="hover:text-red-500 text-xl text-textColor"
                to={"/dashboard/home"}
              >
                Dashboard
              </Link>
            )}
            <Link
              className="hover:text-red-500 text-xl text-textColor"
              to={"/profile"}
            >
              Mi Perfil
            </Link>
            <Link
              className="hover:text-red-500 text-xl text-textColor"
              to={"/user-orders"}
            >
              Pedidos
            </Link>
            <NavLink
              className="hover:text-red-500 text-xl text-textColor"
              to={"/ubicate"} 
            >
              Ubicate
            </NavLink>
            <hr />
            <motion.div
              {...buttonClcik}
              onClick={signOut}
              className="group flex items-center justify-center px-3 py-2 rounded-md shadow-md bg-gray-100 hover:bg-gray-200 gap-3"
            >
              <MdLogout className="text-2xl text-textColor group-hover::text-headingColor" />
              <p className="text-textColor text-xl group-hover:text-headingColor">
                Cerrar Sesión
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Menú móvil: Mostrar cuando se hace clic en la foto del usuario */}
      <div className="md:hidden flex items-center">
        {user ? (
          <div
            className="relative cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} // Alternar el estado del menú móvil
          >
            <div className="w-12 h-12 rounded-full shadow-md cursor-pointer overflow-hidden flex items-center justify-center">
              <motion.img
                className="w-full h-full object-cover"
                src={user?.picture ? user?.picture : Avatar}
                whileHover={{ scale: 1.15 }}
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        ) : (
          <NavLink to="/login">
            <motion.button
              {...buttonClcik}
              className="px-4 py-2 rounded-md shadow-md bg-lightOverlay border border-red-300 cursor-pointer"
            >
              Iniciar Sesión
            </motion.button>
          </NavLink>
        )}
      </div>

      {/* Menú de navegación para pantallas pequeñas */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 right-12 bg-white rounded-md shadow-md p-4 flex flex-col gap-4 w-[calc(100%-2rem)] max-w-[260px]">
          {/* Menú de usuario */}
          {user && (
            <>
              {user?.user_id === process.env.REACT_APP_ADMIN_ID && (
                <Link
                  className="hover:text-red-500 text-xl text-textColor"
                  to={"/dashboard/home"}
                >
                  Dashboard
                </Link>
              )}
              <Link
                className="hover:text-red-500 text-xl text-textColor"
                to={"/profile"}
              >
                Mi Perfil
              </Link>
              <Link
                className="hover:text-red-500 text-xl text-textColor"
                to={"/user-orders"}
              >
                Pedidos
              </Link>
              <NavLink
                className="hover:text-red-500 text-xl text-textColor"
                to={"/ubicate"}
              >
                Ubicate
              </NavLink>
              <hr />
            </>
          )}

          {/* Menú general con los mismos estilos de los links de usuario */}
          <NavLink
            className={({ isActive }) =>
              isActive ? "text-red-500 text-xl font-semibold" : "text-textColor text-xl"
            }
            to={"/"}
          >
            Inicio
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "text-red-500 text-xl font-semibold" : "text-textColor text-xl"
            }
            to={"/menu"}
          >
            Menú
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "text-green-500 text-xl font-semibold" : "text-textColor text-xl"
            }
            to={"/aboutus"}
          >
            Acerca De Nosotros
          </NavLink>

          {user && (
            <motion.div
              {...buttonClcik}
              onClick={signOut}
              className="group flex items-center justify-center px-3 py-2 rounded-md shadow-md bg-gray-100 hover:bg-gray-200 gap-3"
            >
              <MdLogout className="text-2xl text-textColor group-hover::text-headingColor" />
              <p className="text-textColor text-xl group-hover:text-headingColor">
                Cerrar Sesión
              </p>
            </motion.div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
