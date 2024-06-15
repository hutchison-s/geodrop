import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../contexts/UserContext"
import { useEffect, useState } from "react";
import axios from 'axios'
import '../styles/profile.css'

export default function Profile() {
    const {profile, logout} = useUser();
    const {id} = useParams();
    const [viewing, setViewing] = useState(profile);
    const navigate = useNavigate();

    const getProfile = async () => {
        const other = axios.get(`http://localhost:5000/users/${id}`);
        if (other) {
            setViewing(other);
        } else {
            navigate('/404');
        }
    }

    useEffect(()=>{
        console.log(id);
        if (id) {
            getProfile();
        }
    }, [])

    return (
        <section id="profileFrame" className="flex vertical center gapM">
            <h2>Hello {viewing.displayName}</h2>
            <img src={viewing.photo} alt={`Photo of ${viewing.displayName}`} className="circle shadowL"/>
            <p>{viewing.email}</p>
            <button onClick={logout} className="shadowS bgNone padM rounded borderThin">Log out</button>
        </section>
    )
}