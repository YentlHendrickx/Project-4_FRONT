import './App.css';

// Components
import AuthForm from './components/authform';
import Home from './components/home';
import MeterList from './components/meterlist';

import { createTheme, ThemeProvider } from '@mui/material/styles';

// Navigation
import { Routes, Route, BrowserRouter, Navigate, useNavigate } from 'react-router-dom';

import { useState, useEffect } from 'react';
import { SideBar } from './components/sidebar';
import Graphs from './components/graphs';

const theme = createTheme({
  palette: {
    secondary: {
      main: '#f1faeeff',
    }
  }
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn) {
      setIsLoggedIn(true);
    }
  }, []);

  function Main() {
    const navigate = useNavigate();

    const handleLogout = () => {
      if (isLoggedIn) {
        setIsLoggedIn(false);
    
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
    
        navigate('/login');
      }
    }

    const PrivateRoute = ({ children }) => {
      return isLoggedIn ? children :  <Navigate to="/login" />;
    };

    return (
      <div>
        <SideBar handleLogout={handleLogout}/>
        <div className="ml-[8rem]">
          <Routes>
              <Route 
                path={'/'} 
                element={ 
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute> 
                }/>
              <Route 
                path={'/meters'} 
                element={ 
                  <PrivateRoute>
                    <MeterList />
                  </PrivateRoute> 
                }/>
              <Route 
                path={'/graphs'} 
                element={ 
                  <PrivateRoute>
                    <Graphs />
                  </PrivateRoute> 
                }/>

              <Route path={'/login'} element={ <AuthForm forLogin={true} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn}/> }/>
              <Route path={'/register'} element={ <AuthForm forLogin={false} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn}/> }/>
          </Routes>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter >
      <ThemeProvider theme={theme}>
        <Main />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;