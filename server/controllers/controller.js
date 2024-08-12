import express from 'express';
import Engine from '../models/Engine.js';

const router = express.Router();
router.use(express.json());

router.post('/addEngine', async (req, res) => {
    try {
        const {
            installationTitle: title,
            installationPosition: location,
            installationPlace: installationLocation,
            installationIventNumber: inventoryNumber,
            installationAccount: accountNumber,
            installationType: type,
            installationPower: power,
            installationCoupling: coupling,
            installationStatus: status,
            installationDate: date,
            comments = 'Нет комментариев',
            historyOfTheInstallation = 'История установки отсутствует',
            historyOfTheRepair = 'История ремонта отсутствует'
        } = req.body;

        const engineInstance = new Engine();
        await engineInstance.addEngine(
            title,
            location,
            installationLocation,
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


export default router;
