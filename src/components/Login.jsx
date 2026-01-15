import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { apiUrl } from "../config";
import useUserStore from "../stores/useUserStore";

import fondo from "../assets/images/persona3.jpg";
import logo from "../assets/images/logoPerfecto.png";

import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
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
  MDBIcon,
  //MDBSelect
} from "mdb-react-ui-kit";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    contrasena: "",
  });

  const [errors, setErrors] = useState({});
  const { setUser } = useUserStore();

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "success", // success | error | warning | info
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El formato del correo no es válido.";
    }
    if (!formData.contrasena) {
      newErrors.contrasena = "La contraseña es obligatoria.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const response = await fetch(apiUrl + "/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        setAlert({
          show: true,
          message: data.mensaje,
          severity: "success",
        });

        setUser(data.datos);

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setAlert({
          show: true,
          message: data.mensaje || "Error en el inicio de sesión",
          severity: "error",
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        message:
          "Error de red. Por favor, inténtelo de nuevo más tarde." + error,
        severity: "error",
      });
    }
  };

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
    <>
      <MDBContainer className="mt-5">
        <MDBRow
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "calc(100vh - 13rem)" }}
        >
          <MDBCol md="6">
            <MDBCardImage
              src={fondo}
              alt="login form"
              className="rounded-start w-100"
            />
          </MDBCol>

          <MDBCol md="6">
            <MDBCardBody className="d-flex flex-column">
              <div className="d-flex flex-row align-items-center justify-content-center ">
                <img
                  src={logo}
                  alt="Logo"
                  className="img-fluid"
                  style={{ maxHeight: 200 }}
                />
              </div>
              <form onSubmit={handleSubmit}>
                <h5
                  className="fw-normal my-4 pb-3"
                  style={{ letterSpacing: "1px" }}
                >
                  Iniciar Sesión
                </h5>
                {errors.apiError && (
                  <Alert severity="error">{errors.apiError}</Alert>
                )}

                {errors.email && (
                  <p
                    style={{
                      color: "red",
                      fontSize: "0.9rem",
                      marginTop: "4px",
                    }}
                  >
                    {errors.email}
                  </p>
                )}
                <MDBInput
                  wrapperClass="mb-4"
                  name="email"
                  label="Email"
                  id="formControlLg"
                  type="email"
                  size="lg"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.contrasena && (
                  <p
                    style={{
                      color: "red",
                      fontSize: "0.9rem",
                      marginTop: "4px",
                    }}
                  >
                    {errors.contrasena}
                  </p>
                )}
                <MDBInput
                  wrapperClass="mb-4"
                  name="contrasena"
                  label="Contraseña"
                  id="formControlLg"
                  type="password"
                  size="lg"
                  value={formData.contrasena}
                  onChange={handleChange}
                />

                <MDBBtn
                  className="mb-4 px-5 btn-custom"
                  color="dark"
                  size="lg"
                  type="submit"
                >
                  Acceder
                </MDBBtn>
                <div
                  className="d-flex flex-column align-items-start"
                  style={{ gap: 6 }}
                >
                  <a
                    className="small text-muted"
                    href="#!"
                    style={{ fontWeight: "bold" }}
                  >
                    ¿Has olvidado tu contraseña?
                  </a>
                  <p
                    className="mb-5 pb-lg-2"
                    style={{ color: "#AA5D65", fontWeight: "bold" }}
                  >
                    ¿No tienes cuenta?{" "}
                    <Link to="/altausuario" style={{ color: "#AA5D65" }}>
                      Registrate Aquí
                    </Link>
                  </p>
                </div>

                <div className="d-flex flex-row justify-content-start">
                  <a href="#!" className="small text-muted me-1">
                    Terms of use.
                  </a>
                  <a href="#!" className="small text-muted">
                    Privacy policy
                  </a>
                </div>
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
              </form>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
}
export default Login;
