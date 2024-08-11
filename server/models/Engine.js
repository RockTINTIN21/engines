import EngineModel from './engineModelDB.js';

class Engine {
    constructor(
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
    ) {
        this.title = title;
        this.location = location;
        this.installationLocation = installationLocation;
        this.inventoryNumber = inventoryNumber;
        this.accountNumber = accountNumber;
        this.type = type;
        this.power = power;
        this.coupling = coupling;
        this.status = status;
        this.comments = comments;
        this.historyOfTheInstallation = historyOfTheInstallation;
        this.historyOfTheRepair = historyOfTheRepair;
        this.date = date;
        this.repository = [
            {
                title: 'АИР 100-S4-872889-50342515',
                location: 'Склад №1',
                installationLocation: 'Компрессорная',
                inventoryNumber: '872645',
                accountNumber: '50500404',
                type: 'А315M2Q3',
                power: '200',
                coupling: 'Нет',
                status: 'В кап. рем.',
                comments: 'Посадка муфты осуществляется с отступом от конца вала на 4мм.',
                historyOfTheInstallation: 'Таблица',
                historyOfTheRepair: 'Таблица',
                date: '11.08.2024'
            }
        ];
    }

    filterEnginesByTitle(title) {
        const filtered = this.repository.filter(engine => engine.title.toLowerCase() === title.toLowerCase());
        console.log(title);
        if (filtered.length === 0) {
            console.log('Ошибка: ', filtered);
            const error = new Error("Такого двигателя не существует");
            error.name = "title";
            throw error;
        } else {
            console.log('Успешно: ', filtered);
            console.log('Обновленный репозиторий:', this.repository);
            return filtered;
        }
    }

    addEngine(title, location, installationLocation, inventoryNumber, accountNumber, type, power, coupling, status, comments, historyOfTheInstallation, historyOfTheRepair, date) {
        const engineExists = this.repository.some(engine => engine.title.toLowerCase() === title.toLowerCase());

        if (!engineExists) {
            const newEngine = {
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
            };

            this.repository.push(newEngine);
            console.log('Двигатель успешно добавлен.');
            console.log('Обновленный репозиторий:', this.repository);
        } else {
            const error = new Error("Двигатель с таким названием уже существует");
            error.name = "title";
            throw error;
        }
    }
}

export default Engine;
// const engineInstance = new Engine(
//     'АИР 100-S4-872889-50342515',  // title
//     'Склад №1',                     // location
//     'Компрессорная',                // installationLocation
//     '872645',                       // inventoryNumber
//     '50500404',                     // accountNumber
//     'А315M2Q3',                     // type
//     '200',                          // power
//     'Нет',                          // coupling
//     'В кап. рем.',                  // status
//     'Посадка муфты осуществляется с отступом от конца вала на 4мм.', // comments
//     'Таблица',                      // historyOfTheInstallation
//     'Таблица',                      // historyOfTheRepair
//     '11.08.2024'                    // date
// );
// const result = engineInstance.filterEnginesByTitle('АИР 100-S4-872889-50342515');
// console.log('Результат фильтрации:', result);

