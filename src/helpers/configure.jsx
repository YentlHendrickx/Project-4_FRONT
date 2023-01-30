import { embed } from '@nebula.js/stardust';
import barchart from '@nebula.js/sn-bar-chart';
import linechart from '@nebula.js/sn-line-chart';
import piechart from '@nebula.js/sn-pie-chart';
import sankeychart from '@nebula.js/sn-sankey-chart';
import funnechart from '@nebula.js/sn-funnel-chart';
import mekkochart from '@nebula.js/sn-mekko-chart';

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
    ]
});

export default nebulaConfiguration;
