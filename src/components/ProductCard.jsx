import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

import { useFavorites } from "../context/FavoritesContext.jsx";
import { useNavigate } from "react-router-dom";

import useCartStore from "../stores/useCartStore"; // <-- tu store

const ProductCard = ({ id_producto, image, title, price, }) => {
  const { isFavorite, toggleFavorite  } = useFavorites();
  const favorito = isFavorite(id_producto);
  const navigate = useNavigate();

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    console.log(`🔄 Click en corazón - Producto: ${id_producto}, Favorito actual: ${favorito}`);
    
    // Espera a que se complete la operación
    const success = await toggleFavorite(id_producto);
    
    if (success) {
      console.log(`✅ Toggle completado - Producto: ${id_producto}`);
    } else {
      console.log(`❌ Error en toggle - Producto: ${id_producto}`);
    }
  };

  const handleProductClick = () => {
    navigate(`/producto/${id_producto}`);
  };

   // Store del carrito
  const addToCart = useCartStore((state) => state.addToCart);

   const handleAddToCart = (e) => {
    e.stopPropagation(); // evita abrir la página del producto
    addToCart({ id_producto, title, price, image });
    console.log(`🛒 Producto añadido al carrito: ${title}`);
  };

  //console.log(`🎨 Render ProductCard ${id_producto} - favorito: ${favorito}`);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "300px",
        border: "1px solid #e0e0e0",
        overflow: "hidden",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        margin: "10px",
        fontFamily: "'DM Sans', sans-serif",
        cursor: "pointer",
      }}
      onClick={handleProductClick}
    >
      {/* Imagen del producto */}
      <div style={{ width: "100%", height: "400px", overflow: "hidden", position: "relative" }}>
        <img
          src={image}
          alt={title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onClick={() =>navigate(`/producto/${id_producto}`)} 
        />


  {/* 🛒 Carrito arriba izquierda */}
        <div
          onClick={handleAddToCart}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 2,
            fontSize: "24px",
            color: "#B59E8C",
            textShadow: "1px 1px 4px rgba(0,0,0,0.7)",
            cursor: "pointer",
          }}
        >
           <AddShoppingCartIcon />
        </div>


        {/* Corazón arriba derecha */}
        <div
         /* onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(id_producto);
          }}*/
          onClick={handleFavoriteClick}
          style={{
            top: "10px",
            right: "10px",
            zIndex: 2,
            fontSize: "24px",
            color: favorito ? "#892C47" : "#B59E8C",
            textShadow: "1px 1px 4px rgba(0,0,0,0.7)",
            cursor: "pointer",
            position: "absolute",
          }}
        >
          {favorito ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </div>
      </div>

      {/* Información del producto */}
      <div style={{ padding: "15px" }}>
        <h3 style={{ fontSize: "1rem", margin: "0 0 5px 0" }}>{title}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontWeight: "600" }}>{price}€</span>
          {/*oldPrice && <span style={{ textDecoration: "line-through", color: "#888" }}>{oldPrice}€</span>*/}
        </div>

        {/* Colores 
        {colors && (
          <div style={{ marginTop: "10px", display: "flex", gap: "5px" }}>
            {colors.map((color, i) => (
              <div
                key={i}
                style={{
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
                  backgroundColor: color,
                  border: "1px solid #ccc",
                }}
              ></div>
            ))}
          </div>
        )}*/}
      </div>
    </div>
  );
};

export default ProductCard;
