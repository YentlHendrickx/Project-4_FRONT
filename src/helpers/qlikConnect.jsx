import React, { useEffect, useState } from 'react';

const config = {
    host                 : process.env.REACT_APP_QLIK_HOST,
    prefix              : process.env.REACT_APP_QLIK_PREFIX,
    port                : process.env.REACT_APP_QLIK_PORT,
    webIntegrationId    : process.env.REACT_APP_QLIK_INTEGRATION_ID,
    isSecure            : true,
}

const QlikConnect = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        async function login() {
            fetch(`https://${config.host}/api/v1/users/me`, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'qlik-web-integration-id': config.webIntegrationId,
                }
            }).then(response => {
                if (response.status === 200) {
                    console.warn(response);
                    return true;
                } else {
                    window.location.href = `https://${config.host}/login?qlik-web-integration-id=${config.webIntegrationId}&returnto=${window.location.href}`;
                }
            }).catch(error => {
                console.warn(error);
                return false;
            })
        }

        if (isLoggedIn === false) {
            const loginState = async () => {
                return await login();
            }

            if (loginState() === true) {
                setIsLoggedIn(true);
            }
        }

    }, []);

    return (
       <>
        {children}
       </>
    );
}


export default QlikConnect;
