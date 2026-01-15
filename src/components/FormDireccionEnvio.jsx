import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
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
import { apiUrl } from "../config";
import useUserStore from "../stores/useUserStore";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";


function FormDireccionEnvio() {
  const navigate = useNavigate();
  const {user} = useUserStore();
  const location = useLocation();
  const direccionAEditar = location.state?.direccion;
  const esEdicion = !!direccionAEditar;
  console.log("Usuario en FormDireccionEnvio:", user);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "success", // success | error | warning | info
  });

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    direccion: "",
    ciudad: "",
    provincia: "",
    codigo_postal: "",
    pais: "",
    observaciones: "",
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
      direccion: "",
      ciudad: "",
      provincia: "",
      codigo_postal: "",
      pais: "",
      observaciones: "",
    });
  };

  // 🔹 Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const id_usuario = user?.id_usuario;
    if (!id_usuario) {
      setAlert({
        show: true,
        message: "No se encontró el usuario en sesión.",
        severity: "error",
      });
        
      }

    try {

      const method = esEdicion ? "PUT" : "POST";
      const bodyData = esEdicion ? { ...formData, id_direccion: direccionAEditar.id_direccion } : formData;
     
      const response = await fetch(`${apiUrl}/direccionesEnvio/${id_usuario}`, {
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
          message: esEdicion ? "Dirección actualizada correctamente" : "Dirección agregada correctamente",
          severity: "success",
        });
        navigate("/myaccount");
      } else {
        setAlert({
          show: true,
          message: data.mensaje || "Error al agregar la dirección",
          severity: "error",
        });}
    } catch (error) {
      setAlert({
        show: true,
        message: "Error de red. Por favor, inténtalo de nuevo más tarde. " + error,
        severity: "error",
      });
     
    }
  };

  useEffect(() => {
    if(direccionAEditar){
      setFormData({
        direccion: direccionAEditar.direccion || "",
        ciudad: direccionAEditar.ciudad || "",
        provincia: direccionAEditar.provincia || "",
        codigo_postal: direccionAEditar.codigo_postal || "",
        pais: direccionAEditar.pais || "",
        observaciones: direccionAEditar.observaciones || "",
      });
    }
  }, [direccionAEditar]);

  useEffect(() => {
      document.body.style.backgroundColor = "#E2DDD7"; // tu color de fondo
  
      // Limpieza opcional al desmontar (por si cambias de vista)
      return () => {
        document.body.style.backgroundColor = "";
      };
    }, []);

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
                  style={{ height: "100%", objectFit: "cover" }}
                />
              </MDBCol>

              <MDBCol md="6">
                <MDBCardBody className="text-black d-flex flex-column justify-content-center">
                  <h3 className="mb-5 text-uppercase fw-bold">
                    {esEdicion ? "Editar Dirección de Envío" : "Nueva Dirección de Envío"}
                  </h3>

                  <form onSubmit={handleSubmit}>
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Dirección"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      required
                    />
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Ciudad"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      required
                    />
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Provincia"
                      name="provincia"
                      value={formData.provincia}
                      onChange={handleChange}
                      required
                    />
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Código Postal"
                      name="codigo_postal"
                      value={formData.codigo_postal}
                      onChange={handleChange}
                      required
                    />
                    <MDBInput
                      wrapperClass="mb-4"
                      label="País"
                      name="pais"
                      value={formData.pais}
                      onChange={handleChange}
                      required
                    />
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Observaciones"
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleChange}
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
                  <Stack sx={{ width: "100%" }} spacing={2} className="mt-4">
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

export default FormDireccionEnvio;