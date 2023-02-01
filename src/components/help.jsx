import { useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
 
export default function Example() {
  const [open, setOpen] = useState(1);
 
  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };
 
  return (
    <div className="w-full h-full">
      <div className="w-[100%] flex flex-col justify-center items-center mt-4">
        <div className="w-[80%] p-4 rounded-md">
          <h2 className="text-4xl underline text-center">FAQ</h2>
          <Accordion open={open === 1} >
            <AccordionHeader onClick={() => handleOpen(1)}>
              What is the purpose of this app?
            </AccordionHeader>
            <AccordionBody>
              Our app is capable of giving you an elegant way to follow up
              on your electricity usage. Doing this you can monitor your usage
              and make changes to save energy. 
            </AccordionBody>
          </Accordion>
          <Accordion open={open === 2} >
            <AccordionHeader onClick={() => handleOpen(2)}>
              How do you start monitoring?
            </AccordionHeader>
            <AccordionBody>
              After setting up the elek3city monitoring device there 
              are a few steps:
              
              1. Got to meter setup (Wrench icon), and create a new meter.
              2. Fill in the details, Raspberry ID and MeterId as well as a name
              for your meter (address or anything you choose)
              3. DONE! You can now follow up on your elektricity usage.
            </AccordionBody>
          </Accordion>
          <Accordion open={open === 3}>
            <AccordionHeader onClick={() => handleOpen(3)}>
              How do I connect the monitoring device?
            </AccordionHeader>
            <AccordionBody>
              First you have to make sure to enable the P1 port on your meter. Steps for this
              can be found on the Fluvius website.

              After the P1 port is open you setting up the device is really simple. Just plug in the included
              cable into the P1 port, setup the meter in the application... and you're done!
            </AccordionBody>
          </Accordion>
        </div>
      </div>
    </div>
  );
}