import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Context from './Context';
import embed from './configure';
import connect from './connect';

const nebulaPromise = async () => {
  const app = await connect({
    webIntegrationId: '_WA9Avm_qD0Jfm-r78_MKfbZ6T7Fb1N2',
    url: 'zkkzn87ew4rjt3n.eu.qlikcloud.com',
    appId: 'c16d3353-ee3a-457e-9de8-66f1b0f55c0e',
  });

//   return embed(app);
};

const GlobalValuesProvider = ({ children }) => {
  const [nebula, setNebula] = useState(null);

  const init = async () => {
    const _nebula = await nebulaPromise();
    // setNebula(_nebula);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Context.Provider value={{
      nebula,
    }}
    >
      {children}
    </Context.Provider>
  );
};

// GlobalValuesProvider.propTypes = {
//   children: PropTypes.array.isRequired,
// };
GlobalValuesProvider.defaultProps = [];

export default GlobalValuesProvider;
