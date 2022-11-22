import React, {useContext} from "react";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";

export default function MainPage (){
    const {request, error} = useHttp();
    const context = useContext(AuthContext);


    const formSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const bodyRequest = {};

        for (const [key, value] of formData.entries()){
            bodyRequest[key] = value;
        }

        let data = await request('/api/login', 'POST', bodyRequest);
        if (data && !error){
            context.login(data);
        }
    }

    return(
        <div className="container">
            <div className="col s12 m7">
                <h2 className="header">Вход</h2>
                <div className="card horizontal">
                    <div className="card-stacked">
                        <div className="card-content">
                            <form id="login_form" onSubmit={formSubmit}>
                                <div className="input-field col s6">
                                    <input id="login" type="text" className="validate" name="login" required/>
                                        <label htmlFor="login">Логин</label>
                                </div>
                                <div className="input-field col s6">
                                    <input id="password" type="password" className="validate" name="password" required/>
                                        <label htmlFor="password">Пароль</label>
                                </div>
                            </form>
                        </div>
                        <div className="card-action">
                            <button form='login_form' className="btn">Войти</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}