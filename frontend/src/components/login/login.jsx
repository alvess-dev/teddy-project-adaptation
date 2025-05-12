import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import "./login.css";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            navigate('/ListarClothes');
        }   

        document.body.classList.add('login-page');
        return () => {
            document.body.classList.remove('login-page');
        };
    }, []);

    const handleLogin = async () => {

        if (!email || !password) {
            alert("Preencha todos os campos.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email, password: password })
            });

            const data = await response.json();

            if (data.token) {
                const cookieOptions = rememberMe ? { expires: 7, path: '/' } : { path: '/' };
                
                Cookies.set('token', data.token, cookieOptions);
                Cookies.set('user_id', data.user.id_user, cookieOptions);

                navigate('/ListarClothes');
            } else {
                alert("Email ou senha inválidos!");
            }
        } catch (error) {
            console.error("Erro no login:", error);
            alert("Erro ao tentar logar. Tente novamente.");
        }
    };

    return (
        <div className="login-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card title="Login" style={{ width: '300px' }}>
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="email">Usuário</label>
                        <InputText id="email" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="field">
                        <label htmlFor="password">Senha</label>
                        <InputText id="password" autoComplete="off" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="field-checkbox">
                        <Checkbox inputId="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.checked)} />
                        <label htmlFor="rememberMe">Manter Conectado</label>
                    </div>
                    <Button label="Entrar" onClick={handleLogin} className="btn-entrar p-mt-3" />
                    <Button label="Criar Conta" className="p-button-secondary p-mt-2" onClick={() => navigate('/register')} />
                </div>
            </Card>
        </div>
    );
}
