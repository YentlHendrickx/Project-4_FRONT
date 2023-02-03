// Connection between Qlik and React

import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { enigmaUrlState } from "../store";
import { Auth, AuthType } from "@qlik/sdk";

// eslint-disable-next-line no-unused-vars
const enigma = require("enigma.js");
// eslint-disable-next-line no-unused-vars
const schema = require("enigma.js/schemas/12.936.0.json");

// Configuration straight from .env file
const config = {
  host: process.env.REACT_APP_QLIK_HOST,
  prefix: process.env.REACT_APP_QLIK_PREFIX,
  port: process.env.REACT_APP_QLIK_PORT,
  webIntegrationId: process.env.REACT_APP_QLIK_INTEGRATION_ID,
  appId: process.env.REACT_APP_QLIK_APP_ID,
  isSecure: true,
};

// Wrapper for connecting, child components are rendererd within connection
const QlikConnect = ({ children }) => {
  // Var for storing wss url and state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [enigmaUrl, setEnigmaUrl] = useRecoilState(enigmaUrlState);

  useEffect(() => {
    // Try to get data, if unauthorized -> redirect to qlik to login
    async function login() {
      return fetch(`https://${config.host}/api/v1/users/me`, {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "qlik-web-integration-id": config.webIntegrationId,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            // console.warn(response);
            // Logged in
            return true;
          } else {
            // Redirect to qlik (returnto = current page)
            window.location.href = `https://${config.host}/login?qlik-web-integration-id=${config.webIntegrationId}&returnto=${window.location.href}`;
            return false;
          }
        })
        .catch((error) => {
          console.warn(error);
          return false;
        });
    }

    // Only try getting wss url if not already present
    if (isLoggedIn === false || enigmaUrl === null) {
      const loginState = async () => {
        // Try login and redirect
        const state = await login();

        // Get wss url
        const getWss = async () => {
          // Settings from .env
          const webIntegrationId = config.webIntegrationId;
          const hostUrl = config.host;
          const appId = config.appId;

          // Get auth object ready for authentication
          const authInstance = new Auth({
            webIntegrationId,
            autoRedirect: true,
            authType: AuthType.WebIntegration,
            host: hostUrl,
          });

          // Check authentication and try to authenticate
          if (!authInstance.isAuthenticated()) {
            console.error("NOT AUTHENTICATED TRYING TO AUTH");
            authInstance.authenticate();

            if (authInstance.isAuthenticated()) {
              console.error("STILL NOT AUTHENTICATED");
            }

            return -1;
          } else {
            // Generate a wss url used in creating the engine
            const wssUrl = await authInstance.generateWebsocketUrl(appId);
            return wssUrl;
          }
        };

        if (state) {
          // Login succes -> get wss
          setIsLoggedIn(true);
          const wssUrl = await getWss();

          setEnigmaUrl(wssUrl);
        }
      };

      // Try to login
      loginState();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};

export default QlikConnect;
