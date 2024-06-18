import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types'
import axios from "axios";
import { apiBaseURL, serverBaseURL } from "../apiSwitch";

export const DropContext = createContext([]);

export function DropContextProvider({children}) {
    const [drops, setDrops] = useState([]);

    const getDrops = ()=>{
        axios.get(`${apiBaseURL}/drops`)
            .then(res => {
                if (res.status === 200) {
                    console.log(`obtaining ${res.data.length} drops`);
                    setDrops(res.data)
                }
            })
            .catch(err => console.log(err))
    }

    useEffect(()=>{
        getDrops()

        const sseSource = new EventSource(`${serverBaseURL}/events`);
        
        sseSource.onerror = (err) => console.log(err)

        sseSource.addEventListener('updateDrop', (event)=>{
            console.log('updateDrop event received');
            const updatedDrop = JSON.parse(event.data);
            setDrops(oldDrops => {
                return oldDrops.map(p => p._id === updatedDrop._id ? {...p, ...updatedDrop} : p)
            })
        })

        sseSource.addEventListener('newDrop', (event)=>{
            console.log('newDrop event received');
            const newDrop = JSON.parse(event.data);
            setDrops(oldDrops => {
                return [...oldDrops, newDrop]
            })
        })

        sseSource.addEventListener('deleteDrop', (event)=>{
            console.log('deleteDrop event received');
            const dropToDelete = JSON.parse(event.data);
            setDrops(oldDrops => {
                return oldDrops.filter(p => p._id !== dropToDelete._id)
            })
        })

        return ()=>{
            sseSource.close();
        }
    }, [])

    return (
        <DropContext.Provider value={{drops, setDrops}}>
            {children}
        </DropContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDrops = ()=>useContext(DropContext);

DropContextProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element)
    ]).isRequired
}