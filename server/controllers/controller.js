import express from 'express';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import { Readable } from 'stream';
import Engine from "../models/Engine.js";

const router = express.Router();

// Подключение к MongoDB
const mongoURI = 'mongodb+srv://admin:77599557609@enginedb.ywnql.mongodb.net/?retryWrites=true&w=majority&appName=engineDB';
const conn = mongoose.createConnection(mongoURI);

let gfs;
conn.once('open', () => {
    gfs = new GridFSBucket(conn.db, {
        bucketName: 'uploads'
    });
});

const storage = multer.memoryStorage();
const upload = multer({ storage });
// Пример файла server.js или другого файла маршрутов

router.post('/addEngine', upload.single('file'), async (req, res) => {
    try {
        let imageFileId = null;
        console.log(req.body)
        if (req.file) {
            // Процесс загрузки файла, если он был передан
            const filename = crypto.randomBytes(16).toString('hex') + path.extname(req.file.originalname);
            const readableStream = new Readable();
            readableStream.push(req.file.buffer);
            readableStream.push(null);

            const uploadStream = gfs.openUploadStream(filename, {
                contentType: req.file.mimetype,
                metadata: { title: req.body.title, position: req.body.position }
            });

            readableStream.pipe(uploadStream)
                .on('error', (error) => {
                    console.error('Ошибка при загрузке файла в GridFS:', error);
                    res.status(500).send({ status: 'error', message: 'Ошибка при загрузке файла' });
                })
                .on('finish', async () => {
                    imageFileId = uploadStream.id;
                    await createEngine(res, req.body, imageFileId);
                });
        } else {
            await createEngine(res, req.body, imageFileId);  // Переходим к созданию двигателя с null для imageFileId
        }
    } catch (error) {
        console.error('Ошибка при добавлении двигателя:', error.message);
        res.status(500).send({ status: 'error', errors: { field: error.name, message: error.message } });
    }
});
// Маршрут для удаления двигателя по его ID
router.delete('/deleteEngine/:id', async (req, res) => {
    try {
        const engineId = req.params.id;

        const engineInstance = new Engine();
        const result = await engineInstance.deleteEngine(engineId);

        if (!result) {
            return res.status(404).send({ status: 'error', message: 'Двигатель не найден' });
        }

        res.status(200).send({ status: 'success', message: 'Двигатель успешно удален' });
    } catch (error) {
        console.error('Ошибка при удалении двигателя:', error.message);
        res.status(500).send({ status: 'error', message: 'Ошибка при удалении двигателя' });
    }
});
router.patch('/updateEngine/:id', upload.single('file'), async (req, res) => {
    try {
        const engineId = req.params.id;
        const {
            title,
            location,
            installationPlace,
            iventNumber,  // Получаем iventNumber
            accountNumber,
            type,
            power,
            coupling,
            status,
            comments,
            docFromPlace,
            linkOnAddressStorage
        } = req.body;
        // Преобразуем iventNumber в inventoryNumber
        const inventoryNumber = iventNumber;
        // Логика обновления изображения.id;
        let { imageFileId } = req.body; // Получите imageFileId из тела запроса
        if (req.file) {
            const filename = crypto.randomBytes(16).toString('hex') + path.extname(req.file.originalname);
            const readableStream = new Readable();
            readableStream.push(req.file.buffer);
            readableStream.push(null);

            const uploadStream = gfs.openUploadStream(filename, {
                contentType: req.file.mimetype,
                metadata: { title, position: req.body.position }
            });

            await new Promise((resolve, reject) => {
                readableStream.pipe(uploadStream)
                    .on('error', reject)
                    .on('finish', () => {
                        imageFileId = uploadStream.id;
                        resolve();
                    });
            });
        }

        const engineInstance = new Engine();
        await engineInstance.updateEngine(
            engineId,
            title,
            location,
            installationPlace,
            inventoryNumber,
            accountNumber,
            type,
            power,
            coupling,
            status,
            comments,
            imageFileId,
            docFromPlace,
            linkOnAddressStorage
        );

        res.status(200).json({ status: 'success', message: 'Данные двигателя успешно обновлены' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
async function createEngine(res, engineData, imageFileId) {
    const engineInstance = new Engine();
    await engineInstance.addEngine(
        engineData.title,
        engineData.position,
        engineData.installationPlace,
        engineData.iventNumber,
        engineData.account,
        engineData.type,
        engineData.power,
        engineData.coupling,
        engineData.status,
        engineData.comments,
        engineData.historyOfTheInstallation,
        engineData.historyOfTheRepair,
        engineData.date,
        imageFileId,
        engineData.docFromPlace,  // Добавление ссылок
        engineData.linkOnAddressStorage
    );

    res.status(201).send({ status: 'success', message: 'Двигатель успешно добавлен' });
}
// Получение всех двигателей
router.get('/getAllEngines', async (req, res) => {
    try {
        const engineInstance = new Engine();  // Создание экземпляра класса Engine
        const engines = await engineInstance.getAllEngines();  // Вызов метода через экземпляр

        res.status(200).send({ status: 'success', data: engines });
    } catch (error) {
        console.error('Ошибка при получении всех двигателей:', error.message);
        res.status(500).send({ status: 'error', message: error.message });
    }
});

router.get('/image/:id', async (req, res) => {
    try {
        const fileId = new mongoose.Types.ObjectId(req.params.id);

        const downloadStream = gfs.openDownloadStream(fileId);

        downloadStream.on('file', (file) => {
            res.set({
                'Content-Type': file.contentType,
                'Content-Length': file.length
            });
        });

        downloadStream.on('data', (chunk) => {
            res.write(chunk);
        });

        downloadStream.on('end', () => {
            res.end();
        });

        downloadStream.on('error', (err) => {
            console.error('Ошибка при загрузке файла:', err);
            res.status(404).send('Файл не найден');
        });
    } catch (error) {
        console.error('Ошибка при получении изображения:', error.message);
        res.status(500).send({
            status: 'error',
            message: 'Ошибка при получении изображения'
        });
    }
});


router.post('/addPosition', async (req, res) => {
    try {
        const {
            position: position,
            installationPlace: installationPlace,
        } = req.body;
        // if (!installationPlace) {
        //     installationPlace = undefined;
        // }
        const engineInstance = new Engine();
        await engineInstance.addPosition(
            position,
            installationPlace,
        );

        res.status(201).send({
            status: 'success',
            message: 'Место нахождения успешно добавлено'
        });
    } catch (error) {
        console.error('Ошибка при добавлении местонахождения:', error.message);
        res.status(404).send({
            status: 'error',
            errors: {
                field: error.name,
                message: error.message
            }
        });
    }
});
router.post('/addHistoryRepair', async (req, res) => {
    try {
        const {
            repairType,
            repairDescription,
            repairDate,
            engineId
        } = req.body;

        // Проверка на корректность полученных данных
        if (!engineId || !repairType || !repairDescription || !repairDate) {
            return res.status(400).send({
                status: 'error',
                message: 'Необходимо предоставить все поля: engineId, repairType, repairDescription, repairDate'
            });
        }

        const engineInstance = new Engine();
        await engineInstance.addHistoryRepair(
            engineId,
            repairType,
            repairDescription,
            repairDate
        );

        res.status(201).send({
            status: 'success',
            message: 'Запись истории ремонта успешно добавлена'
        });
    } catch (error) {
        console.error('Ошибка при добавлении истории ремонта:', error.message);
        res.status(500).send({
            status: 'error',
            message: error.message
        });
    }
});

router.get('/getPositions', async (req, res) => {
    try {
        const engineInstance = new Engine();
        const positions = await engineInstance.getPositions();  // Получаем все позиции
        res.status(200).send({
            status: 'success',
            data: positions
        });
    } catch (error) {
        console.error('Ошибка при получении позиций:', error.message);
        res.status(500).send({
            status: 'error',
            message: error.message
        });
    }
});
router.get('/getEngineByLocation', async (req, res) => {
    try {
        const location = decodeURIComponent(req.query.location);
        const engineInstance = new Engine();

        const engines = await engineInstance.getEngineByLocation(location);
        res.status(200).send({
            status: 'success',
            data: engines
        });
    } catch (error) {
        console.error('Ошибка при поиске двигателей по местонахождению:', error.message);
        res.status(404).send({
            status: 'error',
            message: error.message
        });
    }
});
router.get('/getEngineByID', async (req, res) => {
    try {
        const engineId = decodeURIComponent(req.query.engineId);
        console.log('Received Engine ID:', engineId);  // Выводим значение ID для отладки
        const engineInstance = new Engine();
        const engine = await engineInstance.getEngineById(engineId);

        if (!engine) {
            throw new Error('Двигатель не найден');
        }

        res.status(200).send({
            status: 'success',
            data: engine
        });
    } catch (error) {
        console.error('Ошибка при поиске двигателей по ID:', error.message);
        res.status(404).send({
            status: 'error',
            message: error.message
        });
    }
});


// Маршрут для поиска двигателей по месту установки (installationPlace)
router.get('/getEngineByInstallationPlace', async (req, res) => {
    try {
        const installationPlace = decodeURIComponent(req.query.installationPlace);
        const engineInstance = new Engine();
        const engines = await engineInstance.getEngineByInstallationPlace(installationPlace);
        res.status(200).send({
            status: 'success',
            data: engines
        });
    } catch (error) {
        console.error('Ошибка при поиске двигателей по месту установки:', error.message);
        res.status(404).send({
            status: 'error',
            message: error.message
        });
    }
});

// Маршрут для поиска двигателя по инвентарному номеру (inventoryNumber)
router.get('/getEngineByInventoryNumber', async (req, res) => {
    try {
        const inventoryNumber = req.query.inventoryNumber;
        const engineInstance = new Engine();
        const engine = await engineInstance.getEngineByInventoryNumber(inventoryNumber);
        res.status(200).send({
            status: 'success',
            data: engine
        });
    } catch (error) {
        console.error('Ошибка при поиске двигателя по инвентарному номеру:', error.message);
        res.status(404).send({
            status: 'error',
            message: error.message
        });
    }
});

router.delete('/delPosition', async (req, res) => {
    try {
        const {
            position: position
        } = req.body;
        // if (!installationPlace) {
        //     installationPlace = undefined;
        // }
        const engineInstance = new Engine();
        await engineInstance.deletePosition(
            position
        );

        res.status(201).send({
            status: 'success',
            message: 'Место нахождения успешно удалено'
        });
    } catch (error) {
        console.error('Ошибка при удалении местонахождения:', error.message);
        res.status(404).send({
            status: 'error',
            errors: {
                field: error.name,
                message: error.message
            }
        });
    }
});

router.post('/addInstallationPlace', async (req, res) => {
    try {
        const { position, installationPlace } = req.body;

        const engineInstance = new Engine();
        await engineInstance.addInstallationPlaceToPosition(position, installationPlace);

        res.status(201).send({
            status: 'success',
            message: 'Место установки успешно добавлено'
        });
    } catch (error) {
        console.error('Ошибка при добавлении места установки:', error.message);
        res.status(404).send({
            status: 'error',
            errors: {
                field: error.name,
                message: error.message
            }
        });
    }
});
router.delete('/delInstallationPlace', async (req, res) => {
    try {
        const { position, installationPlace } = req.body;

        const engineInstance = new Engine();
        await engineInstance.deleteInstallationPlaceFromPosition(position, installationPlace);

        res.status(201).send({
            status: 'success',
            message: 'Место установки успешно удалено'
        });
    } catch (error) {
        console.error('Ошибка при удалении места установки:', error.message);
        res.status(404).send({
            status: 'error',
            errors: {
                field: error.name,
                message: error.message
            }
        });
    }
});
export default router;
