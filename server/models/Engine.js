import EngineModelDB from '../models/engineModelDB.js';
import PositionModelDB from "./PositionModelDB.js";
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
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

    // Метод для поиска двигателей по местонахождению (location)
    async getEngineByLocation(location) {
        try {
            const engines = await EngineModelDB.find({
                location: { $regex: new RegExp('^' + location.toLowerCase(), 'i') }  // Используем регистронезависимый поиск
            });
            if (engines.length === 0) {
                throw new Error("Двигатели с таким местонахождением не найдены");
            }
            return engines;
        } catch (error) {
            console.error('Ошибка при поиске двигателей по местонахождению:', error.message);
            throw error;
        }
    }

    // Метод для поиска двигателей по месту установки (installationPlace)
    async getEngineByInstallationPlace(installationPlace) {
        try {
            const engines = await EngineModelDB.find({
                installationPlace: { $regex: new RegExp('^' + installationPlace.toLowerCase(), 'i') }  // Регистронезависимый поиск
            });
            if (engines.length === 0) {
                throw new Error("Двигатели с таким местом установки не найдены");
            }
            return engines;
        } catch (error) {
            console.error('Ошибка при поиске двигателей по месту установки:', error.message);
            throw error;
        }
    }

    // Метод для поиска двигателей по инвентарному номеру (inventoryNumber)
    async getEngineByInventoryNumber(inventoryNumber) {
        try {
            const engine = await EngineModelDB.findOne({
                inventoryNumber: { $regex: new RegExp('^' + inventoryNumber.toLowerCase(), 'i') }  // Регистронезависимый поиск
            });
            if (!engine) {
                throw new Error("Двигатель с таким инвентарным номером не найден");
            }
            return engine;
        } catch (error) {
            console.error('Ошибка при поиске двигателя по инвентарному номеру:', error.message);
            throw error;
        }
    }


    // Новый метод для поиска двигателя по его ID
    async getEngineById(engineId) {
        try {
            const engine = await EngineModelDB.findOne({ _id: engineId });  // Ищем по строковому ID
            if (!engine) {
                throw new Error("Двигатель с таким ID не найден");
            }
            return engine;
        } catch (error) {
            console.error('Ошибка при поиске двигателя по ID:', error.message);
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
// Метод для добавления новых установок к существующей позиции
    async addInstallationPlaceToPosition(position, installationPlace) {
        try {
            console.log('Данные из формы:', position, installationPlace);

            // Ищем позицию по имени (без учета регистра)
            const positionLowerCase = position.toLowerCase();
            const positionDoc = await PositionModelDB.findOne({ positionLowerCase });

            if (!positionDoc) {
                throw new Error("Местонахождение не найдено");
            }

            // Разделяем установки по запятым, чтобы получить массив
            const newInstallationPlaces = installationPlace.split(',').map(place => place.trim());

            // Добавляем новые установки к существующему массиву, избегая дубликатов
            positionDoc.installationPlaces = [...new Set([...positionDoc.installationPlaces, ...newInstallationPlaces])];

            await positionDoc.save();  // Сохраняем изменения в базе данных
            console.log('Установки успешно добавлены.');
        } catch (error) {
            console.error('Ошибка при добавлении установок:', error.message);
            throw error;
        }
    }
    async deleteInstallationPlaceFromPosition(position, installationPlace) {
        try {
            console.log('Данные для удаления установки:', position, installationPlace);

            // Преобразуем название позиции в нижний регистр для поиска
            const positionLowerCase = position.toLowerCase();
            const positionDoc = await PositionModelDB.findOne({ positionLowerCase });

            if (!positionDoc) {
                throw new Error("Местонахождение не найдено");
            }

            // Убираем указанное место установки из массива installationPlaces
            positionDoc.installationPlaces = positionDoc.installationPlaces.filter(
                place => place !== installationPlace
            );

            await positionDoc.save();  // Сохраняем изменения в базе данных
            console.log('Место установки успешно удалено.');
        } catch (error) {
            console.error('Ошибка при удалении места установки:', error.message);
            throw error;
        }
    }

    // Остальные методы остаются неизменными
    async addEngine(title, location, installationPlace, inventoryNumber, accountNumber, type, power, coupling, status, comments, historyOfTheInstallation, historyOfTheRepair, date) {
        try {
            console.log('Данные из формы:', title, location, installationPlace, inventoryNumber, accountNumber, type, power, coupling, status, comments, historyOfTheInstallation, historyOfTheRepair, date);

            const engineExists = await EngineModelDB.findOne({ title: title.toLowerCase() });

            if (!engineExists) {
                const currentDate = moment().format('YYYY-MM-DD');  // Форматируем текущую дату
                const engineId = uuidv4();  // Генерируем уникальный идентификатор

                const newEngine = new EngineModelDB({
                    _id: engineId,  // Устанавливаем сгенерированный UUID в качестве идентификатора
                    title,
                    location,
                    installationPlace,
                    inventoryNumber,
                    accountNumber,
                    type,
                    power,
                    coupling,
                    status,
                    comments: comments || 'Нет комментариев',
                    historyOfTheInstallation: [
                        {
                            installationPlace: installationPlace,
                            status: status,
                            date: currentDate
                        }
                    ],
                    historyOfTheRepair: [],  // Пустой массив, так как ремонта еще не было
                    date
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