import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteAProduct, getAllProducts, updateProduct } from "../api";
import { DataTable } from "../components";
import { alertNULL, alertSuccess, alertDanger } from "../context/actions/alertActions";
import { setAllProducts } from "../context/actions/productActions";
import DBNewItem from "./DBNewItem";

const DBItems = () => {
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const allProducts = await getAllProducts();
      dispatch(setAllProducts(allProducts));
    };
    
    fetchProducts();
  }, [dispatch]);

  const handleEdit = (rowData) => {
    setEditProduct(rowData);
  };

  const handleUpdate = async (updatedData) => {
    try {
      await updateProduct(updatedData);
      dispatch(alertSuccess("Producto actualizado con éxito"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      const allProducts = await getAllProducts();
      dispatch(setAllProducts(allProducts));
      setEditProduct(null);
    } catch (error) {
      dispatch(alertDanger(`Error al actualizar el producto: ${error.message}`));
    }
  };

  const handleDelete = async (rowData) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto ${rowData.product_name}?`)) {
      try {
        await deleteAProduct(rowData.productId);
        dispatch(alertSuccess(`Producto ${rowData.product_name} eliminado.`));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
        const allProducts = await getAllProducts();
        dispatch(setAllProducts(allProducts));
      } catch (error) {
        dispatch(alertDanger(`Error al eliminar el producto: ${error.message}`));
      }
    }
  };

  return (
    <div className="w-full pt-6">
      {editProduct ? (
        <DBNewItem 
          initialProduct={editProduct} 
          onClose={() => setEditProduct(null)} 
          onUpdate={handleUpdate} 
        />
      ) : (
        <DataTable
          columns={[
            {
              title: "Imagen",
              field: "imageURL",
              render: (rowData) => (
                <img
                  src={rowData.imageURL}
                  className="w-32 h-16 object-contain rounded-md"
                  alt={rowData.product_name}
                />
              ),
            },
            {
              title: "Nombre",
              field: "product_name",
            },
            {
              title: "Categoría",
              field: "product_category",
            },
            {
              title: "Precio",
              field: "product_price",
              render: (rowData) => (
                <p className="text-xl font-semibold text-textColor flex items-center justify-center">
                  $ {parseFloat(rowData.product_price)}
                </p>
              ),
            },
          ]}
          data={products}
          title="Lista de Productos"
          actions={[
            {
              icon: "edit",
              tooltip: "Editar",
              onClick: (event, rowData) => handleEdit(rowData),
            },
            {
              icon: "delete",
              tooltip: "Borrar",
              onClick: (event, rowData) => handleDelete(rowData),
            },
          ]}
        />
      )}
    </div>
  );  
};

export default DBItems;
