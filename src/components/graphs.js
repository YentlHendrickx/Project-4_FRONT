import { useEffect, useRef, useState } from "react";

// Nebula
import { embed } from "@nebula.js/stardust";

// Recoil
import { useRecoilValue } from "recoil";
import { enigmaUrlState } from "../store";

import nebulaConfiguration from "../helpers/configure";

// Enigma
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

const Graphs = () =>  {
    // Different graphs
    const perHourRef = useRef(null);
    const enigmaUrl = useRecoilValue(enigmaUrlState);

    useEffect(() => {
        const runEnigma = async () => {
            if (enigmaUrl) {
                const session = await enigma.create({
                    schema,
                    url: enigmaUrl,

                });

                const newEnigmaApp = await (await session.open()).openDoc(config.appId);

                const field = await newEnigmaApp.getField("MeterId");

                await field.selectValues({
                "qFieldValues": [
                    {
                        "qText": "3",
                        "qIsNumeric": true,
                        "qNumber": 3
                    }
                    ],
                    "qToggleMode": false,
                    "qSoftLock": true
                });
                
                const n = await nebulaConfiguration(newEnigmaApp);
                
                if (perHourRef.current.children[0]) {
                    perHourRef.current.removeChild(perHourRef.current.children[0]);
                }

                const perHourElement = perHourRef.current;
                n.render({
                    element: perHourElement,
                    id: 'mGxVj',
                });
            }
        }

        runEnigma();

    }, [enigmaUrl]);


    return (
        <div className="w-screen h-screen">
           <div className="w-[70%] h-[50%]" ref={perHourRef}>

            </div>
        </div>
    );
}

export default Graphs;

