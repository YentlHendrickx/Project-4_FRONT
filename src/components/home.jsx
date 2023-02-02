import { useEffect, useRef, useState } from "react";

// Recoil
import { useRecoilState, useRecoilValue } from "recoil";
import { enigmaUrlState } from "../store";
import { userMetersState } from "../store";
import { userDataState } from "../store";

// Nebula config
import nebulaConfiguration from "../helpers/configure";

import theme from '../myTheme.json';

// Axios
import axios from "axios";

// Enigma
const enigma = require('enigma.js');
const schema = require('enigma.js/schemas/12.936.0.json');

// Config from .env
const config = {
    host                : process.env.REACT_APP_QLIK_HOST,
    prefix              : process.env.REACT_APP_QLIK_PREFIX,
    port                : process.env.REACT_APP_QLIK_PORT,
    webIntegrationId    : process.env.REACT_APP_QLIK_INTEGRATION_ID,
    appId               : process.env.REACT_APP_QLIK_APP_ID,
    isSecure            : true,
}

const Home = () =>  {
    // States for the meters
    const [userMeters, setUserMeters]       = useRecoilState(userMetersState);
    const [running, setRunning]             = useState(false);
    const userData                          = useRecoilValue(userDataState);

    // References to components for rendering the graphs
    const elcKpiRef = useRef(null);
    const gasKpiRef = useRef(null);
    const elcKpiDayRef = useRef(null);

    const objectReferences = [
        {
            "Reference" : elcKpiRef,
            "ID"        : 'cecWcKK'       
        },
        {
            "Reference" : gasKpiRef,
            "ID"        : 'VEzxP'
        },
        {
            "Reference" : elcKpiDayRef,
            "ID"        : 'ssCJDVk'
        }
    ];

    // WSS url from qlikConnect.jsx
    const enigmaUrl = useRecoilValue(enigmaUrlState);

    // On startup automatically get user meters
    useEffect(() => {
        // Get meters and options
        if (userMeters.length === 0) {

            // Valid userId
            if (userData.userId !== -1 && userData.userId !== undefined) {
                // Get user specific data (meters)
                const getUserData = async () => {
                    let result = -1;
                    await axios.get(process.env.REACT_APP_API_URL + "User/" + userData.userId)

                    .then(resp => {
                        result = resp;
                    }).catch(error => {
                        console.error(error);
                    });

                    if (result === -1) {
                        return;
                    }

                    // Add select and meter values
                    const data = result.data;
                    let meters = [];
                    let select = [{label: 'All Meters', value: -1}];

                    // Add select options
                    if (data.userMeters.length) {
                        data.userMeters.forEach(meter => {
                            meters.push(meter.meterId);
                            select.push({label: meter.address, value: meter.meterId});
                        });
                    }
                    
                    setUserMeters(meters);
                }
                getUserData();
            }
        }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userMeters]);

    useEffect(() => {
        const runEnigma = async () => {

            // Check run conditions, enigmaUrl needs to be set and engine can't already be running
            if (enigmaUrl !== null && !running) {
                setRunning(true);

                // Remove any nebulae tags still present, upon engine creation new one will be created (prevents mem leak)
                const results = document.querySelectorAll('[data-app-id]');
                results.forEach(memoryLeak => {
                    memoryLeak.remove();
                });

                // Create enigma engine based on schema specfied in require
                const session = await enigma.create({
                    schema,
                    url: enigmaUrl,
                });

                // Use engine to create a new app based on the app document
                const newEnigmaApp = await (await session.open()).openDoc(config.appId);

                // Get MeterId field for filtering
                const field = await newEnigmaApp.getField("MeterId");
                
                // Base dictionary for filtering
                let qFielValuesDict = {
                    "qFieldValues": [

                    ],
                    "qToggleMode": false,
                    "qSoftLock": true
                }

                // Add all meters
                userMeters.forEach(meter => {
                    qFielValuesDict["qFieldValues"].push( 
                        {
                            "qText": String(meter),
                            "qIsNumeric": true,
                            "qNumber": parseInt(meter),
                        },
                    );
                });

                // Select the values specified in the dict
                await field.selectValues(qFielValuesDict);

                const themeConfig = await nebulaConfiguration.createConfiguration({
                    context: {
                        theme: 'kpiTheme'
                    },
                    themes: [
                        {
                            id: 'kpiTheme',
                            load: () => Promise.resolve(theme)
                        }
                    ]
                });

                // Set app configuration and create embeddable object
                const n = await themeConfig(newEnigmaApp);

                // Loop over every Reference and ID combo
                objectReferences.forEach(ref => {

                    // Get reference
                    const reference = ref.Reference.current;

                    if (reference != null) {
                        const id = ref.ID;

                        // Remove children if they already exist (on re-render)
                        if (reference.children[0]) {
                            reference.removeChild(reference.children[0]);
                        }

                        // Render chart with id
                        n.render({
                            element: reference,
                            id: id,
                        });
                    }
                });
            }
        }

        // Run main function
        if (enigmaUrl !== null && userMeters.length > 0) {
            runEnigma();
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enigmaUrl, userMeters]);

    return (
        <div className="w-full h-screen">
            <div className="w-full h-[50%] md:flex justify-around items-around mt-4">
                <div className="border-2 border-[#FFEB11] bg-[#FEDA00] rounded-lg md:w-[45%] md:h-auto w-[80%] h-[10rem] drop-shadow-lg mx-auto" ref={elcKpiRef}>
                    
                </div>
                <div className="border-2 border-[#22A6D2] bg-[#1195C1] rounded-lg md:w-[45%] md:h-auto w-[80%] h-[10rem] drop-shadow-lg md:mr-2 mx-auto mt-2" ref={gasKpiRef}>

                </div>
                <div className="border-2 border-[#22A6D2] bg-[#1195C1] rounded-lg md:w-[45%] md:h-auto w-[80%] h-[10rem] drop-shadow-lg md:mr-2 mx-auto mt-2" ref={elcKpiDayRef}>

                </div>
            </div>
        </div>
    );
}

export default Home;