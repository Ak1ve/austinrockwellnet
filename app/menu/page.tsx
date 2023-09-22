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

type Day = {
  lunch: Dining
  dinner: Dining
}

type Menu = {
  monday: Day
  tuesday: Day
  wednesday: Day
  thursday: Day
  friday: Day
  saturday: Day
  sunday: Day
}

type MenuRespone = {
  for_week: number,
  menu: Menu,
}

function Day({ day }: { day: Day }) {

  return (
    <div className="p-5 dark:bg-gray-900 text-gray-500">
      <div className="grid grid-cols-2 mx-auto w-72 gap-5">
        <div className="col-span-2 text-black dark:text-gray-400 mx-auto">Lunch</div>
        <div>Clarity:</div><div className="text-gray-700">{day.lunch.clarity}</div>
        <div>Heritage:</div><div className="text-gray-700">{day.lunch.heritage}</div>
        <div>Lord Saunders:</div><div className="text-gray-700">{day.lunch.lord_saunders}</div>
        <div className="col-span-2 text-black dark:text-gray-400 mx-auto">Dinner</div>
        <div>Clarity:</div><div className="text-gray-700">{day.dinner.clarity}</div>
        <div>Heritage:</div><div className="text-gray-700">{day.dinner.heritage}</div>
        <div>Lord Saunders:</div><div className="text-gray-700">{day.dinner.lord_saunders}</div>
      </div>
    </div>)
}

function DayCollapse({ hook, day, dayString }: { hook: any, day: Day, dayString: string }) {
  const show = { ...hook[0] };
  show[dayString] = !show[dayString];
  return (
    <>
      <AccordionItemHeading onClick={() => hook[1](show)}>
        <AccordionItemButton>{dayString}</AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel><Day day={day} /></AccordionItemPanel>
    </>
  );
}

function AccordionAlwaysOpen({ menu, currentDay }: { menu: Menu, currentDay: string }) {
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
      <AccordionItem uuid={"Monday"}><DayCollapse hook={showHook} day={menu.monday} dayString="Monday" /></AccordionItem>
      <AccordionItem uuid={"Tuesday"}><DayCollapse hook={showHook} day={menu.tuesday} dayString="Tuesday" /></AccordionItem>
      <AccordionItem uuid={"Wednesday"}><DayCollapse hook={showHook} day={menu.wednesday} dayString="Wednesday" /></AccordionItem>
      <AccordionItem uuid={"Thursday"}><DayCollapse hook={showHook} day={menu.thursday} dayString="Thursday" /></AccordionItem>
      <AccordionItem uuid={"Friday"}><DayCollapse hook={showHook} day={menu.friday} dayString="Friday" /></AccordionItem>
      <AccordionItem uuid={"Saturday"}><DayCollapse hook={showHook} day={menu.saturday} dayString="Saturday" /></AccordionItem>
      <AccordionItem uuid={"Sunday"}><DayCollapse hook={showHook} day={menu.sunday} dayString="Sunday" /></AccordionItem>
    </Accordion>
  );
}

/*
sunday: { lunch: { clarity: "Clarity Lunch is really cool", lord_saunders: "Bruh lord saunders literally doesnt have lunch", heritage: "meh" }, dinner: { clarity: "YOOOO DINNNER", lord_saunders: "SO FUIRE BRUH", heritage: "HERIATE" } },
    monday: { lunch: { clarity: "Clarity Lunch is really cool", lord_saunders: "Bruh lord saunders literally doesnt have lunch", heritage: "meh" }, dinner: { clarity: "YOOOO DINNNER", lord_saunders: "SO FUIRE BRUH", heritage: "HERIATE" } },
    tuesday: { lunch: { clarity: "Clarity Lunch is really cool", lord_saunders: "Bruh lord saunders literally doesnt have lunch", heritage: "meh" }, dinner: { clarity: "YOOOO DINNNER", lord_saunders: "SO FUIRE BRUH", heritage: "HERIATE" } },
    wednesday: { lunch: { clarity: "Clarity Lunch is really cool", lord_saunders: "Bruh lord saunders literally doesnt have lunch", heritage: "meh" }, dinner: { clarity: "YOOOO DINNNER", lord_saunders: "SO FUIRE BRUH", heritage: "HERIATE" } },
    thursday: { lunch: { clarity: "Clarity Lunch is really cool", lord_saunders: "Bruh lord saunders literally doesnt have lunch", heritage: "meh" }, dinner: { clarity: "YOOOO DINNNER", lord_saunders: "SO FUIRE BRUH", heritage: "HERIATE" } },
    friday: { lunch: { clarity: "Clarity Lunch is really cool", lord_saunders: "Bruh lord saunders literally doesnt have lunch", heritage: "meh" }, dinner: { clarity: "YOOOO DINNNER", lord_saunders: "SO FUIRE BRUH", heritage: "HERIATE" } },
    saturday: { lunch: { clarity: "Clarity Lunch is really cool", lord_saunders: "Bruh lord saunders literally doesnt have lunch", heritage: "meh" }, dinner: { clarity: "YOOOO DINNNER", lord_saunders: "SO FUIRE BRUH", heritage: "HERIATE" } }
 */
export default function Index() {
  "use client";
  const [menu, setMenu] = useState(null as MenuRespone | null);
  useEffect(() => {
      fetch("https://www.austinrockwell.net/api/menus").then(x => {
        x.json().then(x => setMenu(x));
      });

  }, []);
  if (menu === null) {
    return <>"loading..."</>;
  }
  console.log(menu);
  return <><AccordionAlwaysOpen menu={menu.menu} currentDay="Sunday" />For Week: {menu.for_week}</>
}
