import React, { useState, useCallback, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Avatar, Logo } from "../assets";
import { isNotActiveStyles } from "../utils/styles";
import { motion } from "framer-motion";
import { buttonClick, slideTop } from "../animations";
import { MdLogout, MdShoppingCart } from "../assets/icons";
import { useDispatch, useSelector } from "react-redux";
import { getAuth } from "firebase/auth";
import { app } from "../config/firebase.config";
import { setUserNull } from "../context/actions/userActions";
import { setCartOn } from "../context/actions/displayCartAction";

function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

const menuItems = [
  { to: "/dashboard/home", label: "Dashboard", adminOnly: true },
  { to: "/user-orders", label: "Pedidos" },
  { to: "/ubicate", label: "Ubicate" },
];

const commonLinks = [
  { to: "/", label: "Inicio", activeClassName: "text-red-500" },
  { to: "/menu", label: "Menú", activeClassName: "text-red-500" },
  {
    to: "/aboutus",
    label: "Acerca De Nosotros",
    activeClassName: "text-green-500",
  },
];

const MenuLinks = ({ items, user, isMobile = false }) => {
  return items.map(({ to, label, adminOnly, activeClassName }) => {
    if (adminOnly && user?.user_id !== process.env.REACT_APP_ADMIN_ID)
      return null;
    if (isMobile) {
      return (
        <Link
          key={to}
          to={to}
          className="hover:text-red-500 text-xl text-textColor"
          onClick={(e) => e.currentTarget.blur()}
        >
          {label}
        </Link>
      );
    }
    return (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) =>
          isActive
            ? `text-xl font-semibold ${activeClassName || "text-red-500"}`
            : "text-textColor text-xl"
        }
      >
        {label}
      </NavLink>
    );
  });
};

const UserMenu = ({ user, signOut, closeMenu }) => {
  const menuRef = useRef(null);
  useClickOutside(menuRef, closeMenu);

  return (
    <motion.div
      {...slideTop}
      ref={menuRef}
      className="px-6 py-4 w-48 bg-white rounded-md shadow-md absolute top-20 right-12 flex flex-col gap-4 hidden md:flex"
      role="menu"
      aria-label="User menu"
    >
      <MenuLinks items={menuItems} user={user} />
      <hr />
      <motion.button
        {...buttonClick}
        onClick={signOut}
        className="group flex items-center justify-center px-3 py-2 rounded-md shadow-md bg-gray-100 hover:bg-gray-200 gap-3 text-left"
        role="menuitem"
        tabIndex={0}
      >
        <MdLogout className="text-2xl text-textColor group-hover:text-headingColor" />
        <p className="text-textColor text-xl group-hover:text-headingColor">
          Cerrar Sesión
        </p>
      </motion.button>
    </motion.div>
  );
};

const MobileUserMenu = ({ user, signOut }) => {
  return (
    <div
      className="md:hidden absolute top-20 right-4 bg-white rounded-md shadow-md p-4 flex flex-col gap-4 w-[calc(100%-2rem)] max-w-[260px]"
      role="menu"
      aria-label="Mobile user menu"
    >
      {user && <MenuLinks items={menuItems} user={user} isMobile />}
      {user && <hr />}
      <MenuLinks items={commonLinks} isMobile />
      {user && (
        <motion.button
          {...buttonClick}
          onClick={signOut}
          className="group flex items-center justify-center px-3 py-2 rounded-md shadow-md bg-gray-100 hover:bg-gray-200 gap-3"
          role="menuitem"
          tabIndex={0}
        >
          <MdLogout className="text-2xl text-textColor group-hover:text-headingColor" />
          <p className="text-textColor text-xl group-hover:text-headingColor">
            Cerrar Sesión
          </p>
        </motion.button>
      )}
    </div>
  );
};

const Header = () => {
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const firebaseAuth = getAuth(app);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signOut = useCallback(() => {
    firebaseAuth
      .signOut()
      .then(() => {
        dispatch(setUserNull());
        navigate("/login", { replace: true });
      })
      .catch((err) => {
        console.error("Error signing out:", err);
        alert("Error al cerrar sesión. Intente nuevamente.");
      });
  }, [firebaseAuth, dispatch, navigate]);

  const toggleUserMenu = useCallback(() => {
    setIsUserMenuOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    setIsUserMenuOpen(false);
  }, [navigate]);

  return (
    <header className="fixed z-50 inset-x-0 top-0 flex items-center px-12 md:px-20 py-6 backdrop-blur-lg bg-white/5">
      <NavLink to={"/"} className="flex items-center justify-center gap-4">
        <img src={Logo} className="w-20" alt="Logo" />
        <p className="font-semibold text-3xl">El Buen Gusto</p>
      </NavLink>

      <nav
        className="hidden md:flex flex-1 justify-center"
        aria-label="Main navigation"
      >
        <ul className="flex items-center gap-16">
          {commonLinks.map(({ to, label, activeClassName }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive
                  ? `text-2xl font-semibold ${
                      activeClassName || "text-red-700"
                    } px-4 py-2 duration-100 transition-all ease-in-out`
                  : isNotActiveStyles
              }
            >
              {label}
            </NavLink>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-6 ml-auto">
        {user?.user_id && (
          <motion.div
            {...buttonClick}
            onClick={() => dispatch(setCartOn())}
            className="relative cursor-pointer"
            aria-label="Carrito de compras"
            role="button"
            tabIndex={0}
          >
            <MdShoppingCart className="text-3xl text-textColor" />
            {cart?.length > 0 && (
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center absolute -top-4 -right-1">
                <p className="text-primary text-base font-semibold">
                  {cart.length}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {user ? (
          <div
            className="w-12 h-12 rounded-full shadow-md cursor-pointer overflow-hidden flex items-center justify-center"
            onClick={toggleUserMenu}
            role="button"
            tabIndex={0}
            aria-haspopup="true"
            aria-expanded={isUserMenuOpen}
            aria-label="Toggle user menu"
          >
            <motion.img
              className="w-full h-full object-cover"
              src={user?.picture || Avatar}
              whileHover={{ scale: 1.15 }}
              referrerPolicy="no-referrer"
              alt="Perfil de usuario"
            />
          </div>
        ) : (
          <NavLink to="/login">
            <motion.button
              {...buttonClick}
              className="px-4 py-2 rounded-md shadow-md bg-lightOverlay border border-red-300 cursor-pointer"
            >
              Iniciar Sesión
            </motion.button>
          </NavLink>
        )}
      </div>

      {isUserMenuOpen && user && (
        <UserMenu
          user={user}
          signOut={signOut}
          closeMenu={() => setIsUserMenuOpen(false)}
        />
      )}
      {isUserMenuOpen && user && (
        <MobileUserMenu user={user} signOut={signOut} />
      )}
    </header>
  );
};

export default Header;
