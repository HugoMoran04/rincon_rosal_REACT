import { Box, Typography, Button, Paper } from "@mui/material";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import LockIcon from "@mui/icons-material/Lock";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Unauthorized() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #892C47, #AA5D65, #000000)",
        px: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          maxWidth: 520,
          width: "100%",
          p: 4,
          textAlign: "center",
          borderRadius: 4,
          backgroundColor: "rgba(0,0,0,0.75)",
          color: "#fff",
        }}
      >
        {/* Icono */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <LocalFireDepartmentIcon sx={{ fontSize: 64, color: "#ff5252" }} />
        </Box>

        {/* Título */}
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          ¡Alto ahí, con arte!
        </Typography>

        {/* Mensaje */}
        <Typography variant="body1" sx={{ color: "#ffcccb", mb: 3 }}>
          Esta zona está más cerrada que un tablao después del último quejío.
          <br />
          No tienes permisos para entrar aquí.
        </Typography>

        {/* Detalle */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            color: "#ff8a80",
            mb: 4,
          }}
        >
          <LockIcon fontSize="small" />
          <Typography variant="caption">Acceso denegado · Error 403</Typography>
        </Box>

        {/* Botón */}
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => window.history.back()}
          sx={{
            backgroundColor: "#AA5D65",
            borderRadius: 3,
            px: 3,
            py: 1.5,
            fontWeight: "bold",
            '&:hover': { backgroundColor: "#892C47" },
          }}
        >
          Volver por donde viniste
        </Button>

        {/* Footer */}
        <Typography
          variant="caption"
          display="block"
          sx={{ mt: 4, color: "#ffab91", opacity: 0.8 }}
        >
          Si crees que esto es un error, habla con quien lleva el compás 😉
        </Typography>
      </Paper>
    </Box>
  );
}
