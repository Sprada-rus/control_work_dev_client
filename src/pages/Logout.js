import React, {useContext, useEffect} from "react";
import {AuthContext} from "../context/AuthContext";
import {useNavigate} from "react-router-dom"

export default function Logout(){
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    useEffect(() => {
        auth.logout();
        navigate('/')
    })

    return <></>
}
