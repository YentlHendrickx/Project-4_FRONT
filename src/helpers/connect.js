import axios from 'axios';
import enigma from 'enigma.js';
import schema from 'enigma.js/schemas/12.170.2.json';

import {Auth, AuthType, Config} from '@qlik/sdk';

async function login(webIntegrationId, url) {
    async function isLoggedIn() {
        fetch(`https://${url}/api/v1/users/me`, {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json',
              'qlik-web-integration-id': webIntegrationId,
          },
      }).then(response => {
        console.log("GOT RESPONSE", response);
        console.log(response.status);
        if (response.status === 200) {
          return true;
        } else {
          window.location.href = `https://${url}/login?qlik-web-integration-id=${webIntegrationId}&returnto=${window.location.href}`;
        }
        // return response.status === 200;
      }).catch(err => {
        console.warn("GOT ERROR", err);
        return false;
      });
    }

    isLoggedIn();
}

async function getQCSHeaders({ webIntegrationId, url }) {

    await login(webIntegrationId, url);
    // await isLoggedIn(webIntegrationId, url).then(loggedIn => {
    //   console.log(loggedIn);
    //     if (loggedIn === false) {
    //     }
    // });

    // const config = {
    //     authType: AuthType.WebIntegration,
    //     host: `${url}`,
    //     webIntegrationId: webIntegrationId,
    //     autoRedirect: true,
    //     // clientId: `fc2abef1828e06e388d9f834d25065a1`,
    //     // clientSecret: `b0cd68ba1c4daf6e171eae08253f466704b8c83458cc54fe1868d84d29cc1dbf`,
    //     // redirectUri: 'http://localhost:3000/graphs',
    // }

    // console.log("TRYING AUTH FLOW");
    // const auth = new Auth(config);

    // if(!auth.isAuthenticated()) {
    //    const res = auth.authenticate();
    //    console.log(res);
    // }
   
   


    // const response = await axios.get(`https://${url}/api/v1/csrf-token`, {
    //     credentials: 'include',
    //     headers: { 'qlik-web-integration-id': webIntegrationId, Authorization: `Bearer eyJhbGciOiJFUzM4NCIsImtpZCI6ImExNWI4YjcwLWU1NzYtNGIyYy1iOTZmLTcyOTUxMDA4YTc4ZCIsInR5cCI6IkpXVCJ9.eyJzdWJUeXBlIjoidXNlciIsInRlbmFudElkIjoieVlJTVNEVUNqS21aa25YX0dlUG5jdldJcWtIOHExd2oiLCJqdGkiOiJhMTViOGI3MC1lNTc2LTRiMmMtYjk2Zi03Mjk1MTAwOGE3OGQiLCJhdWQiOiJxbGlrLmFwaSIsImlzcyI6InFsaWsuYXBpL2FwaS1rZXlzIiwic3ViIjoiaURTZW4xdDk4X2dOV3Z6SnRyTVotVjRsZ1ljWjcwSEkifQ.VOr7-18hsaGkdE5934aPb2McYht2FmqYNFkHE-nAklm_W0f4bV5cFo4Hy3bMsvs_2u02KKDpHkeW5tlixkXe0k8XVy54LgmTNvQC4x_NCiJVm6RwF_0aTdv3BOkWINup` },
    // });

//   if (true) {
//     const config = {
//         authType: AuthType.OAuth2,
//         host: `https://${url}/login`,
//         clientId: `5375c488453d3b20f85b4fce17bbb5fc`,
//         clientSecret: `b0cd68ba1c4daf6e171eae08253f466704b8c83458cc54fe1868d84d29cc1dbf`,
//         redirectUri: window.location.href,
//     }

//     const auth = new Auth(config);
//     window.Buffer = window.Buffer || require("buffer").Buffer;
//     const res = await auth.authorize(window.location.href);


//     // const loginUrl = new URL(`https://${url}/login`);
//     // loginUrl.searchParams.append('returnto', window.location.href);
//     // loginUrl.searchParams.append('qlik-web-integration-id', webIntegrationId);
//     // window.location.href = loginUrl;
//     return undefined;
//   }

    // const csrfToken = new Map(response.headers).get('qlik-csrf-token');
    // return {
    //     'qlik-web-integration-id': webIntegrationId,
    //     'qlik-csrf-token': csrfToken,
    // };
}

async function getEnigmaApp({ host, appId, headers }) {
  const params = Object.keys(headers)
    .map((key) => `${key}=${headers[key]}`)
    .join('&');

  const enigmaGlobal = await enigma
    .create({
      schema,
      url: `wss://${host}/app/${appId}?${params}`,
    })
    .open();

  return enigmaGlobal.openDoc(appId);
}

async function connect({ url, webIntegrationId, appId }) {
  const host = url.replace(/^https?:\/\//, '').replace(/\/?/, '');
  const headers = await getQCSHeaders({ url, webIntegrationId });
//   console.warn(host, headers, appId);
//   return getEnigmaApp({ host, headers, appId });
}

export default connect;