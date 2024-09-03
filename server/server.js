import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import controller from './controllers/controller.js';
import session from 'express-session'; // Используйте ES6 импорт для express-session
import config from './config.js';
const app = express();
const port = config.backendPort;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
// Путь к директории uploads
// Делаем папку 'uploads' доступной для запросов
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());

// Подключение к MongoDB
mongoose.connect(config.mongoURI, {
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
    secret: 'q4werty123uasdg', // Задайте секретный ключ для подписи Cookie
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Для HTTPS установите в true
}));

// Маршрут для логина
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === config.login && password === config.password) {
        req.session.user = { username };  // Сохранение информации о пользователе в сессию
        res.json({ status: 'success', message: 'Authentication successful!' });
    } else {
        res.status(401).json({ status: 'error', message: 'Authentication failed' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Сервер запущен на порту ${port}, сайт доступен по ссылке: http://${config.frontendIP}/`);
});