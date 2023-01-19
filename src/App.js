import './App.css';

// Components
import AuthForm from './components/authform';
import Home from './components/home';
import MeterList from './components/meterlist';


// Navigation
import { Routes, Route, BrowserRouter } from 'react-router-dom';


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
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  }

  function Main() {

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