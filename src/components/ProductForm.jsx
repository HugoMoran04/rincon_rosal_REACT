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
import { apiUrl } from "../config";
import useUserStore from "../stores/useUserStore";
import { Category } from "@mui/icons-material";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

function ProductForm() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const location = useLocation();
  const productToEdit = location.state?.producto;
  const { id_producto } = useParams();
  const esEdicion = !!id_producto;

  console.log("Usuario en ProductForm:", user);

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    color: "",
    medidas: "",
    precio: "",
    stock: "",
    id_categoria: "",
    anotaciones: "",
    imagen: "",
  });

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "success", // success | error | warning | info
  });

  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    // Fetch categories from the API
    fetch(`${apiUrl}/categorias`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCategorias(data.datos); // Assuming the API returns categories in data.datos
      })
      .catch((error) => {
        console.error("Error al obtener las categorías:", error);
      });
  }, []);

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
      color: "",
      medidas: "",
      precio: "",
      stock: "",
      id_categoria: "",
      anotaciones: "",
      imagen: "",
    });
  };

  // 🔹 Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productoId = productToEdit?.id_producto || id_producto;
      const method = esEdicion ? "PUT" : "POST";
      const bodyData = esEdicion
        ? { ...formData, id_producto: productoId }
        : formData;
      const url = esEdicion
        ? `${apiUrl}/productos/${productoId}`
        : `${apiUrl}/productos`;

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
            ? "Producto actualizado correctamente"
            : "Producto agregado correctamente",
          severity: "success",
        });
        setTimeout(() => {
          navigate("/productsList");
        }, 1500);
      } else {
        setAlert({
          show: true,
          message: data.mensaje || "Error al agregar el producto",
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
      fetch(`${apiUrl}/productos/${id_producto}`, {
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
            color: data.datos.color || "",
            medidas: data.datos.medidas || "",
            precio: data.datos.precio || "",
            stock: data.datos.stock || "",
            id_categoria: String(data.datos.id_categoria) || "",
            anotaciones: data.datos.anotaciones || "",
            imagen: data.datos.imagen || "",
          });
        })
        .catch((error) => {
          console.error("Error al obtener el producto:", error);
        });
    }
  }, [id_producto, esEdicion]);

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
                   style={{ height: "100%", objectFit: "cover" }}
                />
              </MDBCol>

              <MDBCol md="6">
                <MDBCardBody className="text-black d-flex flex-column justify-content-center">
                  <h3 className="mb-5 text-uppercase fw-bold">
                    {esEdicion ? "Editar Producto" : "Nuevo Producto"}
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
                      label="Color"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      required
                    />
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Medidas"
                      name="medidas"
                      value={formData.medidas}
                      onChange={handleChange}
                      required
                    />
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Precio"
                      name="precio"
                      value={formData.precio}
                      onChange={handleChange}
                      required
                    />
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                    />
                    <div className="mb-4">
                      <select
                        className="form-select"
                        name="id_categoria"
                        value={formData.id_categoria}
                        onChange={handleChange}
                        required
                      >
                        {!esEdicion && <option value="">Categoria</option>}

                        {categorias.map((cat) => (
                          <option
                            key={cat.id_categoria}
                            value={cat.id_categoria}
                          >
                            {cat.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Anotaciones"
                      name="anotaciones"
                      value={formData.anotaciones}
                      onChange={handleChange}
                      required
                    />
                    <MDBInput
                      wrapperClass="mb-4"
                      label="URL Imagen"
                      name="imagen"
                      value={formData.imagen}
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

export default ProductForm;
