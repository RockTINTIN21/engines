import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import crypto from 'crypto';
import path from 'path';

// Подключаемся к MongoDB
const mongoURI = 'mongodb+srv://admin:77599557609@enginedb.ywnql.mongodb.net/?retryWrites=true&w=majority&appName=engineDB';

// Создаем хранилище для GridFS
const storage = new GridFsStorage({
    url: mongoURI,
    options: { useUnifiedTopology: true },
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads' // Название bucket'а (аналог коллекции) для хранения файлов
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({ storage });

export { upload };