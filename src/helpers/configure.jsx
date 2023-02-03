// Configuration file for all graphs, if another graph is needed add import, name and load: function

import { embed }    from '@nebula.js/stardust';
import barchart     from '@nebula.js/sn-bar-chart';
import linechart    from '@nebula.js/sn-line-chart';
import piechart     from '@nebula.js/sn-pie-chart';
import sankeychart  from '@nebula.js/sn-sankey-chart';
import funnechart   from '@nebula.js/sn-funnel-chart';
import mekkochart   from '@nebula.js/sn-mekko-chart';
import histogram    from '@nebula.js/sn-histogram';
import kpi          from '@nebula.js/sn-kpi';


// Create config for all charts
const nebulaConfiguration = embed.createConfiguration({
    types: [
        {
            name: "barchart",
            load: () => Promise.resolve(barchart)
        },
        {
            name: "linechart",
            load: () => Promise.resolve(linechart)
        },
        {
            name: "piechart",
            load: () => Promise.resolve(piechart)
        },
        {
            name: "sankeychart",
            load: () => Promise.resolve(sankeychart)
        },
        {
            name: "funnechart",
            load: () => Promise.resolve(funnechart)
        },
        {
            name: "mekkochart",
            load: () => Promise.resolve(mekkochart)
        },
        {
            name: 'kpi',
            load: () => Promise.resolve(kpi)
        },
        {
            name: 'histogram',
            load: () => Promise.resolve(histogram)
        }
    ],
});

export default nebulaConfiguration;
