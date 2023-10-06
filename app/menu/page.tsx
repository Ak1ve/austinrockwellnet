"use client";
import { accordion } from "@material-tailwind/react";
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

const stev = {
  day: {
    breakfast: { hours: "7:30 AM - 11:00 AM", start: 7.5, end: 11 },
    lunch: { hours: "11:00 AM - 5:00 PM", start: 11, end: 17 },
    dinner: { hours: "5:00 PM - 8:00 PM", start: 17, end: 20 }
  },
  end: {
    breakfast: {
      hours: "9:30 AM - 11:00 AM", start: 9.5, end: 11
    },
    lunch: { hours: "11:00 AM - 5:00 PM", start: 11, end: 17 },
    dinner: { hours: "5:00 PM - 8:00 PM", start: 17, end: 20 }
  }
}

const lord = {
    lunch: null,
    dinner: { hours: "5:00 PM - 7:30 PM", start: 17, end: 19.5 }
}

const clarity = {
    lunch: { hours: "11:00 AM - 2:00 PM", start: 11, end: 14 },
    dinner: { hours: "5:00 PM - 8:00 PM", start: 17, end: 20 }
}

const heritage = {
  lunch: { hours: "11:00 AM - 2:00 PM", start: 11, end: 14 },
  dinner: { hours: "5:00 PM - 8:00 PM", start: 17, end: 20 }
}

type HourRep = {
  hours: string,
  start: number,
  end: number
} | null;

type HoursDayType = {
  breakfast: {
    stevie: HourRep
  },
  lunch: {
    stevie: HourRep,
    lord_saunders: HourRep,
    clarity: HourRep,
    heritage: HourRep,
  },
  dinner: {
    stevie: HourRep,
    lord_saunders: HourRep,
    clarity: HourRep,
    heritage: HourRep,
  }
}

type HoursType = {
  sunday: HoursDayType,
  monday: HoursDayType,
  tuesday: HoursDayType,
  wednesday: HoursDayType,
  thursday: HoursDayType,
  friday: HoursDayType,
  saturday: HoursDayType
}

const Hours: HoursDayType = {} as any;
const end = (x: string) => x === "saturday" || x === "sunday";
const sab = (x: string) => x === "friday" || x === "saturday";
["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].forEach(x => {
  (Hours as any)[x] = {
    breakfast: {
      stevie: end(x) ? stev.end.breakfast : stev.day.breakfast
    },
    lunch: {
      stevie: end(x) ? stev.end.lunch : stev.day.lunch,
      clarity: clarity.lunch,
      heritage: sab(x) ? null : heritage.lunch,
      lord_saunders: sab(x) ? null : lord.lunch
    },
    dinner: {
      stevie: end(x) ? stev.end.dinner : stev.day.dinner,
      clarity: clarity.dinner,
      heritage: sab(x) ? null : heritage.dinner,
      lord_saunders: sab(x) ? null : lord.dinner
    }
  };
});

function StevieCollapse({ places, mode, day }: { places: SteviePlaces, mode: string, day: string }) {
  const [showChildren, setShowChildren] = useState(false);
  const text = showChildren ? "Hide Menu" : "Show Menu";
  const menus = Object.entries(places).map(val => (<><div>{val[0]}</div><div className="text-gray-700">{val[1]}</div></>));
  return (<>
    <div>Stevie:<br/>
    <span className="italic text-xs">{getHours("stevie", mode, day)}</span>
      </div><div><div onClick={() => setShowChildren(!showChildren)} className="text-blue-500 underline hover:text-blue-700 hover:cursor-pointer">{text}</div></div>
    {showChildren ? menus : <></>}
  </>);
}

interface LoadedDay {
  day: Day
  stevieMenus: Day<SteviePlaces>
  loading?: false
  dayString: string
}

type DayType = LoadedDay | { loading: true, dayString: string }


function getHours(hall: string, mode: string, day: string) {
  let d = hall.toLowerCase();
  d = d === "lord saunders" ? "lord_saunders" : d;
  const m = (Hours as any)[day.toLowerCase()][mode.toLowerCase()][d];
  return m && m.hours ? m.hours : "Closed";
}


function DayMenu(props: { name: string, menu: string, mode: string, loading?: false, day: string } | { mode: string, loading: true, name: string, day: string }) {
  if (props.loading) {
    return (
      <>
        <div>
          {props.name}:<br/>
          <span className="italic text-xs">{getHours(props.name, props.mode, props.day)}</span>
        </div><div className="text-gray-700 animate-pulse" role="status">
          <div className="h-2 bg-gray-200 rounded-full max-w-[450px] mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full max-w-[300px] mb-2.5"></div>
        </div>
      </>
    )
  }
  return (
    <>
      <div>{props.name}:<br/>
          <span className="italic text-xs">{getHours(props.name, props.mode, props.day)}</span></div><div className="text-gray-700">{props.menu}</div>
    </>
  );
}

