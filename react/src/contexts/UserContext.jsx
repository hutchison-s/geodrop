import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { useEffect } from "react";
import axios from "axios";
import { apiBaseURL, serverBaseURL } from "../apiSwitch";

const initialUser = {
  username: null,
  email: null,
  _id: null,
};

export const UserContext = createContext(initialUser);

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(initialUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("Success!", user);

        // Get app profile info for Google user
        axios
          .post(`${apiBaseURL}/confirm`, {
            uid: user.uid,
            email: user.email,
          })
          .then((res) => {
            if (res.status === 200) {
              // Log in with user profile
              axios.patch(`${apiBaseURL}/users/${res.data._id}`, {newLogin: true})
                .then(res => {
                  login(res.data);
                })
            } else {
              throw new Error("Failed to confirm user.");
            }
          })
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              const { email, displayName, photoURL, uid } = user;

              // Create a new profile for Google user
              axios
                .post(`${apiBaseURL}/users`, {
                  uid,
                  email,
                  displayName,
                  photo: photoURL,
                })
                .then((res) => {
                  if (res.status === 201) {
                    // Log in with newly created profile
                    login(res.data);
                  } else {
                    console.log("Could not create new user.");
                  }
                })
                .catch((createError) => {
                  console.log("Could not create new user.", createError);
                });
            } else {
              console.log("An unexpected error occurred.", error);
            }
          });
      } else {
        console.log("no user signed in");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // Ping Render server every minute to keep it from spinning down. Clear on unmount
  useEffect(()=>{

    const pinger = setInterval( ()=>{
        axios.get(`${serverBaseURL}/ping`)
          .then(res => console.log(res.data))
          .catch(err => console.log(err.message))
    }, 60000)

    return ()=>{
      clearInterval(pinger)
    }
  })

  const logout = async () => {
    await signOut(auth);
    // eslint-disable-next-line no-unused-vars
    setProfile((p) => initialUser);
  };

  const login = (account) => {
    // eslint-disable-next-line no-unused-vars
    setProfile((p) => account);
  };

  return (
    <UserContext.Provider value={{ setProfile, profile, logout, login }}>
      {children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(UserContext);

UserProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};
