import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types'
import axios from "axios";

export const PinContext = createContext([]);

export function PinContextProvider({children}) {
    const [pins, setPins] = useState([]);

    const getPins = ()=>{
        axios.get('http://localhost:5000/pins')
            .then(res => {
                if (res.status === 200) {
                    setPins(res.data)
                }
            })
            .catch(err => console.log(err))
    }

    useEffect(()=>{
        getPins()
    }, [])

    return (
        <PinContext.Provider value={{pins, setPins}}>
            {children}
        </PinContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePins = ()=>useContext(PinContext);

PinContextProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element)
    ]).isRequired
}