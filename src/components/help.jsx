import { Fragment, useState } from "react";
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
  <div className="flex flex-col justify-center items-center w-full">
    <h1 className="text-4xl">FAQ</h1>
    
    <div className="w-[50%]">
      <Accordion open={open === 1} >
        <AccordionHeader onClick={() => handleOpen(1)}>
          Wat doet onze app?
        </AccordionHeader>
        <AccordionBody>
          Onze app monitort jou verbruik aan de hand van de meters 
          die je meegeeft. Zo kan jij jouw actueel verbruik beter in 
          beeld brengen.
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 2} >
        <AccordionHeader onClick={() => handleOpen(2)}>
          Hoe begin je met monitoren?
        </AccordionHeader>
        <AccordionBody>
          Eerst voeg je jou meter toe, daarna log je in via 
          qlik &#40;indien nodig &#41; en de rest gaat vanzelf.
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 3}>
        <AccordionHeader onClick={() => handleOpen(3)}>
          Hoe voeg ik een meter toe?
        </AccordionHeader>
        <AccordionBody>
          Klik op de moersleutel links net boven de log uit knop en druk dan op de blauwe Creëer knop.
          Vervolgens geef je jou Raspberry ID mee, dit is de ID 
          die je terugvind op de sticker van de meegeleverde Raspberry Pi.
          Daarna geef je de Meter ID van jou digitale meter mee, dit is de 
          meter waar je de Raspberry Pi hebt insteken. Als laatste vul je 
          het address in waar de meter/raspberry zich bevindt. Druk nu op de 
          Creëer knop. Nu heb je een meter toegevoegd!
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 4}>
        <AccordionHeader onClick={() => handleOpen(4)}>
          Hoe sluit ik mijn raspberry pi aan?
        </AccordionHeader>
        <AccordionBody>
            Steek je raspberry pi in poort P1 met een RJ11 naar usb kabel. Opgelet dit is enkel 
            mogelijk met een digitale meter.
        </AccordionBody>
      </Accordion>
      </div>
    </div>
  );
}