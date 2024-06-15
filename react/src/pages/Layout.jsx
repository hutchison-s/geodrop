import { Outlet } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import '../styles/layout.css'
import AppFooter from "../components/AppFooter";
import { useState } from "react";
import OptionsMenu from "../components/OptionsMenu";

export default function Layout() {

    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = ()=>{
        setIsMenuOpen(o => !o);
    }

    return (
        <>
            <AppHeader toggleMenu={toggleMenu} visible={isMenuOpen}/>
            <OptionsMenu visible={isMenuOpen} close={toggleMenu}/>
            <section className="appView">
                <div className="contentWrap">
                    <Outlet />
                </div>
            </section>
            <AppFooter />
        </>
    )
}