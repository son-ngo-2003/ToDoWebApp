import React from "react";
import { useNavigate, useRouteError } from "react-router";
import { FaExclamationTriangle, FaHome } from "react-icons/fa";
import styles from "./errorPage.module.css";

interface ErrorPageProps {}

const ErrorPage: React.FC<ErrorPageProps> = () => {
    const error: any = useRouteError();
    const errorMessage = error?.message || "Something went wrong.";
    const navigate = useNavigate();

    const redirectHome = () => {
        navigate("/");
    };

    const isNotFound = error?.status === 404;

    return (
        <div className={`${styles.errorContainer}`}>
            <div className={styles.icon}>
                <FaExclamationTriangle size={50} />
            </div>
            <h1 className={`${styles.title} title`}>
                {isNotFound ? "404 - Page Not Found" : errorMessage}
            </h1>
            <p className={`${styles.message} text`}>
                {isNotFound
                    ? "The page you are looking for does not exist."
                    : "Please try again later."}
            </p>
            {isNotFound && (
                <button className={styles.homeButton} onClick={redirectHome}>
                    <FaHome className={styles.homeIcon} />
                    Go to Home
                </button>
            )}
        </div>
    );
};

export default ErrorPage;