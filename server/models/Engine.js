import EngineModelDB from '../models/engineModelDB.js';
import PositionModelDB from "./PositionModelDB.js";

class Engine {
    // Метод для добавления новой позиции в коллекцию `Position`
    async addPosition(position, installationPlace) {
        try {
            console.log('Данные из формы:', position, installationPlace);

            // Преобразуем название позиции в нижний регистр для проверки уникальности
            const positionLowerCase = position.toLowerCase();

            // Проверяем, существует ли уже такая позиция (с учетом регистра)
            const positionExists = await PositionModelDB.findOne({ positionLowerCase });

            if (positionExists) {
                const error = new Error("Такое местонахождение уже существует");
                error.name = "position";
                throw error;
            }

            // Создаем новую позицию
            const newPosition = new PositionModelDB({
                position,  // Храним введенное значение как есть
                positionLowerCase,  // Храним значение в нижнем регистре для проверки уникальности
                installationPlaces: installationPlace ? [installationPlace] : []  // Если installationPlace указано, добавляем его в массив, иначе оставляем пустой массив
            });

            await newPosition.save();  // Сохраняем новую позицию в базе данных
            console.log('Позиция успешно добавлена.');
        } catch (error) {
            console.error('Ошибка при добавлении позиции:', error.message);
            throw error;
        }
    }

    async getPositions() {
        try {
            const positions = await PositionModelDB.find({});  // Получаем все позиции
            return positions;  // Возвращаем найденные позиции
        } catch (error) {
            console.error('Ошибка при получении позиций:', error.message);
            throw error;
        }
    }

    // Метод для удаления позиции
    async deletePosition(position) {
        try {
            console.log('Удаление позиции:', position);

            // Ищем и удаляем позицию из базы данных
            const deletedPosition = await PositionModelDB.findOneAndDelete({ position });

            if (!deletedPosition) {
                const error = new Error("Позиция не найдена");
                error.name = "position";
                throw error;
            }

            console.log('Позиция успешно удалена.');
            return deletedPosition;  // Возвращаем удаленную позицию, если нужно
        } catch (error) {
            console.error('Ошибка при удалении позиции:', error.message);
            throw error;
        }
    }

    // // Метод для добавления новых установок к существующей позиции
    // async addInstallationPlaceToPosition(position, newInstallationPlaces) {
    //     try {
    //         console.log('Данные из формы:', position, newInstallationPlaces);
    //
    //         // Ищем позицию по имени
    //         const positionDoc = await PositionModelDB.findOne({ position: position.toLowerCase() });
    //
    //         if (!positionDoc) {
    //             throw new Error("Местонахождение не найдено");
    //         }
    //
    //         // Добавляем новые установки к существующему массиву
    //         positionDoc.installationPlaces.push(...newInstallationPlaces);
    //
    //         await positionDoc.save();  // Сохраняем изменения в базе данных
    //         console.log('Установки успешно добавлены.');
    //     } catch (error) {
    //         console.error('Ошибка при добавлении установок:', error.message);
    //         throw error;
    //     }
    // }

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