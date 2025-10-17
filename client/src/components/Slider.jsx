import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/bundle";
import "../assets/css/swiperStyles.css";
import { useSelector } from "react-redux";
import { SliderCard } from "../components";

const Slider = ({ category }) => {
  const products = useSelector((state) => state.products);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (products) {
      setFilteredProducts(
        products.filter((data) => data.product_category === category)
      );
    }
  }, [products, category]);

  return (
    <div className="w-full pt-12">
      <Swiper
        spaceBetween={30}
        grabCursor={true}
        centeredSlides={false}
        className="mySwiper"
        breakpoints={{
          1440: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          480: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
        }}
      >
        {filteredProducts.length > 0 &&
          filteredProducts.map((data, i) => (
            <SwiperSlide key={i}>
              <SliderCard data={data} index={i} />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default Slider;
