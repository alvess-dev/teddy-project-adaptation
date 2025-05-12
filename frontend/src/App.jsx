import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate, Link } from 'react-router-dom';
import 'primereact/resources/themes/saga-orange/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Cookies from 'js-cookie';
import { Menubar } from 'primereact/menubar';
import './App.css';

import PrivateRoute from './components/auth/PrivateRoute';
import ListarClothes from "./components/clothes/listar-clothes";
import ListarUsers from "./components/users/listar-users";
import Sobre from "./components/sobre/sobre";
import Login from "./components/login/login";
import Register from './components/register/register';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token && location.pathname !== '/' && location.pathname !== '/register') {
      navigate('/');
    }

    const user = Cookies.get('username');
    if (user) {
      setUsername(user);
    }
  }, [location, navigate]);

  const handleLogout = () => {
    Cookies.remove('token', { path: '/' });
    Cookies.remove('user_id', { path: '/' });
    Cookies.remove('username', { path: '/' });
    setUsername('');
    navigate('/');
  };

  const items = [
    { label: 'Clothes', url: '/ListarClothes' },
    { label: 'Users',   url: '/ListarUsers'   },
    { label: 'Sobre',   url: '/Sobre'         },
    { label: 'Sair',    command: handleLogout  }
  ];

  const start = (
    <Link to="/ListarClothes" style={{ textDecoration: 'none' }}>
      <h1 className="titulo">CreAite</h1>
    </Link>
  );

  const end = (
    <div className="welcome">
      {username && <span>{username}</span>}
    </div>
  );

  return (
    <div className="card">
      {['/ListarClothes','/ListarUsers','/Sobre'].includes(location.pathname) && (
        <Menubar model={items} start={start} end={end} className="custom-menubar" />
      )}
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/ListarClothes"
            element={
              <PrivateRoute>
                <ListarClothes />
              </PrivateRoute>
            }
          />
          <Route
            path="/ListarUsers"
            element={
              <PrivateRoute>
                <ListarUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="/Sobre"
            element={
              <PrivateRoute>
                <Sobre />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
