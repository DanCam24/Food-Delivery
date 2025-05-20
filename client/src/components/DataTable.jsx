import React from "react";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from "@mui/material";

const DataTable = ({ columns, data, title, actions }) => {
  const defaultMaterialTheme = createTheme();

  const localization = {
    header: {
      actions: "Acciones",
    },
    body: {
      emptyDataSourceMessage: "No hay registros para mostrar",
      filterRow: {
        filterTooltip: "Filtrar",
      },
    },
    pagination: {
      labelDisplayedRows: "{from}-{to} de {count}",
      labelRowsSelect: "filas",
      labelRowsPerPage: "Filas por página:",
      firstAriaLabel: "Primera página",
      firstTooltip: "Primera página",
      lastAriaLabel: "Última página",
      lastTooltip: "Última página",
      nextAriaLabel: "Siguiente página",
      nextTooltip: "Siguiente página",
      previousAriaLabel: "Página anterior",
      previousTooltip: "Página anterior",
    },
    toolbar: {
      searchTooltip: "Buscar",
      searchPlaceholder: "Buscar",
    },
  };

  return (
    <ThemeProvider theme={defaultMaterialTheme}>
      <MaterialTable
        columns={columns}
        data={data}
        title={title}
        actions={actions}
        localization={localization}
      />
    </ThemeProvider>
  );
};

export default DataTable;
