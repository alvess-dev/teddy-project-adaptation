import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!nickname || !email || !password) {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        try {
            const newUser = {
                nickname,
                email,
                password,
                language: "portuguese",
                country: "Brazil",
                registration_date: new Date().toISOString().slice(0, 19).replace('T', ' ')
            };

            const response = await axios.post('http://localhost:3000/users', newUser, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Resposta do servidor:', response);
            alert("Usuário cadastrado com sucesso!");
            navigate('/');
        } catch (err) {
            console.error('Erro ao cadastrar:', err.response ? err.response.data.message : err.message);

            if (err.response && err.response.status === 400) {
                alert(err.response.data.message); // Exibe a mensagem de erro enviada pelo servidor
            } else {
                alert("Erro ao cadastrar usuário.");
            }
        }
    };

    return (
        <div className="login-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card title="Cadastro" style={{ width: '300px' }}>
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="nickname">Apelido</label>
                        <InputText
                            id="nickname"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            required
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <InputText
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="password">Senha</label>
                        <InputText
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button label="Cadastrar" onClick={handleRegister} className="p-mt-3" />
                </div>
            </Card>
        </div>
    );
}
