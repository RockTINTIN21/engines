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
    const [modalTitle, setModalTitle] = useState('')
    const [modalType,setModalType] = useState('')
    const [action,setAction] = useState('')
    const [method,setMethod] = useState('')
    const [initialValues, setInitialValues] = useState({})
    const [formSelectPosition, setFormSelectPosition] = useState()
    const [installationPlaces, setInstallationPlaces] = useState([]);
    const handleDataSubmission = ()=>{
        setShowModal(false);
    }

    const closeModal = () => {
        setShowModal(false);
    }
    // formSelectPosition = ['Склад №1', 'Склад №2']
    const getFromServer = async () => {
        const response = await getFetchData('getPositions');
        if (response.status === 'error') {
            console.log('Ошибка:', response.error);
        } else {
            let arr = response.data.map(position => position.position);
            setFormSelectPosition(arr);
            console.log('Успешно!');
        }
    }

    useEffect(() => {
        getFromServer();
    }, []);

    useEffect(() => {
        console.log(formSelectPosition);
    }, [formSelectPosition]);
    const saveFormType = (formType) => {
        switch (formType){
            case 'addPosition':
                setFormFields([
                    {id:'position',label:'Место нахождения:',formType:'field'},
                    {id:'installationPlace',label:'Необязательно - Места установки(Через запятую):',formType:'fieldTextArea'}
                ])
                setInitialValues({
                    position:'',
                    installationPlace:''
                })
                setModalTitle('Добавить место нахождения')
                setAction('addPosition')
                setMethod('POST')
                break
            case 'delPosition':
                setFormFields([
                    {id:'position',label:'Место нахождения:',formType:'selectMenu',selectMenu: formSelectPosition,isPosition:true},
                ])
                setInitialValues({
                    position:formSelectPosition[0],
                })
                setAction('delPosition')
                setMethod('DELETE')
                setModalTitle('Удалить место нахождения')
                break

            case 'addInstallationPlace':
                setFormFields([
                    {id:'position',label:'Место нахождения:',formType: 'selectMenu',selectMenu:formSelectPosition},
                    {id:'installationPlace',label:'Необязательно - Места установки(Через запятую):',formType:'fieldTextArea'}
                ])
                setInitialValues({
                    position:formSelectPosition[0],
                    installationPlace:''
                })
                setModalTitle('Добавить место установки')
                setAction('addInstallationPlace')
                setMethod('POST')
                break
            case 'delInstallationPlace':
                setFormFields([
                    {id:'position',label:'Место нахождения:',formType:'selectMenu',selectMenu: formSelectPosition},
                    {id:'installationPlace',label:'Место установки:',formType:'field'},
                ])
                setInitialValues({
                    installationTitle:'',
                })
                setAction('delInstallationPlace')
                setMethod('DELETE')
                setModalTitle('Удалить место установки')
                break
        }

        setModalType('form')
        setShowModal(true);
    }
    return(
        <>
            <MenuHeader title="Управление БД" pathToMain={"/"} titleButtonMain="Меню" imgPathToMain={MenuIcon} imgPathToSearch={search} pathToSearch={'/AggregateJournal'} titleButtonSearch="Поиск"/>
            <div className=" ">
                <div className="col-12 styles-card bg-gray mt-3 mt-md-0 d-flex flex-column flex-md-row pt-3 pb-3 p-md-auto">
                    <Button className='m-2 col-auto' onClick={()=>saveFormType('addPosition')}>Добавить место нахождения</Button>
                    <Button className='m-2 col-auto' onClick={()=>saveFormType('delPosition')}>Удалить место нахождения</Button>
                </div>
                <div className="col-12 styles-card bg-gray mt-3 mt-md-3 d-flex flex-column flex-md-row pt-3 pb-3 p-md-auto">
                    <Button className='m-2 col-auto' onClick={()=>saveFormType('addInstallationPlace')}>Добавить место установки</Button>
                    <Button className='m-2 col-auto'>Удалить место установки</Button>
                </div>
            </div>
            <UniversalModal show={showModal} handleClose={closeModal} modalType={modalType} formFields={formFields} title={modalTitle} initialValues={initialValues} onSubmit={handleDataSubmission} action={action} method={method}/>

        </>
    )
}

export default EditDataBase;