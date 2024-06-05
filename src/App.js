import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbars from './component/navbar';
import AuthState from './context';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Buy from './page/buy';
import Tender from './page/tender';
import Vote from './page/vote';
function App() {
  return (
    <div className="App">
      <AuthState>
        <BrowserRouter>
         <Navbars/>
         <Routes>
          <Route path="/" element={<Buy/>}/>
          <Route path="/tender" element={<Tender/>} />
          <Route path="/vote"  element={<Vote/>}/>
         </Routes>
        </BrowserRouter>
      </AuthState>
    </div>
  );
}

export default App;
