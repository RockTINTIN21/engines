import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import controller from './controllers/controller.js';
import mongoose from "mongoose";


const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());

// Подключение к MongoDB
const mongoURI = 'mongodb://localhost:27017/enginesDB';
mongoose.connect(mongoURI, {
}).then(() => {
    console.log('Успешное подключение к MongoDB');
}).catch((error) => {
    console.error('Ошибка подключения к MongoDB:', error);
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});
app.use(controller.app);
controller.addToRepo();

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}, сайт доступен по ссылке: http://localhost:5173/`);
});
