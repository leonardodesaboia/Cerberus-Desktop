import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home';
import Store from './pages/Store';
import Redeemed from './pages/Redeemed';
const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/store" element={<Store/>} />
          <Route path="/redeemed" element={<Redeemed/>} />
        </Routes>
      </BrowserRouter>
  )
}

export default App