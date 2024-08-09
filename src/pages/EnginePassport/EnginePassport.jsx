import MenuHeader from "../../components/MenuHeader/MenuHeader.jsx";
import MenuIcon from "../../assets/icons/MenuIcon.svg"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styles from "./EnginePassport.module.css"
import {Formik} from "formik";
import search from '../../assets/icons/SearchIcon.svg'
import {useState} from "react";
import {Table} from "react-bootstrap";
import engineExample from "../../assets/engines/engine_example.png"
import {Link} from "react-router-dom";

const formSelectPlace = ['Компрессорная', 'Насосная'];
const formSelectedPlace = formSelectPlace.map((elem, index) => (
    <option key={index} value={elem}>{elem}</option>
));

const formSelectStatus = ['В кап. рем', 'Готово'];
const formSelectedStatus = formSelectStatus.map((elem, index) => (
    <option key={index} value={elem}>{elem}</option>
));

const formSelectPosition = ['Склад №1', 'Склад №2'];
const formSelectedPosition = formSelectPosition.map((elem, index) => (
    <option key={index} value={elem}>{elem}</option>
));
function AggregateJournal(){
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
                    <Button className="me-2 w-100 w-md-auto mt-2 mt-md-0">Сохранить изменения</Button>
                    <Button className="bg-danger w-100 w-md-auto mt-2 mt-md-0 text-white">Удалить запись</Button>
                </div>
            </div>


            <div className=" mt-4">
                <div className="container-fluid">
                    <Formik
                        // initialValues={formValue}
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
                                    <Form.Group
                                        className="mb-3 d-flex w-100 styles-card bg-gray justify-content-between p-2 align-items-center"
                                        controlId="formBasicEmail">
                                        <Form.Label className="w-50 mb-0">Место нахождения:</Form.Label>
                                        <Form.Select
                                            defaultValue={formSelectPosition[0]}
                                            className={`w-100 pt-0 pb-0 ps-3`}
                                        >
                                            {formSelectedPosition || 'Пусто'}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3 d-flex w-100 styles-card bg-gray justify-content-between p-2 align-items-center"
                                        controlId="formBasicEmail">
                                        <Form.Label className="w-50 mb-0">Место установки:</Form.Label>
                                        <Form.Select
                                            defaultValue={formSelectPlace[0]}
                                            className={`w-100 pt-0 pb-0 ps-3`}
                                        >
                                            {formSelectedPlace || 'Пусто'}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3 d-flex w-100 styles-card bg-gray justify-content-between p-2 align-items-center"
                                        controlId="formBasicEmail">
                                        <Form.Label className="w-50 mb-0">Ивент. номер:</Form.Label>
                                        <Form.Control type="email" className="w-100 pt-0 pb-0 ps-3"/>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3 d-flex w-100 styles-card bg-gray justify-content-between p-2 align-items-center"
                                        controlId="formBasicEmail">
                                        <Form.Label className="w-50 mb-0">Учет. номер:</Form.Label>
                                        <Form.Control type="email" className="w-100 pt-0 pb-0 ps-3"/>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3 d-flex w-100 styles-card bg-gray justify-content-between p-2 align-items-center"
                                        controlId="formBasicEmail">
                                        <Form.Label className="w-50 mb-0">Мощность:</Form.Label>
                                        <Form.Control type="email" className="w-100 pt-0 pb-0 ps-3"/>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3 d-flex w-100 styles-card bg-gray justify-content-between p-2 align-items-center"
                                        controlId="formBasicEmail">
                                        <Form.Label className="w-50 mb-0">Муфта:</Form.Label>
                                        <Form.Select className={`w-100 pt-0 pb-0 ps-3`}>
                                            <option value="1">Да</option>
                                            <option value="2">Нет</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3 d-flex w-100 styles-card bg-gray justify-content-between p-2 align-items-center"
                                        controlId="formBasicEmail">
                                        <Form.Label className="w-50 mb-0">Готов / Не готов:</Form.Label>
                                        <Form.Select
                                            defaultValue={formSelectStatus[0]}
                                            className={`w-100 pt-0 pb-0 ps-3`}
                                        >
                                            {formSelectedStatus || 'Пусто'}
                                        </Form.Select>
                                    </Form.Group>
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
                                        <Button className="w-100">Добавить запись</Button>
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
                                        <Button className="w-100">Добавить запись</Button>
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
                                            <td>Посадка муфты осуществляется с отступом отконца вала на 4мм.
                                            </td>
                                            <td>23.01.2024</td>
                                        </tr>
                                        </tbody>
                                    </Table>
                                </Form.Group>
                            </Form>
                        )}
                    </Formik>

                </div>
            </div>
        </>
    )

}

export default AggregateJournal;
