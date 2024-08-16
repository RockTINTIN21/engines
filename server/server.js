import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import controller from './controllers/controller.js';
import router from "./controllers/controller.js";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());

// Подключение к MongoDB
const mongoURI = 'mongodb+srv://admin:77599557609@enginedb.ywnql.mongodb.net/?retryWrites=true&w=majority&appName=engineDB';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Успешное подключение к MongoDB Atlas');
}).catch((error) => {
    console.error('Ошибка подключения к MongoDB Atlas:', error);
});

// Использование маршрутов контроллера
app.use('/api', controller);
const session = require('express-session');

app.use(session({
    secret: 'your_secret_key', // Задайте секретный ключ для подписи Cookie
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Для HTTPS установите в true
}));
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '77599557609') {
        req.session.user = { username };  // Сохранение информации о пользователе в сессию
        res.json({ status: 'success', message: 'Authentication successful!' });
    } else {
        res.status(401).json({ status: 'error', message: 'Authentication failed' });
    }
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}, сайт доступен по ссылке: http://localhost:5173/`);
});
