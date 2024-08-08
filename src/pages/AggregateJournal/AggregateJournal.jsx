import MenuHeader from "../../components/MenuHeader/MenuHeader.jsx";
import MenuIcon from "../../assets/icons/MenuIcon.svg"
import styles from "./AggregateJournal.module.css"
function AggregateJournal(){
    return(
        <>
            <MenuHeader title="Агрегатный журнал" pathToMain={"/"} titleButtonMain={"К меню"} imgPathToMain={MenuIcon}/>
            <div className={`container-fluid styles-card p-2 bg-gray`}>
                test
            </div>
        </>
    )
}
export default AggregateJournal;