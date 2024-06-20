import { createContext, useContext, useState } from "react";
import PropTypes from 'prop-types';

export const LightContext = createContext('light');

export function LightContextProvider({children}) {

    const [mode, setMode] = useState('light');

    const switchMode = ()=>{
        setMode(m => m === 'light' ? 'dark' : 'light')
    }

    const isDark = mode === 'dark'

    return (
        <>
            <LightContext.Provider value={{mode, isDark, switchMode}}>
                {children}
            </LightContext.Provider>
        </>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMode = ()=>useContext(LightContext);

LightContextProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element)
    ]).isRequired
}