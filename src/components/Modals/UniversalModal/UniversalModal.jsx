
// import styles from './MenuCard.module.css';
import {useEffect, useState} from "react";
import successIcon from '../../../assets/icons/mark.png';

import { Modal, Button } from 'react-bootstrap';
import Form from "react-bootstrap/Form";
import {Formik} from "formik";
import SuccessModal from "../SuccessModal/SuccessModal.jsx";
import {fetchData, validationSchema} from "../../../../Validation.js";

const UniversalModal = ({ show, title, handleClose, formFields, modalType,closeModal,initialValues,action,method, onSubmit}) => {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [serverErrors, setServerErrors] = useState({});
    const closeUniversalModal = () => setShowSuccessModal(false);
    useEffect(() => {
        formFields.map((field) =>{
            if(field.isPosition){
                console.log('TES')
            }
        })
    }, [initialValues]);
    // const changePosition = ((e,isPosition)=>{
    //     console.log()
    //     if(isPosition === true){
    //         console.log('Да, это position')
    //     }
    // })

    const submitOnServer =  async (values,action,method) => {
        const response = await fetchData(values,action,method);
        // switch (action){
        //     case 'addPosition':
        //         if(response.status === 'error'){
        //             const nameField = response.errors.field
        //             setServerErrors({[nameField]:response.errors.message });
        //             setTimeout(() => {
        //                 setServerErrors({[nameField]:false });
        //             }, 3000);
        //         }else{
        //             console.log('Успешно!');
        //             setShowSuccessModal(true);
        //             onSubmit();
        //         }
        //         break
        //     case 'addInstallationPlace':
        //         if(response.status === 'error'){
        //             const nameField = response.errors.field
        //             setServerErrors({[nameField]:response.errors.message });
        //             setTimeout(() => {
        //                 setServerErrors({[nameField]:false });
        //             }, 3000);
        //         }else{
        //             console.log('Успешно!');
        //             setShowSuccessModal(true);
        //             onSubmit();
        //         }
        //         break
        // }
        if(response.status === 'error'){
            const nameField = response.errors.field
            setServerErrors({[nameField]:response.errors.message });
            setTimeout(() => {
                setServerErrors({[nameField]:false });
            }, 3000);
        }else{
            console.log('Успешно!');
            setShowSuccessModal(true);
            onSubmit();
        }
        // const response = await fetchData(values,action,method);
        // if(response.status === 'error'){
        //     const nameField = response.errors.field
        //     setServerErrors({[nameField]:response.errors.message });
        //     setTimeout(() => {
        //         setServerErrors({[nameField]:false });
        //     }, 3000);
        // }else{
        //     console.log('Успешно!');
        //     setShowSuccessModal(true);
        //     onSubmit();
        // }
    }

    const renderModalContent = () => {
        switch (modalType) {
            case 'form':
                return (
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema(action)}
                        onSubmit={(values,) => {
                            console.log('Отправлено!',values)
                            submitOnServer(values, action, method);

                        }}
                    >
                        {({ handleSubmit, handleChange, values, touched, errors ,serverErrors}) => (

                            <Form onSubmit={handleSubmit}>
                                {formFields.map((field, index) => (
                                    <Form.Group key={index} className="mb-3">
                                        {(() => {
                                            const {id} = field
                                            switch (field.formType) {
                                                case 'selectMenu':
                                                    return (
                                                        <>
                                                            <Form.Label>{field.label}</Form.Label>
                                                            <Form.Select
                                                                id={id}
                                                                name={id}
                                                                value={values[id]}
                                                                onChange={(e)=>{
                                                                    handleChange(e);
                                                                }}
                                                                isInvalid={touched && (!!errors[field.id] || !!serverErrors)}
                                                            >
                                                                {field.selectMenu.map((option, i) => (
                                                                    <option key={i} value={option}>
                                                                        {option}
                                                                    </option>
                                                                ))}
                                                            </Form.Select>
                                                            <Form.Control.Feedback type="invalid">{errors[field.id] || serverErrors}</Form.Control.Feedback>
                                                        </>
                                                    );
                                                case 'date':
                                                    return (
                                                        <>
                                                            <Form.Label>{field.label}</Form.Label>
                                                            <Form.Control
                                                                type="date"
                                                                id={id}
                                                                name={id}
                                                                value={field.value}
                                                                onChange={handleChange}
                                                                isInvalid={touched && (!!errors[field.id] || !!serverErrors)}
                                                            />
                                                            <Form.Control.Feedback type="invalid">{errors[field.id] || serverErrors}</Form.Control.Feedback>
                                                        </>
                                                    );
                                                case 'field':
                                                    return (
                                                        <>
                                                            <Form.Label>{field.label}</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                id={id}
                                                                name={id}
                                                                onChange={handleChange}
                                                                isInvalid={touched && (!!errors[field.id] || !!serverErrors)}
                                                            />
                                                            <Form.Control.Feedback type="invalid">{errors[field.id] || serverErrors}</Form.Control.Feedback>
                                                        </>
                                                    );
                                                case 'fieldTextArea':
                                                    return (
                                                        <>
                                                            <Form.Label>{field.label}</Form.Label>
                                                            <Form.Control
                                                                as="textarea"
                                                                rows={field.rows || 3}
                                                                id={id}
                                                                name={id}
                                                                onChange={handleChange}
                                                            />
                                                        </>
                                                    );
                                                default:
                                                    return null;
                                            }
                                        })()}
                                    </Form.Group>
                                ))}
                                <Button className="w-100" type='submit'>
                                    {title}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                );
            case 'retryMenu':
                return (
                    <div className="text-center">
                        <p className='p-3'>
                            Вы уверены что хотите удалить эту запись?
                        </p>

                        <Modal.Footer >
                            <Button variant="danger">Удалить</Button>
                            <Button variant="primary" onClick={handleClose}>Закрыть</Button>
                        </Modal.Footer>
                    </div>
                )
            default:
                return null;
        }
    };

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title || 'Подтверждение'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {renderModalContent()}
                </Modal.Body>
            </Modal>
            <SuccessModal showModal={showSuccessModal} closeModal={closeUniversalModal}></SuccessModal>
        </>

    );
};

export default UniversalModal;



