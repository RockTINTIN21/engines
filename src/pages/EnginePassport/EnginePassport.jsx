import MenuHeader from "../../components/MenuHeader/MenuHeader.jsx";
import MenuIcon from "../../assets/icons/MenuIcon.svg"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styles from "./EnginePassport.module.css"
import {Formik} from "formik";
import search from '../../assets/icons/SearchIcon.svg'
import {useEffect, useState} from "react";
import {Table} from "react-bootstrap";
import FormSelect from "../../components/Forms/FormSelect/FormSelect.jsx";
import FormControl from "../../components/Forms/FormControl/FormControl.jsx";
import engineExample from "../../assets/engines/engine_example.png"
import {Link} from "react-router-dom";
import UniversalModal from "../../components/Modals/UniversalModal/UniversalModal.jsx";


function EnginePassport(){
    const [showModal, setShowModal] = useState(false);
    const [formFields, setFormFields] = useState([]);
    const [modalType,setModalType] = useState('')
    const [modalTitle, setModalTitle] = useState('')
    const closeModal = () => {
        setShowModal(false);
    };
    const formSelectPlace = [
        {mainPlace: 'Компрессорная', subPlace: ['P-1', 'P-2']},
        {mainPlace: 'Масло станция', subPlace: ['A-1', 'C-2']}
    ];
    const formSelectedPlace = formSelectPlace.map(elem => elem.mainPlace);
    const [subPlace, setSubPlace] = useState(formSelectPlace[0].subPlace)
    const saveFormType = (formType) => {
        switch (formType){
            case 'historyPlace':
                setFormFields([
                    {id:'installationPlace',label:'Место установки:',formType:'selectMenu',selectMenu:subPlace},
                    {id:'installationStatus',label:'Статус установки:',formType:'selectMenu',selectMenu:formSelectStatus},
                    {id:'installationDate',label:'Дата установки:',formType:'date'}
                ])
                setModalTitle('История мест установки')
                setModalType('form')
                break
            case 'historyRepair':

                setFormFields([
                    {id: 'repairPlace', label: 'Место ремонта:', formType: 'selectMenu', selectMenu: subPlace},
                    {id: 'repairStatus', label: 'Описание ремонта:', formType: 'fieldTextArea', value: ''},
                    {id: 'repairDate', label: 'Дата ремонта:', formType: 'date'}
                ]);
                setModalTitle('История выполняемых ремонтов')
                setModalType('form')
                break
            case 'retryMenu':
                setModalType('retryMenu')
                break
            default:
                setFormFields([])
        }


        setShowModal(true);
    };
    const formSelectStatus = ['В кап. рем', 'Готов','В ср. рем'],
    formSelectCoupling = ['Готов', 'Не готов'],
    formSelectPosition = ['Склад №1', 'Склад №2'],
    iventNumber = '',
    accountNumber = '',
    power = ''

    useEffect(() => {
        console.log(modalType)
    }, [modalType]);

    const initialValues = {
        place: formSelectPosition[0],
        installationLocation:formSelectPlace[0],
        iventNumber:iventNumber,
        accountNumber: accountNumber,
        power:power,
        coupling:formSelectCoupling[0],
        status:formSelectStatus[0]
    }
    const [formValues,setFormValues] = useState(initialValues)
    const handleChangeValue = (e) => {
        const {name,value} = e.target
        setFormValues(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
    useEffect(() => {
        console.log(formValues)
        if(JSON.stringify(formValues) === JSON.stringify(initialValues)){
            setDisabledButton(true)
        }else{
            setDisabledButton(false)
        }
    }, [formValues]);
    const [disabledButton, setDisabledButton] = useState(true)



    return(
        <>
            <MenuHeader title="Паспорт двигателя"
                        pathToMain={"/"}
                        titleButtonMain={"К меню"}
                        imgPathToMain={MenuIcon}
                        pathToSearch={"/AggregateJournal"}
                        titleButtonSearch={"К поиску"}
                        imgPathToSearch={search}
            />
            <div
                className="styles-card p-3 bg-gray d-flex flex-column flex-md-row justify-content-between align-items-center">
                <h4 className="p-0 m-0 col-12 col-md-8 text-center text-md-start ps-md-2 ps-0">Двигатель: АИР 100-S4 - 872889 - 50342515</h4>
                <div className="d-flex flex-column flex-md-row w-100 mt-2 mt-md-0 justify-content-md-end">
                    <Button className="me-2 w-100 w-md-auto mt-2 mt-md-0" disabled={disabledButton}>Сохранить изменения</Button>
                    <Button className="bg-danger w-100 w-md-auto mt-2 mt-md-0 text-white" onClick={()=>saveFormType('retryMenu')}>Удалить запись</Button>
                </div>
            </div>


            <div className=" mt-4">
                <div className="container-fluid">
                    <Formik
                        initialValues={initialValues}
                        enableReinitialize={true}
                        // validationSchema={validationSchemaRightPanel(action)}
                        // onSubmit={(values) => {
                        //     submitOnServer(values);
                        // }}
                    >
                        {({handleSubmit, handleChange, values, touched, errors}) => (
                            <Form className="row">
                                <div className="col-auto ps-mb-0 d-flex flex-column align-items-center">
                                    <div className="mb-3">
                                        <img src={engineExample}
                                             alt="Фото двигателя"
                                             className={`styles-card bg-gray ${styles.adaptiveSize}`}/>
                                    </div>
                                    <div className="w-100 pb-3 pb-md-0">
                                        <Button className="w-100">Обновить фото</Button>
                                    </div>

                                </div>
                                <div className="col-12 col-md-5 ps-md-3">
                                    <FormSelect label='Место нахождения:' name="location" value={formValues.location} options={formSelectPosition} onChange={handleChangeValue} />
                                    <FormSelect label='Место установки:' name="installationLocation" value={formValues.installationLocation} options={formSelectedPlace} onChange={handleChangeValue} />
                                    <FormControl value={formValues.iventNumber} label='Ивент. номер:' name='iventNumber' onChange={handleChangeValue}/>
                                    <FormControl value={formValues.accountNumber} label='Учет. номер:' name='accountNumber' onChange={handleChangeValue}/>
                                    <FormControl value={formValues.power} label='Мощность:' name='power' onChange={handleChangeValue}/>
                                    <FormSelect label='Муфта:' name="coupling" value={formValues.installationLocation} options={formSelectCoupling} onChange={handleChangeValue} />
                                    <FormSelect label='Готов / Не готов:' name="status" value={formValues.installationLocation} options={formSelectStatus} onChange={handleChangeValue} />
                                </div>
                                <div className="col-md col-12">
                                    <Link><Button className="w-100 mb-3">Ссылка на адрес
                                        хранения</Button></Link>
                                    <Link><Button className="w-100 mb-3">Док. От произ. мест.</Button></Link>
                                </div>
                                <Form.Group
                                    className="col-12 col-md-4 mt-4 p-3 me-4 flex-wrap bg-gray styles-card"
                                    controlId="formBasicEmail">
                                    <Form.Label className="mb-0">
                                        Комментарии от обслуживающего персонала,
                                        советы при обслуживании, особенности в обслуживании:
                                    </Form.Label>
                                    <Form.Control as="textarea"
                                                  defaultValue={'Посадка муфты осуществляется с отступом от конца вала на 4мм.'}
                                                  className={`w-100 mt-3 ${styles.textarea}`}/>
                                </Form.Group>

                                <Form.Group
                                    className="col-md col-12 mt-4 me-4 p-3 bg-gray styles-card flex-wrap"
                                    controlId="formBasicEmail">
                                    <div className="w-100 pb-4">
                                        <Form.Label className="mb-0 pb-1">
                                            История мест установки:
                                        </Form.Label>
                                        <Button className="w-100" title='Добавить запись' onClick={()=>saveFormType('historyPlace')}>Добавить запись</Button>
                                    </div>
                                    <Table striped bordered hover>
                                        <thead>
                                        <tr>
                                            <th>Место:</th>
                                            <th>Статус:</th>
                                            <th>Дата:</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>P1</td>
                                            <td>Установили</td>
                                            <td>23.01.2024</td>
                                        </tr>
                                        </tbody>
                                    </Table>
                                </Form.Group>
                                <Form.Group
                                    className="col-md col-12 mt-4 me-4 p-3 bg-gray styles-card flex-wrap"
                                    controlId="formBasicEmail">
                                    <div className="w-100 pb-4">
                                        <Form.Label className="mb-0 pb-1">
                                            История выполняемых ремонтов:
                                        </Form.Label>
                                        <Button className="w-100" onClick={()=>saveFormType('historyRepair')}>Добавить запись</Button>
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
                                        <tr>
                                            <td>P1</td>
                                            <td>Посадка муфты осуществляется с отступом от конца вала на 4мм.
                                            </td>
                                            <td>23.01.2024</td>
                                        </tr>
                                        </tbody>
                                    </Table>
                                </Form.Group>
                            </Form>
                        )}
                    </Formik>
                    <UniversalModal show={showModal} handleClose={closeModal} modalType={modalType} formFields={formFields} title={modalTitle}/>
                </div>
            </div>
        </>
    )

}

export default EnginePassport;
