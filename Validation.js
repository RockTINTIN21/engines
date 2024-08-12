import * as yup from "yup";

// Определение регулярных выражений и текстов ошибок для каждого поля
const regx = {
    installationTitle: { regx: null, errorText: '' },
    installationPosition: { regx: null, errorText: '' },
    installationPlace: { regx: null, errorText: '' },  // Это поле необязательное
    installationIventNumber: { regx: null, errorText: '' },
    installationAccount: { regx: null, errorText: '' },
    installationType: { regx: null, errorText: '' },
    installationPower: { regx: null, errorText: '' },
    installationCoupling: { regx: null, errorText: '' },
    installationStatus: { regx: null, errorText: '' },
    installationDate: { regx: null, errorText: '' },
    position: { regx: null, errorText: '' }  // Это поле обязательное
};

// Функция для создания схемы валидации на основе действия
export const validationSchema = (action) => {
    switch (action) {
        case 'addEngine':
            return yup.object().shape({
                installationTitle: yup.string().required('Обязательно'),
                installationPosition: yup.string().required('Обязательно'),
                installationPlace: yup.string(),  // Поле необязательное, без required
                installationIventNumber: yup.string().required('Обязательно'),
                installationAccount: yup.string().required('Обязательно'),
                installationType: yup.string().required('Обязательно'),
                installationPower: yup.string().required('Обязательно'),
                installationCoupling: yup.string().required('Обязательно'),
                installationStatus: yup.string().required('Обязательно'),
                installationDate: yup.string().required('Обязательно')
            });

        case 'addPosition':
            return yup.object().shape({
                position: yup.string().required('Обязательно'),
                installationPlace: yup.string()  // Поле необязательное, без required
            });

        default:
            return yup.object().shape({});
    }
};
export const fetchData = async (values, action, method) => {
    const requestOptions = {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
    };

    switch (action) {
        case 'addEngine':
            console.log('В фетч:', values);
            try {
                const response = await fetch("http://localhost:3000/api/addEngine", requestOptions);

                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }

                const data = await response.json();
                console.log('Ответ от сервера:', data);

                return data;
            } catch (error) {
                console.error('Ошибка при выполнении fetch:', error);
                throw error; // или обработайте ошибку по-другому
            }
        case 'addPosition':
            console.log('В фетч:', values);
            try {
                const response = await fetch("http://localhost:3000/api/addPosition", requestOptions);

                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }

                const data = await response.json();
                console.log('Ответ от сервера:', data);

                return data;
            } catch (error) {

                console.error('Ошибка при выполнении fetch:', error);
                throw error; // или обработайте ошибку по-другому
            }
        case 'delPosition':
            console.log('В фетч:', values);
            try {
                const response = await fetch("http://localhost:3000/api/delPosition", requestOptions);

                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }

                const data = await response.json();
                console.log('Ответ от сервера:', data);

                return data;
            } catch (error) {

                console.error('Ошибка при выполнении fetch:', error);
                throw error; // или обработайте ошибку по-другому
            }
    }
};
export const getFetchData = async (action) => {
    const requestOptions = {
        method: 'GET'
    };
    switch (action){
        case 'getPositions':
            console.log('В фетч:');
            try {
                const response = await fetch("http://localhost:3000/api/getPositions", requestOptions);

                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }

                const data = await response.json();
                console.log('Ответ от сервера:', data);

                return data;
            } catch (error) {

                console.error('Ошибка при выполнении fetch:', error);
                throw error; // или обработайте ошибку по-другому
            }
    }
}