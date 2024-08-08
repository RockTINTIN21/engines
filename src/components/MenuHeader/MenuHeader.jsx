import React, { useState } from 'react';
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from './MenuHeader.module.css';

function MenuHeader({ title, pathToMain, titleButtonMain, pathToSearch, titleButtonSearch, imgPathToMain, imgPathToSearch }) {
    const [isMainHovered, setIsMainHovered] = useState(false);
    const [isSearchHovered, setIsSearchHovered] = useState(false);

    return (
        <div className={`container-fluid ${styles.menuHeader} styles-card p-2 mb-3 mb-md-5`}>

                <div className="d-flex flex-column flex-md-row justify-content-md-between bd-highlighto">
                    <div className="p-2">
                        {pathToMain && (
                            <Button
                                className={`${styles.btn} ps-3 pe-3  w-md-100 w-100`}
                                onMouseEnter={() => setIsMainHovered(true)}
                                onMouseLeave={() => setIsMainHovered(false)}
                            >
                                <Link to={pathToMain} className={`text-decoration-none ${styles.link}`}>
                                    <img
                                        src={imgPathToMain}
                                        alt="btn"
                                        className={`${styles.icon} ${isMainHovered ? styles.hover : ''} pb-1 pe-1`}
                                    />
                                    {titleButtonMain || 'Ошибка загрузки'}
                                </Link>
                            </Button>
                        )}
                    </div>
                    <div className="p-2 pt-1 pt-md-3 text-center">
                        {title}
                    </div>
                    <div className="p-2">
                        {pathToSearch && (
                            <Button
                                className={`${styles.btn} ps-3 pe-3  w-md-100 w-100`}
                                onMouseEnter={() => setIsSearchHovered(true)}
                                onMouseLeave={() => setIsSearchHovered(false)}
                            >
                                <Link to={pathToSearch} className="text-decoration-none text-white">
                                    <img
                                        src={imgPathToSearch}
                                        alt="btn"
                                        className={`${styles.icon} ${isSearchHovered ? styles.hover : ''}`}
                                    />
                                    {titleButtonSearch || 'Ошибка загрузки'}
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

        </div>
    );
}

export default MenuHeader;
