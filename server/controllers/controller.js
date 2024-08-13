import express from 'express';
import Engine from '../models/Engine.js';

const router = express.Router();
router.use(express.json());

router.post('/addEngine', async (req, res) => {
    try {
        const {
            title: title,
            position: position,
            installationPlace: installationPlace,
            iventNumber: inventoryNumber,
            account: accountNumber,
            type: type,
            power: power,
            coupling: coupling,
            status: status,
            date: date,
            comments = 'Нет комментариев',
            historyOfTheInstallation = 'История установки отсутствует',
            historyOfTheRepair = 'История ремонта отсутствует'
        } = req.body;

        const engineInstance = new Engine();
        await engineInstance.addEngine(
            title,
            position,
            installationPlace,
            inventoryNumber,
            accountNumber,
            type,
            power,
            coupling,
            status,
            comments,
            historyOfTheInstallation,
            historyOfTheRepair,
            date
        );

        res.status(201).send({
            status: 'success',
            message: 'Двигатель успешно добавлен'
        });
    } catch (error) {
        console.error('Ошибка при добавлении двигателя:', error.message);
        res.status(404).send({
            status: 'error',
            errors: {
                field: error.name,
                message: error.message
            }
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
        const engines = await engineInstance.getEngineById(engineId);

        res.status(200).send({
            status: 'success',
            data: engines
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
