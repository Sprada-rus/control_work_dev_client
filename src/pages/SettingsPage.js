import React, {useEffect, useState} from "react";
import {useHttp} from "../hooks/http.hook";
import {useNavigate} from "react-router-dom";

export default function SettingsPage(){
    const {request} = useHttp();
    const [grid, setGrid] = useState({});
    const navigate = useNavigate();

    const settings = {
        'name_material': {
            title: 'Наименование материала',
            order: 10
        },
        'b0': {
            title: 'b0',
            order: 20
        },
        'b1': {
            title: 'b1',
            order: 30
        },
        'b2': {
            title: 'b2',
            order: 40
        },
        'b3': {
            title: 'b3',
            order: 50
        },
        'b4': {
            title: 'b4',
            order: 60
        },
        'b5': {
            title: 'b5',
            order: 70
        },
        'b6': {
            title: 'b6',
            order: 80
        },
        'b7': {
            title: 'b7',
            order: 90
        },
        'b8': {
            title: 'b8',
            order: 100
        },
        'btn_action': {
            title: 'Измнеить данные',
            order: 110
        }
    }

    const editHandler = (e) => {
        const {target} = e;
        console.log(target.id)
        navigate(`/edit_material/${target.id}`);
    }

    useEffect(() => {
            request('/api/get_table', 'POST', {})
              .then(data => {
                setGrid(data);
              });
    }, []);



    return (
        <div className="container">
            <h3>Настройка расчетов</h3>
            <div style={{width:"100%", maxHeight:"100%", overflow:"scroll"}}>
            <table>
                <thead>
                    <tr>
                        {Object.entries(settings)
                          .sort((row, nexRow) => {
                              const [name, value] = row;
                              const [nextName, nextValue] = row;
                              return value.order - nextValue.order;
                          })
                          .map((row, index) => {
                              const [name, value] = row;
                              return <th key={name+index}>{value.title}</th>
                          })}
                    </tr>
                </thead>
                <tbody>
                    {Object.values(grid).length > 0 && Object.entries(grid).map((row, index) => {
                        const [id, materialValue] = row;
                        return <tr key={id}>
                            <td>{materialValue.name}</td>

                                {Object.entries(materialValue['math_value']).map(row => {
                                   return <td key={row[0]}>
                                       {row[1]}
                                   </td>
                                })}
                            <td><button id={id} onClick={editHandler} className="btn">Изменить</button></td>
                        </tr>
                    })}
                </tbody>
            </table>
            </div>
        </div>
    )
}