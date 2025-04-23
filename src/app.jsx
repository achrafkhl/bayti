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
import PrivateRoute from './config/PrivateRoute';
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

        
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
        <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
        <Route path="/cprofile" element={<PrivateRoute><Cprofile /></PrivateRoute>} />
        <Route path="/homes" element={<PrivateRoute><Homes /></PrivateRoute>} />
        <Route path="/new" element={<PrivateRoute><New /></PrivateRoute>} />
        <Route path="/meal" element={<PrivateRoute><Meal /></PrivateRoute>} />
        <Route path="/sprofile" element={<PrivateRoute><Sprofile /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
