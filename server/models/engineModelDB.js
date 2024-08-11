import mongoose from 'mongoose';

const engineSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    location: String,
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