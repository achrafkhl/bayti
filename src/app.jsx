// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Achri from './pages/main/achri';    
import Cart from './pages/cart/cart';     
import Cprofile from './pages/cprofile/cprofile';
import Favorites from './pages/favorites/favorites';
import Forget from './pages/forget/forget';
import Home from './pages/home/home';
import Homes from './pages/homes/homes';
import Login from './pages/login/login';
import Meal from './pages/meal/meals';
import New from './pages/new/new';
import Reset from './pages/reset/reset';
import Signup from './pages/signup/signup';
import Sprofile from './pages/sprofile/sprofile';
import "./index.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Achri />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget" element={<Forget />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/home" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/cprofile" element={<Cprofile />} />
        <Route path="/homes" element={<Homes />} />
        <Route path="/new" element={<New />} />
        <Route path="/meal" element={<Meal />} />
        <Route path="/sprofile" element={<Sprofile />} />
      </Routes>
    </Router>
  );
}

export default App;
