import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import "./login.css";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Adiciona a classe `login-page` ao <body> quando o componente é montado
        document.body.classList.add('login-page');

        // Remove a classe `login-page` ao <body> quando o componente é desmontado
        return () => {
            document.body.classList.remove('login-page');
        };
    }, []);

    const handleLogin = () => {
        if (rememberMe) {
            Cookies.set('username', username, { expires: 7 }); // Cookie expira em 7 dias
        } else {
            localStorage.setItem('username', username);
        }
        navigate('/ListarClothes'); // Redireciona para a página inicial
        window.location.reload(); // Força o recarregamento da página para garantir que o estado do username seja atualizado
    };

    return (
        <div className="login-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card title="Login" style={{ width: '300px' }}>
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="username">Usuário</label>
                        <InputText id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="field">
                        <label htmlFor="password">Senha</label>
                        <InputText id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="field-checkbox">
                        <Checkbox inputId="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.checked)} />
                        <label htmlFor="rememberMe">Manter Conectado</label>
                    </div>
                    <Button label="Entrar" onClick={handleLogin} className="btn-entrar p-mt-3" />
                </div>
            </Card>
        </div>
    );
}
