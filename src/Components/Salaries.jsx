import React, { useEffect, useState } from "react";
import {firestore} from "../firebase"

function Salaries() {

    const [Employee, setEmployee] = useState([]);
    const [currentId, setCurrentId] = useState("");

    //Variables que contendran la cantidad menor y mayor de horas trabajadas,
    //para identificar a los empleados peor y mejor pagados
    const [minHour, setMinHour] = useState(Number.MAX_SAFE_INTEGER);
    const [maxHour, setMaxHour] = useState(Number.MIN_SAFE_INTEGER);
    const [hoursSet, setHoursSet] = useState(false);

  
    const getEmployees = async () => {
        await firestore.collection("Empleados").orderBy("id_emp", "asc").onSnapshot((querySnapshot) => {
            const docs = [];
            querySnapshot.forEach((doc) => {
              docs.push({ ...doc.data(), id: doc.id });

              if (!hoursSet) {
                //Actualizando horas menores y mayores
                if (doc.data().Horas < minHour) {
                    setMinHour(doc.data().Horas);
                }
                if (doc.data().Horas > maxHour) {
                    setMaxHour(doc.data().Horas);
                }
              }
            });
            setEmployee(docs);
            setHoursSet(true);
          });
    };

    useEffect(() => { getEmployees();});
  
    var salary, isss, afp, renta;
    const calcBase = (hours) => {
        if (hours <= 160) {
            salary = hours * 9.75;
        }
        else if (hours > 160 && hours <= 200) {
            let remHours = hours - 160;
            salary = (160 * 9.75) + (remHours * 11.50);
        }
        else if (hours > 200 && hours <= 250) {
            let remHours = hours - 200;
            salary = (160 * 9.75) + (40 * 11.50) + (remHours * 12.50);
        }
        return salary;
    }

    const calcIsss = () => {
        isss = salary * 0.0525;
        return isss;
    }
    
    const calcAfp = () => {
        afp = salary * 0.0688;
        return afp;
    }

    const calcRenta = () => {
        renta = salary * 0.1;
        return renta;
    }

    const calcNet = () => {
        return salary - isss - afp - renta;
    }

    function Extremes(props) { 
        if (props.hours == minHour) {
            return <h1 className="border px-4 py-2 bg-red-600 text-white text-3xl">POSEE EL MENOR SUELDO</h1>
        }
        else if (props.hours == maxHour) {
            return <h1 className="border px-4 py-2 bg-green-600 text-white text-3xl">POSEE EL MAYOR SUELDO</h1>
        }
        else {
            return null;
        }
    }


  return (
  <div className="container py-2 w-1/2">
        <h2 className="text-6xl text-center py-4">Sueldos de Empleados</h2>
        {Employee.map((emp) => (
        <div className="bg-white rounded-lg m-6 border border-gray-500 text-center" key={emp.id}>
            <h2 className="text-3xl bg-blue-600 p-6 text-white">Código de empleado: {emp.id_emp}</h2>
            <div className="text-6xl">Nombre de empleado:<br/> <span className="text-purple-600">{emp.Nombre}</span></div>
            <br/>
            <div className="text-5xl">Horas trabajadas: {emp.Horas}</div>
            <Extremes hours={emp.Horas}/>
            <div className="flex m-16 border rounded-lg px-4 py-2 bg-gray-300">
                <div className="w-1/2">
                    <div className="text-4xl text-left border-b border-gray-600">Sueldo base:</div>
                    <div className="text-4xl text-left border-b border-gray-600">ISSS:</div>
                    <div className="text-4xl text-left border-b border-gray-600">AFP: </div>
                    <div className="text-4xl text-left border-b border-gray-600">RENTA:</div>
                    <div className="text-5xl text-left">Sueldo neto:</div>
                </div>
                <div className="w-1/2">
                    <div className="text-4xl text-right border-b border-gray-600">${calcBase(emp.Horas).toFixed(2)}</div>
                    <div className="text-4xl text-red-600 text-right border-b border-gray-600">${calcIsss().toFixed(2)}</div>
                    <div className="text-4xl text-red-600 text-right border-b border-gray-600">${calcAfp().toFixed(2)}</div>
                    <div className="text-4xl text-red-600 text-right border-b border-gray-600">${calcRenta().toFixed(2)}</div>
                    <div className="text-5xl text-green-600 text-right">${calcNet().toFixed(2)}</div>
                </div>
            </div>
        </div>
        ))}
    </div>
  );
}

export default Salaries;