
// import styles from './MenuCard.module.css';
import { useState } from "react";
import successIcon from '../../../assets/icons/mark.png';

import { Modal, Button } from 'react-bootstrap';
import Form from "react-bootstrap/Form";
import {Formik} from "formik";
import SuccessModal from "../SuccessModal/SuccessModal.jsx";

const UniversalModal = ({ show, title, handleClose, formFields, modalType,closeModal}) => {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const renderModalContent = () => {
        switch (modalType) {
            case 'form':
                return (
                    <Formik
                        // initialValues={FormValues}
                        // validationSchema={validationSchema(action)}
                        // onSubmit={(values) => {
                        //     submitOnServer(values, action, method);
                        // }}
                    >
                        {({ handleSubmit, handleChange, values, touched, errors }) => (
                            <Form onSubmit={handleSubmit}>
                                {formFields.map((field, index) => (
                                    <Form.Group key={index} className="mb-3">
                                        {(() => {
                                            switch (field.formType) {
                                                case 'selectMenu':
                                                    return (
                                                        <>
                                                            <Form.Label>{field.label}</Form.Label>
                                                            <Form.Select
                                                                id={field.id}
                                                                name={field.id}
                                                                defaultValue={field.selectMenu[0]}
                                                            >
                                                                {field.selectMenu.map((option, i) => (
                                                                    <option key={i} value={option}>
                                                                        {option}
                                                                    </option>
                                                                ))}
                                                            </Form.Select>
                                                        </>
                                                    );
                                                case 'date':
                                                    return (
                                                        <>
                                                            <Form.Label>{field.label}</Form.Label>
                                                            <Form.Control
                                                                type="date"
                                                                id={field.id}
                                                                name={field.id}
                                                                value={field.value}
                                                                onChange={handleChange}
                                                            />
                                                        </>
                                                    );
                                                case 'field':
                                                    return (
                                                        <>
                                                            <Form.Label>{field.label}</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                id={field.id}
                                                                name={field.id}
                                                                onChange={handleChange}
                                                            />
                                                        </>
                                                    );
                                                case 'fieldTextArea':
                                                    return (
                                                        <>
                                                            <Form.Label>{field.label}</Form.Label>
                                                            <Form.Control
                                                                as="textarea"
                                                                rows={field.rows || 3}
                                                                id={field.id}
                                                                name={field.id}
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
                                <Button className="w-100">
                                    Добавить запись
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
                    <Modal.Title>Подтверждение</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {renderModalContent()}
                </Modal.Body>
            </Modal>
            <SuccessModal showModal={showSuccessModal} closeModal={closeModal}></SuccessModal>
        </>

    );
};

export default UniversalModal;



