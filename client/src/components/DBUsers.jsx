import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../api";
import { Avatar } from "../assets";
import { setAllUserDetails } from "../context/actions/allUsersAction";
import DataTable from "./DataTable";

const DBUsers = () => {
  const allUsers = useSelector((state) => state.allUsers);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!allUsers || allUsers.length === 0) {
      getAllUsers().then((data) => {
        dispatch(setAllUserDetails(data));
      });
    }
  }, [allUsers, dispatch]);

  const usersData = allUsers || [];

  return (
    <div className="flex items-center justify-self-center gap-4 pt-6 w-full">
      <DataTable
        columns={[
          {
            title: "Imagen",
            field: "photoURL",
            render: (rowData) => (
              <img
                src={rowData.photoURL ? rowData.photoURL : Avatar}
                className="w-32 h-16 object-contain rounded-md"
                alt={
                  rowData.displayName
                    ? `${rowData.displayName}'s avatar`
                    : "Usuario sin imagen"
                }
              />
            ),
          },
          {
            title: "Nombre",
            field: "displayName",
          },
          {
            title: "Correo",
            field: "email",
          },
          {
            title: "Verificado",
            field: "emailVerified",
            render: (rowData) => (
              <p
                className={`px-2 py-1 w-32 text-center text-primary rounded-md ${
                  rowData.emailVerified ? "bg-emerald-500" : "bg-red-500"
                }`}
              >
                {rowData.emailVerified ? "Verificado" : "No Verificado"}
              </p>
            ),
          },
        ]}
        data={usersData}
        title="Lista de Usuarios"
      />
    </div>
  );
};

export default DBUsers;