function Day(props: DayType) {
  const currentTime = useState(null as Date | null);
  const [swap, setSwap] = useState(false);
  useEffect(() => {
    currentTime[1](new Date());
    setTimeout(() => {
      setSwap(!swap);
    },1000 * 2 * 60); // every two minutes
  }, [swap]);


  if (props.loading) {
    return (
      <div className="p-5 text-gray-500">
        <div className="grid grid-cols-2 mx-auto gap-5">
          <div className="col-span-2 text-black mx-auto">Breakfast</div>
          <DayMenu name="Stevie" loading mode="breakfast" day={props.dayString}/>

          <div className="col-span-2 text-black  mx-auto">Lunch</div>
          <DayMenu name="Clarity" loading mode="lunch" day={props.dayString}/>
          <DayMenu name="Heritage" loading mode="lunch" day={props.dayString}/>
          <DayMenu name="Lord Saunders" loading mode="lunch" day={props.dayString}/>
          <DayMenu name="Stevie" loading mode="lunch" day={props.dayString}/>

          <div className="col-span-2 text-black mx-auto">Dinner</div>
          <DayMenu name="Clarity" loading mode="dinner" day={props.dayString}/>
          <DayMenu name="Heritage" loading mode="dinner" day={props.dayString}/>
          <DayMenu name="Lord Saunders" loading mode="dinner" day={props.dayString}/>
          <DayMenu name="Stevie" loading mode="dinner" day={props.dayString}/>
        </div>
      </div>
    );
  }
  return (
    <div className="p-5 text-gray-500">
      <div className="grid grid-cols-2 mx-auto gap-5">
        <div className="col-span-2 text-black mx-auto">Breakfast</div>
        <StevieCollapse places={props.stevieMenus.breakfast!} mode="breakfast" day={props.dayString}/>

        <div className="col-span-2 text-black  mx-auto">Lunch</div>
        <DayMenu name="Clarity" menu={props.day.lunch.clarity} mode="lunch" day={props.dayString}/>
        <DayMenu name="Heritage" menu={props.day.lunch.heritage} mode="lunch" day={props.dayString}/>
        <DayMenu name="Lord Saunders" menu={props.day.lunch.lord_saunders} mode="lunch" day={props.dayString}/>
        <StevieCollapse places={props.stevieMenus.lunch} mode="lunch" day={props.dayString}/>

        <div className="col-span-2 text-black mx-auto">Dinner</div>
        <DayMenu name="Clarity" menu={props.day.dinner.clarity} mode="dinner" day={props.dayString}/>
        <DayMenu name="Heritage" menu={props.day.dinner.heritage} mode="dinner" day={props.dayString}/>
        <DayMenu name="Lord Saunders" menu={props.day.dinner.lord_saunders} mode="dinner" day={props.dayString}/>
        <StevieCollapse places={props.stevieMenus.dinner} mode="dinner" day={props.dayString}/>
      </div>
    </div>
  );
}


interface LoadedCollapse {
  hook: any
  day: Day
  dayString: string
  stevieMenus: Day<SteviePlaces>
  loading?: false
}

interface UnloadedCollapse {
  loading: true
  dayString: string
}

type CollapseAccordion = LoadedCollapse | UnloadedCollapse
function DayCollapse(props: CollapseAccordion) {
  if (props.loading) {
    return (<>
      <AccordionItemHeading>
        <AccordionItemButton>{props.dayString}</AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel><Day loading dayString={props.dayString}/></AccordionItemPanel>
    </>);
  }
  const show = { ...props.hook[0] };
  show[props.dayString] = !show[props.dayString];
  return (
    <>
      <AccordionItemHeading onClick={() => props.hook[1](show)}>
        <AccordionItemButton>{props.dayString}</AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel><Day dayString={props.dayString} day={props.day} stevieMenus={props.stevieMenus} /></AccordionItemPanel>
    </>
  );
}

interface LoadedAccordion {
  menu: Menu
  currentDay: string
  stevie: StevieMenu
  loading?: false
}

type AccordionProps = LoadedAccordion | { loading: true };

function AccordionAlwaysOpen(props: AccordionProps) {
  const showHook = useState({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: true,
    Sunday: true,
  });

  if (props.loading) {
    return (
      <Accordion allowMultipleExpanded allowZeroExpanded preExpanded={Object.keys(showHook[0])}>
        {Object.keys(showHook[0]).map(x => (
          <AccordionItem uuid={x} key={x}>
            <DayCollapse loading dayString={x} />
          </AccordionItem>
        ))}
      </Accordion>
    )
  }

  return (
    <Accordion allowMultipleExpanded allowZeroExpanded preExpanded={[props.currentDay]}>
      {Object.keys(showHook[0]).map(x => (
        <AccordionItem uuid={x} key={x}>
          <DayCollapse hook={showHook} day={(props.menu as any)[x.toLowerCase()]}
            stevieMenus={(props.stevie as any)[x.toLowerCase()]} dayString={x} />
        </AccordionItem>
      ))}
    </Accordion>
  )
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
  const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][(new Date()).getDay()];
  return (<>
    {menu === null ? <AccordionAlwaysOpen loading /> :
      <AccordionAlwaysOpen menu={menu.menu} currentDay={week} stevie={menu.stevie} />
    }
    For Week: {menu?.for_week || "unknown"}
    <div className="italic">*DISCLAIMER: Some menu options may not be accurate.  If any issue arises (either with using the site or incorrect menus), please contact arockwel@oberlin.edu </div>
  </>);
}
