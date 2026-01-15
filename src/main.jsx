import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import Home from "./pages/Home";

import AltaUsuario from "./components/AltaUsuario";
import Login from "./components/Login";
import MyAccount from "./components/MyAccount";
import ListadoUsuarios from "./components/ListadoUsuarios";
import FormDireccionEnvio from "./components/FormDireccionEnvio";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./components/Unaunthorized";
import ProductSelect from "./components/ProductSelect";
import CategoryList from "./components/CategoryList";
import CategoryForm from "./components/CategoryForm";
import ProductsList from "./components/ProductsList";
import ProductForm from "./components/ProductForm";
import Menu from "./components/Menu";
import ProductDetail from "./components/ProductDetail";
import useUserStore from "./stores/useUserStore.jsx";
import Layout from "./pages/Layout.jsx";
import AllProducts from "./components/AllProducts.jsx";
import AllOrders from "./components/AllOrders.jsx";

import "mdb-react-ui-kit/dist/css/mdb.min.css";

import "@fontsource/dm-serif-text";

import "./index.css";
import Carrito from "./components/Carrito.jsx";

// Keep the router minimal so the app doesn't reference components that
// aren't implemented yet. Add routes as components become available.
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    //errorElement: <PaginaError />,
    children: [
      {
        index: true,
        element: <Home />,
      },

      {
        path: "login",
        element: <Login />,
      },
      {
        path: "altausuario",
        element: <AltaUsuario />,
      },
      {
        path: "unauthorized",
        element: <Unauthorized />,
      },
      {
        path: "carrito",
        element: <Carrito />,
      },

      {
        path: "allproducts",
        element: <AllProducts />,
      },

      {
        element: <ProtectedRoute allowedRoles={["user", "admin"]} />,
        children: [
          {
            path: "myaccount",
            element: <MyAccount />,
          },
          {
            path: "formDireccionEnvio",
            element: <FormDireccionEnvio />,
          },
          {
            path: "formDireccionEnvio/:id_usuario",
            element: <FormDireccionEnvio />,
          },
          {
            path: "producto/:id_producto",
            element: <ProductDetail />,
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          {
            path: "listadousuarios",
            element: <ListadoUsuarios />,
          },
          {
            path: "productSelect",
            element: <ProductSelect />,
          },
          {
            path: "categoryList",
            element: <CategoryList />,
          },
          {
            path: "productsList",
            element: <ProductsList />,
          },
          {
            path: "categoryForm",
            element: <CategoryForm />,
          },
          {
            path: "categoryForm/:id_categoria",
            element: <CategoryForm />,
          },
          {
            path: "productForm",
            element: <ProductForm />,
          },
          {
            path: "productForm/:id_producto",
            element: <ProductForm />,
          },
          {
            path:"orderList",
            element: <AllOrders />,
          },
        ],
      },
    ],
  },
]);

function AppWrapper() {
  // Usar selector de Zustand para obtener userId de forma reactiva
  // Esto causará que el componente re-renderice cuando userId cambie
  const userId = useUserStore((state) => state.user?.id_usuario ?? null);

  console.log("🔍 AppWrapper - userId reactivo:", userId);

  return (
    <FavoritesProvider userId={userId}>
      <RouterProvider router={router} />
    </FavoritesProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/**<RouterProvider router={router} /> */}
    <AppWrapper />
  </StrictMode>
);
