import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";
import logo from "../assets/images/envio.jpg";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

import { apiUrl } from "../config";
import useUserStore from "../stores/useUserStore";
import { Category } from "@mui/icons-material";

function CategoryForm() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const location = useLocation();
  const categoriaAEditar = location.state?.categoria;
  const { id_categoria } = useParams();
  const esEdicion = !!id_categoria;

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "success", // success | error | warning | info
  });

  console.log("Usuario en CategoryForm:", user);

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    anotaciones: "",
  });

  // 🔹 Manejar cambios de campos
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Limpiar formulario
  const handleReset = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      anotaciones: "",
    });
  };

  // 🔹 Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const categoriaId = categoriaAEditar?.id_categoria || id_categoria;
      const method = esEdicion ? "PUT" : "POST";
      const bodyData = esEdicion
        ? { ...formData, id_categoria: categoriaId }
        : formData;
      const url = esEdicion
        ? `${apiUrl}/categorias/${categoriaId}`
        : `${apiUrl}/categorias`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (response.ok) {
        setAlert({
          show: true,
          message: esEdicion
            ? "Categoria actualizada correctamente"
            : "Categoria agregada correctamente",
          severity: "success",
        });

        setTimeout(() => {
          navigate("/categoryList");
        }, 1500);
      } else {
        setAlert({
          show: true,
          message: data.mensaje || "Error al agregar la dirección",
          severity: "error",
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        message:
          "Error de red. Por favor, inténtalo de nuevo más tarde. " + error,
        severity: "error",
      });
    }
  };

  useEffect(() => {
    if (esEdicion) {
      fetch(`${apiUrl}/categorias/${id_categoria}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          setFormData({
            nombre: data.datos.nombre || "",
            descripcion: data.datos.descripcion || "",
            anotaciones: data.datos.anotaciones || "",
          });
        })
        .catch((error) => {
          console.error("Error al obtener la categoría:", error);
        });
    }
  }, [id_categoria, esEdicion]);

  useEffect(() => {
    document.body.style.backgroundColor = "#E2DDD7"; // tu color de fondo

    // Limpieza opcional al desmontar (por si cambias de vista)
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <MDBContainer fluid>
      <MDBRow
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <MDBCol md="6">
          <MDBCard className="my-4">
            <MDBRow className="g-0">
              <MDBCol md="6" className="d-none d-md-block">
                <MDBCardImage
                  src={logo}
                  alt="Imagen"
                  className="rounded-start"
                  fluid
                />
              </MDBCol>

              <MDBCol md="6">
                <MDBCardBody className="text-black d-flex flex-column justify-content-center">
                  <h3 className="mb-5 text-uppercase fw-bold">
                    {esEdicion ? "Editar Categoria" : "Nueva Categoria"}
                  </h3>

                  <form onSubmit={handleSubmit}>
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Descripcion"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      required
                    />
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Anotaciones"
                      name="anotaciones"
                      value={formData.anotaciones}
                      onChange={handleChange}
                      required
                    />
                    {errors.apiError && (
                      <p style={{ color: "red" }}>{errors.apiError}</p>
                    )}

                    <div className="d-flex justify-content-center pt-3">
                      <MDBBtn
                        className="btn-reset"
                        color="light"
                        size="lg"
                        type="button"
                        onClick={handleReset}
                      >
                        LIMPIAR
                      </MDBBtn>
                      <MDBBtn
                        className="ms-2 btn-custom"
                        size="lg"
                        type="submit"
                      >
                        GUARDAR
                      </MDBBtn>
                    </div>
                    
                  </form>
                </MDBCardBody>
              </MDBCol>
            </MDBRow>
          </MDBCard>
          {alert.show && (
                      <Stack
                        sx={{ width: "100%" }}
                        spacing={2}
                        className="mt-4"
                      >
                        <Alert
                          severity={alert.severity}
                          onClose={() => setAlert({ ...alert, show: false })}
                        >
                          {alert.message}
                        </Alert>
                      </Stack>
                    )}
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default CategoryForm;
