
import { Outlet } from "react-router-dom";      
import Menu from "../components/Menu";
import Navbar from "../components/Navbar";
import { FavoritesProvider } from "../context/FavoritesContext.jsx";

function Home() {

    return(
        <>
           {/*<Navbar />
            
           <Menu />
            
            <Outlet />*/ } 
            <Menu /> 
            
        </>
    );
}

export default Home;