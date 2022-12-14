import React, {useEffect, useRef, useState} from "react";
import AnyChart from "anychart-react";
import anyChart from "anychart";
import {useHttp} from "../hooks/http.hook";
import * as XLSX from "xlsx";

export default function ResearchPage(){
    const {request, loading, error, clearError} = useHttp();
    const [materialValue, setMaterialValue] = useState({});
    const [options, setOptions] = useState([]);
    const [activeMathValue, setActiveMathValue] = useState({});
    const [chart, setChart] = useState(null);
    const [table, setTable] = useState({});
    const tableRef = useRef(null);

    useEffect(() => {
      clearError();
    }, [error, clearError])

    useEffect(() => {
      request('/api/get_options', 'POST', {}).then(data => {
          if (data && Object.values(data).length > 0 && !error){
            const tmpOptions = [];
            const tmpMaterialValues = {};

            for (let [id, materialValue] of Object.entries(data)){
              tmpOptions.push([id, materialValue.name]);
              tmpMaterialValues[id] = materialValue['math_value'];
            }

            setMaterialValue(tmpMaterialValues);
            setOptions(tmpOptions);
          }
      })
      // eslint-disable-next-line
    }, []);


    const changeOptions = (e) => {
      const value = e.target.value;
      if (value){
        setActiveMathValue(materialValue[value]);

      } else {
        setActiveMathValue({});
      }
    }

    const researchData = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const maxTime = parseInt(formData.get('max_time'));
      const minTime = parseInt(formData.get('min_time'));
      const stepTime = parseInt(formData.get('step_time'));
      const maxTemp = parseInt(formData.get('max_temp'));
      const minTemp = parseInt(formData.get('min_temp'));
      const stepTemp = parseInt(formData.get('step_temp'));
      const b0 = parseFloat(activeMathValue['b0']), b1 = parseFloat(activeMathValue['b1']), b2 = parseFloat(activeMathValue['b2']), b3 = parseFloat(activeMathValue['b3']),
        b4 = parseFloat(activeMathValue['b4']), b5 = parseFloat(activeMathValue['b5']), b6 = parseFloat(activeMathValue['b6']), b7 = parseFloat(activeMathValue['b7']), b8 = parseFloat(activeMathValue['b8']);
      const chartData = [];
      const tableData = {}

      for (let currentTime = minTime; currentTime <= maxTime; currentTime += stepTime){
        let row = []
        for (let currentTemp = minTemp; currentTemp <= maxTemp; currentTemp += stepTemp){
          const hr = b0 + (b1 * currentTime)
            + (b2 * currentTemp) + (b3 * currentTime * currentTemp)
            + (b4 * Math.pow(currentTime, 2)) + (b5 * Math.pow(currentTemp, 2))
            + (b6 * Math.pow(currentTime, 2) * currentTemp) + (b7 * currentTime * Math.pow(currentTemp, 2))
            + (b8 * Math.pow(currentTime, 2) * Math.pow(currentTemp, 2));

          if (currentTemp === minTemp || currentTemp === ((maxTemp - minTemp) / 2 + minTemp) || currentTemp === maxTemp) {
            row.push(hr.toFixed(2));
          }
          tableData[currentTemp] = {...tableData[currentTemp], [currentTime]: hr};
        }

        chartData.push([currentTime, ...row]);
      }

      setTable(tableData);

      const dataSet = anyChart.data.set(chartData);
      const firstLineData = dataSet.mapAs({x: 0, value: 1});
      const secondLineData = dataSet.mapAs({x: 0, value: 2});
      const thirdLineData = dataSet.mapAs({x: 0, value: 3});

      const typeChart = anyChart.line();
      typeChart.animation(true);
      typeChart.yAxis().title('?????????????????? ???????????? (????.)');
      typeChart.xAxis().title('?????????? ???????????????????????????? ???????????????? ?????? ???????????????? (??????.)');

      typeChart.crosshair().enabled(true).yLabel(false).yStroke(null);

      const firstSeries = typeChart.line(firstLineData);
      firstSeries
        .name('?????????????????? ?????????????? ?????? ?????????????????????? ??????????????????????')
        .stroke('3 #f49595')
        .tooltip()
        .format('?????? ?????????????????????? ??????????????????????: {%value}????.');

      const secondSeries = typeChart.line(secondLineData);
      secondSeries
        .name('?????????????????? ?????????????? ?????? ?????????????? ??????????????????????')
        .stroke('3 #f9eb97')
        .tooltip()
        .format('?????? ?????????????? ??????????????????????: {%value}????.');

      const thirdSeries = typeChart.line(thirdLineData);
      thirdSeries
        .name('?????????????????? ?????????????? ?????? ???????????????????????? ??????????????????????')
        .stroke('3 #a8d9f6')
        .tooltip()
        .format('?????? ???????????????????????? ??????????????????????: {%value}????.');

      typeChart.legend().enabled(true);

      setChart(typeChart);
    }

    const downloadExcel = () =>{
      if (Object.values(table).length > 0){
          const nodeTable = tableRef.current;
          const workbook = XLSX.utils.table_to_book(nodeTable);
          XLSX.writeFile(workbook, 'Report.xlsb');
      }
    }


    return (

        <div className="container" style={{}}>
          {loading && <div style={{display:'flex', alignItems:"center", justifyContent:"center", height:"100vh"}}><p>????????????????...</p></div>}
          {!loading &&
            <>
              <h3>??????????????????????</h3>
              <div className="container" style={{display:'flex', width:'100%', maxHeight: "550px", justifyContent:"space-between", marginBottom:"2em"}}>
                <div style={{width: '35%'}}>
                  <form id="form_data" onSubmit={researchData}>
                    <div className="input-field col s6">
                      <select id="material" className="validate" name="material" required style={{display:"block"}} defaultValue={""} onChange={changeOptions}>
                        <option value="">????????????????</option>
                        {
                          options?.map(row => {
                            const [id, name] = row;
                            return <option key={id} value={id}>{name}</option>
                          })
                        }
                      </select>
                    </div>
                    <div className="input-field col s6">
                      <input id="min_time" type="number" className="validate" name="min_time" required defaultValue={50}/>
                      <label className="active" htmlFor="min_time">?????????????????????? ?????????? ???????????????????????????? ???????????????? (??????)</label>
                    </div>
                    <div className="input-field col s6">
                      <input id="max_time" type="number" className="validate" name="max_time" required defaultValue={70}/>
                      <label className="active" htmlFor="max_time">???????????????????????? ?????????? ???????????????????????????? ???????????????? (??????)</label>
                    </div>
                    <div className="input-field col s6">
                      <input id="step_time" type="number" className="validate" name="step_time" required defaultValue={1}/>
                      <label className="active" htmlFor="step_time">?????? ?????????? ???????????????????????????? ???????????????? (??????)</label>
                    </div>
                    <div className="input-field col s6">
                      <input id="min_temp" type="number" className="validate" name="min_temp" required defaultValue={1200}/>
                      <label className="active" htmlFor="min_temp">?????????????????????? ?????????????????????? ???????????????? (<sup>0</sup>??)</label>
                    </div>
                    <div className="input-field col s6">
                      <input id="max_temp" type="number" className="validate" name="max_temp" required defaultValue={1400}/>
                      <label className="active" htmlFor="max_temp">???????????????????????? ?????????????????????? ???????????????? (<sup>0</sup>??)</label>
                    </div>
                    <div className="input-field col s6">
                      <input id="step_temp" type="number" className="validate" name="step_temp" required defaultValue={10}/>
                      <label className="active" htmlFor="step_temp">?????? ?????????????????????? ???????????????? (<sup>0</sup>??)</label>
                    </div>
                  </form>
                  <div style={{display:"flex", justifyContent:'space-between'}}>
                    <button className="btn" form="form_data">??????????????????</button>
                    <button className="btn" disabled={Object.values(table).length <= 0} onClick={downloadExcel}>??????????</button>
                  </div>
                </div>
                <div style={{width:"60%", maxHeight:"100%", overflow:"scroll"}} id="table_result">
                  <table style={{width:"100%"}} ref={tableRef}>
                    <thead>
                      <tr>
                        <th> </th>
                        {Object.values(table).length > 0 && Object.keys(Object.values(table)[0]).map((value, index) => {
                          return <th key={index}>r{value}</th>
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(table).length > 0 && Object.entries(table).map((row, index) => {
                        const [temp, value] = row;
                        return (
                          <tr key={index}>
                            <td>T{temp}</td>
                            {Object.values(value).map((timeValue, index) => {
                              return <td key={index}>{timeValue.toFixed(2)}</td>
                            })
                            }
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <AnyChart  height={600} title=""
                           instance={chart}
                />
              </div>
            </>
          }
        </div>

    )
}