import mongoose from 'mongoose';

const installationHistorySchema = new mongoose.Schema({
    installationPlace: String,
    status: String,
    date: String
});

const repairHistorySchema = new mongoose.Schema({
    position: String,
    installationPlace: String,
    repairDescription: String,
    date: String
});

const engineSchema = new mongoose.Schema({
    _id: { type: String, required: true },
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
    historyOfTheInstallation: [installationHistorySchema],
    historyOfTheRepair: [repairHistorySchema],
    date: String,
    imageFileId: mongoose.Schema.Types.ObjectId  // ID файла в GridFS
});

const EngineModelDB = mongoose.model('Engine', engineSchema);

export default EngineModelDB;