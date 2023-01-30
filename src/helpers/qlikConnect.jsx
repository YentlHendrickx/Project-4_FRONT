import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { enigmaUrlState } from '../store';
import { Auth, AuthType } from '@qlik/sdk';

const enigma = require('enigma.js');
const schema = require('enigma.js/schemas/12.936.0.json');

const config = {
    host                : process.env.REACT_APP_QLIK_HOST,
    prefix              : process.env.REACT_APP_QLIK_PREFIX,
    port                : process.env.REACT_APP_QLIK_PORT,
    webIntegrationId    : process.env.REACT_APP_QLIK_INTEGRATION_ID,
    appId               : process.env.REACT_APP_QLIK_APP_ID,
    isSecure            : true,
}

const QlikConnect = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [enigmaUrl, setEnigmaUrl] = useRecoilState(enigmaUrlState);

    useEffect(() => {
        async function login() {
            return fetch(`https://${config.host}/api/v1/users/me`, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'qlik-web-integration-id': config.webIntegrationId,
                }
            }).then(response => {
                if (response.status === 200) {
                    // console.warn(response);
                    return true;
                } else {
                    window.location.href = `https://${config.host}/login?qlik-web-integration-id=${config.webIntegrationId}&returnto=${window.location.href}`;
                    return false;
                }
            }).catch(error => {
                console.warn(error);
                return false;
            });
        }

        if (isLoggedIn === false || enigmaUrlState === null) {
            const loginState = async () => {
                const state = await login();
                // console.log(await state);

                const getCSRF = async () => {
                    const webIntegrationId = config.webIntegrationId;
                    const hostUrl = config.host;
                    const appId = config.appId;
                    
                    const authInstance = new Auth({
                        webIntegrationId,
                        autoRedirect: true,
                        authType: AuthType.WebIntegration,
                        host: hostUrl,
                    });

                    if (!authInstance.isAuthenticated()) {
                        authInstance.authenticate();
                        return -1;
                    } else {
                        const wssUrl = await authInstance.generateWebsocketUrl(appId);
                        return wssUrl;
                    }
                }

                if (state) {
                    setIsLoggedIn(true);
                    const wssUrl = await getCSRF();
                
                    setEnigmaUrl(wssUrl);
                }
            }

            loginState();
        }

    }, []);

    return (
       <>
        {children}
       </>
    );
}

export default QlikConnect;