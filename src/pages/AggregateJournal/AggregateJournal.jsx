// AggregateJournal.jsx
import MenuHeader from "../../components/MenuHeader/MenuHeader.jsx";
import MenuIcon from "../../assets/icons/MenuIcon.svg";
import DataBaseIcon from "../../assets/icons/DataBaseIcon.svg";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styles from "./AggregateJournal.module.css";
import { Formik } from "formik";
import search from '../../assets/icons/SearchIcon.svg';
import edit from '../../assets/icons/EditIcon.svg';
import {useEffect, useRef, useState} from "react";
import UniversalModal from "../../components/Modals/UniversalModal/UniversalModal.jsx";
import {getAllEngines, getApiDataSearch, getFetchData} from "../../../Validation.js";
import {Table} from "react-bootstrap";
import {Link} from "react-router-dom";

function AggregateJournal() {
    const [isMainHovered, setIsMainHovered] = useState(false);
    const [isEditHovered, setIsEditHovered] = useState(false);
    const [initialValues, setInitialValues] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [formFields, setFormFields] = useState([]);
    const [modalType, setModalType] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [positionsData, setPositionsData] = useState([]);

    const formSelectCoupling = ['Готов', 'Не готов'];
    const formSelectStatus = ['В кап. рем', 'Готов', 'В ср. рем'];

    const handleDataSubmission = () => {
        setShowModal(false);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const getFromServer = async () => {
        const response = await getFetchData('getPositions');
        if (response && response.status === 'error') {
            console.log('Ошибка:', response.error);
        } else {
            setPositionsData(response.data);
            if (response.data.length > 0) {
                handlePositionChange(response.data[0].position); // Обновляем места установки для первой позиции по умолчанию
            }
        }
    };

    const handlePositionChange = (selectedPosition) => {
        const selectedData = positionsData.find(position => position.position === selectedPosition);
        if (selectedData) {
            console.log('Выбрано!')
            updateFormFields(selectedPosition, selectedData.installationPlaces);
        } else {
            console.log('else')
            updateFormFields(selectedPosition, []);
        }
    };

    const updateFormFields = (position, installationPlaces) => {
        console.log('installationPlaces',installationPlaces)
        setInitialValues({
            title: '',
            position: position || '',
            installationPlace: installationPlaces[0] || '',
            inventoryNumber: '',
            account: '',
            type: '',
            power: '',
            coupling: formSelectCoupling[0],
            status: formSelectStatus[0],
            linkOnAddressStorage:'',
            docFromPlace:'',
            date: ''

        });
        console.log('installationPlaces2',installationPlaces)
        const test = installationPlaces || ''
        console.log('test',test)
        const test2 = { id: 'installationPlace', label: 'Место установки:', formType: 'selectMenu', selectMenu: test }
        setFormFields([
            { id: 'title', label: 'Название двигателя:', formType: 'field' },
            { id: 'position', label: 'Место нахождения:', formType: 'selectMenu', selectMenu: positionsData.map(position => position.position), isPosition: true },
            test2,
            { formType: 'image'},
            { id: 'inventoryNumber', label: 'Ивент. Номер:', formType: 'field' },
            { id: 'account', label: 'Учет. Номер:', formType: 'field' },
            { id: 'type', label: 'Тип:', formType: 'field' },
            { id: 'power', label: 'Мощность:', formType: 'field' },
            { id: 'coupling', label: 'Муфта:', formType: 'selectMenu', selectMenu: formSelectCoupling },
            { id: 'status', label: 'Готов / Не готов:', formType: 'selectMenu', selectMenu: formSelectStatus },
            { id: 'linkOnAddressStorage', label: 'Ссылка на адрес хранения:', formType: 'field' },
            { id: 'docFromPlace', label: 'Ссылка на документацию от производителя:', formType: 'field' },
            { id: 'date', label: 'Дата:', formType: 'date' }
        ]);
        console.log('formFields:',formFields[2])
    };

    useEffect(() => {
        getFromServer();
    }, []);

    useEffect(() => {
        if (positionsData.length > 0) {
            const defaultPosition = positionsData[0].position;
            handlePositionChange(defaultPosition);
        }
    }, [positionsData]);

    const saveFormType = async () => {
        // Открытие модального окна
        setModalTitle('Добавить запись');
        setModalType('form');
        setShowModal(true);
    };

    const [status, setStatus] = useState('Здесь пока ничего нет. Начните искать в поиске');
    const formSelectList = [
        { title: 'Место нахождения', validationType: 'getEngineByLocation', value: { location: "" } },
        { title: 'Место установки', validationType: 'getEngineByInstallationPlace', value: { installationPlace: "" } },
        { title: 'Инвентарный номер', validationType: 'getEngineByInventoryNumber', value: { inventoryNumber: "" } }
    ];

    const [formTitle, setFormTitle] = useState(formSelectList[0].title);
    const [formValue, setFormValue] = useState(formSelectList[0].value);
    const [actionSearch, setActionSearch] = useState(formSelectList[0].validationType);
    const handleChangeSelectMenu = (e, resetForm) => {
        const key = formSelectList.findIndex(elem => elem.title === e.target.value);
        setFormTitle(formSelectList[key].title);
        setActionSearch(formSelectList[key].validationType);
        setFormValue(formSelectList[key].value || {}); // Убедитесь, что value всегда определено
        resetForm({ values: formSelectList[key].value || {} });
    };

    const formSelectedList = formSelectList.map((elem, index) => (
        <option key={index} value={elem.title}>{elem.title}</option>
    ));
    const [engineList, setEngineList] = useState([]);
    const submitOnServer = async (values) => {
        const response = await getApiDataSearch(values, actionSearch);
        if (response.status === 'error') {
            setStatus('Ничего не найдено');
        } else {
            setStatus('');
            // Оборачиваем объект в массив, если ответ не является массивом
            const data = Array.isArray(response.data) ? response.data : [response.data];
            setEngineList(data);
        }
    };
    const showAllEngines = async () =>{
        const response = await getAllEngines();
        if (response.status === 'error') {
            setStatus('Ничего не найдено')
        } else {
            setStatus('')
            setEngineList(response.data)
        }
    }
    useEffect(() => {
        console.log('Двигатели:',engineList)
    }, [engineList]);
    return (
        <>
            <MenuHeader title="Агрегатный журнал" pathToMain={"/"} titleButtonMain="Меню" imgPathToMain={MenuIcon}
                        imgPathToSearch={DataBaseIcon} pathToSearch={'/AggregateJournal/EditDataBase'}
                        titleButtonSearch="Управление БД"/>
            <div className={`container styles-card p-2 bg-gray `}>
                <div className="m-2 ">
                    <Formik
                        initialValues={formValue}
                        enableReinitialize={true}
                        onSubmit={(values) => {
                            submitOnServer(values);
                        }}
                    >
                        {({handleSubmit, handleChange, values, touched, errors, resetForm}) => (
                            <Form onSubmit={handleSubmit}
                                  className="m-1 col-md-12 col-auto d-flex flex-column flex-md-row">
                                <div className="col-md-7 col-auto d-flex">
                                    <Form.Group controlId="formBasic" className="col-md-10 col-auto">
                                        <Form.Control type="text" className={`h-100 ${styles.formSearch}`}
                                                      placeholder={formTitle}
                                                      name={Object.keys(formValue)[0]}
                                                      value={values[Object.keys(formValue)[0]]}
                                                      onChange={handleChange}
                                                      isInvalid={touched[Object.keys(formValue)[0]] && !!errors[Object.keys(formValue)[0]]}
                                        />
                                        <Form.Control.Feedback
                                            type="invalid">{errors[Object.keys(formValue)[0]]}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Button type="submit"
                                            className={`h-100 col ${styles.btnSubmit} pt-2 p-0 pe-md-3 pe-1 ms-0 text-center `}
                                            onMouseEnter={() => setIsMainHovered(true)}
                                            onMouseLeave={() => setIsMainHovered(false)}
                                    >
                                        <img src={search}
                                             className={`${styles.icon} ${isMainHovered ? styles.hover : ''} p-0`}
                                             alt="Search"/>
                                        Найти
                                    </Button>
                                </div>

                                <Form.Select defaultValue={formSelectList[0].title}
                                             className={`col ms-md-3 pt-2  mt-2 mt-md-0 selectMenu`}
                                             onChange={(e) => handleChangeSelectMenu(e, resetForm)}
                                >
                                    {formSelectedList || 'Пусто'}
                                </Form.Select>
                                <Button className="ms-md-3 col-md-auto col-12  mt-2 mt-md-0"
                                        onClick={() => showAllEngines()}
                                >
                                    Показать все
                                </Button>
                                <Button className="ms-md-3 col-md-auto col-12  mt-2 mt-md-0"
                                        onMouseEnter={() => setIsEditHovered(true)}
                                        onMouseLeave={() => setIsEditHovered(false)}
                                        onClick={() => saveFormType()}
                                >
                                    <img src={edit}
                                         className={`${styles.icon} ${isEditHovered ? styles.hover : ''} pe-1`}
                                         alt="Search"/>
                                    Добавить
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
            <div className={`container styles-card p-2 bg-gray mt-3`}>
                <div className={`table-responsive`}>
                    <Table striped bordered hover className={`engineList`} style={{maxHeight: '400px'}}>
                        <thead className={`engineListThead`}>
                        <tr>
                            <th>#</th>
                            <th>Название:</th>
                            <th>Место нахождения:</th>
                            <th>Место установки:</th>
                            <th>Ивент. Номер:</th>
                            <th>Учет. Номер:</th>
                            <th>Тип:</th>
                            <th>Мощность:</th>
                            <th>Муфта:</th>
                            <th>Готов / Не готов:</th>
                            <th>Комментарии:</th>
                            <th>Дата:</th>
                        </tr>
                        </thead>
                        <tbody>
                        {engineList.length > 0 ? (
                            engineList.map((engine, index) => {
                                const handleRowClick = () => {
                                    window.location.href = `/AggregateJournal/EnginePassport/${engine._id}`;
                                };

                                const renderRow = () => (
                                    <>
                                        <td>{index + 1}</td>
                                        <td>{engine.title}</td>
                                        <td>{engine.location}</td>
                                        <td>{engine.installationPlace}</td>
                                        <td>{engine.inventoryNumber}</td>
                                        <td>{engine.accountNumber}</td>
                                        <td>{engine.type}</td>
                                        <td>{engine.power} кВт</td>
                                        <td>{engine.coupling}</td>
                                        <td>{engine.status}</td>
                                        <td>{engine.comments}</td>
                                        <td>{engine.date}</td>
                                    </>
                                );

                                switch (engine.status) {
                                    case 'Готов':
                                        return (
                                            <tr key={index} className={`bgReady`} onClick={handleRowClick}
                                                style={{cursor: 'pointer'}}>
                                                {renderRow()}
                                            </tr>
                                        );
                                    case 'В кап. рем':
                                        return (
                                            <tr key={index} className={`bgHeavyRepair`} onClick={handleRowClick}
                                                style={{cursor: 'pointer'}}>
                                                {renderRow()}
                                            </tr>
                                        );
                                    case 'В ср. рем':
                                        return (
                                            <tr key={index} className={`bgLowRepair`} onClick={handleRowClick}
                                                style={{cursor: 'pointer'}}>
                                                {renderRow()}
                                            </tr>
                                        );
                                    default:
                                        return (
                                            <tr key={index} onClick={handleRowClick} style={{cursor: 'pointer'}}>
                                                {renderRow()}
                                            </tr>
                                        );
                                }
                            })
                        ) : (
                            <tr>
                                <td colSpan="12" className="text-center">{status}</td>
                            </tr>
                        )}
                        </tbody>


                    </Table>
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
                action='addEngine'
                method='POST'
                onPositionChange={handlePositionChange}  // Передаем функцию для обновления мест установки
                positionsData={positionsData}  // Передаем positionsData в UniversalModal
            />
        </>
    )
}

export default AggregateJournal;