import Navbar from "../components/Navbar";
import Menu from "../components/Menu";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Navbar />
     {/*<Menu />*/ } 
      <div style={{ paddingTop: "20px" }}>
        <Outlet />
      </div>
    </>
  );
}
