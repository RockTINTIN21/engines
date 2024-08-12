import mongoose from 'mongoose';
// Определение схемы для местоположений (position и installationPlace)
const locationSchema = new mongoose.Schema({
    position: { type: String, required: true },  // position обязательно
    installationPlace: { type: String }  // installationPlace может быть необязательным
});
const engineSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    location: [locationSchema],
    installationLocation: String,
    inventoryNumber: String,
    accountNumber: String,
    type: String,
    power: String,
    coupling: String,
    status: String,
    comments: String,
    historyOfTheInstallation: String,
    historyOfTheRepair: String,
    date: String
});

const EngineModelDB = mongoose.model('Engine', engineSchema);

export default EngineModelDB;