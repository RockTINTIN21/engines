import MenuHeader from "../../components/MenuHeader/MenuHeader.jsx";
import MenuIcon from "../../assets/icons/MenuIcon.svg";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styles from "./EnginePassport.module.css";
import {Field, Formik} from "formik";
import search from '../../assets/icons/SearchIcon.svg';
import defaultImagePassport from '../../assets/engines/defaultImagePassport.png';
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import FormSelect from "../../components/Forms/FormSelect/FormSelect.jsx";
import FormControl from "../../components/Forms/FormControl/FormControl.jsx";

import { Link, useParams } from "react-router-dom";
import UniversalModal from "../../components/Modals/UniversalModal/UniversalModal.jsx";
import { fetchData, getApiDataSearch, getFetchData } from "../../../Validation.js";
import FileUpload from "../../components/Forms/FileUpload/FileUpload.jsx";
import SuccessModal from "../../components/Modals/SuccessModal/SuccessModal.jsx";

function EnginePassport() {
    const { engineId } = useParams();
    const [subPlace, setSubPlace] = useState([]); // Состояние для подстановки мест установки
    const [showModal, setShowModal] = useState(false);
    const [formFields, setFormFields] = useState([]);
    const [modalType, setModalType] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [positionsData, setPositionsData] = useState([]);
    const [positionsDataForRepairHistory, setPositionsDataForRepairHistory] = useState([]);
    const [initialValuesForRepair, setInitialValuesForRepair] = useState([])
    const [action, setAction] = useState(null)
    const [imageFileId, setImageFileId] = useState(null); // Добавляем новое состояние для imageFileId
    const [propsFormDeleteModal,setPropsFormDeleteModal] = useState(null)
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const closeUniversalModal = () => setShowSuccessModal(false);
    const handleDataSubmission = () => {
        setShowModal(false);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const [formSelectLocation, setFormSelectLocation] = useState([{ mainPlace: '', subPlace: [] }]);

    const getFromServer = async () => {
        const response = await getFetchData('getPositions');
        if (response && response.status === 'error') {
            console.log('Ошибка:', response.error);
        } else {
            const formattedData = response.data.map(position => ({
                mainPlace: position.position,
                subPlace: position.installationPlaces || [],
            }));
            setFormSelectLocation(formattedData);
            setPositionsData(response.data);
            setPositionsDataForRepairHistory(response.data);
            console.log('showModal:',showModal)
            if (response.data.length > 0) {
                handlePositionChangeForRepairHistory(response.data[0].position); // Обновляем места установки для первой позиции по умолчанию
            }
        }
    };

    const formSelectCoupling = ['Да', 'Нет'],
        formSelectStatus = ['Готов', 'В ср. рем', 'В кап. рем'];

    useEffect(() => {
        getFromServer();
    }, []);


    const [enginePassportFormDB, setEnginePassportFromDB] = useState(null);

    const [initialValues, setInitialValues] = useState({
        title: '',
        location: '',
        installationPlace: '',
        iventNumber: '',
        accountNumber: '',
        power: '',
        coupling: '',
        status: '',
        historyOfTheInstallation: [],
        historyOfTheRepair: []
    });

    const [formValues, setFormValues] = useState(initialValues);

    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setFormValues(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        if (JSON.stringify(formValues) === JSON.stringify(initialValues)) {
            setDisabledButton(true);
        } else {
            setDisabledButton(false);
        }
    }, [formValues]);

    const [disabledButton, setDisabledButton] = useState(true);
    const formSelectedLocation = formSelectLocation.map(elem => elem.mainPlace);
    const handlePositionChangeForRepairHistory = (selectedPosition) => {
        const selectedDataForRepair = positionsDataForRepairHistory.find(position => position.position === selectedPosition);
        if (selectedDataForRepair ) {
            updateFormFields(selectedPosition, selectedDataForRepair.installationPlaces);
        } else {
            updateFormFields(selectedPosition, []);
        }
    };
    const saveFormType = (formType,values) =>{
        if(formType === 'historyRepair'){
            handlePositionChangeForRepairHistory()
            setModalType('form');
            setAction('addHistoryRepair');
            setShowModal(true)
        }else if(formType === 'retryMenu'){
            setModalTitle('Удалить запись');
            setAction('delEngine');
            setModalType('retryMenu');
            values.id = engineId
            setPropsFormDeleteModal({values:values,action:'deleteEngine',method:'DELETE'})
            setShowModal(true)
            // submitOnServerEnginesData(values,'editEngine','PATCH');
        }else if(formType === 'successMenu'){
            setShowSuccessModal(true)
        }


    }
    // switch (formType){
    //     case 'repairHistory':
    //
    // }
    const updateFormFields = (position, installationPlacesForRepairHistory) => {
        setInitialValuesForRepair({
            engineId: engineId,
            position: position || '',
            installationPlace: installationPlacesForRepairHistory[0],
            repairDescription: '',
            date: ''
        });
        setFormFields([
            { id: 'position', label: 'Место нахождения:', formType: 'selectMenu', selectMenu: positionsDataForRepairHistory.map(position => position.position), isPosition: true },
            { id: 'installationPlace', label: 'Место установки:', formType: 'selectMenu', selectMenu: installationPlacesForRepairHistory },
            { id: 'repairDescription', label: 'Описание ремонта:', formType: 'fieldTextArea' },
            { id: 'date', label: 'Дата установки:', formType: 'date' }
        ]);
        setModalTitle('Добавить в историю ремонтов');
        setModalType('form');

    };

    // Функция для обработки изменений местоположения и обновления списка мест установки
    const handlePositionChange = (selectedPosition) => {
        const selectedData = positionsData.find(position => position.position === selectedPosition);
        if (selectedData) {
            console.log(selectedData.installationPlaces || [])
            setSubPlace(selectedData.installationPlaces || []);
            updateFormFields(selectedPosition, selectedData.installationPlaces);
        } else {
            setSubPlace([]);
            updateFormFields(selectedPosition, []);
        }
    };

    const handleLocationChange = (selectedLocation) => {
        const selectedData = formSelectLocation.find(location => location.mainPlace === selectedLocation);
        if (selectedData) {
            setSubPlace(selectedData.subPlace || []);
            setFormValues(prevState => ({
                ...prevState,
                location: selectedLocation,
                installationPlace: selectedData.subPlace[0] || ''
            }));
        } else {
            setSubPlace([]);
            setFormValues(prevState => ({
                ...prevState,
                location: selectedLocation,
                installationPlace: ''
            }));
        }
    };



    const submitOnServer = async (engineId) => {
        try {
            const response = await getApiDataSearch({ engineId }, 'getEngineByID');
            if (response.status === 'error') {
                console.error('Ошибка:', response.message);
            } else {
                setEnginePassportFromDB(response.data);  // Обновляем состояние
                console.log('Данные двигателя:', response.data);
                setImageFileId(response.data.imageFileId)
                console.log('setImageField:', imageFileId)
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
        }
    };

    useEffect(() => {
        if (engineId) {
            submitOnServer(engineId);
        }
    }, [engineId]);

    useEffect(() => {
        if (positionsData.length > 0) {
            const defaultPosition = positionsData[0].position;
            handlePositionChange(defaultPosition);
        }
    }, [positionsData]);

    useEffect(() => {
        if (enginePassportFormDB) {
            setFormValues({
                title: enginePassportFormDB.title || '',
                location: enginePassportFormDB.location || '',
                installationPlace: enginePassportFormDB.installationPlace || '',
                iventNumber: enginePassportFormDB.inventoryNumber || '',
                accountNumber: enginePassportFormDB.accountNumber || '',
                power: enginePassportFormDB.power || '',
                coupling: enginePassportFormDB.coupling || '',
                status: enginePassportFormDB.status || '',
                comments: enginePassportFormDB.comments || '',
                historyOfTheInstallation: enginePassportFormDB.historyOfTheInstallation || [''],
                historyOfTheRepair: enginePassportFormDB.historyOfTheRepair || [''],
            });
            setDisabledButton(false);
        }
    }, [enginePassportFormDB]);
    const [imageUrl, setImageUrl] = useState('');


    useEffect(() => {
        const fetchImage = async () => {
            try {
                console.log('imageField:',imageFileId)
                if(imageFileId){
                    const response = await fetch(`http://localhost:3000/api/image/${imageFileId}`);
                    if (response.ok) {
                        const blob = await response.blob(); // Получаем Blob объекта изображения
                        setImageUrl(URL.createObjectURL(blob)); // Создаем URL для Blob и сохраняем его в состоянии
                    } else {
                        console.log('error')
                    }
                }

            } catch (error) {
                console.error('Ошибка при загрузке изображения:', error);
            }
        };

        if (imageFileId) {
            fetchImage();
        }else{
            setImageUrl(defaultImagePassport);
            console.log('test',imageUrl)
        }
    }, [imageFileId]);

    const submitOnServerEnginesData =  async (values,action,method) =>{
        try {
            values.id = engineId
            console.log(
                'Обновленные значения:',values
            )
            const response = await fetchData(values, action,method);
            if (response.status === 'error') {
                console.error('Ошибка:', response.message);
            } else {
                saveFormType('successMenu')
                console.log('Cool!')
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
        }
    }

    if (!enginePassportFormDB) {
        return <div className='text-center'><h1>Загрузка...</h1></div>; // Показываем индикатор загрузки, пока данные не загружены
    }

    return (
        <>
            <MenuHeader title="Паспорт двигателя"
                        pathToMain={"/"}
                        titleButtonMain={"К меню"}
                        imgPathToMain={MenuIcon}
                        pathToSearch={"/AggregateJournal"}
                        titleButtonSearch={"К поиску"}
                        imgPathToSearch={search}
            />
            <div className="mt-4">
                <div className="container-fluid">
                    <Formik enableReinitialize={true} initialValues={formValues}
                            onSubmit={(values) => {
                                const cleanedValues = { ...values };
                                delete cleanedValues.historyOfTheInstallation;
                                delete cleanedValues.historyOfTheRepair;
                                console.log('Значения из формы:', cleanedValues);
                                submitOnServerEnginesData(values,'updateEngine','PATCH');
                            }}
                    >
                        {({ handleSubmit, handleChange, values, touched, errors }) => (
                            <Form className="row" onSubmit={handleSubmit}>
                                <div
                                    className="styles-card p-3 mb-4 bg-gray d-flex flex-column flex-md-row justify-content-between align-items-center">
                                    <h4 className="p-0 m-0 col-12 col-md-8 text-center text-md-start ps-md-2 ps-0">
                                        Двигатель: {formValues.title}
                                    </h4>
                                    <div
                                        className="d-flex flex-column flex-md-row w-100 mt-2 mt-md-0 justify-content-md-end">
                                        <Button className="me-2 w-100 w-md-auto mt-2 mt-md-0" disabled={disabledButton} type='submit'>Сохранить
                                            изменения</Button>
                                        <Button className="bg-danger w-100 w-md-auto mt-2 mt-md-0 text-white"
                                                onClick={() => saveFormType('retryMenu',values)}>Удалить запись</Button>
                                    </div>
                                </div>
                                <div className="col-auto ps-mb-0 d-flex flex-column align-items-center">
                                    <div className="mb-3">
                                        {
                                            imageUrl ?
                                        <img
                                            src={imageUrl}
                                            alt="Фото двигателя"
                                            className={`styles-card bg-gray 
                                            ${styles.adaptiveSize}`}
                                        />: 'Изображение недоступно'
                                        }
                                    </div>
                                    <div className="w-100 pb-3 pb-md-0">
                                        <FileUpload name="file" label="Обновить фото" applyStyles={true}/>
                                    </div>
                                </div>
                                <div className="col-12 col-md-5 ps-md-3">
                                    <FormControl
                                        label='Название:'
                                        name='title'
                                        value={formValues.title}
                                        formikValue={values.title}  // Передаем значение из Formik
                                        onChange={handleChangeValue}
                                        touched={touched}
                                        errors={errors}
                                        handleChange={handleChange}
                                        serverErrors={'test'}
                                    />
                                    <FormSelect
                                        label='Место нахождения:'
                                        name="location"
                                        value={values.location}
                                        formikValue={formValues.location}
                                        options={formSelectedLocation}
                                        onChange={(e) => handleLocationChange(e.target.value)}
                                        handleChange={handleChange}
                                        serverErrors={'test'}
                                        touched={touched}
                                        errors={errors}
                                    />
                                    <FormSelect
                                        label='Место установки:' name="installationPlace"
                                        value={values.installationPlace}
                                        formikValue={formValues.installationPlace}
                                        options={subPlace}
                                        onChange={handleChangeValue}
                                        handleChange={handleChange}
                                        serverErrors={'test'}
                                        touched={touched}
                                        errors={errors}
                                    />
                                    <FormControl
                                        value={values.iventNumber}
                                        formikValue={formValues.iventNumber}
                                        label='Ивент. номер:'
                                        name='iventNumber'
                                        onChange={handleChangeValue}
                                        handleChange={handleChange}
                                        touched={touched}
                                        errors={errors}
                                        serverErrors={'test'}/>
                                    <FormControl
                                        value={values.accountNumber}
                                        formikValue={formValues.accountNumber}
                                        label='Учет. номер:'
                                        name='accountNumber'
                                        onChange={handleChangeValue}
                                        handleChange={handleChange}
                                        touched={touched}
                                        errors={errors}
                                        serverErrors={'test'}
                                    />

                                    <FormControl
                                        value={values.power}
                                        formikValue={formValues.power}
                                        label='Мощность(кВт):'
                                        name='power'
                                        onChange={handleChangeValue}
                                        handleChange={handleChange}
                                        touched={touched}
                                        errors={errors}
                                        serverErrors={'test'}
                                    />
                                    <FormSelect
                                        label='Муфта:'
                                        name="coupling"
                                        value={values.coupling}
                                        formikValue={formValues.coupling}
                                        options={formSelectCoupling}
                                        onChange={handleChangeValue}
                                        handleChange={handleChange}
                                        serverErrors={'test'}
                                        touched={touched}
                                        errors={errors}
                                    />
                                    <FormSelect
                                        label='Готов / Не готов:'
                                        name="status"
                                        value={values.status}
                                        formikValue={formValues.status}
                                        options={formSelectStatus}
                                        onChange={handleChangeValue}
                                        handleChange={handleChange}
                                        serverErrors={'test'}
                                        touched={touched}
                                        errors={errors}
                                    />
                                </div>
                                <div className="col-md col-12">
                                    <Link><Button className="w-100 mb-3">Ссылка на адрес хранения</Button></Link>
                                    <Link><Button className="w-100 mb-3">Док. От произ. мест.</Button></Link>
                                </div>
                                <Form.Group className="col-12 col-md-4 mt-4 p-3 me-4 flex-wrap bg-gray styles-card">
                                    <Form.Label className="mb-0">Комментарии от обслуживающего персонала, советы при обслуживании, особенности в обслуживании:</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        value={formValues.comments || values.comments || ''}
                                        className={`w-100 mt-3 ${styles.textarea}`}
                                        onChange={(e)=> {handleChangeValue(e); handleChange(e)}}
                                        id='comments'  // 'id' явно указан
                                        name='comments'
                                        isInvalid={touched.comments && !!errors.comments}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.comments}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="col-md col-12 mt-4 me-4 p-3 bg-gray styles-card flex-wrap"
                                            controlId="formBasicEmail">
                                    <div className="w-100 pb-4">
                                        <Form.Label className="mb-0">История мест установки:</Form.Label></div>
                                    <Table striped bordered hover>
                                        <thead>
                                        <tr>
                                            <th>Место:</th>
                                            <th>Статус:</th>
                                            <th>Дата:</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {formValues.historyOfTheInstallation.map((elem, index) => (
                                            <tr key={index}>
                                                <td>{elem.installationPlace}</td>
                                                <td>{elem.status}</td>
                                                <td>{elem.date}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                </Form.Group>
                                <Form.Group className="col-md col-12 mt-4 me-4 p-3 bg-gray styles-card flex-wrap"
                                            controlId="formBasicEmail">
                                    <div className="w-100 pb-4">
                                        <Form.Label className="mb-0 pb-1">История выполняемых ремонтов:</Form.Label>
                                        <Button className="w-100" onClick={() => saveFormType('historyRepair')}>Добавить
                                            запись</Button>
                                    </div>
                                    <Table striped bordered hover>
                                        <thead>
                                        <tr>
                                            <th>Место:</th>
                                            <th>Описание:</th>
                                            <th>Дата:</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {formValues.historyOfTheRepair.length > 0 ? (
                                            formValues.historyOfTheRepair.map((elem, index) => (
                                                <tr key={index}>
                                                    <td>{elem.installationPlace}</td>
                                                    <td>{elem.repairDescription}</td>
                                                    <td>{elem.date}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center">Здесь пока ничего нет</td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </Table>
                                </Form.Group>
                            </Form>
                        )}
                    </Formik>
                    <UniversalModal
                        show={showModal}
                        handleClose={closeModal}
                        modalType={modalType}
                        formFields={formFields}
                        title={modalTitle}
                        initialValues={initialValuesForRepair}
                        onSubmit={handleDataSubmission}
                        action={action}
                        method='POST'
                        onPositionChange={handlePositionChangeForRepairHistory}
                        positionsData={positionsData}
                        propsFormDeleteModal = {propsFormDeleteModal}
                    />
                    <SuccessModal showModal={showSuccessModal} closeModal={closeUniversalModal}></SuccessModal>
                </div>
            </div>
        </>
    );
}

export default EnginePassport;
