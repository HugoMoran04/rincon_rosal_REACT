import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Menu,
  MenuItem,
  createTheme,
  ThemeProvider,
  SwipeableDrawer,
} from "@mui/material";

import React from "react";

import logo from "../assets/images/logoPerfecto.png";
import fondo from "../assets/images/imagenlunares.jpeg";

import fondoDrawer from "../assets/images/sinfondo.JPG";

import { Link, useNavigate } from "react-router-dom";

import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";

import useUserStore from "../stores/useUserStore";
import useCartStore from "../stores/useCartStore";

function NavBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorE2, setAnchorE2] = React.useState(null);
  const [drwerOpen, setDrawerOpen] = React.useState(false);
  const { user, clearUser, isAdmin, isUser, isLoggedIn } = useUserStore();
  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorE2);
  const loggedIn = isLoggedIn();
  const navigate = useNavigate();

  const handleClick = (event) => {
    // 🔹 Si está logueado, lo mandamos directamente a su cuenta
    if (loggedIn) {
      navigate("/myaccount");
    } else {
      // 🔹 Si no está logueado, abrimos el menú con las opciones de login/registro
      setAnchorEl(event.currentTarget);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick2 = (event) => {
    setAnchorE2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorE2(null);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };
  const theme = createTheme({
    components: {
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: "#2B2B2D",

            "&:hover": {
              backgroundColor: "#B59E8C",
              color: "#fff",
              //fontWeight: "bold",
            },
          },
        },
      },
    },
  });

  const totalItems = useCartStore((state) => state.totalItems());

  return (
    <>
      <AppBar
        position="static"
        sx={{
          boxShadow: 3,
          backgroundImage: `url(${fondo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Logo */}
          <img
            src={logo}
            alt="Logo"
            style={{ height: 115, width: "auto", borderRadius: "50%" }}
            onClick={() => navigate("/")}
          />
          <Box sx={{ display: "flex", gap: 5, margin: "0 auto" }}>
            {/* <SearchIcon fontSize="large" sx={{ cursor: "pointer" }} /> */}
            <PersonIcon
              fontSize="large"
              sx={{ cursor: "pointer" }}
              onClick={handleClick}
            />
            <Box
              sx={{ position: "relative", cursor: "pointer" }}
              onClick={() => navigate("/carrito")}
            >
              <ShoppingCartIcon fontSize="large" sx={{ cursor: "pointer" }} />
              {totalItems > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    backgroundColor: "#892C47",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                >
                  {totalItems}
                </Box>
              )}
            </Box>

            {user?.rol === "admin" ? (
              <SupervisedUserCircleIcon
                fontSize="large"
                sx={{ cursor: "pointer" }}
                onClick={handleClick2}
              />
            ) : null}
          </Box>
          {/* Aquí podrías añadir algo a la derecha si quieres */}
          <Box sx={{ width: 100 }} />{" "}
          {/* espacio igual al logo para mantener centrado */}
          <MenuIcon
            fontSize="large"
            sx={{ cursor: "pointer" }}
            onClick={() => setDrawerOpen(true)}
          />
        </Toolbar>
      </AppBar>
      <ThemeProvider theme={theme}>
        {!loggedIn && (
          <Menu
            id="person-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Link to="/altausuario">
              <MenuItem
                sx={{ fontFamily: "'DM Serif Text', serif" }}
                onClick={handleClose}
              >
                Registrarse
              </MenuItem>
            </Link>
            <Link to="/login">
              <MenuItem
                sx={{ fontFamily: "'DM Serif Text', serif" }}
                onClick={handleClose}
              >
                Iniciar sesión
              </MenuItem>
            </Link>
            <Link to="/myaccount">
              <MenuItem
                sx={{ fontFamily: "'DM Serif Text', serif" }}
                onClick={handleClose}
              >
                Mi cuenta
              </MenuItem>
            </Link>
          </Menu>
        )}

        <Menu
          id="person-admin"
          anchorEl={anchorE2}
          open={open2}
          onClose={handleClose2}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Link to="/productSelect">
            <MenuItem
              sx={{ fontFamily: "'DM Serif Text', serif" }}
              onClick={handleClose2}
            >
              Productos
            </MenuItem>
          </Link>
          <Link to="/orderList">
            <MenuItem
              sx={{ fontFamily: "'DM Serif Text', serif" }}
              onClick={handleClose2}
            >
              Pedidos
            </MenuItem>
          </Link>
          <Link to="/listadousuarios">
            <MenuItem
              sx={{ fontFamily: "'DM Serif Text', serif" }}
              onClick={handleClose2}
            >
              Usuarios
            </MenuItem>
          </Link>
        </Menu>
        <SwipeableDrawer
          anchor="right"
          open={drwerOpen}
          onClose={() => setDrawerOpen(false)}
          onOpen={() => setDrawerOpen(true)}
        >
          <Box
            sx={{
              width: 250,
              height: "100%",
              backgroundImage: `url(${fondoDrawer})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <img
              src={logo}
              alt="Logo Drawer"
              style={{ height: 235, width: "auto" }}
            />
          </Box>
        </SwipeableDrawer>
      </ThemeProvider>
    </>
  );
}
export default NavBar;
