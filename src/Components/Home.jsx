import React, { useContext } from "react";
import { UserContext } from "../providers/UserProvider";
import { auth } from "../firebase";
import { Router, Link } from "@reach/router";
import Employees from "./Employees";
import Salaries from "./Salaries";

const ProfilePage = () => {

  // Asigna un user para leer el contexto del tema actual.
  // React encontrará el Provider superior más cercano y usará su valor.
  const user = useContext(UserContext);

  //const {displayName, email } = user;
  //console.log(" Usuario ProfilePage : " + displayName + " - " + email);

  const signOut = () => {
    auth.signOut();
    window.location.href="/";
  };

  return (
    <div>
      <nav className="navbar bg-blue-600 text-white sticky top-0">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="/">Desafio 3 DPS</a>
          </div>
          <ul className="nav navbar-nav">
            <li className="active"><Link to="/">Inicio</Link></li>
            <li><Link to="salaries" >Ver sueldos</Link></li>
            <button className="btn btn-danger" onClick={() => { signOut() }}>
              Cerrar sesion</button>
          </ul>
        </div>
      </nav>
      <Router>
        <Employees path="/" />
        <Employees path="/signUp" />
        <Salaries path="salaries" />
      </Router>

    </div>
  )
};

export default ProfilePage;

