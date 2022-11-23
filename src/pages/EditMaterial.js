import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useHttp} from "../hooks/http.hook";

export default function EditMaterial(){
  const {materialId} = useParams();
  const {request, loading} = useHttp();
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    request('/api/get_material', 'POST', {materialId})
      .then(data => {
        console.log(data);
        setFormData(data);
      });
  }, []);

  const backHandler = () => {
    navigate('/settings');
  }

  const saveHandler = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const reqBody = {};


    reqBody['material_id'] = materialId;
    for (let [key, value] of data){
      console.log(key, value);
      reqBody[key] = value;
    }

    request('/api/save_change', 'POST', reqBody).finally(() => {
      navigate('/settings');
    })

  }

  return <div className="container">
    <h3>Изменение значений</h3>
    {loading && <div style={{display:'flex', alignItems:"center", justifyContent:"center", height:"100vh"}}><p>Загрузка...</p></div>}
    {Object.values(formData).length > 0 && !loading && <form id="edit_material" className="container" onSubmit={saveHandler}>
      <div className="input-field col s6">
        <input id="name_material" type="text" className="validate" name="name_material" disabled
               defaultValue={formData.name ?? ''}/>
        <label className="active" htmlFor="name_material">Наименование материала</label>
      </div>
      <div className="input-field col s6">
        <input id="b0" type="text" className="validate" name="b0"
               defaultValue={formData['math_value']['b0'] ?? ''}/>
        <label className="active" htmlFor="b0">b<sup>0</sup></label>
      </div>
      <div className="input-field col s6">
        <input id="b1" type="text" className="validate" name="b1"
               defaultValue={formData['math_value']['b1'] ?? ''}/>
        <label className="active" htmlFor="b1">b<sup>1</sup></label>
      </div>
      <div className="input-field col s6">
        <input id="b2" type="text" className="validate" name="b2"
               defaultValue={formData['math_value']['b2'] ?? ''}/>
        <label className="active" htmlFor="b2">b<sup>2</sup></label>
      </div>
      <div className="input-field col s6">
        <input id="b3" type="text" className="validate" name="b3"
               defaultValue={formData['math_value']['b3'] ?? ''}/>
        <label className="active" htmlFor="b3">b<sup>3</sup></label>
      </div>
      <div className="input-field col s6">
        <input id="b4" type="text" className="validate" name="b4"
               defaultValue={formData['math_value']['b4'] ?? ''}/>
        <label className="active" htmlFor="b4">b<sup>4</sup></label>
      </div>
      <div className="input-field col s6">
        <input id="b5" type="text" className="validate" name="b5"
               defaultValue={formData['math_value']['b5'] ?? ''}/>
        <label className="active" htmlFor="b5">b<sup>5</sup></label>
      </div>
      <div className="input-field col s6">
        <input id="b6" type="text" className="validate" name="b6"
               defaultValue={formData['math_value']['b6'] ?? ''}/>
        <label className="active" htmlFor="b6">b<sup>6</sup></label>
      </div>
      <div className="input-field col s6">
        <input id="b7" type="text" className="validate" name="b7"
               defaultValue={formData['math_value']['b7'] ?? ''}/>
        <label className="active" htmlFor="b7">b<sup>7</sup></label>
      </div>
      <div className="input-field col s6">
        <input id="b8" type="text" className="validate" name="b8"
               defaultValue={formData['math_value']['b8'] ?? ''}/>
        <label className="active" htmlFor="b8">b<sup>8</sup></label>
      </div>
    </form>
    }
    <div style={{display:"flex", justifyContent:"space-between"}}>
      <button onClick={backHandler}>Отмена</button>
      <button form="edit_material">Сохранить</button>
    </div>
  </div>
}