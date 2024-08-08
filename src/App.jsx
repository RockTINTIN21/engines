import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Menu from "./pages/Menu.jsx";
import Header from "./layouts/Header/Header.jsx";
import AggregateJournal from "./pages/AggregateJournal/AggregateJournal.jsx";

function App() {

  return (
    <Router>
      <Header/>
      <div className="container pt-3 pt-md-5">
          <Routes>
              <Route path="/" element={<Menu/>}/>
              <Route path="/AggregateJournal" element={<AggregateJournal/>}/>
          </Routes>
      </div>
    </Router>

  )
}

export default App
