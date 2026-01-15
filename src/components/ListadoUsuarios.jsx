import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { apiUrl } from "../config";

import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import ConfirmModal from "./ModalConfirmacion";
import { Modal, Button, Divider } from "@mui/material";

const headCells = [
  {
    id: "ID",
    numeric: true,
    disablePadding: true,
    label: "ID",
  },
  {
    id: "nombre",
    numeric: false,
    disablePadding: false,
    label: "Nombre",
  },
  {
    id: "apellido",
    numeric: false,
    disablePadding: false,
    label: "Apellido",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "edad",
    numeric: false,
    disablePadding: false,
    label: "Edad",
  },
  {
    id: "telefono",
    numeric: true,
    disablePadding: false,
    label: "Teléfono",
  },
  {
    id: "rol",
    numeric: false,
    disablePadding: false,
    label: "Rol",
  },
  {
    id: "nif",
    numeric: false,
    disablePadding: false,
    label: "NIF/CIF",
  },
  {
    id: "fechaRegistro",
    numeric: false,
    disablePadding: false,
    label: "Alta",
  },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            sx={{
              color: "#892C47",
              "&.Mui-checked": {
                color: "#892C47", // color cuando está marcado
              },
            }}
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left" //headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{fontWeight:"bold"}}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  // onOpenDeleteModal: PropTypes.func.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, selected, handleOpenModal } = props;
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: "#E6D0D2",
        }
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%", fontWeight: "bold" }}
          color="inherit"
          variant="subtitle1"
          component="div"
          
        >
          {numSelected} seleccionados
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%",  fontWeight: "bold" }}
          variant="h6"
          id="tableTitle"
          component="div"
          
        >
          USUARIOS
        </Typography>
      )}
      {numSelected > 0 ? (
        <>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => {
                handleOpenModal(selected);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>

          {numSelected === 1 && (
            <Tooltip title="Editar">
              <IconButton //</Tooltip>onClick={() => setEditingId(selected[0])}
              >
                <BorderColorIcon />
              </IconButton>
            </Tooltip>
          )}
        </>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selected: PropTypes.array.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleOpenModal: PropTypes.func.isRequired,
};

function ListadoUsuarios() {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getUsuarios() {
      let response = await fetch(apiUrl + "/usuarios", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        let data = await response.json();
        setRows(data.datos);
      }
    }

    getUsuarios();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!usuarioAEliminar.length) return;

    try {
      for (const id_usuario of usuarioAEliminar) {
        let response = await fetch(apiUrl + "/usuarios/" + id_usuario, {
          method: "DELETE",
        });
        if (!response.ok) {
          alert("Error al eliminar el usuario con ID: " + id_usuario);
        }
    }

    setRows(prev => prev.filter(usuario => !usuarioAEliminar.includes(usuario.id_usuario)));
    setSelected([]);
    handleCloseModal();
    } catch (error) {
      alert(error, "Error de conexión con el servidor");
    }

      

 /* const handleDelete = async (id) => {
    const idsEliminar = Array.isArray(id) ? id : [id];

    for (const id_usuario of idsEliminar) {
      let response = await fetch(apiUrl + "/usuarios/" + id_usuario, {
        method: "DELETE",
      });

      if (response.ok) {
        setRows(
          (prevRows) =>
            prevRows.filter((usuario) => usuario.id_usuario !== id_usuario)
          
        );
      
      }
    }
    setSelected([]);*/
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id_usuario);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [rows, order, orderBy, page, rowsPerPage]
  );
  useEffect(() => {
    // Cambia el color de fondo al montar
    document.body.style.backgroundColor = "#E2DDD7";

    // Limpieza cuando se sale de la vista
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  //FUNCIONES MODAL
  const handleOpenModal = (ids) => {
    setUsuarioAEliminar(Array.isArray(ids) ? ids : [ids]);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setUsuarioAEliminar([]);
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2, mt: 6, backgroundColor: "#F6EEEF" }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selected={selected}
          handleDelete={handleDeleteConfirm}
          handleOpenModal={handleOpenModal}
          //onOpenDeleteModal={(ids) =>{
          //setIdsToDelete(ids);
          //setModalOpen(true);
          //}}
        />
        <TableContainer>
          <Table
            sx={{
              minWidth: 750,
              borderCollapse: "collapse",
              "& td, & th": {
                borderBottom: "1px solid #C79499", // <== tu color personalizado
              },
            }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = selected.includes(row.id_usuario);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id_usuario)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id_usuario}
                    selected={isItemSelected}
                    sx={{
                      cursor: "pointer",
                      "&.Mui-selected": {
                        backgroundColor: "#E6D0D2", // color de fondo cuando está seleccionada
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "#E6D0D2", // color cuando está seleccionada + hover
                      },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        sx={{
                          color: "#892C47",
                          "&.Mui-checked": {
                            color: "#892C47", // color cuando está marcado
                          },
                        }}
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.id_usuario}
                    </TableCell>

                    <TableCell>{row.nombre}</TableCell>
                    <TableCell>{row.apellidos}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.edad}</TableCell>
                    <TableCell>{row.telefono}</TableCell>
                    <TableCell>{row.rol}</TableCell>
                    <TableCell>{row.nif_cif}</TableCell>
                    <TableCell>{row.fecha_registro}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} sx={{
        "& .MuiSwitch-switchBase.Mui-checked": {
          color: "#892C47", // color del "botón" cuando está activo
        },
        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
          backgroundColor: "#892C47", // color del fondo cuando está activo
        },
        "& .MuiSwitch-switchBase": {
          color: "#AA5D65", // color del "botón" cuando está apagado
        },
        "& .MuiSwitch-track": {
          backgroundColor: "#AA5D65", // color del fondo cuando está apagado
        },
      }}/>}
        label="Dense padding"
      />
  <Modal
  open={openModal}
  onClose={handleCloseModal}
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 380,
      bgcolor: "background.paper",
      borderRadius: 2,
      boxShadow: 24,
      p: 4,
      display: "flex",
      flexDirection: "column",
      gap: 2,
    }}
  >
    <Typography id="modal-title" variant="h6" mb={2}>
      {usuarioAEliminar.length > 1
        ? `¿Deseas eliminar estos usuarios?`
        : `¿Deseas eliminar este usuario?`}
    </Typography>
    {usuarioAEliminar.length > 1 && (
  <Typography id="modal-description" variant="h5" mb={1} textAlign="center">
    Se eliminarán {usuarioAEliminar.length} usuarios.
  </Typography>
)}
    <Divider sx={{ my: 1 }} />
    <Box sx={{ display: "flex", justifyContent: "space-around" }}>
    <Button variant="contained" color="error" onClick={handleDeleteConfirm} className="btn-custom">
        Eliminar
      </Button>
      <Button variant="contained" onClick={handleCloseModal} className="btn-reset" style={{backgroundColor: "#B59E8C"}}>
        Cancelar
      </Button>
      
    </Box>
  </Box>
</Modal>

    </Box>
  );
}

export default ListadoUsuarios;
