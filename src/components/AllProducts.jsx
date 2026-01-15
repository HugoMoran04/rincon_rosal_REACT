import React, { useEffect, useState, useRef } from "react";
import { apiUrl } from "../config";
import ProductCard from "../components/ProductCard";
import { MDBBtn } from "mdb-react-ui-kit";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";

function AllProducts() {
  const [categorias, setCategorias] = useState([]);
  const slidersRef = useRef({});
  const [visibleCards, setVisibleCards] = useState({}); // para controlar flechas

  useEffect(() => {
    const fetchCategorias = async () => {
      const res = await fetch(`${apiUrl}/categorias/con-productos`);
      const data = await res.json();
      if (data.ok && Array.isArray(data.datos)) {
        setCategorias(data.datos);
      } else {
        setCategorias([]);
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = "#E2DDD7";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  // Detectar cuántas cards caben en cada slider según el tamaño de la pantalla
  useEffect(() => {
    const updateVisibleCards = () => {
      const newVisible = {};
      categorias.forEach((cat) => {
        const slider = slidersRef.current[cat.id_categoria];
        if (slider) {
          const containerWidth = slider.offsetWidth;
          const cardWidth = 250 + 20; // ancho card + gap
          const cardsFit = Math.floor(containerWidth / cardWidth);
          newVisible[cat.id_categoria] = cardsFit;
        }
      });
      setVisibleCards(newVisible);
    };

    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, [categorias]);

  const handleScroll = (id_categoria, direction) => {
    const slider = slidersRef.current[id_categoria];
    if (!slider) return;
    const cardWidth = 250 + 20;
    slider.scrollBy({
      left: direction === "next" ? cardWidth * 2 : -cardWidth * 2,
      behavior: "smooth",
    });
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Colecciones</h1>

      {categorias
        .filter(
          (cat) => Array.isArray(cat.productos) && cat.productos.length > 0
        )
        .map((cat) => {
          const cardsFit = visibleCards[cat.id_categoria] || 0;
          const needArrows = cat.productos.length > cardsFit;

          return (
            <div key={cat.id_categoria} style={{ marginBottom: "60px" }}>
              <h2>{cat.nombre}</h2>
              <div style={{ position: "relative" }}>
                <div
                  ref={(el) => (slidersRef.current[cat.id_categoria] = el)}
                  style={{
                    display: "flex",
                    overflowX: "hidden",
                    gap: "20px",
                    scrollSnapType: "x mandatory",
                    paddingBottom: "10px",
                  }}
                >
                  {cat.productos.map((p) => (
                    <div
                      key={p.id_producto}
                      style={{
                        flex: "0 0 auto",
                        scrollSnapAlign: "start",
                        width: "250px",
                      }}
                    >
                      <ProductCard
                        id_producto={p.id_producto}
                        image={p.imagen}
                        title={p.nombre}
                        price={p.precio}
                      />
                    </div>
                  ))}
                </div>

                {/* Flechas solo si hace falta */}
                {needArrows && (
                  <>
                    <ArrowBackIosRoundedIcon
                      onClick={() => handleScroll(cat.id_categoria, "prev")}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "-30px",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color:"#892C47",

                        zIndex: 10,
                      }}
                    ></ArrowBackIosRoundedIcon>
                    <ArrowForwardIosRoundedIcon
                    onClick={() => handleScroll(cat.id_categoria, "next")}
                      
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "-30px",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        color:"#892C47",
                        cursor: "pointer",
                      }}
                      
                    >
                      &#8594;
                    </ArrowForwardIosRoundedIcon>
                  </>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default AllProducts;
