import React, { useEffect, useState } from "react";
import {firestore} from "../firebase"
import Swal from "sweetalert2"

function Employees() {
  const Toast = Swal.mixin({
    customClass: {
      title: "text-gray-200"
    },
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

    const [Employee, setEmployee] = useState([]);
    const [currentId, setCurrentId] = useState("");
  
    const initialStateValues = {
      id_emp: 0,
      Nombre: "",
      Horas: 0
    };
    const [values, setValues] = useState(initialStateValues);
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setValues({ ...values, [name]: value });
    };
    let regex = new RegExp("^[a-zA-ZáéíóúÁÉÍÓÚ ]+$");
    const emptyspaces = (values)=>{
      var n;
      for (n in values) {
        if (n==="Nombre") {
          if (values[n].trim()==="" || !regex.test(values[n])) {
            Swal.fire("El nombre deben ser letras y no quedar en blanco", "Operación Fallida", "error");
            return true;
          }
        }
        else if (n==="Horas") {
          var numero = parseFloat(values[n]);
          console.log(numero);
          if (!Number.isInteger(numero) || numero<0) {
            Swal.fire("El numero debe ser entero y mayor a 0", "Operación Fallida", "error");
            return true;
          }
        }
      }
      return false
    }
    const getEmployeeById = async (id) => {
        const doc = await firestore.collection("Empleados").doc(id).get();
        setValues({ ...doc.data() });
    };
    const getEmployees = async () => {
        await firestore.collection("Empleados").orderBy("id_emp", "asc").onSnapshot((querySnapshot) => {
            const docs = [];
            querySnapshot.forEach((doc) => {
              docs.push({ ...doc.data(), id: doc.id });
            });
            setEmployee(docs);
          });
    };
  
    const onDeleteEmployee = async (id) => {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
        })
        swalWithBootstrapButtons.fire({
            title: '¿Eliminar al empleado?',
            showCancelButton: true,
            confirmButtonText: `Si`,
            cancelButtonText: 'No'
          }).then (async (result) => {
            if (result.isConfirmed) {
             await firestore.collection("Empleados").doc(id).delete();
             Toast.fire({title: "Empleado eliminado correctamente", icon:"success", background:"#e53e3e", iconColor:"#fc8181"});
            } else {
              Swal.fire('Empleado no eliminado', '', 'info')
            }
          })
    };
  
    useEffect(() => {
      getEmployees();
      if (currentId === "") {
        const initialStateValues2 = {
            id_emp: 0,
            Nombre: "",
            Horas: 0
        };
          setValues({ ...initialStateValues2 });
        } else {
          //https://stackoverflow.com/questions/56059127/how-to-fix-this-error-function-collectionreference-doc
          if (currentId !== null && currentId !== undefined) {
            getEmployeeById(currentId);
          }
        }
    }, [currentId]);
  
    const addOrEditEmployee = async (e) => {
      e.preventDefault();
      try {
        if (!emptyspaces(values)) {
          values.Nombre = values.Nombre.trim();
          values.Horas = parseInt(values.Horas);
        if (currentId === "") {
          if (Employee.length!=0) {
            values.id_emp = Employee[Employee.length-1].id_emp+1;
          }
          else
          {
            values.id_emp = 0;
          }
            
            await firestore.collection("Empleados").doc().set(values);
            Toast.fire({title: "Empleado agregado correctamente", icon:"success", background:"green"});
            } else {
            await firestore.collection("Empleados").doc(currentId).update(values);
            Toast.fire({title: "Empleado actualizado correctamente", icon:"success", background:"#3182ce", iconColor:"#63b3ed"});
            setCurrentId("");
            }
            setValues(initialStateValues);   
      }
      } catch (error) {
        console.error(error);
      }
    };
    const limpiar = ()=>{
      if (currentId === "") {
        setValues(initialStateValues);
      }
      else
      {
        setCurrentId("");
      }
    }

  return (
  <div className="container py-2">
    <h1 className="py-6 text-3xl text-center">Agregar Empleados</h1>
    <form onSubmit={addOrEditEmployee} className="w-full max-w-lg mx-auto my-6">
      <div className="w-full md:w-full px-3">
      <label className="text-base block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
        Nombre Empleado
      </label>
        <input
          type="text"
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          value={values.Nombre}
          name="Nombre"
          onChange={handleInputChange}
        />
      </div>
      <div className="w-full md:w-full px-3">
        <label className="text-base block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
        Horas trabajadas
        </label>
        <input 
         type="number"
         value={values.Horas}
         name="Horas"
         className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
         onChange={handleInputChange}
        />
      </div>
      <button className="btn btn-primary">
        {currentId === "" ? "Guardar" : "Actualizar"}
      </button>
      <button onClick={limpiar} type="reset" className="btn text-gray-700 bg-gray-300">
        Limpiar
      </button>
    </form>
          <h2 className="text-3xl text-center py-4">Lista de Empleados</h2>
          <table className="table text-center">
            <thead>
              <tr>
                <th className="w-1/2 px-4 py-2 text-center">Nombre</th>
                <th className="px-4 py-2 text-center">Horas trabajadas</th>
                <th className="w-1/4 px-4 py-2 text-center">Aciones</th>
              </tr>
            </thead>
            <tbody>
              {Employee.map((emp) => (
                <tr key={emp.id}>
                  <td className="border px-4 py-2">{emp.Nombre}</td>
                  <td className="border px-4 py-2">{emp.Horas}</td>
                  <td className="border px-4 py-2">
                    <button className="btn btn-primary buton" onClick={() => setCurrentId(emp.id)}>Editar</button>
                    <button className="btn btn-danger buton" onClick={() => onDeleteEmployee(emp.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
  );
}

export default Employees;