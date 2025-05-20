import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../api";
import { setAllProducts } from "../context/actions/productActions";
import { CChart } from "@coreui/react-chartjs";

const DBHome = () => {
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();

  // Filtros para cada categoría correcta
  const bebidas = products?.filter((item) => item.product_category === "Bebidas");
  const verduras = products?.filter((item) => item.product_category === "Verduras");
  const frutas = products?.filter((item) => item.product_category === "Frutas");
  const granos = products?.filter((item) => item.product_category === "Granos");
  const carnicos = products?.filter((item) => item.product_category === "Cárnicos");
  const aseo = products?.filter((item) => item.product_category === "Aseo");
  const abarrotes = products?.filter((item) => item.product_category === "Abarrotes");
  const lacteos = products?.filter((item) => item.product_category === "Lácteos");
  const mascotas = products?.filter((item) => item.product_category === "Mascotas");

  const categories = ["Bebidas", "Verduras", "Frutas", "Granos", "Cárnicos", "Aseo", "Abarrotes", "Lácteos", "Mascotas"];
  const revenueData = [12000, 8500, 9400, 7800, 10200, 6400, 9200, 8300, 7500];
  const profitMarginData = [15, 10, 12, 8, 20, 5, 9, 13, 6];

  useEffect(() => {
    if (!products) {
      getAllProducts().then((data) => {
        dispatch(setAllProducts(data));
      });
    }
  }, [products, dispatch]);

  return (
    <div className="flex items-center justify-center flex-col pt-6 w-full h-full">
      {/* Sección de gráficos */}
      <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
        
        {/* Gráfico de Barras - Cantidad de Productos por Categoría */}
        <div className="w-full">
          <CChart
            type="bar"
            data={{
              labels: [
                "Bebidas",
                "Verduras",
                "Frutas",
                "Granos",
                "Cárnicos",
                "Aseo",
                "Abarrotes",
                "Lácteos",
                "Mascotas",
              ],
              datasets: [
                {
                  label: "Conteo por Categoría",
                  backgroundColor: "#6bc3fa",
                  data: [
                    bebidas?.length,
                    verduras?.length,
                    frutas?.length,
                    granos?.length,
                    carnicos?.length,
                    aseo?.length,
                    abarrotes?.length,
                    lacteos?.length,
                    mascotas?.length,
                  ],
                },
              ],
            }}
            labels="months"
          />
        </div>

        {/* Gráfico de Líneas - Comparación de Rentabilidad */}
<div className="w-full">
  <CChart
    type="line"
    data={{
      labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"], // Meses
      datasets: [
        {
          label: "Rentabilidad de Verduras (%)",
          borderColor: "#4BC0C0",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          data: [15, 20, 25, 18, 22, 26], // Datos ficticios para Bebidas
          fill: false,
        },
        {
          label: "Rentabilidad de Frutas (%)",
          borderColor: "#9966FF",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          data: [10, 12, 15, 14, 17, 19], // Datos ficticios para Postres
          fill: false,
        },
      ],
    }}
    options={{
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Rentabilidad (%)" },
        },
      },
      plugins: {
        legend: {
          position: "top",
        },
      },
    }}
  />
</div>


        {/* Gráfico de Barras Apiladas - Disponibilidad por Categoría */}
        <div className="w-full">
          <CChart
            type="bar"
            data={{
              labels: [
                "Bebidas",
                "Verduras",
                "Frutas",
                "Granos",
                "Cárnicos",
                "Aseo",
                "Abarrotes",
                "Lácteos",
                "Mascotas",
              ],
              datasets: [
                {
                  label: "Disponibles",
                  backgroundColor: "#4BC0C0",
                  data: [30, 50, 70, 40, 60, 35, 80, 55, 45],
                },
                {
                  label: "No disponibles",
                  backgroundColor: "#FF6384",
                  data: [5, 10, 15, 7, 9, 5, 12, 6, 3],
                },
              ],
            }}
            options={{
              scales: {
                x: { stacked: true },
                y: { stacked: true },
              },
            }}
          />
        </div>

        {/* Gráfico de Torta - Distribución de Categorías */}
        <div className="w-full lg:w-3/4 xl:w-2/3">
          <CChart
            type="pie"
            data={{
              labels: [
                "Bebidas",
                "Verduras",
                "Frutas",
                "Granos",
                "Cárnicos",
                "Aseo",
                "Abarrotes",
                "Lácteos",
                "Mascotas",
              ],
              datasets: [
                {
                  backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#FF9F40",
                    "#FF6384",
                    "#36A2EB",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40",
                  ],
                  data: [
                    bebidas?.length,
                    verduras?.length,
                    frutas?.length,
                    granos?.length,
                    carnicos?.length,
                    aseo?.length,
                    abarrotes?.length,
                    lacteos?.length,
                    mascotas?.length,
                  ],
                },
              ],
            }}
          />
        </div>

{/* Gráfico de Barras - Ingresos por Categoría */}
<div className="w-full">
  <CChart
    type="bar" // Asegúrate de que aquí el tipo sea "bar"
    data={{
      labels: categories,
      datasets: [
        {
          label: "Ingresos ($)",
          backgroundColor: "#6bc3fa",
          data: revenueData,
          borderWidth: 1, // Puedes ajustar esto según prefieras
          barPercentage: 0.8,
          categoryPercentage: 0.6,
        },
      ],
    }}
    options={{
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Categorías',
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Ingresos ($)',
          },
        },
      },
    }}
  />
</div>


        {/* Gráfico de Líneas - Margen de Ganancia */}
        <div className="w-full">
          <CChart
            type="line"
            data={{
              labels: categories,
              datasets: [
                {
                  label: "Margen de Ganancia (%)",
                  borderColor: "#FF6384",
                  backgroundColor: "rgba(255,99,132,0.2)",
                  data: profitMarginData,
                  fill: false,
                },
              ],
            }}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: "Margen de Ganancia (%)" },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DBHome;