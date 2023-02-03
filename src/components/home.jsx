import { useEffect, useRef, useState } from "react";

// Recoil
import { useRecoilState, useRecoilValue } from "recoil";
import { enigmaUrlState } from "../store";
import { userMetersState } from "../store";
import { userDataState } from "../store";

// Nebula config
import nebulaConfiguration from "../helpers/configure";

import theme from "../myTheme.json";

// Axios
import axios from "axios";
import { NavLink } from "react-router-dom";

// Enigma
const enigma = require("enigma.js");
const schema = require("enigma.js/schemas/12.936.0.json");

// Config from .env
const config = {
  host: process.env.REACT_APP_QLIK_HOST,
  prefix: process.env.REACT_APP_QLIK_PREFIX,
  port: process.env.REACT_APP_QLIK_PORT,
  webIntegrationId: process.env.REACT_APP_QLIK_INTEGRATION_ID,
  appId: process.env.REACT_APP_QLIK_APP_ID,
  isSecure: true,
};

const Home = () => {
  // States for the meters
  const [userMeters, setUserMeters] = useRecoilState(userMetersState);
  const [running, setRunning] = useState(false);
  const userData = useRecoilValue(userDataState);

  // References to components for rendering the graphs
  const elcKpiRef = useRef(null);
  const gasKpiRef = useRef(null);
  const elcKpiDayRef = useRef(null);
  const gasKpiDayRef = useRef(null);

  const objectReferences = [
    {
      Reference: elcKpiRef,
      ID: "cecWcKK",
    },
    {
      Reference: gasKpiRef,
      ID: "VEzxP",
    },
    {
      Reference: elcKpiDayRef,
      ID: "ssCJDVk",
    },
    {
      Reference: gasKpiDayRef,
      ID: "ZRmScb",
    },
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
          await axios
            .get(process.env.REACT_APP_API_URL + "User/" + userData.userId)

            .then((resp) => {
              result = resp;
            })
            .catch((error) => {
              console.error(error);
            });

          if (result === -1) {
            return;
          }

          // Add select and meter values
          const data = result.data;
          let meters = [];
          let select = [{ label: "All Meters", value: -1 }];

          // Add select options
          if (data.userMeters.length) {
            data.userMeters.forEach((meter) => {
              meters.push(meter.meterId);
              select.push({ label: meter.address, value: meter.meterId });
            });
          }

          setUserMeters(meters);
        };
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
        const results = document.querySelectorAll("[data-app-id]");
        results.forEach((memoryLeak) => {
          memoryLeak.remove();
        });

        // Create enigma engine based on schema specfied in require
        const session = await enigma.create({
          schema,
          url: enigmaUrl,
        });

        // Use engine to create a new app based on the app document
        const newEnigmaApp = await (await session.open()).openDoc(config.appId);

        // Make sure app is in standard mode
        await newEnigmaApp.abortModal(true);
        // Clear all selections
        await newEnigmaApp.clearAll();

        // Get MeterId field for filtering
        const field = await newEnigmaApp.getField("MeterId");

        // Base dictionary for filtering
        let qFielValuesDict = {
          qFieldValues: [],
          qToggleMode: false,
          qSoftLock: true,
        };

        // Add all meters
        userMeters.forEach((meter) => {
          qFielValuesDict["qFieldValues"].push({
            qText: String(meter),
            qIsNumeric: true,
            qNumber: parseInt(meter),
          });
        });

        // Select the values specified in the dict
        await field.selectValues(qFielValuesDict);

        const themeConfig = await nebulaConfiguration.createConfiguration({
          context: {
            theme: "kpiTheme",
            constraints: {
              active: true,
              passive: true,
              select: true,
            },
          },
          themes: [
            {
              id: "kpiTheme",
              load: () => Promise.resolve(theme),
            },
          ],
        });

        // Set app configuration and create embeddable object
        const n = await themeConfig(newEnigmaApp);

        // Loop over every Reference and ID combo
        objectReferences.forEach((ref) => {
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
    };

    // Run main function
    if (enigmaUrl !== null && userMeters.length > 0) {
      runEnigma();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enigmaUrl, userMeters]);

  return (
    <div className="w-full h-full">
      <p className="text-4xl mt-4 ml-2 max-w-[90%]">
        Hello, {userData.firstName} {userData.lastName}!
      </p>
      <p className="text-md ml-2 text-light max-w-[80%]">
        Don't see any data, or want to add another meter? Visit the{" "}
        <NavLink
          to="/meters"
          className="text-uiSecondary hover:text-uiSecondaryLight"
        >
          Meter Config Page.
        </NavLink>
      </p>
      <p className="text-md mt-1 ml-2 text-light max-w-[80%]">
        Want to get a closer look at the data? Visit the{" "}
        <NavLink
          to="/graphs"
          className="text-uiSecondary hover:text-uiSecondaryLight"
        >
          Details Page.
        </NavLink>
      </p>

      <p className="w-full text-3xl text-center mt-2 font-bold">Usage Today</p>
      <div className="w-full h-[20%] md:grid md:grid-cols-2 mt-4">
        <div
          className="border-2 border-kpiElectricBorder bg-kpiElectric rounded-lg w-[80%] md:w-[90%] md:max-h-[20rem] md:h-auto h-[10rem] drop-shadow-lg mx-auto bg-repeat bg-2rem bg-blend-soft-light bg-electric-pattern"
          ref={elcKpiDayRef}
        ></div>
        <div
          className="border-2 border-kpiGasBorder bg-kpiGas rounded-lg w-[80%] md:w-[90%] md:max-h-[20rem] md:h-auto h-[10rem] drop-shadow-lg mx-auto bg-repeat bg-2rem bg-blend-soft-light bg-gas-pattern"
          ref={gasKpiDayRef}
        ></div>
      </div>

      <p className="w-full text-3xl text-center mt-8 font-bold">
        Usage this Year
      </p>
      <div className="w-full h-[20%] md:grid md:grid-cols-2 mt-4">
        <div
          className="border-2 border-kpiElectricBorder bg-kpiElectric rounded-lg w-[80%] md:w-[90%] md:max-h-[20rem] md:h-auto h-[10rem] drop-shadow-lg mx-auto bg-repeat bg-2rem bg-blend-soft-light bg-electric-pattern"
          ref={elcKpiRef}
        ></div>
        <div
          className="border-2 border-kpiGasBorder bg-kpiGas rounded-lg w-[80%] md:w-[90%] md:max-h-[20rem] md:h-auto h-[10rem] drop-shadow-lg mx-auto mt-4 md:mt-0 bg-repeat bg-2rem bg-blend-soft-light bg-gas-pattern"
          ref={gasKpiRef}
        ></div>
      </div>
    </div>
  );
};

export default Home;
