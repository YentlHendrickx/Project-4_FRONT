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


const DropdownSelector = ({userMeters, setUserMeters, selectOptions, setSelectOptions, onValueChange}) => {

    const userData = useRecoilValue(userDataState);

    // Get user meters
    useEffect(() => {
        if (userMeters.length === 0 || selectOptions == null) {

            if (userData.userId !== -1 && userData.userId !== undefined) {
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

                    const data = result.data;
                    let meters = [];
                    let select = [{label: 'All Meters', value: -1}];

                    if (data.userMeters.length) {
                        data.userMeters.forEach(meter => {
                            meters.push(meter.meterId);
                            select.push({label: meter.address, value: meter.meterId});
                        });
                    }
                    
                    setUserMeters(meters);
                    setSelectOptions(select);
                }
                getUserData();
            }
        }
    }, [userMeters, selectOptions]);


    if (selectOptions) {
        return (
            <div>
                <select onChange={(event) => onValueChange(event)}>
                    {selectOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
        );
    } else {
        return (
            <div>
                Loading...
            </div>
        );
    }
}

const Graphs = () =>  {
    // States for the meters
    const [userMeters, setUserMeters] = useRecoilState(userMetersState);
    const [running, setRunning] = useState(false);
    const [updatedAddress, setUpdatedAddress] = useState(false);

    const [selectOptions, setSelectOptions] = useState(null);
    const [meterNumbers, setMeterNumbers] = useState(-1);

    // References to components for rendering the graphs
    const perHourRef        = useRef(null);
    const perDayRef         = useRef(null);
    const lastHourRef       = useRef(null);
    const perHourGasRef     = useRef(null);

    const objectReferences = [
        {
            "Reference" : perHourRef,
            "ID"        : 'mGxVj'       
        },
        {
            "Reference" : perDayRef,
            "ID"        : 'GJKGGP'
        },
        {
            "Reference" : lastHourRef,
            "ID"        : 'tXAsbem'
        },
        {
            "Reference" : perHourGasRef,
            "ID"        : 'kNxMkjJ'
        }
    ];

    // WSS url from qlikConnect.jsx
    const enigmaUrl = useRecoilValue(enigmaUrlState);


    useEffect(() => {
        if (userMeters) {
            // console.log("YEET");
            updateMeterNumbers(-1);
        }
    }, []);

    function updateMeterNumbers(selectedAddress) {

        let newMeterNumbers = '';

        if (userMeters.length) {
            newMeterNumbers = selectedAddress
        }

        setMeterNumbers(newMeterNumbers);
        setUpdatedAddress(true);
    }

    function onValueChange(event) {
        event.preventDefault();
        updateMeterNumbers(event.target.value);
    }

    useEffect(() => {
        const runEnigma = async () => {

            if (enigmaUrl && (!running || updatedAddress === true)) {
                setRunning(true);
                setUpdatedAddress(false);

                const results = document.querySelectorAll('[data-app-id]');
                results.forEach(memoryLeak => {
                    memoryLeak.remove();
                });

                // Create enigma engine
                const session = await enigma.create({
                    schema,
                    url: enigmaUrl,
                });

                // Create enigma app and open correct qlik app
                const newEnigmaApp = await (await session.open()).openDoc(config.appId);

                // Set filtering so that user can only see their own Meters
                const field = await newEnigmaApp.getField("MeterId");
                
                let qFielValuesDict = {
                    "qFieldValues": [

                    ],
                    "qToggleMode": false,
                    "qSoftLock": true
                }

                if (parseInt(meterNumbers) === -1) {
                    userMeters.forEach(meter => {
                        qFielValuesDict["qFieldValues"].push( 
                            {
                                "qText": String(meter),
                                "qIsNumeric": true,
                                "qNumber": parseInt(meter),
                            },
                        );
                    });
                } else {
                    qFielValuesDict["qFieldValues"].push( 
                        {
                            "qText": String(meterNumbers),
                            "qIsNumeric": true,
                            "qNumber": parseInt(meterNumbers),
                        },
                    );
                }

                await field.selectValues(qFielValuesDict);
                
                // Create the app using the configuration from configure.jsx
                const n = await nebulaConfiguration(newEnigmaApp);

                // Loop over every Reference and ID combo
                objectReferences.forEach(ref => {
                    const reference = ref.Reference.current;
                    const id = ref.ID;

                    // Remove children if they already exist (on re-render)
                    if (reference.children[0]) {
                        reference.removeChild(reference.children[0]);
                        // console.warn(reference.children);
                    }

                    // Render chart with id
                    n.render({
                        element: reference,
                        id: id,
                    });
                });
            }
        }

        // Run main function
        runEnigma();

    }, [enigmaUrl, updatedAddress]);

    return (
        <div className="w-full h-screen">
            <DropdownSelector userMeters={userMeters} setUserMeters={setUserMeters} selectOptions={selectOptions} setSelectOptions={setSelectOptions} onValueChange={onValueChange}/>
            <div className="w-full h-[50%] grid grid-cols-2 gap-4 justify-around">
                <div className="w-full" ref={perHourRef}>

                </div>
                <div className="w-full" ref={perDayRef}>

                </div>
                <div className="w-full" ref={lastHourRef}>

                </div>
                <div className="w-full" ref={perHourGasRef}>

                </div>
            </div>
        </div>
    );
}

export default Graphs;

