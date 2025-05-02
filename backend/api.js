import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fs from 'fs/promises';

const app = express();
const PORT = 3000;
const SECRET_KEY = "macaquinho";

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/images', express.static('images'));

async function getData() {
  const jsonData = await fs.readFile('./data.json', 'utf-8');
  return JSON.parse(jsonData);
}

async function saveData(data) {
  await fs.writeFile('./data.json', JSON.stringify(data, null, 2));
}

app.get('/', async (req, res) => {
  const data = await getData();
  res.json(data);
});

app.get('/users', async (req, res) => {
  const data = await getData();
  res.json(data[0].tables.users);
});

app.get('/users/:id', async (req, res) => {
  const data = await getData();
  const users = data[0].tables.users;
  const user = users.find(u => u.id_user === parseInt(req.params.id));
  user ? res.json(user) : res.status(404).json({ error: 'Usuário não encontrado' });
});

app.get('/clothes', async (req, res) => {
  const data = await getData();
  res.json(data[0].tables.clothes);
});

app.post('/users', async (req, res) => {
  const { nickname, email, password, language, country, registration_date } = req.body;

  const data = await getData();
  const users = data[0].tables.users;

  const emailExists = users.some(u => u.email === email);
  if (emailExists) {
    return res.status(400).json({ message: 'Email já cadastrado.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id_user: users.length + 1,
    nickname,
    email,
    password: hashedPassword,
    language,
    country,
    registration_date,
    profile_picture: '/images/users/default.png'
  };

  users.push(newUser);
  await saveData(data);

  res.status(201).json({ message: 'Usuário cadastrado com sucesso.', user: newUser });
});

app.put('/users/:id', async (req, res) => {
  const data = await getData();
  const users = data[0].tables.users;
  const index = users.findIndex(u => u.id_user === parseInt(req.params.id));
  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    await saveData(data);
    res.json(users[index]);
  } else {
    res.status(404).json({ error: 'Usuário não encontrado' });
  }
});

app.delete('/users/:id', async (req, res) => {
  const data = await getData();
  const users = data[0].tables.users;
  const index = users.findIndex(u => u.id_user === parseInt(req.params.id));
  if (index !== -1) {
    const deleted = users.splice(index, 1);
    await saveData(data);
    res.json({ message: 'Usuário deletado', deleted });
  } else {
    res.status(404).json({ error: 'Usuário não encontrado' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const data = await getData();
  const users = data[0].tables.users;
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado." });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Senha incorreta." });
  }

  const token = jwt.sign(
    { id_user: user.id_user, nickname: user.nickname },
    SECRET_KEY,
    { expiresIn: '7d' }
  );

  res.json({ token, user: { id_user: user.id_user, nickname: user.nickname } });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get('/rota-secreta', authenticateToken, (req, res) => {
  res.json({ message: "Acesso autorizado!", user: req.user });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
