import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Menu from "./pages/Menu.jsx";
import Header from "./layouts/Header/Header.jsx";
import AggregateJournal from "./pages/AggregateJournal/AggregateJournal.jsx";
import EnginePassport from "./pages/EnginePassport/EnginePassport.jsx";
import EditDataBase from "./pages/EditDataBase/EditDataBase.jsx";

function App() {

  return (
    <Router>
      <Header/>
      <div className="container pt-3 pt-md-4">
          <Routes>
              <Route path="/" element={<Menu/>}/>
              <Route path="/AggregateJournal" element={<AggregateJournal/>}/>
              <Route path="/AggregateJournal/EnginePassport" element={<EnginePassport/>}/>
              <Route path="/AggregateJournal/EditDataBase" element={<EditDataBase/>}/>
              <Route path="/AggregateJournal/EnginePassport/:engineId" element={<EnginePassport/>}/>
          </Routes>
      </div>
    </Router>

  )
}

export default App
