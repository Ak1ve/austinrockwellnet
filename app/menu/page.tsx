"use client";
import { useState, useEffect } from "react";

// https://www.npmjs.com/package/react-accessible-accordion

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';

type Dining = {
  clarity: string,
  lord_saunders: string,
  heritage: string
}

interface Day<D = Dining> {
  breakfast?: D
  lunch: D
  dinner: D
}

type Menu<D = Dining> = {
  monday: Day<D>
  tuesday: Day<D>
  wednesday: Day<D>
  thursday: Day<D>
  friday: Day<D>
  saturday: Day<D>
  sunday: Day<D>
}

type SteviePlaces = { [k: string]: string };


type StevieMenu = Menu<SteviePlaces>;

type MenuResponse = {
  for_week: number,
  menu: Menu,
  stevie: StevieMenu
}

function StevieCollapse({ places }: { places: SteviePlaces }) {
  const [showChildren, setShowChildren] = useState(false);
  const text = showChildren ? "Hide Menu" : "Show Menu";
  const menus = Object.entries(places).map(val => (<><div>{val[0]}</div><div className="text-gray-700">{val[1]}</div></>));
  return (<>
    <div>Stevie:</div><div><div onClick={() => setShowChildren(!showChildren)} className="text-blue-500 underline hover:text-blue-700 hover:cursor-pointer">{text}</div></div>
    {showChildren ? menus : <></>}
  </>);
}

function Day({ day, stevieMenus }: { day: Day, stevieMenus: Day<SteviePlaces> }) {
  return (
    <div className="p-5  text-gray-500">
      <div className="grid grid-cols-2 mx-auto gap-5">
        <div className="col-span-2 text-black mx-auto">Breakfast</div>
        <StevieCollapse places={stevieMenus.breakfast!} />

        <div className="col-span-2 text-black  mx-auto">Lunch</div>
        <div>Clarity:</div><div className="text-gray-700">{day.lunch.clarity}</div>
        <div>Heritage:</div><div className="text-gray-700">{day.lunch.heritage}</div>
        <div>Lord Saunders:</div><div className="text-gray-700">{day.lunch.lord_saunders}</div>
        <StevieCollapse places={stevieMenus.lunch} />

        <div className="col-span-2 text-black mx-auto">Dinner</div>
        <div>Clarity:</div><div className="text-gray-700">{day.dinner.clarity}</div>
        <div>Heritage:</div><div className="text-gray-700">{day.dinner.heritage}</div>
        <div>Lord Saunders:</div><div className="text-gray-700">{day.dinner.lord_saunders}</div>
        <StevieCollapse places={stevieMenus.dinner} />
      </div>
    </div>)
}

function DayCollapse({ hook, day, dayString, stevieMenus }: { hook: any, day: Day, dayString: string, stevieMenus: Day<SteviePlaces> }) {
  const show = { ...hook[0] };
  show[dayString] = !show[dayString];
  return (
    <>
      <AccordionItemHeading onClick={() => hook[1](show)}>
        <AccordionItemButton>{dayString}</AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel><Day day={day} stevieMenus={stevieMenus} /></AccordionItemPanel>
    </>
  );
}

function AccordionAlwaysOpen({ menu, currentDay, stevie }: { menu: Menu, currentDay: string, stevie: StevieMenu }) {
  const showHook = useState({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: true,
    Sunday: true,
  });

  return (
    <Accordion allowMultipleExpanded allowZeroExpanded preExpanded={[currentDay]}>
      <AccordionItem uuid={"Monday"}><DayCollapse hook={showHook} day={menu.monday} dayString="Monday" stevieMenus={stevie.monday} /></AccordionItem>
      <AccordionItem uuid={"Tuesday"}><DayCollapse hook={showHook} day={menu.tuesday} dayString="Tuesday" stevieMenus={stevie.tuesday} /></AccordionItem>
      <AccordionItem uuid={"Wednesday"}><DayCollapse hook={showHook} day={menu.wednesday} dayString="Wednesday" stevieMenus={stevie.wednesday} /></AccordionItem>
      <AccordionItem uuid={"Thursday"}><DayCollapse hook={showHook} day={menu.thursday} dayString="Thursday" stevieMenus={stevie.thursday} /></AccordionItem>
      <AccordionItem uuid={"Friday"}><DayCollapse hook={showHook} day={menu.friday} dayString="Friday" stevieMenus={stevie.friday} /></AccordionItem>
      <AccordionItem uuid={"Saturday"}><DayCollapse hook={showHook} day={menu.saturday} dayString="Saturday" stevieMenus={stevie.saturday} /></AccordionItem>
      <AccordionItem uuid={"Sunday"}><DayCollapse hook={showHook} day={menu.sunday} dayString="Sunday" stevieMenus={stevie.sunday} /></AccordionItem>
    </Accordion>
  );
}


export default function Index() {
  "use client";
  const [menu, setMenu] = useState(null as MenuResponse | null);
  // const menu = dummy satisfies MenuResponse;
  
  useEffect(() => {
      fetch("https://www.austinrockwell.net/api/menus").then(x => {
        x.json().then(x => setMenu(x));
      });

  }, []);
  if (menu === null) {
    return <>Loading Menus...</>;
  }
  const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][(new Date()).getDay()];
  return <><AccordionAlwaysOpen menu={menu.menu} currentDay={week} stevie={menu.stevie} />For Week: {menu.for_week}<div className="italic">*DISCLAIMER: Some menu options may not be accurate.  If any issue arises (either with using the site or incorrect menus), please contact arockwel@oberlin.edu </div></>
}
