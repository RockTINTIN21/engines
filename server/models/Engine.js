import EngineModelDB from '../models/engineModelDB.js';

class Engine {
    // Метод для добавления новой позиции в массив positions
    async addPosition(position, installationPlaces) {
        try {
            console.log('Данные из формы:', position, installationPlaces);

            // Ищем двигатель по title
            const engine = await EngineModelDB.findOne({ title: title.toLowerCase() });

            if (!engine) {
                throw new Error("Двигатель с таким названием не найден");
            }

            // Проверяем, существует ли уже такая позиция
            const positionExists = engine.positions.some(p => p.position.toLowerCase() === position.toLowerCase());

            if (positionExists) {
                throw new Error("Такая позиция уже существует");
            }

            // Добавляем новую позицию в массив positions
            engine.positions.push({
                position,
                installationPlaces
            });

            await engine.save();  // Сохраняем изменения в базе данных
            console.log('Позиция успешно добавлена.');
        } catch (error) {
            console.error('Ошибка при добавлении позиции:', error.message);
            throw error;
        }
    }

    // Остальные методы остаются неизменными
    async addEngine(title, location, installationLocation, inventoryNumber, accountNumber, type, power, coupling, status, comments, historyOfTheInstallation, historyOfTheRepair, date) {
        try {
            console.log('Данные из формы:', title, location, installationLocation, inventoryNumber, accountNumber, type, power, coupling, status, comments, historyOfTheInstallation, historyOfTheRepair, date);
            const engineExists = await EngineModelDB.findOne({ title: title.toLowerCase() });

            if (!engineExists) {
                const newEngine = new EngineModelDB({
                    title,
                    location,
                    installationLocation,
                    inventoryNumber,
                    accountNumber,
                    type,
                    power,
                    coupling,
                    status,
                    comments: comments || 'Нет комментариев',
                    historyOfTheInstallation: historyOfTheInstallation || 'История установки отсутствует',
                    historyOfTheRepair: historyOfTheRepair || 'История ремонта отсутствует',
                    date,
                    positions: []  // Инициализируем пустой массив positions
                });

                await newEngine.save();
                console.log('Двигатель успешно добавлен.');
            } else {
                throw new Error("Двигатель с таким названием уже существует");
            }
        } catch (error) {
            console.error('Ошибка при добавлении двигателя:', error.message);
            throw error;
        }
    }
}

export default Engine;