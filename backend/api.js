import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fs from "fs/promises";
import path from "path";
import multer from "multer";

const app = express();
const PORT = 3000;
const SECRET_KEY = "macaquinho";

// uploads (imagem)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/clothes/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // nome da extensao (png, jpg)
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  }
});
const upload = multer({ storage }); // cria o middleware

app.use(cors({ // habilita o cors, p comunicar c o front de origem diferente
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));

app.use(express.json());
app.use('/images', express.static('images'));

// ler json e salvar

async function getData() {
  const raw = await fs.readFile('./data.json', 'utf-8'); //arquivo do json
  return JSON.parse(raw);
}
async function saveData(data) {
  await fs.writeFile('./data.json', JSON.stringify(data, null, 2));
}

// rota users ---
app.get('/', async (req, res) => {
  const data = await getData();
  res.json(data);
});

app.get('/users', authenticateToken, async (req, res) => {
  const data = await getData();
  res.json(data[0].tables.users);
});

app.get('/users/:id', async (req, res) => {
  const data = await getData();
  const user = data[0].tables.users.find(u => u.id_user === +req.params.id); // usuario no array === id da url
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'Usuário não encontrado' });
  }
});

app.post('/users', async (req, res) => { // cria usuario
  const { nickname, email, password, language, country, registration_date } = req.body;
  const data = await getData();
  const users = data[0].tables.users;

  if (users.some(u => u.email === email)) {
    return res.status(400).json({ message: 'Email já cadastrado.' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser = {
    id_user: users.length + 1,
    nickname, email, password: hashed,
    language, country, registration_date
  };

  users.push(newUser);
  await saveData(data);
  res.status(201).json({ message: 'Usuário cadastrado', user: newUser });
});

app.put('/users/:id', async (req, res) => {
  const data = await getData();
  const users = data[0].tables.users;
  const index = users.findIndex(u => u.id_user === +req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  users[index] = { ...users[index], ...req.body }; // mescla os dados atuais + body
  await saveData(data);
  res.json(users[index]);
});

app.delete('/users/:id', async (req, res) => {
  const data = await getData();
  const users = data[0].tables.users;
  const index = users.findIndex(u => u.id_user === +req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  const deleted = users.splice(index, 1);
  await saveData(data);
  res.json({ message: 'Usuário deletado', deleted });
});

// rotas clothes

app.get('/clothes', authenticateToken, async (req, res) => {
  const data = await getData();
  res.json(data[0].tables.clothes);
});

app.post(
  '/clothes',
  authenticateToken,
  upload.single('image'),
  async (req, res) => {
    const { item_name, category, color, size } = req.body;
    if (!item_name || !category || !color || !size) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
    }

    const data = await getData();
    const clothes = data[0].tables.clothes;
    let nextId;
    if (clothes.length > 0) {
      const ids = clothes.map(c => c.id_cloth);
      const maxId = Math.max(...ids);
      nextId = maxId + 1;
    } else {
      nextId = 1;
    }

    const image_path = req.file ? `/images/clothes/${req.file.filename}` : '';

    const newCloth = {
      id_cloth: nextId,
      id_user: req.user.id_user, 
      item_name,
      category,
      color,
      size,
      image_path,
      added_date: new Date()
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ')
    };

    clothes.push(newCloth);
    await saveData(data);
    res.status(201).json(newCloth);
  }
);

app.put(
  '/clothes/:id',
  authenticateToken,
  upload.single('image'),
  async (req, res) => {
    const id = +req.params.id;
    const { item_name, category, color, size } = req.body;

    const data = await getData();
    const clothes = data[0].tables.clothes;
    const index = clothes.findIndex(c => c.id_cloth === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Roupa não encontrada.' });
    }

    clothes[index] = {
      ...clothes[index],
      item_name: item_name ?? clothes[index].item_name, // se n for null ou undefined troca
      category: category ?? clothes[index].category,
      color: color ?? clothes[index].color,
      size: size ?? clothes[index].size
    };

    if (req.file) {
      clothes[index].image_path = `/images/clothes/${req.file.filename}`;
    }

    await saveData(data);
    res.json(clothes[index]);
  }
);

app.delete(
  '/clothes/:id',
  authenticateToken,
  async (req, res) => {
    const id = +req.params.id;
    const data = await getData();
    const clothes = data[0].tables.clothes;
    const index = clothes.findIndex(c => c.id_cloth === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Roupa não encontrada.' });
    }

    clothes.splice(index, 1);
    await saveData(data);
    res.json({ message: 'Roupa excluída.' });
  }
);

// autenticação

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const data = await getData();
  const user = data[0].tables.users.find(u => u.email === email);

  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Senha incorreta.' });

  const token = jwt.sign(
    { id_user: user.id_user, nickname: user.nickname },
    SECRET_KEY,
    { expiresIn: '7d' }
  );

  res.json({ token, user: { id_user: user.id_user, nickname: user.nickname } });
});

function authenticateToken(req, res, next) {
  const auth = req.headers['authorization'];
  const token = auth && auth.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
