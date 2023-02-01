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

// Dropdown for selecting graph source
const DropdownSelector = ({userMeters, setUserMeters, selectOptions, setSelectOptions, onValueChange}) => {

    // Get user data for getting associated meters
    const userData = useRecoilValue(userDataState);

    // Get user meters
    useEffect(() => {
        // Get meters and options
        if (userMeters.length === 0 || selectOptions == null) {

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
                    setSelectOptions(select);
                }
                getUserData();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userMeters, selectOptions]);


    // Return loading if no select options, otherwise return true
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


    // On startup automatically show all meter graphs
    useEffect(() => {
        if (userMeters) {
            updateMeterNumbers(-1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Based on input set meter numbers for showing specific graph
    function updateMeterNumbers(selectedAddress) {
        let newMeterNumbers = '';

        if (userMeters.length) {
            newMeterNumbers = selectedAddress
        }

        setMeterNumbers(newMeterNumbers);

        // Updated is true, the charts will be re-rendered
        setUpdatedAddress(true);
    }

    // Update chart if selection was changed
    function onValueChange(event) {
        event.preventDefault();
        updateMeterNumbers(event.target.value);
    }

    useEffect(() => {
        const runEnigma = async () => {

            // Check run conditions, enigmaUrl needs to be set and engine can't already be running
            if (enigmaUrl !== null && (!running || updatedAddress === true)) {
                setRunning(true);
                setUpdatedAddress(false);

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

                // All meters or just one?
                if (parseInt(meterNumbers) === -1) {
                    // Update dictionary by adding all meters
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
                    // Update dictionary by adding specific meter
                    qFielValuesDict["qFieldValues"].push( 
                        {
                            "qText": String(meterNumbers),
                            "qIsNumeric": true,
                            "qNumber": parseInt(meterNumbers),
                        },
                    );
                }

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

        // Only run when valid arguments are found
        if (enigmaUrl !== null && userMeters.length > 0) {
            // Run main function
            runEnigma();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
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