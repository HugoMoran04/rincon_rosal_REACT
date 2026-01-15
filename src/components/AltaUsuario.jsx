import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBRadio,
  //MDBSelect
} from "mdb-react-ui-kit";
import logo from "../assets/images/flores.jpg";
import { apiUrl } from "../config";

//import foto from "../assets/images/logoPerfecto.png";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CloseIcon from '@mui/icons-material/Close';

function AltaUsuario() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    edad: "",
    nif: "",
    email: "",
    contrasena: "",
    telefono: "",
    rol: "user",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [open, setOpen] = React.useState(true);

  /*const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };*/

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = "Los apellidos son obligatorios";
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
    } else if(!/^\d{9}$/.test(formData.telefono)){
      newErrors.telefono = "El teléfono debe tener 9 dígitos";
    }
    if (!formData.edad.trim()) {
      newErrors.edad = "La edad es obligatoria";
    }
    if (!formData.email) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El formato del correo no es válido.";
    }
    if (!formData.contrasena) {
      newErrors.contrasena = "La contraseña es obligatoria.";
    } else if (formData.contrasena.length < 6) {
      newErrors.contrasena = "La contraseña debe tener al menos 6 caracteres.";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0){//Object.keys(errors).length) 
      setAlert({ tipo: "warning", message: "Por favor, complete el formulario" });
      return false;
    } 

    /*if(Object.keys(newErrors).length > 0) {
      setAlert({ tipo: "", message: "" });
      return false;
    }*/
  

  setAlert({ tipo: "", message: "" });
  return true;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit triggered");
    setOpen(true);
    if (!validate()) return;

    try {
      // Debug: mostrar en consola el payload que vamos a enviar
      console.log("Payload a enviar:", formData);

      const response = await fetch(apiUrl + "/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Intentar leer cuerpo como texto o JSON para mostrar el error del servidor
        const text = await response.text();
        let parsed;
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = null;
        }
        console.error("Server error", response.status, parsed ?? text);
        const serverMessage =
          (parsed && (parsed.mensaje || parsed.error || parsed.message)) ||
          text ||
          `HTTP ${response.status}`;
        setAlert({tipo:"error", message:"Error del servidor: "+  serverMessage});
        return;
      }

      // response.ok === true
      setSuccess(true);
      setFormData({
        nombre: "",
        apellidos: "",
        edad: "",
        nif: "",
        email: "",
        contrasena: "",
        telefono: "",
        rol: "user",
      });
      setErrors({});
      const respuesta = await response.json();
      setAlert({ tipo: "success", message:  "Usuario registrado con éxito." });
      if (respuesta.ok) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      alert(
        "Error al registrar el usuario. Por favor, inténtelo de nuevo más tarde.",
        error
      );
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = () => {
    setFormData({
      nombre: "",
      apellidos: "",
      edad: "",
      nif: "",
      email: "",
      contrasena: "",
      telefono: "",
      rol: "user",
    });
    setErrors({});
    setSuccess(false);
  };

  useEffect(() => {
    document.body.style.backgroundColor = "#E2DDD7"; // tu color de fondo

    // Limpieza opcional al desmontar (por si cambias de vista)
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  useEffect(() => {
    if (alert.message) {
      setOpen(true);
    }
  }, [alert.message]);

  return (
    <>
      <MDBContainer fluid>
        <MDBRow
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <MDBCol md="6">
            <MDBCard className="my-4" md="">
              <MDBRow className="g-0">
                <MDBCol md="6" className="d-none d-md-block">
                  <MDBCardImage
                    src={logo}
                    alt="Sample photo"
                    className="rounded-start"
                    fluid
                  />
                </MDBCol>

                <MDBCol md="6">
                  <MDBCardBody className="text-black d-flex flex-column justify-content-center">
                    <h3 className="mb-5 text-uppercase fw-bold align-tex">
                      REGISTRARSE
                    </h3>
                    <form onSubmit={handleSubmit}>
                      <MDBRow>
                        <MDBCol md="6">
                          <MDBInput
                            wrapperClass="mb-4"
                            label="Nombre"
                            size="lg"
                            id="nombre"
                            type="text"
                            name="nombre"
                            onChange={handleChange}
                            value={formData.nombre}
                          />
                        </MDBCol>

                        <MDBCol md="6">
                          <MDBInput
                            wrapperClass="mb-4"
                            label="Apellidos"
                            size="lg"
                            id="apellidos"
                            type="text"
                            name="apellidos"
                            onChange={handleChange}
                            value={formData.apellidos}
                          />
                        </MDBCol>
                      </MDBRow>

                      <MDBInput
                        wrapperClass="mb-4"
                        label="Teléfono"
                        size="lg"
                        id="telefono"
                        type="tel"
                        name="telefono"
                        onChange={handleChange}
                        value={formData.telefono}
                      />
                      <MDBRow>
                        <MDBCol md="6">
                          <MDBInput
                            wrapperClass="mb-4"
                            label="NIF/CIF (opcional)"
                            size="lg"
                            id="nif"
                            type="text"
                            name="nif"
                            onChange={handleChange}
                            value={formData.nif}
                          />
                        </MDBCol>

                        <MDBCol md="6">
                          <MDBInput
                            wrapperClass="mb-4"
                            label="Edad"
                            size="lg"
                            id="edad"
                            type="date"
                            name="edad"
                            onChange={handleChange}
                            value={formData.edad}
                          />
                        </MDBCol>

                        {/*<LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="Fecha de nacimiento"
                            value={fechaNacimiento}
                            onChange={(newValue) =>
                              setFechaNacimiento(newValue)
                            }
                          />
                        </LocalizationProvider>*/}
                      </MDBRow>

                      <MDBInput
                        wrapperClass="mb-4"
                        label="Email"
                        size="lg"
                        id="email"
                        type="email"
                        name="email"
                        onChange={handleChange}
                        value={formData.email}
                      />
                      <div position="absolute mb-4">
                        <MDBInput
                          className="input-custom"
                          wrapperClass="mb-4"
                          label="Contraseña"
                          size="lg"
                          id="contrasena"
                          type="password"
                          name="contrasena"
                          value={formData.contrasena}
                          onChange={handleChange}
                          style={{ paddingRight: "40px" }}
                        />
                        {/*<VisibilityIcon
                          style={{
                            position: "absolute",
                            right: 15,
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            color: "#555",
                          }}
                        />*/}
                      </div>

                      {/* Campo explícito para rol para asegurarnos de que se envía */}
                      <div style={{ display: "none" }}>
                        <select
                          name="rol"
                          value={formData.rol}
                          onChange={handleChange}
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </div>

                      <div className="d-flex justify-content-center pt-3v ">
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
                          onClick={() =>
                            console.log("Registrarse button clicked")
                          }
                        >
                          REGISTRARSE
                        </MDBBtn>
                      </div>
                    </form>
                  </MDBCardBody>
                </MDBCol>
              </MDBRow>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      {Object.entries(errors).map(([field, msg]) => (
        <Collapse key={field} in={open} sx={{ width: { xs: "90%", sm: "70%", md: "50%", lg: "25%" }, mb: 2, mx: "auto" }} >
        <Alert
        severity="warning"
        action={
          <IconButton aria-label="close"
              color="inherit"
              size="small"
              onClick={() => 
                setErrors(prev => {
            const copy = { ...prev };
            delete copy[field];
            return copy;
          })
              }>  
          <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        > {msg}
         </Alert>
      </Collapse>
      
      ))}


      {alert.message && (
      <Collapse in={open} sx={{width: "25%", mb:2}} >
        <Alert
        severity={alert.tipo} 
        action={
          <IconButton aria-label="close"
              color="inherit"
              size="small"
              onClick={() => 
                setOpen(false)}>
              
          <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        >
         {alert.message}</Alert>
      </Collapse>
      
      )}
    </>
  );
}

export default AltaUsuario;
