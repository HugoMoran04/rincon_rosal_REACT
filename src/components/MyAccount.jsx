import { useState, useEffect, use } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  IconButton,
  Button,
  Divider,
  Card,
  CardContent,
  Modal,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
//import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/useUserStore";
import { apiUrl } from "../config";
import logo from "../assets/images/logoPerfecto.png";
import { MDBRow, MDBCol, MDBBtn } from "mdb-react-ui-kit";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LogoutIcon from "@mui/icons-material/Logout";
import { useFavorites } from "../context/FavoritesContext";
import ProductCard from "./ProductCard";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

export default function MiCuenta() {
  const [direccionAEliminar, setDireccionAEliminar] = useState(null);
   const [alert, setAlert] = useState({
      show: false,
      message: "",
      severity: "success", // success | error | warning | info
    });

  //MODAL DIRECCION
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = (direccion) => {
    setDireccionAEliminar(direccion);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setDireccionAEliminar(null);
    setOpenModal(false);
  };
  const navigate = useNavigate();
  //MODAL CERRAR SESION
  const [openModalLogout, setOpenModalLogout] = useState(false);
  const handleOpenLogoutModal = () => setOpenModalLogout(true);
  const handleCloseLogoutModal = () => setOpenModalLogout(false);

  //MODAL ELIMINAR USUARIO
  const [openModalDeleteUser, setOpenModalDeleteUser] = useState(false);
  const handleOpenDeleteUserModal = () => setOpenModalDeleteUser(true);
  const handleCloseDeleteUserModal = () => setOpenModalDeleteUser(false);

  //USUARIOS
  const { user, setUser, clearUser } = useUserStore();
  console.log("Usuario en MyAccount:", user);
  const [formData, setFormData] = useState({
    id_usuario: user.id_usuario,
    nombre: "",
    apellidos: "",
    telefono: "",
    email: "",
    edad: "",
    contrasena: "••••••••",
    ...user,
  });
  //
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        ...user,
      }));
    }
  }, [user]);

  const [editableFields, setEditableFields] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  //Correcto
  const handleEditClick = (field) => {
    if (field === "contrasena") {
      navigate("/cambiar-contrasena");
      return;
    }
    setEditableFields((prev) => ({ ...prev, [field]: true }));
  };

  //Correcto
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  //??
  const handleSave = async () => {
    try {
      setIsSaving(true);
      console.log("ID URL:", formData.id_usuario);
      console.log("ID body:", formData.id_usuario);
      console.log("User store:", user);

      const dataToSend = { ...formData };

      delete dataToSend.contrasena; // No enviar la contraseña si no se ha cambiado

      const response = await fetch(`${apiUrl}/usuarios/${user.id_usuario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser({ ...user, ...updatedUser.datos });
        setEditableFields({});
        // alert("Datos actualizados correctamente");
        //} else {
        //alert("Error al guardar los cambios");
      }
    } catch (error) {
      console.error(error);
      setAlert({
        show: true,
        message: "Error al guardar los cambios",
        severity: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  //BORRAR USUARIOS
  const handleDelete = async () => {
    try {
      const response = await fetch(`${apiUrl}/usuarios/${user.id_usuario}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setAlert({
          show: true,
          message: "Cuenta eliminada correctamente",
          severity: "success",
        });
        clearUser();
        navigate("/");
      } else {
        setAlert({
          show: true,
          message: "Error al eliminar la cuenta",
          severity: "error",
        });
      }
    } catch (error) {
      console.error(error);
      setAlert({
        show: true,
        message: "Error de conexión con el servidor",
        severity: "error",
      });
    }
  };

  const fields = [
    { label: "Nombre", field: "nombre" },
    { label: "Apellidos", field: "apellidos" },
    { label: "Teléfono", field: "telefono" },
    { label: "Email", field: "email" },
    { label: "Fecha de nacimiento", field: "edad" },
    { label: "Contraseña", field: "contrasena", type: "contrasena" },
  ];

  //DIRECCIONES

  const [addressData, setAddressData] = useState({
    id_direccion: "",
    direccion: "",
    ciudad: "",
    provincia: "",
    codigo_postal: "",
    pais: "",
    id_usuario: user.id_usuario,
  });
  const [section, setSection] = useState("cuenta");
  const fieldsAddress = [
    { label: "Direccion", field: "direccion" },
    { label: "Ciudad", field: "ciudad" },
    { label: "Provincia", field: "provincia" },
    { label: "Codigo Postal", field: "codigo_postal" },
    { label: "Pais", field: "pais" },
  ];

  const [direcciones, setDirecciones] = useState([]);

  //OBTERNER DIRECCIONES
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/direccionesEnvio/${user.id_usuario}`
        );
        if (response.ok) {
          const data = await response.json();
          setDirecciones(data.datos);
        }
      } catch (error) {
        console.error("Error al obtener la dirección:", error);
      }
    };
    if (user?.id_usuario) {
      fetchAddress();
    }
  }, [user]);

  //BORRAR DIRECCION
  const handleBorrar = async () => {
    if (!direccionAEliminar) return;
    try {
      const response = await fetch(
        `${apiUrl}/direccionesEnvio/${user.id_usuario}/${direccionAEliminar.id_direccion}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setDirecciones((prev) =>
          prev.filter(
            (dir) => dir.id_direccion !== direccionAEliminar.id_direccion
          )
        );
        handleCloseModal();
        setAlert({
          show: true,
          message: "Dirección borrada correctamente",
          severity: "success",
        });
        
      } else {
        setAlert({
          show: true,
          message: "Error al borrar la dirección",
          severity: "error",
        });
      }
    } catch (error) {
      console.error(error);
      setAlert({
        show: true,
        message: "Error de conexión con el servidor",
        severity: "error",
      });
    }
  };

  //EDITAR DIRECCION
  const handleEditar = (direccion) => {
    navigate("/formDireccionEnvio", { state: { direccion } });
  };

  // FAVORITOS
  //const { user } = useUserStore();
  const [favProductsData, setFavProductsData] = useState([]);
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    const loadFavProducts = async () => {
      if (!user?.id_usuario) return;

      try {
        // 1️⃣ Obtener los favoritos del usuario
        const responseFavs = await fetch(
          `${apiUrl}/favoritos/usuario/${user.id_usuario}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!responseFavs.ok) throw new Error("Error al obtener favoritos");

        const favData = await responseFavs.json();
        const productIds = favData.datos.map((f) => f.id_producto);

        if (productIds.length === 0) {
          setFavProductsData([]);
          return;
        }

        // 2️⃣ Obtener los productos completos por sus IDs
        const responseProducts = await fetch(
          `${apiUrl}/productos/favoritesProducts/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: productIds }),
          }
        );

        if (!responseProducts.ok) throw new Error("Error al obtener productos");

        const productsData = await responseProducts.json();
        setFavProductsData(productsData.datos || []);
      } catch (error) {
        console.error("Error al cargar productos favoritos:", error);
        setFavProductsData([]);
      }
    };

    loadFavProducts();
  }, [user]);

  //MIS PEDIDOS
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);
  useEffect(() => {
    console.log("🔵 PASO 1: useEffect se ejecutó");
    console.log("   - section es:", section);
    console.log("   - user es:", user);
    console.log("   - user.id_usuario es:", user?.id_usuario);
    console.log("useEffect ejecutado:", section, user);
    if (!user?.id_usuario) {
      console.log("No hay usuario, saliendo del useEffect");
      return;
    }

    if (section !== "misPedidos") {
      console.log("La sección no es 'misPedidos', saliendo del useEffect");
      return;
    }

    console.log("Fetch de pedidos va a ejecutarse"); // <- esto debe salir

   
    const fetchPedidos = async () => {
      console.log("🔵 PASO 2: fetchPedidos empieza");

      // 1. Creamos un AbortController para timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.error("⏰ TIMEOUT: Fetch tardó más de 5 segundos");
      }, 5000); // 5 segundos

      try {
        setLoadingPedidos(true);

        // 1. Construye la URL
        const url = `${apiUrl}/pedidos/${user.id_usuario}`;
        console.log("   URL:", url);
        console.log("   Haciendo fetch...");

        // 2. Hacemos el fetch (CORREGIDO)
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });
        clearTimeout(timeoutId); // Limpiamos el timeout si fetch fue exitoso

        // 3. Verificamos la respuesta
        console.log("🟢 Fetch terminó!");
        console.log("   Status:", response.status);
        console.log("   OK:", response.ok);

        // 4. Si hay error HTTP, lanzamos excepción
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 5. Convertimos a JSON
        const data = await response.json();
        console.log("📦 Datos recibidos. Success:", data.success);

        // 6. Procesamos la respuesta
        if (data.ok) {
          setPedidos(data.datos || []);
          console.log(
            "✅ Pedidos guardados en estado. Cantidad:",
            data.datos?.length || 0
          );
        } else {
          console.warn("⚠️ API respondió con success: false");
          setPedidos([]);
        }
      } catch (error) {
        clearTimeout(timeoutId); // Limpiamos el timeout en caso de error
        if (error.name === "AbortError") {
          console.error("🔴 ERROR: Fetch CANCELADO por timeout (5 segundos)");
          console.error(
            "   Esto significa que nunca recibió respuesta del servidor"
          );
        } else {
          console.error("🔴 ERROR:", error.message);
        }

        setPedidos([]);
      } finally {
        console.log("🔚 Finalizando fetch");
        setLoadingPedidos(false);
      }
    };

    fetchPedidos();
  }, [section, user]);

  useEffect(() => {
    document.body.style.backgroundColor = "#E2DDD7"; // tu color de fondo

    // Limpieza opcional al desmontar (por si cambias de vista)
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  //PANEL LATERAL
  const onChangeSection = (newSection) => {
    setSection(newSection);
  };

   useEffect(() => {
      if (alert.show) {
        const timer = setTimeout(() => {
          setAlert({ ...alert, show: false });
        }, 3000);
  
        return () => clearTimeout(timer);
      }
    }, [alert]);
  

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* PANEL IZQUIERDO */}
      <Box
        component="aside"
        sx={{
          flexDirection: "column",
          width: { xs: "100%", md: "200px" },
          justifyContent: "space-between",
          height: "auto",
          minHeight: { xs: "auto", md: "auto", lg: "100vh", xl: "100vh" },
          borderRight: "1px solid rgba(0,0,0,0.08)",
          p: 3,
          flexShrink: 0,
          bgcolor: { xs: "transparent", md: "#D9D4CE" },
          position: { xs: "relative", md: "sticky" },
          top: { md: 0 },
        }}
      >
        {/* botones del panel */}
        <Typography variant="h6" fontWeight={700} mb={1}>
          Mi cuenta
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Box display="flex" flexDirection="column" gap={1}>
          {/* BOTON CUENTA */}
          <Button
            startIcon={<AccountCircleIcon />}
            fullWidth
            onClick={() => onChangeSection("cuenta")}
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              backgroundColor: section === "cuenta" ? "#B59E8C" : "transparent",
              color: section === "cuenta" ? "#fff" : "#2B2B2D",
              "&:hover": {
                backgroundColor:
                  section === "cuenta" ? "#A08874" : "rgba(0,0,0,0.04)",
              },
              borderRadius: 2,
              py: 1.2,
            }}
          >
            Editar cuenta
          </Button>
          {/* BOTON DIRECCION */}
          <Button
            startIcon={<HomeIcon />}
            fullWidth
            onClick={() => onChangeSection("direcciones")}
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              backgroundColor:
                section === "direcciones" ? "#B59E8C" : "transparent",
              color: section === "direcciones" ? "#fff" : "#2B2B2D",
              "&:hover": {
                backgroundColor:
                  section === "direcciones" ? "#A08874" : "rgba(0,0,0,0.04)",
              },
              borderRadius: 2,
              py: 1.2,
            }}
          >
            Direcciones
          </Button>
          {/* BOTON FAVORITOS */}
          <Button
            startIcon={<FavoriteIcon />}
            fullWidth
            onClick={() => onChangeSection("favoritos")}
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              backgroundColor:
                section === "favoritos" ? "#B59E8C" : "transparent",
              color: section === "favoritos" ? "#fff" : "#2B2B2D",
              "&:hover": {
                backgroundColor:
                  section === "favoritos" ? "#A08874" : "rgba(0,0,0,0.04)",
              },
              borderRadius: 2,
              py: 1.2,
            }}
          >
            Favoritos
          </Button>
          {/*BOTON MIS PEDIDOS* */}
          <Button
            startIcon={<LocalOfferIcon />}
            fullWidth
            onClick={() => onChangeSection("misPedidos")}
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              backgroundColor:
                section === "misPedidos" ? "#B59E8C" : "transparent",
              color: section === "misPedidos" ? "#fff" : "#2B2B2D",
              "&:hover": {
                backgroundColor:
                  section === "misPedidos" ? "#A08874" : "rgba(0,0,0,0.04)",
              },
              borderRadius: 2,
              py: 1.2,
            }}
          >
            Mis Pedidos
          </Button>
        </Box>
        {/* 🔹 Botón de cerrar sesión */}
        <Box sx={{ flexGrow: 1 }}>
          <Divider sx={{ my: 2 }} />

          <Button
            startIcon={<LogoutIcon />}
            fullWidth
            onClick={handleOpenLogoutModal}
            className="btn-custom"
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              borderRadius: 2,
              py: 1.2,
            }}
          >
            Cerrar sesión
          </Button>
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1, p: 3, overflowY: "auto", height: "100%" }}>
        {/* CONTENIDO CUENTA */}
        {section === "cuenta" && (
          <MDBRow className="d-flex justify-content-center">
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-center">
              <img
                src={logo}
                alt="Logo"
                className="img-fluid"
                style={{
                  maxHeight: 170,
                  marginRight: "2rem",
                  marginBottom: "2rem",
                }}
              />
              <Typography
                variant="h5"
                textAlign="center"
                mb={4}
                fontWeight={600}
              >
                HOLA, {formData.nombre?.toUpperCase()}
              </Typography>
            </div>
            <Divider sx={{ my: 3 }} />
            <div className="d-flex justify-content-center w-100">
              <MDBCol md="6" style={{ marginLeft: "11rem" }}>
                <Grid container spacing={2}>
                  {fields.map(({ label, field, type }) => (
                    <Grid item xs={12} sm={6} md={6} key={field}>
                      <Box display="flex" alignItems="center">
                        <TextField
                          label={label}
                          fullWidth
                          size="small"
                          type={type === "password" ? "password" : "text"}
                          value={
                            type === "password"
                              ? "••••••••"
                              : formData[field] || ""
                          }
                          disabled={
                            !editableFields[field] || type === "password"
                          }
                          onChange={(e) => handleChange(field, e.target.value)}
                          sx={{
                            "& .MuiInputBase-input.Mui-disabled": {
                              WebkitTextFillColor: "#000000",
                            },
                          }}
                        />
                        <IconButton onClick={() => handleEditClick(field)}>
                          <EditIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Divider sx={{ my: 3 }} />
                <div
                  className="d-flex justify-content-center pt-3v"
                  style={{ marginLeft: "-10rem" }}
                >
                  <MDBBtn
                    className="btn-reset"
                    onClick={handleSave}
                    disabled={isSaving}
                    type="button"
                    style={{ backgroundColor: "#B59E8C" }}
                  >
                    {isSaving ? "Guardando..." : "Guardar cambios"}
                  </MDBBtn>
                  <MDBBtn
                    className="ms-2 btn-custom"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleOpenDeleteUserModal}
                  >
                    Eliminar cuenta
                  </MDBBtn>
                </div>
              </MDBCol>
            </div>
          </MDBRow>
        )}

        {/* CONTENIDO DIRECCIONES */}

        {section === "direcciones" && (
          <Box
            sx={{
              flexGrow: 1,
              p: { xs: 2, sm: 3, md: 4 },
              display: "flex",
              justifyContent: {
                xs: "center",
                md: "flex-start",
                lg: "flex-start",
              },
              alignItems: "flex-start",
              mt: { xs: -20, sm: -20, md: 0 }, // corrige la bajada excesiva
              ml: { xs: 0, sm: 0, md: -0, lg: -20, xl: -50, xxl: -50 },
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: { xs: "100%", md: "80%", lg: "65%", xl: "50%" },
                // desplazamiento suave que depende del ancho de la pantalla
                /*ml: {
                xs: 0,
                sm: "-10px",
                md: "clamp(-60px, -10vw, -200px)", // se mueve de forma fluida
                lg: "clamp(-100px, -20vw, -350px)", // se adapta sin saltar
                xl: "clamp(-150px, -25vw, -450px)",
              },*/
                mx: "auto",
                transition: "margin-left 0.4s ease-in-out",
              }}
            >
              <Typography variant="h5" fontWeight={700} mb={3}>
                Tus Direcciones
              </Typography>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/formDireccionEnvio")}
                className="btn-custom"
                sx={{
                  mb: 3,
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                Agregar nueva dirección
              </Button>

              {/* Aquí se listan las direcciones */}
              {direcciones.length > 0 ? (
                direcciones.map((dir) => (
                  <Card
                    key={dir.id_direccion}
                    variant="outlined"
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
                      backgroundColor: "#F5F0F0",
                    }}
                  >
                    <CardContent>
                      <Typography fontWeight="bold">{dir.nombre}</Typography>
                      <Typography sx={{ mb: 1 }}>
                        {dir.direccion}, {dir.ciudad}, {dir.provincia},{" "}
                        {dir.codigo_postal}
                      </Typography>

                      <Box>
                        <Button
                          size="small"
                          onClick={() => handleOpenModal(dir)}
                          sx={{
                            textTransform: "none",
                            color: "red",
                            fontWeight: 500,
                          }}
                        >
                          Borrar
                        </Button>
                        <Typography component="span" sx={{ mx: 1 }}>
                          |
                        </Typography>
                        <Button
                          size="small"
                          onClick={() => handleEditar(dir)}
                          sx={{
                            textTransform: "none",
                            color: "#000",
                            fontWeight: 500,
                          }}
                        >
                          Editar
                        </Button>
                        <Typography component="span" sx={{ mx: 1 }}>
                          |
                        </Typography>
                        <Button
                          size="small"
                          onClick={() => handlePredeterminada(dir.id)}
                          sx={{
                            textTransform: "none",
                            color: "#000",
                            fontWeight: 500,
                          }}
                        >
                          Establecer por defecto
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography color="text.secondary">
                  No tienes direcciones guardadas todavía.
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* CONTENIDO FAVORITOS */}
        {section === "favoritos" && (
          <Box sx={{ mt: 2, mx: 0, width: "100%", maxWidth: "1200px" }}>
            {favorites.size > 0 ? (
              favProductsData.length > 0 ? (
                <Grid container spacing={2} justifyContent={"flex-start"}>
                  {favProductsData.map((product) => (
                    <Grid
                      item
                      key={product.id_producto}
                      xs={6} // 2 cards por fila en xs
                      sm={4} // 3 cards por fila en sm
                      md={3} // 4 cards por fila en md
                      lg={2} // 6 cards por fila en lg
                    >
                      <ProductCard
                        id_producto={product.id_producto}
                        image={product.imagen} // según tu API
                        title={product.nombre}
                        price={product.precio}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography>Cargando productos favoritos...</Typography>
              )
            ) : (
              <Typography>No tienes productos favoritos.</Typography>
            )}
          </Box>
        )}
        {/* CONTENIDO MIS PEDIDOS */}
        {section === "misPedidos" && (
          <Box sx={{ mt: 2, mx: 0, width: "100%", maxWidth: "1200px" }}>
            <Typography variant="h5" fontWeight={700} mb={3}>
              Mis pedidos
            </Typography>

            {loadingPedidos ? (
              <Typography>Cargando pedidos...</Typography>
            ) : pedidos.length === 0 ? (
              <Typography>No has realizado pedidos todavía.</Typography>
            ) : (
              pedidos.map((pedido) => (
                <Card
                  key={pedido.id_pedido}
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography fontWeight={600}>
                        Pedido #{pedido.id_pedido}
                      </Typography>
                      <Typography color="text.secondary">
                        {new Date(pedido.fecha_pedido).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Typography>
                      Estado: <strong>{pedido.estado}</strong>
                    </Typography>
                    <Typography mb={2}>
                      Total: <strong>{pedido.total} €</strong>
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {/* ✅ DETALLES CORRECTOS */}
                    {pedido.detalle_pedidos.map((detalle) => (
                      <Box
                        key={detalle.id_detalle}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <Typography>
                          {detalle.id_producto_producto?.nombre} ×{" "}
                          {detalle.unidades}
                        </Typography>
                        <Typography>{detalle.total} €</Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        )}
        {alert.show && (
            <Stack sx={{ width: "100%" }} spacing={2} className="mt-4">
              <Alert
                severity={alert.severity}
                onClose={() => setAlert({ ...alert, show: false })}
              >
                {alert.message}
              </Alert>
            </Stack>
          )}
      </Box>{" "}
      {/* puede que falte cerrar este Box */}
      {/* 🔹 MODAL DE DIRECCION */}
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
            width: 300,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography id="modal-title" variant="h6" mb={2}>
            ¿Quieres eliminar esta dirección?
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "space-around" }}>
            <Button
              variant="contained"
              color="error"
              className="btn-custom"
              onClick={handleBorrar}
            >
              Eliminar
            </Button>
            <Button
              variant="contained"
              onClick={handleCloseModal}
              className="btn-reset"
              style={{ backgroundColor: "#B59E8C" }}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* 🔹 MODAL CERRAR SESION */}
      <Modal
        open={openModalLogout}
        onClose={handleCloseLogoutModal}
        aria-labelledby="modal-logout-title"
        aria-describedby="modal-logout-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography id="modal-logout-title" variant="h6" mb={2}>
            ¿Quieres cerrar sesión?
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              mt: 2,
              gap: 1,
            }}
          >
            <Button
              variant="contained"
              className="btn-custom"
              onClick={() => {
                
                clearUser();
                navigate("/", { replace: true });
                
              }}
            >
              Confirmar
            </Button>
            <Button
              variant="contained"
              onClick={handleCloseLogoutModal}
              className="btn-reset"
              style={{ backgroundColor: "#B59E8C" }}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* 🔹 MODAL ELIMINAR USUARIO */}
      <Modal
        open={openModalDeleteUser}
        onClose={handleCloseDeleteUserModal}
        aria-labelledby="modal-delete-title"
        aria-describedby="modal-delete-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography id="modal-delete-title" variant="h6" mb={2}>
            ¿Quieres eliminar tu cuenta?
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              mt: 2,
              gap: 1,
            }}
          >
            <Button
              variant="contained"
              className="btn-custom"
              onClick={handleDelete} // tu función ya existente
            >
              Eliminar
            </Button>
            <Button
              variant="contained"
              onClick={handleCloseDeleteUserModal}
              sx={{ backgroundColor: "#B59E8C" }}
              className="btn-reset"
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
      
    </Box>
  );
}
