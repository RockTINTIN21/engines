
// import styles from './MenuCard.module.css';
import { useState } from "react";
import successIcon from '../../../assets/icons/mark.png';

import { Modal, Button } from 'react-bootstrap';
import Form from "react-bootstrap/Form";
import {Formik} from "formik";

const SuccessModal = ({ show, handleClose,closeModal}) => {
    return(
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Успешно</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="text-center">
                    <h4>Успешно!</h4>
                    <img src={successIcon} alt="successIcon"/>
                    <Button onClick={closeModal}>
                        Понятно
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    )
};

export default SuccessModal;



