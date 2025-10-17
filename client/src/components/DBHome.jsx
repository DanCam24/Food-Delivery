import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts, getAllOrder } from "../api";
import { setAllProducts } from "../context/actions/productActions";
import { CChart } from "@coreui/react-chartjs";

const DBHome = () => {
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const categories = useMemo(() => {
    if (!products) return [];
    const uniqueCategories = new Set();
    products.forEach((product) => {
      if (product.product_category) {
        uniqueCategories.add(product.product_category);
      }
    });
    return Array.from(uniqueCategories);
  }, [products]);

  const [revenueData, setRevenueData] = useState([]);
  const [availabilityData, setAvailabilityData] = useState([]);

  const productsByCategory = useMemo(() => {
    const map = Object.fromEntries(categories.map((cat) => [cat, []]));
    products?.forEach((product) => {
      if (map[product.product_category]) {
        map[product.product_category].push(product);
      }
    });
    return map;
  }, [products, categories]);

  const unavailableProductsByCategory = useMemo(() => {
    const result = {};
    categories.forEach((cat) => {
      const catProducts = productsByCategory[cat] || [];
      result[cat] = catProducts.filter(
        (p) => parseInt(p.product_quantity || "0") === 0
      );
    });
    return result;
  }, [productsByCategory, categories]);

  useEffect(() => {
    const fetchData = async () => {
      if (!products || products.length === 0) {
        const prodData = await getAllProducts();
        dispatch(setAllProducts(prodData));
      }

      const orders = await getAllOrder();

      const categoryRevenue = Object.fromEntries(
        categories.map((cat) => [cat, 0])
      );

      orders?.forEach((order) => {
        const orderDate = new Date(order.created * 1000);
        const orderMonth = orderDate.getMonth() + 1;
        const orderYear = orderDate.getFullYear();

        if (orderMonth === selectedMonth && orderYear === selectedYear) {
          order.items?.forEach((item) => {
            const { product_category, product_price, quantity } = item;
            const price = parseFloat(product_price || "0");
            const qty = quantity || 0;
            if (categoryRevenue.hasOwnProperty(product_category)) {
              categoryRevenue[product_category] += price * qty;
            }
          });
        }
      });

      setRevenueData(categories.map((cat) => categoryRevenue[cat] || 0));

      const availability = categories.map((cat) => {
        const catProducts = productsByCategory[cat] || [];
        const disponibles = catProducts.filter(
          (p) => parseInt(p.product_quantity || "0") > 0
        ).length;
        const noDisponibles = catProducts.length - disponibles;
        return { disponibles, noDisponibles };
      });

      setAvailabilityData(availability);
    };

    fetchData();
  }, [
    products,
    dispatch,
    productsByCategory,
    categories,
    selectedMonth,
    selectedYear,
  ]);

  const categoryCounts = useMemo(
    () => categories.map((cat) => productsByCategory[cat]?.length || 0),
    [productsByCategory, categories]
  );

  return (
    <div className="flex flex-col items-center justify-center pt-6 w-full h-full">
      <div className="flex gap-4 mb-6">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="border px-2 py-1 rounded"
        >
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border px-2 py-1 rounded"
        >
          {[2024, 2025].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="grid w-full grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        <ChartCard
          title="Conteo por Categoría"
          type="bar"
          labels={categories}
          datasets={[
            {
              label: "Conteo",
              backgroundColor: "#6bc3fa",
              data: categoryCounts,
            },
          ]}
          options={{}}
        />

        <ChartCard
          title="Rentabilidad por Línea"
          type="line"
          labels={categories}
          datasets={[
            {
              label: "Rentabilidad ($)",
              borderColor: "#4BC0C0",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              data: revenueData.map((value) => (value * 0.2).toFixed(2)),
              fill: false,
            },
          ]}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: "Rentabilidad ($)" },
              },
            },
          }}
        />

        <ChartCard
          title="Disponibilidad por Categoría"
          type="bar"
          labels={categories}
          datasets={[
            {
              label: "Disponibles",
              backgroundColor: "#4BC0C0",
              data: availabilityData.map((d) => d.disponibles),
            },
            {
              label: "No disponibles",
              backgroundColor: "#FF6384",
              data: availabilityData.map((d) => d.noDisponibles),
            },
          ]}
          options={{
            scales: {
              x: { stacked: true },
              y: { stacked: true, beginAtZero: true },
            },
          }}
          unavailableProductsByCategory={unavailableProductsByCategory}
        />

        <ChartCard
          title="Ingresos por Categoría"
          type="bar"
          labels={categories}
          datasets={[
            {
              label: "Ingresos ($)",
              backgroundColor: "#6bc3fa",
              data: revenueData,
              borderWidth: 1,
            },
          ]}
          options={{
            scales: {
              x: { title: { display: true, text: "Categorías" } },
              y: {
                beginAtZero: true,
                title: { display: true, text: "Ingresos ($)" },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

const ChartCard = ({
  title,
  type,
  labels,
  datasets,
  options,
  unavailableProductsByCategory,
}) => {
  const extendedOptions = {
    ...options,
    plugins: {
      ...options?.plugins,
      tooltip: {
        ...options?.plugins?.tooltip,
        callbacks: {
          ...options?.plugins?.tooltip?.callbacks,
          label: function (context) {
            const datasetLabel = context.dataset.label || "";
            const category = context.label;

            if (
              datasetLabel === "No disponibles" &&
              unavailableProductsByCategory &&
              unavailableProductsByCategory[category]
            ) {
              const productsNoDisponibles =
                unavailableProductsByCategory[category];
              if (productsNoDisponibles.length === 0) {
                return datasetLabel + ": 0";
              }
              const productNames = productsNoDisponibles
                .map((p) => p.product_name)
                .join(", ");
              return `${datasetLabel} (${productsNoDisponibles.length}): ${productNames}`;
            }

            const value =
              typeof context.parsed === "number"
                ? context.parsed
                : context.parsed.y;

            return datasetLabel + ": " + value;
          },
        },
      },
    },
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-center mb-2">{title}</h2>
      <CChart
        type={type}
        data={{ labels, datasets }}
        options={extendedOptions}
      />
    </div>
  );
};

export default DBHome;
