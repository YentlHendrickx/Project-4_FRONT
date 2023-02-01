import { useEffect, useRef, useState } from "react";

// Recoil
import { useRecoilState, useRecoilValue } from "recoil";
import { enigmaUrlState } from "../store";
import { userMetersState } from "../store";
import { userDataState } from "../store";

// Nebula config
import nebulaConfiguration from "../helpers/configure";

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

    const objectReferences = [
        {
            "Reference" : elcKpiRef,
            "ID"        : 'cecWcKK'       
        },
        {
            "Reference" : gasKpiRef,
            "ID"        : 'VEzxP'
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
                
                // Set app configuration and create embeddable object
                const n = await nebulaConfiguration(newEnigmaApp);

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
            <div className="w-full h-[50%] grid grid-cols-2 gap-4 justify-around">
                <div className="w-full" ref={elcKpiRef}>

                </div>
                <div className="w-full" ref={gasKpiRef}>

                </div>
            </div>
        </div>
    );
}


// function Card({color, line1, line2, line3}){
//     const CardStyle = {
//         backgroundColor: color,
//         color: '#DADFF7',
//         borderRadius: '35px',
//         minWidht:'500px',
//         minHeight:'275px',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center'

//     }

//     return(
//         <div style={CardStyle}>
//                 <p className="text-4xl pb-5">{line1}</p>
//                 <p className="text-6xl py-5">{line2}</p>
//                 <p className="text-4xl pt-5">{line3}</p>
//         </div>
//     );
// }

// function Home() {
//     return(
//         <div>
//             <h1 className="p-5 text-4xl">Uw Verbruik</h1>
//             <h2 className="px-5 text-2xl">Deze week</h2>
//             <div className="grid sm:grid-cols-1  lg:grid-cols-2 gap-6 p-10">
//                 <Card color={'#477998'} line1={'Dag verbruik'} line2={'3,5'} line3={'kWh'}/>
//                 <Card color={'#785964'} line1={'Nacht verbruik'} line2={'6,9'} line3={'kWh'}/>
//                 <Card color={'#FA7E61'} line1={'Hoogste dag verbruik'} line2={'15 kWh'} line3={'17/01/2023'}/>
//                 <Card color={'#93032E'} line1={'Hoogste uur verbruik'} line2={'12 kWh'} line3={'17/01/2023 14:00'}/>
//             </div>
//         </div>
//     );
// }

export default Home;