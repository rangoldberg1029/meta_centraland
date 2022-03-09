import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Main from "./components/Main";
import Edit from "./components/Edit";
import Login from "./components/Login";
import Home from "./components/Home";
import SignUp from './components/SignUp'
import './App.css';



export default function App() {
  return (
    <Router>
      <div className="App" >
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/main" element={<Main />} />
          <Route exact path="/edit" element={<Edit />} />
        </Routes>
      </div>
    </Router>

  );
}


