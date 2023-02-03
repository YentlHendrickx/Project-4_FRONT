import "./App.css";

// Components
import AuthForm from "./components/authform";
import Home from "./components/home";
import MeterList from "./components/meterlist";
import Verification from "./components/verification";
import Forgotpassword from "./components/forgotpassword";
import Profile from "./components/profile";
import Help from "./components/help";

import { ReactNotifications, Store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

import { createTheme, ThemeProvider } from "@mui/material/styles";

// Navigation
import {
  Routes,
  Route,
  BrowserRouter,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useState, useEffect } from "react";
import { SideBar } from "./components/sidebar";
import Graphs from "./components/graphs";

// Recoil
import { RecoilRoot, useSetRecoilState } from "recoil";
import { initialsState, userDataState } from "./store";
import QlikConnect from "./helpers/qlikConnect";

const theme = createTheme({
  palette: {
    secondary: {
      main: "#f1faeeff",
    },
  },
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn) {
      setIsLoggedIn(true);
    }
  }, []);

  function Main() {
    const navigate = useNavigate();
    const setInitials = useSetRecoilState(initialsState);
    const setUserData = useSetRecoilState(userDataState);

    const handleLogout = () => {
      if (isLoggedIn) {
        setIsLoggedIn(false);

        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("initialsState");
        localStorage.removeItem("userDataState");
        navigate("/login");
      }
    };

    useEffect(() => {
      const initialsState = localStorage.getItem("initialsState");
      const userDataState = localStorage.getItem("userDataState");

      const token = localStorage.getItem("token");

      if (token) {
        localStorage.setItem("isLoggedIn", true);
        setIsLoggedIn(true);
      }

      if (initialsState) {
        setInitials(JSON.parse(initialsState));
      }

      if (userDataState) {
        setUserData(JSON.parse(userDataState));
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Private routes will return child routes if logged in, else redirect to login page
    const PrivateRoute = ({ children }) => {
      const loggedIn = localStorage.getItem("isLoggedIn");
      return loggedIn ? children : <Navigate to="/login" />;
    };

    // A logout route will automatically make sure the user is logged out before going on
    const LogoutRoute = ({ children }) => {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token");

      useEffect(() => {
        setIsLoggedIn(false);
      }, []);

      return children;
    };

    return (
      <div className="h-screen">
        <ReactNotifications />
        {isLoggedIn && <SideBar handleLogout={handleLogout} />}
        <div className={`h-full ${isLoggedIn ? "md:ml-[7rem]" : ""}`}>
          <Routes>
            <Route
              path={"/"}
              element={
                <PrivateRoute>
                  <QlikConnect>
                    <Home />
                  </QlikConnect>
                </PrivateRoute>
              }
            />
            <Route
              path={"/graphs"}
              element={
                <PrivateRoute>
                  <QlikConnect>
                    <Graphs />
                  </QlikConnect>
                </PrivateRoute>
              }
            />
            <Route
              path={"/meters"}
              element={
                <PrivateRoute>
                  <MeterList />
                </PrivateRoute>
              }
            />
            <Route
              path={"/profile"}
              element={
                <PrivateRoute>
                  <Profile handleLogout={handleLogout} />
                </PrivateRoute>
              }
            />

            <Route
              path={"/login"}
              element={
                <AuthForm
                  forLogin={true}
                  setIsLoggedIn={setIsLoggedIn}
                  isLoggedIn={isLoggedIn}
                />
              }
            />

            <Route
              path={"/register"}
              element={
                <AuthForm
                  forLogin={false}
                  setIsLoggedIn={setIsLoggedIn}
                  isLoggedIn={isLoggedIn}
                />
              }
            />

            <Route
              path={"/verify"}
              element={
                <LogoutRoute>
                  <Verification
                    setIsLoggedIn={setIsLoggedIn}
                    changeEmail={false}
                  />
                </LogoutRoute>
              }
            />

            <Route
              path={"/verifyEmailChangeToken"}
              element={
                <LogoutRoute>
                  <Verification
                    setIsLoggedIn={setIsLoggedIn}
                    changeEmail={true}
                  />
                </LogoutRoute>
              }
            />

            <Route
              path={"/forgot"}
              element={
                <LogoutRoute>
                  <Forgotpassword />
                </LogoutRoute>
              }
            />

            <Route
              path={"/resetpassword"}
              element={
                <LogoutRoute>
                  <Forgotpassword />
                </LogoutRoute>
              }
            />

            <Route
              path={"/help"}
              element={
                <PrivateRoute>
                  <Help />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <RecoilRoot>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Main />
        </ThemeProvider>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
