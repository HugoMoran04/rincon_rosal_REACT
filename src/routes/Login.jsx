import { useState, useEffect } from "react";
import fondo from "../assets/images/fondoModal2.jpg";
import "./Login.css";

// Minimal Login component that shows a modal-like box on page load.
function Login() {
  const [isOpen, setIsOpen] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setIsOpen(true);
    const t = setTimeout(() => setFadeIn(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleClose = (e) => {
    e?.preventDefault();
    setFadeIn(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  if (!isOpen) return null;

  return (
    <div className={"overlay" + (fadeIn ? " visible" : "")}>
      <div className={"modal-content" + (fadeIn ? " visible" : "")}>
        <div className="modal-bg">
          <img src={fondo} alt="fondo" />
        </div>
        <div className="form">
          <h2>LOGIN</h2>
          <form>
            <input className="login-input" type="text" placeholder="USUARIO" />
            <input className="login-input" type="password" placeholder="CONTRASEÑA" />
            <button className="btn primary" type="submit">
              <b>ENTRAR</b>
            </button>
            <button className="btn close" onClick={handleClose}>
              <b>CERRAR</b>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;