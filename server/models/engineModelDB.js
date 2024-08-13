import mongoose from 'mongoose';

const installationHistorySchema = new mongoose.Schema({
    installationPlace: String,
    status: String,
    date: String
});

const repairHistorySchema = new mongoose.Schema({
    installationPlace: String,
    description: String,
    date: String
});

const engineSchema = new mongoose.Schema({
    _id: { type: String, required: true },  // Поле для хранения UUID
    title: { type: String, required: true, unique: true },
    location: String,
    installationPlace: String,
    inventoryNumber: String,
    accountNumber: String,
    type: String,
    power: String,
    coupling: String,
    status: String,
    comments: String,
    historyOfTheInstallation: [installationHistorySchema],  // Изменяем поле на массив объектов
    historyOfTheRepair: [repairHistorySchema],  // Изменяем поле на массив объектов
    date: String
});

const EngineModelDB = mongoose.model('Engine', engineSchema);

export default EngineModelDB;