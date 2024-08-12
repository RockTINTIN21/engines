import MenuHeader from "../../components/MenuHeader/MenuHeader.jsx";
import MenuIcon from "../../assets/icons/MenuIcon.svg"
import search from '../../assets/icons/SearchIcon.svg'
import Button from 'react-bootstrap/Button';
import {useState} from "react";
import UniversalModal from "../../components/Modals/UniversalModal/UniversalModal.jsx";

function EditDataBase(){
    const [showModal, setShowModal] = useState(false);
    const [formFields, setFormFields] = useState([]);
    const [modalTitle, setModalTitle] = useState('')
    const [modalType,setModalType] = useState('')
    const [action,setAction] = useState('')
    const [method,setMethod] = useState('')
    const [initialValues, setInitialValues] = useState({})
    const handleDataSubmission = ()=>{
        setShowModal(false);
    }

    const closeModal = () => {
        setShowModal(false);
    },
    formSelectPosition = ['Склад №1', 'Склад №2']
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
                    {id:'position',label:'Место нахождения:',formType:'selectMenu',selectMenu: formSelectPosition},
                ])
                setInitialValues({
                    installationTitle:'',
                })
                setAction('delPosition')
                setMethod('DELETE')
                setModalTitle('Удалить место нахождения')
                break

            case 'addInstallationPlace':
                setFormFields([
                    {id:'position',label:'Место нахождения:',formType: 'selectMenu'},
                    {id:'installationPlace',label:'Необязательно - Места установки(Через запятую):',formType:'fieldTextArea'}
                ])
                setInitialValues({
                    installationTitle:'',
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
                    <Button className='m-2 col-auto'>Добавить место установки</Button>
                    <Button className='m-2 col-auto'>Удалить место установки</Button>
                </div>
            </div>
            <UniversalModal show={showModal} handleClose={closeModal} modalType={modalType} formFields={formFields} title={modalTitle} initialValues={initialValues} onSubmit={handleDataSubmission} action={action} method={method}/>

        </>
    )
}

export default EditDataBase;