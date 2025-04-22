import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate, Link } from 'react-router-dom';
import 'primereact/resources/themes/saga-orange/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Cookies from 'js-cookie';
import { Menubar } from 'primereact/menubar';
// import LogoCreAite from "./assets/logo-creaite.png";
import './App.css';

import ListarClothes from "./components/clothes/listar-clothes";
import ListarUsers from "./components/users/listar-users";
import Sobre from "./components/sobre/sobre";
import Login from "./components/login/login";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [greeting, setGreeting] = useState('');

  // Função para determinar a saudação
  function getGreeting() {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 12) {
      return 'Bom dia';
    } else if (hour < 18) {
      return 'Boa tarde';
    } else {
      return 'Boa noite';
    }
  }

  useEffect(() => {
    // Tenta obter o nome de usuário do cookie
    const user = Cookies.get('username');
    user && setUsername(user);
    setGreeting(getGreeting());
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove('username');
    localStorage.removeItem('username');
    setUsername(''); // Limpa o estado do username
    navigate('/'); // Redireciona para a página de login
  };

  const items = [
    {
      label: 'Clothes',
      url: '/ListarClothes'
    },
    {
      label: 'Users',
      url: '/ListarUsers'
    },
    {
      label: 'Sobre',
      url: '/Sobre'
    },
    {
      label: 'Sair',
      command: handleLogout // Adiciona a função de logout ao clicar em "Sair"
    }
  ];

  const start = (
    <Link to="/ListarClothes" style={{ textDecoration: 'none'}}>
      <h1 style={{ color: '#fffcfc', padding: '10px', marginRight: '1em', marginLeft: '1em' }}>CreAite</h1>
    </Link>
  );

  const end = (
    <div className="welcome flex align-items-center gap-2">
      <span className="mx-2">{username ? `${greeting}, ${username}` : ''}</span>
    </div>
  );

  return (
    <div className="card">
      {location.pathname !== '/' && (
        <Menubar model={items} start={start} end={end} className="custom-menubar" />
      )}
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/ListarClothes" element={<ListarClothes />} />
          <Route path="/ListarUsers" element={<ListarUsers />} />
          <Route path="/Sobre" element={<Sobre />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
