import MenuHeader from "../../components/MenuHeader/MenuHeader.jsx";
import MenuIcon from "../../assets/icons/MenuIcon.svg"
import search from '../../assets/icons/SearchIcon.svg'
import Button from 'react-bootstrap/Button';
import {useEffect, useState} from "react";
import UniversalModal from "../../components/Modals/UniversalModal/UniversalModal.jsx";
import {fetchData, getFetchData} from "../../../Validation.js";

function EditDataBase(){
    const [showModal, setShowModal] = useState(false);
    const [formFields, setFormFields] = useState([]);
    const [modalTitle, setModalTitle] = useState('');
    const [modalType, setModalType] = useState('');
    const [action, setAction] = useState('');
    const [method, setMethod] = useState('');
    const [initialValues, setInitialValues] = useState({});
    const [positionsData, setPositionsData] = useState([]); // Данные позиций с сервера
    const [selectedInstallationPlaces, setSelectedInstallationPlaces] = useState([]);

    const handleDataSubmission = () => {
        setShowModal(false);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    // Загрузка данных с сервера
    const getFromServer = async () => {
        const response = await getFetchData('getPositions');
        if (response && response.status === 'error') {
            console.log('Ошибка:', response.error);
        } else {
            setPositionsData(response.data);
            console.log('Позиции успешно загружены!');
            if (response.data.length > 0) {
                handlePositionChange(response.data[0].position); // Обновляем места установки для первой позиции по умолчанию
            }
        }
    }

    // Обновление installationPlaces при изменении позиции
    const handlePositionChange = (selectedPosition) => {
        const selectedData = positionsData.find(position => position.position === selectedPosition);
        if (selectedData) {
            setSelectedInstallationPlaces(selectedData.installationPlaces || []);
        } else {
            setSelectedInstallationPlaces([]);
        }
    };

    useEffect(() => {
        getFromServer();
    }, []);

    useEffect(()=>{
        console.log('selectedInstallationPlaces:', selectedInstallationPlaces);
    }, [selectedInstallationPlaces]);

    const saveFormType = (formType) => {
        switch (formType) {
            case 'addPosition':
                setFormFields([
                    { id: 'position', label: 'Место нахождения:', formType: 'field' },
                    { id: 'installationPlace', label: 'Необязательно - Места установки (через запятую):', formType: 'fieldTextArea' }
                ]);
                setInitialValues({
                    position: '',
                    installationPlace: ''
                });
                setModalTitle('Добавить место нахождения');
                setAction('addPosition');
                setMethod('POST');
                setModalType('form');
                setShowModal(true);
                break;

            case 'delPosition':
                setFormFields([
                    { id: 'position', label: 'Место нахождения:', formType: 'selectMenu', selectMenu: positionsData.map(position => position.position), isPosition: true },
                ]);
                setInitialValues({
                    position: positionsData[0]?.position || '',
                });
                setAction('delPosition');
                setMethod('DELETE');
                setModalTitle('Удалить место нахождения');
                setModalType('form');
                setShowModal(true);
                break;

            case 'addInstallationPlace':
                setFormFields([
                    { id: 'position', label: 'Место нахождения:', formType: 'selectMenu', selectMenu: positionsData.map(position => position.position), isPosition: true },
                    { id: 'installationPlace', label: 'Необязательно - Места установки (через запятую):', formType: 'fieldTextArea' }
                ]);
                setInitialValues({
                    position: positionsData[0]?.position || '',
                    installationPlace: ''
                });
                setModalTitle('Добавить место установки');
                setAction('addInstallationPlace');
                setMethod('POST');
                setModalType('form');
                setShowModal(true);
                break;

            case 'delInstallationPlace':
                if (positionsData.length > 0) {
                    const defaultPosition = positionsData[0].position;
                    handlePositionChange(defaultPosition);

                    setInitialValues({
                        position: defaultPosition,
                        installationPlace: selectedInstallationPlaces[0] || ''
                    });

                    setFormFields([
                        { id: 'position', label: 'Место нахождения:', formType: 'selectMenu', selectMenu: positionsData.map(position => position.position), isPosition: true },
                        { id: 'installationPlace', label: 'Место установки:', formType: 'selectMenu', selectMenu: selectedInstallationPlaces },
                    ]);
                }

                setAction('delInstallationPlace');
                setMethod('DELETE');
                setModalTitle('Удалить место установки');
                setModalType('form');
                setShowModal(true);
                break;
        }
    }

    return(
        <>
            <MenuHeader title="Управление БД" pathToMain={"/"} titleButtonMain="Меню" imgPathToMain={MenuIcon} imgPathToSearch={search} pathToSearch={'/AggregateJournal'} titleButtonSearch="Поиск"/>
            <div className=" ">
                <div className="col-12 styles-card bg-gray mt-3 mt-md-0 d-flex flex-column flex-md-row pt-3 pb-3 p-md-auto">
                    <Button className='m-2 col-auto' onClick={() => saveFormType('addPosition')}>Добавить место нахождения</Button>
                    <Button className='m-2 col-auto' onClick={() => saveFormType('delPosition')}>Удалить место нахождения</Button>
                </div>
                <div className="col-12 styles-card bg-gray mt-3 mt-md-3 d-flex flex-column flex-md-row pt-3 pb-3 p-md-auto">
                    <Button className='m-2 col-auto' onClick={() => saveFormType('addInstallationPlace')}>Добавить место установки</Button>
                    <Button className='m-2 col-auto' onClick={() => saveFormType('delInstallationPlace')}>Удалить место установки</Button>
                </div>
            </div>
            <UniversalModal
                show={showModal}
                handleClose={closeModal}
                modalType={modalType}
                formFields={formFields}
                title={modalTitle}
                initialValues={initialValues}
                onSubmit={handleDataSubmission}
                action={action}
                method={method}
                onPositionChange={handlePositionChange}  // Передаем функцию для обновления мест установки
                positionsData={positionsData}  // Передаем positionsData в UniversalModal
            />
        </>
    )
}

export default EditDataBase;