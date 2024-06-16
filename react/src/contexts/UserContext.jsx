import { createContext, useContext, useState } from "react";
import PropTypes from 'prop-types'
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { useEffect } from "react";
import axios from 'axios'

const initialUser = {
    username: null,
    email: null,
    _id: null
}

export const UserContext = createContext(initialUser);

export function UserProvider({children}) {

    const [profile, setProfile] = useState(initialUser);

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, async (user)=> {
            if (user) {
                console.log('Success!', user);
    
                // Get app profile info for Google user
                const confirmResponse = await axios.post(`http://localhost:5000/confirm`, { uid: user.uid, email: user.email });
                
                if (confirmResponse.status === 200) {
                    // Log in with user profile
                    login(confirmResponse.data);
                } else {
                    throw new Error("Failed to confirm user.");
                }
            } else {
                console.log("no user signed in");
            }
        })

        return () => unsubscribe();
    }, [auth])

    const logout = async()=>{
        await signOut(auth)
        // eslint-disable-next-line no-unused-vars
        setProfile(p => initialUser);
    }

    const login = (account)=>{
        // eslint-disable-next-line no-unused-vars
        setProfile(p => account);
        
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