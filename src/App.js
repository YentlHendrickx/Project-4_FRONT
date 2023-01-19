import logo from './logo.svg';
import './App.css';

// Components
import AuthForm from './components/authform';
import Home from './components/home';
import MeterList from './components/meterlist';


// Navigation
import { Routes, Route, BrowserRouter, NavLink } from 'react-router-dom';


import { useState, useEffect } from 'react';
import { SideBar } from './components/sidebar';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);

    localStorage.removeItem('token');
    localStorage.setItem('isLoggedIn');
  }

  function Header() {
    return (
      <div>
        <h1>Project 4.0</h1>
        <ul>
          <li><NavLink end to="/" className={({isActive}) => isActive ? "active" : undefined}>Home</NavLink></li>
          <li><NavLink to="/login" className={({isActive}) => isActive ? "active" : undefined}>Login</NavLink></li>
          <li><NavLink to="/register" className={({isActive}) => isActive ? "active" : undefined}>Register</NavLink></li>
          <li><NavLink to="/meters" className={({isActive}) => isActive ? "active" : undefined}>Meters</NavLink></li>
        </ul>
      </div>
    );
  }

  function Main() {
    const Style = {
      
    }
    return (
      <div className="ml-[153px]">
        <Routes>
          <Route path={'/'} element={ <Home/> }/>
          <Route path={'/login'} element={ <AuthForm forLogin={true} setIsLoggedIn={setIsLoggedIn} /> }/>
          <Route path={'/register'} element={ <AuthForm forLogin={false} setIsLoggedIn={setIsLoggedIn}/> }/>
          <Route path={'/meters'} element={<MeterList />} />
        </Routes>
      </div>
    )
  }

  return (
    <BrowserRouter >
      <SideBar/>
      <Main />
    </BrowserRouter>
  );
}

export default App;