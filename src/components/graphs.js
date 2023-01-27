import { useEffect, useState, useRef } from "react";
import { embed } from "@nebula.js/stardust";

import barchart from '@nebula.js/sn-bar-chart';


import { useRecoilValue } from "recoil";
import { enigmaUrlState } from "../store";

const enigma = require('enigma.js');
const schema = require('enigma.js/schemas/12.1306.0.json');


const config = {
    host                : process.env.REACT_APP_QLIK_HOST,
    prefix              : process.env.REACT_APP_QLIK_PREFIX,
    port                : process.env.REACT_APP_QLIK_PORT,
    webIntegrationId    : process.env.REACT_APP_QLIK_INTEGRATION_ID,
    isSecure            : true,
}


function Graphs() {
    const [graph, setGraph] = useState(null);
    const ref = useRef(null);
    const enigmaUrl = useRecoilValue(enigmaUrlState);
    
    useEffect(() => {
        const getEnigma = async () => {
            const session = await enigma.create({
                schema,
                url: enigmaUrl
            });

            const app = await (await session.open()).openDoc('c16d3353-ee3a-457e-9de8-66f1b0f55c0e');

            return app;
        }

        const runEnigma = async () => {
            if (enigmaUrl) {
                const newEnigmaApp = await getEnigma();
    
                const n = embed(newEnigmaApp, {
                    types: [
                        {
                            name: "barchart",
                            load: () => Promise.resolve(barchart)
                        }
                    ]
                });

                const element = ref.current;
                
                n.render({
                    element,
                    id: 'mGxVj',
                });
            }
        }

        runEnigma();

    }, [enigmaUrl])


    return (
        <div className="w-screen h-screen">
           <div className="w-[50%] h-[50%]" ref={ref}>

            </div>
        </div>
    );
}

export default Graphs;