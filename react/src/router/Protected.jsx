import { useUser } from "../contexts/UserContext";
import Login from "../pages/Login";


// eslint-disable-next-line react/prop-types
export default function Protected({children}) {
    const {profile} = useUser();
    if (profile._id) {
        return children
    }
    else {
        return <Login />
    }
  }