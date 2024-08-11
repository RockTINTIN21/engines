import express from 'express';
import Engine from '../models/Engine.js';

const app = express.Router();
app.use(express.json());

export function addToRepo() {

    const engines = [
        {
            title:'АИР TEST',
            location:'Склад №2',
            installationLocation:'Компрессорная',
            inventoryNumber:'8726423415',
            accountNumber:'50500404',
            type:'А315123M2Q3',
            power:'200',
            coupling:'Да',
            status:'Готов',
            comments:'нет',
            historyOfTheInstallation:'',
            historyOfTheRepair:'Таблица',
            date:'13.08.2024'
        }
    ];
    const engineInstance = new Engine();
    engines.forEach(engine => {
        engineInstance.addEngine(engine.title,
            engine.location,
            engine.installationLocation,
            engine.inventoryNumber,
            engine.accountNumber,
            engine.type,
            engine.power,
            engine.coupling,
            engine.status,
            engine.comments,
            engine.historyOfTheInstallation,
            engine.historyOfTheRepair,
            engine.date
            );
    });
}

// app.get('/getStudentsByGroup', (req, res) => {
//     try {
//         const group = decodeURIComponent(req.query.group);
//         const repository = Repo.filterStudentsByGroup(group);
//         res.status(200).send({
//             status: 'success',
//             repository: repository
//         });
//     } catch (error) {
//         console.log('GET запрос: ', error);
//         res.status(404).send({
//             status: 'error',
//             errors: {
//                 field: error.name,
//                 message: error.message
//             }
//         });
//     }
// });

export default { app, addToRepo };