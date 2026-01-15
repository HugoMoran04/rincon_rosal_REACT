import React, {useEffect} from "react";
import { Card, CardActionArea, CardMedia, Grid, Box } from "@mui/material";

import productoIMG from "../assets/images/fabProduct.jpeg";
import categoriaIMG from "../assets/images/fabCategory.jpeg";
import { useNavigate } from "react-router";




const TwoCards = () => {
    const navigate = useNavigate();
    useEffect(() => {
    document.body.style.backgroundColor = "#E2DDD7"; // tu color de fondo

    // Limpieza opcional al desmontar (por si cambias de vista)
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);
  return (
    <Box
      sx={{
        minHeight: "80vh",      
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid container spacing={15} justifyContent="center" alignItems="center">
        {/* Primera Card */}
        <Grid item xs={12} md={5}>
          <Card sx={{ WIDTH: "100%", margin: "auto" }}>
            <CardActionArea onClick={() => navigate("/categoryList")}>
              <CardMedia
                component="img"
                height="500"  // Más grande
                src={categoriaIMG}
                alt="Card 1"
              />
            </CardActionArea>
          </Card>
        </Grid>

        {/* Segunda Card */}
        <Grid item xs={12} md={8}>
          <Card sx={{ WIDTH: "100%", margin: "auto" }}>
            <CardActionArea onClick={() => navigate("/productsList")}>
              <CardMedia
                component="img"
                height="500"  // Más grande
                src={productoIMG}
                alt="Card 2"
              />
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TwoCards;
