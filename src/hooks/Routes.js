import React from "react";
import {Routes, Route, Navigate, NavLink, Outlet} from "react-router-dom";
import ResearchPage from "../pages/ResearchPage";
import Logout from "../pages/Logout";
import SettingsPage from "../pages/SettingsPage";
import MainPage from "../pages/MainPage";


export const useRoutes = (isAuth, type) => {
    if (isAuth){
        if (type === 'researcher'){
            return (
                <Routes>
                    <Route path="/research" element={<ResearchPage/>} exact/>
                    <Route path="/logout" element={<Logout/>} exact/>
                    <Route path="*" element={<Navigate to="/research" replace/>}/>
                </Routes>
            )
        }

        if (type === 'admin'){
            return (
                <Routes>
                    <Route path="/research" element={<ResearchPage/>} exact/>
                    <Route path="/settings" element={<SettingsPage/>} exact/>
                    <Route path="/logout" element={<Logout/>} exact/>
                    <Route path="*" element={<Navigate to="/research" replace/>}/>
                </Routes>
            )
        }
    }

    return (
        <Routes>
            <Route path="/"  element={<MainPage/>} exact/>
            <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
    )
}

export const useNavRoutes = (isAuth, type) => {
    if (isAuth && type){
        let data = {}
        if (type === 'researcher'){
            data = {
                main: {
                    link: '/researcher',
                    name: 'Исследование',
                    num: 10
                }
            }
        }

        if (type === 'admin'){
            data = {
                main: {
                    link: '/researcher',
                    name: 'Иследование',
                    num: 10
                },
                curs_project: {
                    link: '/settings',
                    name: 'Настройки исследований',
                    num: 20
                },
            }
        }

        return (
            <div id="navigation">
                <nav>
                  <ul>
                    {Object.values(data).map(item => {
                        return (
                            <li key={item.num}>
                              <NavLink
                                  className={({isActive}) => isActive ? "active nav" : "nav"}
                                  to={item.link}
                              >
                                  {item.name}
                              </NavLink>
                            </li>
                        )})}
                    <li>
                      <NavLink
                          to="/logout"
                          className={({isActive}) => isActive ? "active" : "nav"}
                          key={100}
                      > Выйти из ЛК</NavLink>
                    </li>
                  </ul>
                </nav>
                <Outlet />
            </div>
        );
    }


}