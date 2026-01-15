import React, { useEffect, useState } from "react";
import { Box, Button, IconButton,Modal,Divider,Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { apiUrl } from "../config";
import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/useUserStore";
import useCartStore from "../stores/useCartStore";


const Carrito = () => {
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const { user } = useUserStore();

  const [direcciones, setDirecciones] = useState([]);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(null);
  const [mostrarDirecciones, setMostrarDirecciones] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // Incrementar / Decrementar cantidad
  const incrementQuantity = (product) => addToCart(product, 1);
  const decrementQuantity = (product) => addToCart(product, -1);

  // Total unidades y precio
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Obtener direcciones del usuario
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch(`${apiUrl}/direccionesEnvio/${user.id_usuario}`);
        if (response.ok) {
          const data = await response.json();
          setDirecciones(data.datos);
        }
      } catch (error) {
        console.error("Error al obtener la dirección:", error);
      }
    };
    if (user?.id_usuario) fetchAddress();
  }, [user]);

  // Pagar pedido (crear pedido en backend)
  const pagarPedido = async () => {
    if (!direccionSeleccionada) {
      return alert("Selecciona una dirección primero");
    }

     handleCloseModal();
      navigate("/");
      clearCart();
    
    try {
      const response = await fetch(`${apiUrl}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: user.id_usuario,
          id_direccion: direccionSeleccionada,
          carrito: cart
        })
      });

      const data = await response.json();
      if (data.success) {
        //alert("Pedido realizado correctamente!");
        
        setMostrarDirecciones(false);
       

       /* setTimeout(() => {
        // redirige a página principal
      }, 200); */
      } else {
        alert("Error al realizar el pedido");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor");
    }
  };

  useEffect(() => {
    document.body.style.backgroundColor = "#E2DDD7";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <Box sx={{ padding: 3, maxWidth: 800, margin: "0 auto" }}>
      {!mostrarDirecciones ? (
        <>
          <h2>Mi Carrito</h2>
          {cart.length === 0 ? (
            <p>Tu carrito está vacío 😢</p>
          ) : (
            cart.map((item) => (
              <Box
                key={item.id_producto}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  padding: 2,
                  border: "1px solid #AA5D65",
                  borderRadius: 2,
                  marginBottom: 2,
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 4,
                  }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <h4 style={{ margin: 0 }}>{item.title}</h4>
                  <p style={{ margin: "5px 0" }}>{item.price}€</p>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton
                    sx={{ color: "#AA5D65", "&:hover": { color: "#892C47" } }}
                    onClick={() => decrementQuantity(item)}
                    size="small"
                  >
                    <RemoveIcon />
                  </IconButton>
                  <span>{item.quantity}</span>
                  <IconButton
                    sx={{ color: "#AA5D65", "&:hover": { color: "#892C47" } }}
                    onClick={() => incrementQuantity(item)}
                    size="small"
                  >
                    <AddIcon />
                  </IconButton>
                </Box>

                <IconButton
                  sx={{ color: "#892C47" }}
                  onClick={() => removeFromCart(item.id_producto)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))
          )}

          {cart.length > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 2,
                borderTop: "2px solid #B59E8C",
                marginTop: 4,
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              <span>Total ({totalItems} productos):</span>
              <span>{totalPrice.toFixed(2)}€</span>
            </Box>
          )}

          {cart.length > 0 && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
              <Button
                variant="contained"
                className="btn-custom"
                onClick={() => setMostrarDirecciones(true)} // muestra la sección de direcciones
              >
                Comprar
              </Button>
            </Box>
          )}
        </>
      ) : (
        // Sección de direcciones
        <Box sx={{ mt: 4 }}>
          <h3>Selecciona la dirección de envío</h3>
          {direcciones.length > 0 ? (
            direcciones.map((dir) => (
              <Box
                key={dir.id_direccion}
                sx={{
                  border: direccionSeleccionada === dir.id_direccion ? "2px solid #892C47" : "1px solid #AA5D65",
                  borderRadius: 2,
                  padding: 2,
                  mb: 1,
                  cursor: "pointer",
                  backgroundColor: "#F5F0F0",
                }}
                onClick={() => setDireccionSeleccionada(dir.id_direccion)}
              >
                <p>{dir.nombre}</p>
                <p>{dir.direccion}, {dir.ciudad}, {dir.provincia}, {dir.codigo_postal}</p>
              </Box>
            ))
          ) : (
            <Button
              variant="outlined"
              onClick={() => navigate("/formDireccionEnvio")}
            >
              Agregar nueva dirección
            </Button>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="contained"
              className="btn-custom"
              onClick={handleOpenModal}
              disabled={!direccionSeleccionada}
            >
              Pagar
            </Button>
            <Button
              variant="contained"
              className="btn-reset"
              sx={{ ml: 2, backgroundColor: "#B59E8C" }}
              onClick={() => setMostrarDirecciones(false)}
            >
              Volver al carrito
            </Button>
          </Box>
        </Box>
      )}
        <Modal open={openModal} onClose={handleCloseModal}>
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
            ¿Deseas confirmar el pago del pedido?
          </Typography>
          <Typography id="modal-description" variant="body1">
            Total: {totalPrice.toFixed(2)}€
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "space-around" }}>
            <Button variant="contained" color="success" onClick={pagarPedido} className="btn-custom">
              Confirmar
            </Button>
            <Button variant="contained" onClick={handleCloseModal} className="btn-reset" sx={{ backgroundColor: "#B59E8C" }}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Carrito;
