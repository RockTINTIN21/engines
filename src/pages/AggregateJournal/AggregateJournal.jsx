import MenuHeader from "../../components/MenuHeader/MenuHeader.jsx";
import MenuIcon from "../../assets/icons/MenuIcon.svg"
import DataBaseIcon from "../../assets/icons/DataBaseIcon.svg"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styles from "./AggregateJournal.module.css"
import {Formik} from "formik";
import search from '../../assets/icons/SearchIcon.svg'
import edit from '../../assets/icons/EditIcon.svg'
import {useEffect, useState} from "react";
import {Table} from "react-bootstrap";
import UniversalModal from "../../components/Modals/UniversalModal/UniversalModal.jsx";
import {fetchData} from "../../../Validation.js";

const placeholder = 'Наименование'
function AggregateJournal(){
    const [isMainHovered, setIsMainHovered] = useState(false);
    const [isEditHovered, setIsEditHovered] = useState(false);
    const [initialValues, setInitialValues] = useState({})
    const [showModal, setShowModal] = useState(false);
    const [formFields, setFormFields] = useState([]);
    const [modalType,setModalType] = useState('')
    const [modalTitle, setModalTitle] = useState('')
    const [selectMenuValuesFromDB,setSelectMenuValuesFromDB] = useState([])
    const submitOnServer =  async (values) => {
        const response = await fetchData(values);
        if(response.status === 'error'){
            const nameField = response.errors.field
            setSelectMenuValuesFromDB();
            console.log('Ошибка')
            // setTimeout(() => {
            //     setServerErrors({[nameField]:false });
            // }, 3000);
        }else{
            console.log('Успешно!');
            // setShowSuccessModal(true);
            // onSubmit();
        }
    }
    // useEffect(() => {
    //
    //     setSelectMenuValuesFromDB()
    // }, []);
    const handleDataSubmission = ()=>{
        setShowModal(false);
    }

    const closeModal = () => {
        setShowModal(false);
    };

    const formSelectPlace = [
        {mainPlace: 'Компрессорная', subPlace: ['P-1', 'P-2']},
        {mainPlace: 'Масло станция', subPlace: ['A-1', 'C-2']}
    ];
    const formSelectStatus = ['В кап. рем', 'Готов','В ср. рем'],
        formSelectCoupling = ['Готов', 'Не готов'],
        formSelectPosition = ['Склад №1', 'Склад №2'],
        iventNumber = '',
        accountNumber = '',
        power = ''
    const [subPlace, setSubPlace] = useState(formSelectPlace[0].subPlace)
    const saveFormType = () => {
        setFormFields([
            {id:'installationTitle',label:'Название двигателя:',formType:'field'},
            {id:'installationPosition',label:'Место нахождения:',formType:'selectMenu',selectMenu:formSelectPosition},
            {id:'installationPlace',label:'Место установки:',formType:'selectMenu',selectMenu:subPlace},
            {id:'installationIventNumber',label:'Ивент. Номер:',formType:'field'},
            {id:'installationAccount',label:'Учет. Номер:',formType:'field'},
            {id:'installationType',label:'Тип:',formType:'field'},
            {id:'installationPower',label:'Мощность:',formType:'field'},
            {id:'installationCoupling',label:'Муфта:',formType:'selectMenu',selectMenu:formSelectCoupling},
            {id:'installationStatus',label:'Готов / Не готов:',formType:'selectMenu',selectMenu:formSelectStatus},
            {id:'installationDate',label:'Дата:',formType:'date'}
        ])
        setInitialValues({
            installationTitle: '',
            installationPosition: formSelectPosition[0],
            installationPlace: subPlace[0],
            installationIventNumber: '',
            installationAccount: '',
            installationType: '',
            installationPower: '',
            installationCoupling: formSelectCoupling[0],
            installationStatus: formSelectStatus[0],
            installationDate: ''
        })
        setModalTitle('Добавить запись')
        setModalType('form')
        setShowModal(true);
    }


    const [status, setStatus] = useState('Здесь пока ничего нет. Начните искать в поиске')
    const formSelectList = [
        { title: 'Место нахождения', validationType: 'getStudentByGroup', value: { group: "" } },
        { title: 'Место установки', validationType: 'getStudentByLastName', value: { lastName: "" } },
        { title: 'Ивент. Номер', validationType: 'getStudentById', value: { id: "" } }
    ];
    const [formTitle, setFormTitle] = useState(formSelectList[0].title);
    const [formValue, setFormValue] = useState(formSelectList[0].value);
    const handleChangeSelectMenu = (e, resetForm) => {
        const key = formSelectList.findIndex(elem => elem.title === e.target.value);
        setFormTitle(formSelectList[key].title);
        setFormValue(formSelectList[key].value);
        resetForm({ values: formSelectList[key].value });
        // setAction(formSelectList[key].validationType);
        // setFormValue(formSelectList[key].value);
        // resetForm({ values: formSelectList[key].value });
    };
    const formSelectedList = formSelectList.map((elem, index) => (
        <option key={index} value={elem.title}>{elem.title}</option>
    ));
    return(
        <>
            <MenuHeader title="Агрегатный журнал" pathToMain={"/"} titleButtonMain="Меню" imgPathToMain={MenuIcon} imgPathToSearch={DataBaseIcon} pathToSearch={'/AggregateJournal/EditDataBase'} titleButtonSearch="Управление БД"/>
            <div className={`container styles-card p-2 bg-gray `}>
                <div className="m-2 ">
                    <Formik
                        initialValues={formValue}
                        enableReinitialize={true}
                        // validationSchema={validationSchemaRightPanel(action)}
                        // onSubmit={(values) => {
                        //     submitOnServer(values);
                        // }}
                    >
                        {({handleSubmit, handleChange, values, touched, errors, resetForm}) => (
                        <Form className="m-1 col-md-12 col-auto d-flex flex-column flex-md-row">
                            <div className="col-md-7 col-auto d-flex">
                                <Form.Group controlId="formBasic" className="col-md-10 col-auto">
                                    <Form.Control type="text" className={`h-100 ${styles.formSearch}`}
                                                  placeholder={formTitle}
                                                  name={Object.keys(formValue)[0]}
                                                  value={values[Object.keys(formValue)[0]]}
                                                  onChange={handleChange}
                                    />
                                </Form.Group>
                                <Button type="submit" className={`h-100 col ${styles.btnSubmit} p-0 pe-md-3 pe-1 ms-0 text-center `}
                                        onMouseEnter={() => setIsMainHovered(true)}
                                        onMouseLeave={() => setIsMainHovered(false)}
                                >
                                    <img src={search} className={`${styles.icon} ${isMainHovered ? styles.hover : ''} p-0`} alt="Search"/>
                                    Найти
                                </Button>
                            </div>

                            <Form.Select defaultValue={formSelectList[0].title}
                                         className={`col ms-md-3 pt-2  mt-2 mt-md-0 selectMenu`}
                                         onChange={(e)=> handleChangeSelectMenu(e,resetForm)}
                            >
                                {formSelectedList || 'Пусто'}
                            </Form.Select>
                            <Button className="ms-md-3 col-md-2 col-12  mt-2 mt-md-0"
                                    onMouseEnter={() => setIsEditHovered(true)}
                                    onMouseLeave={() => setIsEditHovered(false)}
                                    onClick={()=>saveFormType()}
                            >
                                <img src={edit} className={`${styles.icon} ${isEditHovered ? styles.hover : ''} pe-1`}
                                     alt="Search"/>
                                Добавить
                            </Button>
                        </Form>
                            )}
                    </Formik>
                </div>
            </div>
            <div className={`container styles-card p-2 bg-gray mt-3`}>
                <Table striped bordered hover>
                    <thead>
                    <tr>
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
                    <tr>
                        <td>Склад №1</td>
                        <td>Компрессорная</td>
                        <td>872645</td>
                        <td>50500404</td>
                        <td>А315M2Q3</td>
                        <td>200 кВт</td>
                        <td></td>
                        <td>В кап. рем.</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colSpan="10" className="text-center">{status}</td>
                    </tr>
                    </tbody>
                </Table>
            </div>
            <UniversalModal show={showModal} handleClose={closeModal} modalType={modalType} formFields={formFields} title={modalTitle} initialValues={initialValues} onSubmit={handleDataSubmission} action='addEngine' method='POST'/>
        </>
    )
}

export default AggregateJournal;