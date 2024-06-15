import { createContext, useContext, useState } from "react";
import PropTypes from 'prop-types'
import { browserLocalPersistence, setPersistence, signOut } from "firebase/auth";
import { auth } from "../config/firebase";

const initialUser = {
    username: null,
    email: null,
    _id: null
}

export const UserContext = createContext(initialUser);

export function UserProvider({children}) {

    const [profile, setProfile] = useState(initialUser);

    const logout = async()=>{
        await signOut(auth)
        // eslint-disable-next-line no-unused-vars
        setProfile(p => initialUser);
    }

    const login = (account)=>{
        // eslint-disable-next-line no-unused-vars
        setProfile(p => account);
        setPersistence(auth, browserLocalPersistence)
    }

    return (
        <UserContext.Provider value={{profile, logout, login}}>
            {children}
        </UserContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = ()=>useContext(UserContext);

UserProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element)
    ]).isRequired
}