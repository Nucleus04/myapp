import Login from './components/Login';
import Registration from './components/Registration';
import Home from './components/Home';
import Compose from './components/Compose';
import Conversation from './components/Conversation';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
        <div>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="/Registration" element={<Registration />} />
            <Route path="/Home" element = {<Home/>} />
            <Route path="/Compose" element = {<Compose/>} />
            <Route path='/conversation/:senderEmail' element={<Conversation/>} />
          </Routes>
        </div>
    </Router>
  );
}

export default App;
