import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setAllProducts } from "../context/actions/productActions";
import { getAllProducts } from "../api";
import { Cart, Header, SliderCard } from "../components";
import { IoCart } from "../assets/icons";
import { staggerFadeInOut } from "../animations";

const Menu = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const isCart = useSelector((state) => state.isCart);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    ...new Set(products.map((product) => product.product_category)),
    "Todos",
  ];

  useEffect(() => {
    if (!products.length) {
      getAllProducts().then((data) => {
        dispatch(setAllProducts(data));
      });
    }
  }, [dispatch, products]);

  const toggleCategory = (category) => {
    if (category === "Todos") {
      setSelectedCategories([]);
    } else {
      setSelectedCategories((prev) =>
        prev.includes(category)
          ? prev.filter((cat) => cat !== category)
          : [...prev, category]
      );
    }
  };

  const filteredProducts = products
    .filter((product) => product.product_quantity > 0)
    .filter((product) =>
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) =>
      selectedCategories.length > 0
        ? selectedCategories.includes(product.product_category)
        : true
    );

  return (
    <main className="w-screen min-h-screen flex flex-col bg-primary px-6 md:px-24 2xl:px-96">
      <Header />
      <header className="mt-40 flex justify-between items-center w-full">
        <h2 className="text-2xl text-headingColor font-bold">Categorías</h2>
        <div className="flex flex-col items-end">
          <h1 className="text-3xl font-bold text-headingColor">
            Nuestro Catálogo
          </h1>
          <div className="w-40 h-1 rounded-md bg-orange-500 my-2"></div>
        </div>
      </header>

      <section className="mt-10">
        <div className="w-full overflow-x-auto pt-6 flex items-center gap-4 pb-4 whitespace-nowrap">
          {categories.map((category, index) => (
            <FilterCard
              key={index}
              data={{ title: category, category }}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              index={index}
            />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl text-headingColor font-bold">Productos</h2>
          <input
            type="text"
            placeholder="Buscar..."
            className="w-1/5 p-2 border rounded-md ml-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full flex items-center justify-evenly flex-wrap gap-4 mt-4">
          {filteredProducts.map((product, index) => (
            <SliderCard key={index} data={product} index={index} />
          ))}
        </div>
      </section>
      {isCart && <Cart />}
    </main>
  );
};

const FilterCard = ({ data, index, selectedCategories, toggleCategory }) => {
  const isActive = selectedCategories.includes(data.category);

  return (
    <motion.div
      key={index}
      {...staggerFadeInOut(index)}
      onClick={() => toggleCategory(data.category)}
      className={`group min-w-[128px] cursor-pointer rounded-md py-6 ${
        isActive ? "bg-red-500" : "bg-primary"
      } hover:bg-red-500 shadow-md flex flex-col items-center justify-center gap-4`}
    >
      <div
        className={`w-10 h-10 rounded-full shadow-md flex items-center justify-center group-hover:bg-primary ${
          isActive ? "bg-primary" : "bg-red-500"
        }`}
      >
        <IoCart
          className={`${
            isActive ? "text-red-500" : "text-primary"
          } group-hover:text-red-500`}
        />
      </div>
      <p
        className={`text-xl font-semibold ${
          isActive ? "text-primary" : "text-textColor"
        } group-hover:text-primary`}
      >
        {data.title}
      </p>
    </motion.div>
  );
};

export default Menu;
