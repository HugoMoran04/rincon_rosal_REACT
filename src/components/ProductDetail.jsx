import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import useCartStore from "../stores/useCartStore";
import { apiUrl } from "../config";


const ProductDetail = () => {
  const { id_producto } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();
  const productId = Number(id_producto);
 // const favorito = isFavorite(id_producto);
   // Store del carrito
  const addToCart = useCartStore((state) => state.addToCart);


  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/productos/${id_producto}`);
        if (!response.ok) throw new Error("Error al cargar el producto");
        const data = await response.json();
        setProducto(data.datos);
      } catch (error) {
        console.error(error);
        alert("Error de conexión con el servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id_producto]);

   useEffect(() => {
      document.body.style.backgroundColor = "#E2DDD7";
      return () => {
        document.body.style.backgroundColor = "";
      };
    }, []);

  if (loading) return <div>Cargando producto...</div>;
  if (!producto) return <div>No se encontró el producto.</div>;

  const {
    nombre: title,
    precio: price,
    descripcion: description,
    imagen,
    medidas: sizes,
    stock,
  } = producto;

   // Función para añadir al carrito
  const handleAddToCart = () => {
    addToCart({   id_producto: Number(id_producto),
      title: producto.nombre,
      price: producto.precio,
      image: producto.imagen,
      quantity: 1,
    });
    console.log(`🛒 Producto añadido al carrito: ${producto.nombre}`);
  };

  // Función para toggle favorito
  const handleToggleFavorite = () => {
    toggleFavorite(id_producto);
  };

 

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "80px",
        padding: "40px",
        maxWidth: "1200px",
        margin: "0 auto",
        flexWrap: "wrap",
      }}
    >
      {/* Imagen principal */}
      <div
        style={{
         // flex: "1 ",
          display: "flex",
          justifyContent: "flex-start", // Imagen hacia la izquierda
          alignItems: "center",
          paddingLeft: "20px",
          minWidth: "300px", // Para que en móviles no se achique demasiado
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "510px",
            aspectRatio: "1 / 1", // Mantener cuadrado
            overflow: "hidden",
            borderRadius: "12px",
            backgroundColor: "#f7f7f7",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={imagen || "/images/default.jpg"}
            alt={title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover", // Ajusta la imagen sin recortar
              objectPosition: "center",
            }}
          />
        </div>
      </div>

      {/* Información del producto */}
      <div
        style={{
          flex: "1.2",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          minWidth: "300px",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>{title}</h1>

        <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
          <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
            {price}€
          </span>
        </div>

        

        {/* Medidas */}
        {sizes && (
          <div>
            <h4 style={{ marginBottom: "10px" }}>Medidas:</h4>
            <div
              style={{
                padding: "8px 15px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                width: "fit-content",
                fontSize: "1rem",
              }}
            >
              {sizes}
            </div>
          </div>
        )}
        <p style={{ fontSize: "1rem", lineHeight: "1.6", color: "#555" }}>
          {description}
        </p>

        {/* Botones */}
        <div style={{ display: "flex", gap: "15px", marginTop: "30px" }}>
          <button
          onClick={handleAddToCart}
            style={{
              padding: "12px 25px",
              backgroundColor: "#5A2C2C",
              className:"btn-custom",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background 0.3s",
            }}
          >
            Añadir a la cesta
          </button>

          <button
            onClick={() => toggleFavorite(productId)}
            style={{
              padding: "12px 20px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: isFavorite(productId) ? "#892C47" : "white",
              color: isFavorite(productId) ? "white" : "#333",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "bold",
              transition: "all 0.3s",
            }}
          >
            {isFavorite(productId) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            Favorito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
