import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/LogIn";

import SidebarUser from "./components/SidebarUser";
import HomeUser from "./pages/user/HomeUser";
import SearchBooksUser from "./pages/user/SearchBooksUser";
import FAQ from "./pages/user/FAQ";
import Setting from "./pages/user/Setting";

import SidebarAdmin from "./components/SidebarAdmin";
import HomeAdmin from "./pages/admin/HomeAdmin";
import Attendance from "./pages/admin/Attendance"
import AddUser from "./pages/admin/AddUser";
import BooksAdmin from "./pages/admin/BooksAdmin";

import SidebarSuperAdmin from "./components/SidebarSuperAdmin";
import HomeSuperAdmin from "./pages/superadmin/HomeSuperAdmin";
import BooksSuperAdmin from "./pages/superadmin/BooksSuperAdmin";
import ManageUser from "./pages/superadmin/ManageUser";
import IssueBookSuperAdmin from "./pages/superadmin/IssueBookSuperAdmin";

function App() {
  // dito nya tinatanggap yung bato ng handle submit
  const storedUserRole = sessionStorage.getItem('userRole');
  const storedUserFirstName = sessionStorage.getItem('userFirstName');
  const storedUserLastName = sessionStorage.getItem('userLastName');
  
  const [userRole, setUserRole] = useState(storedUserRole);
  const [userFirstName, setUserFirstName] = useState(storedUserFirstName || "");
  const [userLastName, setUserLastName] = useState(storedUserLastName || "");

  useEffect(() => {
    if (userRole && userFirstName && userLastName) {
      sessionStorage.setItem('userFirstName', userFirstName);
      sessionStorage.setItem('userLastName', userLastName);
    }
  }, [userRole, userFirstName, userLastName]);

  // tas dito nireread na yung user role para ma set
  const handleLogin = (role, firstName, lastName) => {
    setUserRole(role);
    setUserFirstName(firstName);
    setUserLastName(lastName);
    sessionStorage.setItem('userRole', role);
    sessionStorage.setItem('userFirstName', firstName);
    sessionStorage.setItem('userLastName', lastName);
  }

  // Render sidebar and routes based on user role
  let sidebarComponent, routesComponent;

  if (userRole === "user") {
    sidebarComponent = <SidebarUser userFirstName={userFirstName} userLastName={userLastName} />;
    routesComponent = (
      <Routes>
        <Route path="/home-user" element={<HomeUser userFirstName={userFirstName}/>} />
        <Route path="/search-books" element={<SearchBooksUser />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
    );

  } else if (userRole === "admin") {
    sidebarComponent = <SidebarAdmin />;
    routesComponent = (
      <Routes>
        <Route path="/home-admin" element={<HomeAdmin />} />
        <Route path="/attendance-log" element={<Attendance />} />
        <Route path="/create-accounts" element={<AddUser />} />
        <Route path="/books-admin" element={<BooksAdmin />} />
      </Routes>
    );
  } else if (userRole === "super-admin") {
    sidebarComponent = <SidebarSuperAdmin />;
    routesComponent = (
      <Routes>
        <Route path="/home-super-admin" element={<HomeSuperAdmin />} />
        <Route path="/books-super-admin" element={<BooksSuperAdmin />} />
        <Route path="/manage-users" element={<ManageUser />} />
        <Route path="/books-issued" element={<IssueBookSuperAdmin />} />
      </Routes>
    );
  } else {
    // pabalik sa login 
    return (
      <Router>
        <Login handleLogin={handleLogin} />
      </Router>
    );
  }

  // ito na yung maglalabas ng logged in account depending sa role
  return (
    <Router>
      <div className="min-h-screen flex">
        {sidebarComponent}
        {routesComponent}
      </div>
    </Router>
  );
}

export default App;