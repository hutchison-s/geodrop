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
                    console.log(`obtaining ${res.data.length} pins`);
                    setPins(res.data)
                }
            })
            .catch(err => console.log(err))
    }

    useEffect(()=>{
        getPins()

        const sseSource = new EventSource('http://localhost:8000/events');
        
        sseSource.onerror = (err) => console.log(err)

        sseSource.addEventListener('updatePin', (event)=>{
            console.log('updatePin event received');
            const updatedPin = JSON.parse(event.data);
            setPins(oldPins => {
                return oldPins.map(p => p._id === updatedPin._id ? {...p, ...updatedPin} : p)
            })
        })

        sseSource.addEventListener('newPin', (event)=>{
            console.log('newPin event received');
            const newPin = JSON.parse(event.data);
            setPins(oldPins => {
                return [...oldPins, newPin]
            })
        })

        sseSource.addEventListener('deletePin', (event)=>{
            console.log('deletePin event received');
            const pinToDelete = JSON.parse(event.data);
            setPins(oldPins => {
                return oldPins.filter(p => p._id !== pinToDelete._id)
            })
        })

        return ()=>{
            sseSource.close();
        }
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