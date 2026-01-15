import React, { useEffect, useState, useMemo } from "react";
import { apiUrl } from "../config";

import imagen1 from "../assets/images/carrusel1.jpg";
import imagen2 from "../assets/images/carrusel2.jpg";
import imagen3 from "../assets/images/carrusel3.jpg";

import ProductCard from "./ProductCard";
import { useNavigate } from "react-router";

function Menu() {
  const images = [imagen1, imagen2, imagen3];
  const [index, setIndex] = useState(0);
  const [productosDestacados, setProductosDestacados] = useState([]);
  const destacadosIds= [4,5,6,7];
  const navigate = useNavigate();

  // Avanzar automáticamente cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Traer productos destacados
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch(`${apiUrl}/productos`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        console.log("Productos obtenidos:", data);
        if(Array.isArray(data.datos)){
          const destacados = data.datos.filter((p) =>
          destacadosIds.includes(p.id_producto)
        );
        setProductosDestacados(destacados);
      }else{
        console.error("Datos de productos no es un array:", data.datos);
        setProductosDestacados([]);
      }
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };
    fetchProductos();
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = "#E2DDD7";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  const prodcutosDestacadosMemo = useMemo(() => {
    return productosDestacados;
  }, [productosDestacados]);

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          paddingTop: "50px",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "70%",
            maxWidth: "100%",
            position: "relative",
            height: "750px", // altura fija
            overflow: "hidden",
            //borderRadius: "rem",
            boxShadow: "0 0 20px rgba(0,0,0,0.2)",
          }}
        >
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: `${(i - index) * 100}%`,
                transition: "left 0.6s ease-in-out",
              }}
            />
          ))}

          {/* Texto centrado */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              color: "white",
              textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
              pointerEvents: "none", // para que no bloquee clic en flechas
              fontFamily: "'DM Serif Text', serif",
            }}
          >
            <h1>VIVE,SUEÑA,RESPIRA,FLAMENCO</h1>
          </div>

          {/* Flechas */}
          <button
            onClick={prevSlide}
            style={{
              position: "absolute",
              top: "50%",
              left: "10px",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.5)",
              color: "white",
              border: "none",
              padding: "10px 15px",
              cursor: "pointer",
              fontSize: "24px",
              borderRadius: "50%",
            }}
          >
            ‹
          </button>
          <button
            onClick={nextSlide}
            style={{
              position: "absolute",
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.5)",
              color: "white",
              border: "none",
              padding: "10px 15px",
              cursor: "pointer",
              fontSize: "24px",
              borderRadius: "50%",
            }}
          >
            ›
          </button>
        </div>
        <div
          style={{
            width: "50%", // mismo ancho que el carrusel
            marginTop: "50px",
            alignSelf: "flex-start", // alineado a la izquierda
            color: "#2B2B2D",
            fontSize: "1.5rem",
            fontWeight: "500",
            marginLeft: "15px",
          }}
        >
          <h1>JOYAS DE LA COLECCION</h1>
        </div>
        <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: "30px",
        }}
      >
        {prodcutosDestacadosMemo.map((p) => (
          <ProductCard
            key={p.id_producto}
            id_producto={p.id_producto}
            image={p.imagen}
            title={p.nombre}
            price={p.precio}
            oldPrice={p.precioAnterior || null}
            colors={p.colores}
          />
        ))}
      
   
</div>
   <div
  onClick={() => navigate("/allproducts")}
  style={{
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "1.2rem",
    marginLeft: "20px",
    color: "#892C47",
    fontWeight: "500",
  }}
>
  Ver todo <span style={{ marginLeft: "8px" }}>→</span>
</div>
      </div>
    );
  };
export default Menu;
