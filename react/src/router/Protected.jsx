import { Outlet } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import Login from "../pages/Login";


// eslint-disable-next-line react/prop-types
export default function Protected() {
    const {profile} = useUser();

    return profile._id ? <Outlet/> : <Login/>

  }