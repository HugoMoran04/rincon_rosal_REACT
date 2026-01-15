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
import { Category } from "@mui/icons-material";

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
    id: "unidades",
    numeric: false,
    disablePadding: false,
    label: "Unidades",
  },
  {
    id:"precio",
    numeric: true,
    disablePadding: false,
    label: "Precio",
  },
  {
    id:"estado",
    numeric: false,
    disablePadding: false,
    label: "Estado",
  },
  {
    id:"fecha_pedido",
    numeric: false,
    disablePadding: false,
    label: "Fecha Pedido",
  },
  {
    id: "anotaciones",
    numeric: false,
    disablePadding: false,
    label: "Anotaciones",
  },
];

function descendingComparator(a, b, orderBy) {
  // Para ID
  if (orderBy === 'ID') {
    return b.id_pedido - a.id_pedido;
  }
  
  // Para precio (quita el € y convierte a número)
  if (orderBy === 'precio') {
    const precioA = parseFloat((a.precio || '').replace('€', '')) || a.total_numerico || 0;
    const precioB = parseFloat((b.precio || '').replace('€', '')) || b.total_numerico || 0;
    return precioB - precioA;
  }
  
  // Para unidades (asegura que sea número)
  if (orderBy === 'unidades') {
    const unidadesA = parseInt(a.unidades) || 0;
    const unidadesB = parseInt(b.unidades) || 0;
    return unidadesB - unidadesA;
  }
  
  // Para fecha
  if (orderBy === 'fecha_pedido') {
    const fechaA = new Date(a.fecha_original || a.fecha_pedido);
    const fechaB = new Date(b.fecha_original || b.fecha_pedido);
    return fechaB.getTime() - fechaA.getTime();
  }
  
  // Para texto normal
  const valA = (a[orderBy] || '').toString().toLowerCase();
  const valB = (b[orderBy] || '').toString().toLowerCase();
  
  if (valB < valA) return -1;
  if (valB > valA) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function EnhancedTableHead(props) {
  const navigate = useNavigate();
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
                color: "#892C47",
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
            align="left"
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
};

function EnhancedTableToolbar(props) {
  const { numSelected, selected, handleOpenModal, navigate } = props;
  
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
          sx={{ flex: "1 1 100%", fontWeight: "bold" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          PEDIDOS
        </Typography>
      )}
      {numSelected > 0 ? (
        <>
          <Tooltip title="Eliminar">
            <IconButton onClick={() => handleOpenModal(selected)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          {numSelected === 1 && (
            <Tooltip title="Editar">
              <IconButton>
                <BorderColorIcon />
              </IconButton>
            </Tooltip>
          )}
        </>
      ) : (
        <Tooltip title="Filtrar lista">
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

function PedidosList() {
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("fecha_pedido");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pedidos, setPedidos] = useState([]); 
  const [openModal, setOpenModal] = useState(false);
  const [pedidoToDelete, setPedidoToDelete] = useState([]);
  const navigate = useNavigate();

  // Cargar pedidos
  useEffect(() => {
    let isMounted = true;
    
    async function fetchOrders() {
      try {
        console.log("🔄 Cargando pedidos...");
        
        const response = await fetch(apiUrl + "/pedidos", {
          method: "GET",
          credentials: "include",
        });
        
        if (!response.ok) {
          console.error("❌ Error HTTP:", response.status);
          return;
        }
        
        const data = await response.json();
        console.log("📦 Datos recibidos:", data);
        
        if (isMounted && data.ok === true && Array.isArray(data.datos)) {
          setPedidos(data.datos);
          console.log("✅ Pedidos cargados:", data.datos.length);
        }
        
      } catch (error) {
        console.error("🔴 Error:", error);
        if (isMounted) setPedidos([]);
      }
    }

    fetchOrders();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Cambiar color de fondo
  useEffect(() => {
    document.body.style.backgroundColor = "#E2DDD7";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  // Eliminar pedidos
  const handleDeleteConfirm = async () => {
    if (!pedidoToDelete.length) return;

    try {
      for (const id_pedido of pedidoToDelete) {
        let response = await fetch(apiUrl + "/pedidos/" + id_pedido, {
          method: "DELETE",
        });
        if (!response.ok) {
          alert("Error al eliminar el pedido con ID: " + id_pedido);
        }
      }

      setPedidos(prev => prev.filter(pedido => !pedidoToDelete.includes(pedido.id_pedido)));
      setSelected([]);
      handleCloseModal();
    } catch (error) {
      alert("Error de conexión con el servidor: " + error.message);
    }
  };

  // Funciones de ordenamiento
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = pedidos.map((n) => n.id_pedido);
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

  // Funciones de paginación
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

  // Filas visibles
  const visibleRows = useMemo(
    () => {
      console.log("🔢 Calculando visibleRows...");
      console.log("   - Total pedidos:", pedidos.length);
      
      const sorted = [...pedidos].sort(getComparator(order, orderBy));
      const sliced = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
      
      console.log("   - Filas visibles:", sliced.length);
      return sliced;
    },
    [pedidos, order, orderBy, page, rowsPerPage]
  );

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - pedidos.length) : 0;

  // Funciones modal
  const handleOpenModal = (ids) => {
    setPedidoToDelete(Array.isArray(ids) ? ids : [ids]);
    setOpenModal(true);
  };
  
  const handleCloseModal = () => {
    setOpenModal(false);
    setPedidoToDelete([]);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2, mt: 6, backgroundColor: "#F6EEEF" }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selected={selected}
          handleDelete={handleDeleteConfirm}
          handleOpenModal={handleOpenModal}
          navigate={navigate}
        />
        <TableContainer>
          <Table
            sx={{
              minWidth: 750,
              borderCollapse: "collapse",
              "& td, & th": {
                borderBottom: "1px solid #C79499",
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
              rowCount={pedidos.length}
            />
            <TableBody>
              {console.log("📋 TableBody - Filas visibles:", visibleRows.length)}
              
              {visibleRows.length > 0 ? (
                visibleRows.map((row, index) => {
                  console.log(`   📋 Fila ${index}:`, row.id_pedido, row.nombre);
                  
                  const isItemSelected = selected.includes(row.id_pedido);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id_pedido)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id_pedido}
                      selected={isItemSelected}
                      sx={{
                        cursor: "pointer",
                        "&.Mui-selected": {
                          backgroundColor: "#E6D0D2",
                        },
                        "&.Mui-selected:hover": {
                          backgroundColor: "#E6D0D2",
                        },
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          sx={{
                            color: "#892C47",
                            "&.Mui-checked": {
                              color: "#892C47",
                            },
                          }}
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.id_pedido}
                      </TableCell>
                      <TableCell>{row.nombre || 'Sin nombre'}</TableCell>
                      <TableCell>{row.unidades || 0}</TableCell>
                      <TableCell>{row.precio || '0€'}</TableCell>
                      <TableCell>{row.estado || 'Desconocido'}</TableCell>
                      <TableCell>{row.fecha_pedido || 'Sin fecha'}</TableCell>
                      <TableCell>{row.anotaciones || '-'}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    {pedidos.length === 0 ? "No hay pedidos para mostrar" : "Cargando..."}
                  </TableCell>
                </TableRow>
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={pedidos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={
          <Switch 
            checked={dense} 
            onChange={handleChangeDense} 
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#892C47",
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#892C47",
              },
              "& .MuiSwitch-switchBase": {
                color: "#AA5D65",
              },
              "& .MuiSwitch-track": {
                backgroundColor: "#AA5D65",
              },
            }}
          />
        }
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
            {pedidoToDelete.length > 1
              ? `¿Deseas eliminar estos pedidos?`
              : `¿Deseas eliminar este pedido?`}
          </Typography>
          {pedidoToDelete.length > 1 && (
            <Typography id="modal-description" variant="body1" mb={1} textAlign="center">
              Se eliminarán {pedidoToDelete.length} pedidos.
            </Typography>
          )}
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "space-around" }}>
            <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
              Eliminar
            </Button>
            <Button variant="contained" onClick={handleCloseModal} style={{backgroundColor: "#B59E8C"}}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default PedidosList;