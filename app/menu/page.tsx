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

function Day({ day }: { day: Day }) {

    return (<>
        <div className="pt-5 pb-5 pl-5 pr-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900 w-full text-gray-500">
            <div className="text-black dark:text-gray-400 mx-auto w-fit">Lunch</div>
            <div className="grid grid-cols-2 mx-auto w-fit gap-10">
                <div>Clarity:</div><div className="text-gray-700">{day.lunch.clarity}</div>
                <div>Heritage:</div><div className="text-gray-700">{day.lunch.heritage}</div>
                <div>Lord Saunders:</div><div className="text-gray-700">{day.lunch.lord_saunders}</div>
            </div>
        </div>
        <div className="pt-5 pb-5 pl-5 pr-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900 w-full text-gray-500">
            <div className="text-black dark:text-gray-400 mx-auto w-fit">Dinner</div>
            <div className="grid grid-cols-2 mx-auto w-fit gap-10">
                <div>Clarity:</div><div className="text-gray-700">{day.dinner.clarity}</div>
                <div>Heritage:</div><div className="text-gray-700">{day.dinner.heritage}</div>
                <div>Lord Saunders:</div><div className="text-gray-700">{day.dinner.lord_saunders}</div>
            </div>
        </div>
    </>)
}

function DayCollapse({ hook, day, dayString }: { hook: any, day: Day, dayString: string }) {
    const show = {...hook[0]};
    show[dayString] = !show[dayString];   
    return (
        <>
           <AccordionItemHeading onClick={() => hook[1](show)}>
            <AccordionItemButton>{dayString}</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel><Day day={day}/></AccordionItemPanel>
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
const theme = {
    accordion: {
      defaultProps: {
        icon: undefined,
        className: "",
        animate: {
          unmount: {},
          mount: {},
        },
        disabled: false,
      },
      styles: {
        base: {
          container: {
            display: "block",
            position: "relative",
            width: "w-full",
          },
          header: {
            initial: {
              display: "flex",
              justifyContent: "justify-between",
              alignItems: "items-center",
              width: "w-full",
              py: "py-4",
              borderWidth: "border-b border-b-blue-gray-100",
              color: "text-blue-gray-700",
              fontSmoothing: "antialiased",
              fontFamily: "font-sans",
              fontSize: "text-xl",
              textAlign: "text-left",
              fontWeight: "font-semibold",
              lineHeight: "leading-snug",
              userSelect: "select-none",
              hover: "hover:text-blue-gray-900",
              transition: "transition-colors",
            },
            active: { color: "text-blue-gray-900" },
            icon: {
              ml: "ml-4",
            },
          },
          body: {
            display: "block",
            width: "w-full",
            py: "py-4",
            color: "text-gray-700",
            fontSmoothing: "antialiased",
            fontFamily: "font-sans",
            fontSize: "text-sm",
            fontWeight: "font-light",
            lineHeight: "leading-normal",
          },
          disabled: {
            pointerEvents: "pointer-events-none",
            opacity: "opacity-50",
          },
        },
      },
    },
  };
export default function Index() {
    "use client";
    const [menu, setMenu] = useState({
        sunday: {lunch: {clarity: "Clarity Lunch is really cool",lord_saunders: "Bruh lord saunders literally doesnt have lunch",heritage: "meh"},dinner: {clarity: "YOOOO DINNNER",lord_saunders: "SO FUIRE BRUH",heritage: "HERIATE"}},
        monday: {lunch: {clarity: "Clarity Lunch is really cool",lord_saunders: "Bruh lord saunders literally doesnt have lunch",heritage: "meh"},dinner: {clarity: "YOOOO DINNNER",lord_saunders: "SO FUIRE BRUH",heritage: "HERIATE"}},
        tuesday: {lunch: {clarity: "Clarity Lunch is really cool",lord_saunders: "Bruh lord saunders literally doesnt have lunch",heritage: "meh"},dinner: {clarity: "YOOOO DINNNER",lord_saunders: "SO FUIRE BRUH",heritage: "HERIATE"}},
        wednesday: {lunch: {clarity: "Clarity Lunch is really cool",lord_saunders: "Bruh lord saunders literally doesnt have lunch",heritage: "meh"},dinner: {clarity: "YOOOO DINNNER",lord_saunders: "SO FUIRE BRUH",heritage: "HERIATE"}},
        thursday: {lunch: {clarity: "Clarity Lunch is really cool",lord_saunders: "Bruh lord saunders literally doesnt have lunch",heritage: "meh"},dinner: {clarity: "YOOOO DINNNER",lord_saunders: "SO FUIRE BRUH",heritage: "HERIATE"}},
        friday: {lunch: {clarity: "Clarity Lunch is really cool",lord_saunders: "Bruh lord saunders literally doesnt have lunch",heritage: "meh"},dinner: {clarity: "YOOOO DINNNER",lord_saunders: "SO FUIRE BRUH",heritage: "HERIATE"}},
        saturday:{lunch: {clarity: "Clarity Lunch is really cool",lord_saunders: "Bruh lord saunders literally doesnt have lunch",heritage: "meh"},dinner: {clarity: "YOOOO DINNNER",lord_saunders: "SO FUIRE BRUH",heritage: "HERIATE"}}
    } satisfies Menu);
    // useEffect(() => {
    //     fetch("https://www.austinrockwell.net/api/menus").then(x => {
    //         console.log(x);
    //         x.json().then(x => {
    //             setS(JSON.stringify(x));
    //             console.log("JSON:");
    //             console.log(x);
    //         })

    //     });
    // }, [s]);

    return <AccordionAlwaysOpen menu={menu} currentDay="Sunday"/>
}
