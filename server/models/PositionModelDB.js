import mongoose from 'mongoose';

// Определение схемы для `Position`
const positionSchema = new mongoose.Schema({
    position: { type: String, required: true },  // Основное место (position)
    installationPlaces: [{ type: String, required: true }]  // Массив установок (installationPlaces)
});

// Модель для `Position`
const PositionModel = mongoose.model('Position', positionSchema);

export default PositionModel;
