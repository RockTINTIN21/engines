import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import controller from './controllers/controller.js';
import session from 'express-session'; // Используйте ES6 импорт для express-session

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
// Путь к директории uploads
// Делаем папку 'uploads' доступной для запросов
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());

// Подключение к MongoDB
import { mongoURI } from './config.js'; // Импортируйте ваш конфиг
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Успешное подключение к MongoDB Atlas');
}).catch((error) => {
    console.error('Ошибка подключения к MongoDB Atlas:', error);
});

app.use('/api', controller);

// Настройка сессии
app.use(session({
    secret: 'your_secret_key', // Задайте секретный ключ для подписи Cookie
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Для HTTPS установите в true
}));

// Маршрут для логина
app.post('/login', (req, res) => {
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