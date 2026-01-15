import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { apiUrl } from "../config"; // Asegúrate de que esta ruta sea correcta

// 1. Crear el contexto
const FavoritesContext = createContext();

// 2. Crear el Provider
export const FavoritesProvider = ({ children, userId }) => {
  // Estado para almacenar los favoritos en formato: { id_producto: id_favorito }
  const [favorites, setFavorites] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 3. Efecto para cargar favoritos cuando el userId cambie
  useEffect(() => {
    const loadFavorites = async () => {
      // Si no hay userId, limpiar los favoritos
      if (!userId) {
        setFavorites(new Map());
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log("Cargando favoritos para userId:", userId);

        const response = await fetch(`${apiUrl}/favoritos/usuario/${userId}`, {
          method: "GET",
          credentials: "include", // Importante para enviar cookies si usas sesiones
        });

        if (!response.ok) {
          throw new Error(
            `Error ${response.status}: No se pudieron cargar los favoritos`
          );
        }

        const data = await response.json();
        console.log("Datos recibidos de favoritos:", data);

        // Convertir el array de favoritos a un objeto para fácil acceso
        // Formato: { id_producto: id_favorito }
        const favoritesMap = new Map();

        if (data.datos && Array.isArray(data.datos)) {
          data.datos.forEach((favorito) => {
            favoritesMap.set(favorito.id_producto, favorito.id_favorito);
          });
        }

        console.log("Favoritos mapeados:", favoritesMap);
        setFavorites(favoritesMap);
      } catch (err) {
        console.error("Error al cargar favoritos:", err);
        setError(err.message);
        setFavorites(new Map()); // Limpiar en caso de error
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [userId]); // Se ejecuta cada vez que userId cambie

  // 4. Función para verificar si un producto es favorito
  const isFavorite = (productId) => {
    return favorites.has(productId);
  };

  // 5. Función para alternar (añadir/eliminar) favorito
  const toggleFavorite = async (productId) => {
    // Verificar si hay usuario autenticado
    if (!userId) {
      console.warn("Usuario no autenticado. No se puede gestionar favoritos.");
      setError("Debes iniciar sesión para guardar favoritos");
      return false;
      //return Promise.resolve(false);
    }

    const isCurrentlyFavorite = isFavorite(productId);

    try {
      setError(null);

      if (isCurrentlyFavorite) {
        // ELIMINAR de favoritos
        const favoriteId = favorites.get(productId);
        if (!favoriteId || isNaN(favoriteId)) {
          console.error("ID de favorito inválido para eliminar:", favoriteId);

          // setFavorites(prev => {
          //   const newFavorites = { ...prev };
          //   delete newFavorites[productId];
          //   return newFavorites;
          // });
          // setFavorites((prev) => {
          //   const newFavorites = new Map(prev); // ← clona el Map
          //   newFavorites.delete(productId); // ← elimina la key
          //   return newFavorites; // ← devuelve un Map nuevo
          // });
          return false;
        }

        const response = await fetch(`${apiUrl}/favoritos/${favoriteId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Error al eliminar favorito");
        }

        // Actualizar estado local
        // setFavorites((prev) => {
        //   const newFavorites = { ...prev };
        //   delete newFavorites[productId];
        //   return newFavorites;
        // });
        setFavorites((prev) => {
          const newFavorites = new Map(prev); // ← clona el Map
          newFavorites.delete(productId); // ← elimina la key
          return newFavorites; // ← devuelve un Map nuevo
        });

        console.log(`Producto ${productId} eliminado de favoritos`);
        return true;
      } else {
        // AÑADIR a favoritos
        const response = await fetch(`${apiUrl}/favoritos`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_usuario: userId,
            id_producto: productId,
          }),
        });

        if (!response.ok) {
          throw new Error("Error al añadir favorito");
        }

        const data = await response.json();

        // Actualizar estado local
        // setFavorites((prev) => {
        //   const newFavorites = {
        //     ...prev,
        //     [productId]: data.datos?.id_favorito || data.id_favorito,
        //   };

        //   console.log(`Producto ${productId} añadido a favoritos`);
        //   return newFavorites;
        // });

        setFavorites((prev) => {
          const newFavorites = new Map(prev); // ← clonar el Map
          newFavorites.set(
            productId,
            data.datos?.id_favorito 
          ); // ← asignar valor
          return newFavorites; // ← devolver un Map nuevo
        });

        console.log("Nuevo favorito añadido:", productId);
        return true;
      }
    } catch (err) {
      console.error("Error en toggleFavorite:", err);
      setError(err.message);
      return false;
    }
  };

  // 6. Función para obtener todos los IDs de productos favoritos
  // const getFavoriteProductIds = () => {
  //   return Object.keys(favorites).map((id) => parseInt(id));
    
  // };
  const getFavoriteProductIds = () => Array.from(favorites.keys());

  // 7. Función para obtener el ID del favorito (si lo necesitas para algo)
  const getFavoriteId = (productId) => {
    return favorites.get(productId);
  };

  // 8. Valor que exponemos a través del contexto
  const contextValue = useMemo(
    () => ({
      favorites, // Mapa con todos los favoritos
      isFavorite, // Función para verificar si es favorito
      toggleFavorite, // Función para añadir/eliminar
      getFavoriteProductIds, // Función para obtener lista de IDs
      getFavoriteId, // Función para obtener ID del favorito
      loading, // Estado de carga
      error, // Mensaje de error (si hay)
      userId, // ID del usuario actual (por si lo necesitas)
    }),
    [favorites, loading, error, userId]
  );

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};

// 9. Hook personalizado para usar el contexto
export const useFavorites = () => {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      "useFavorites debe ser usado dentro de un FavoritesProvider"
    );
  }

  return context;
};

export default FavoritesContext;
