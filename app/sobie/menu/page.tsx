"use client";
import NavbarDefault from "@/components/Navbar";
import { Footer, ObieText } from "@/components/text";
import { useState, useEffect } from "react";
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
    AccordionItemState,
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
    const menus = Object.entries(places).map(val => (<><div>{val[0]}</div><div className="text-gray-700 dark:text-[#f9f9f9]">{val[1]}</div></>));
    return (<>
        <div>Stevie:<br />
            <span className="italic text-xs">{getHours("stevie", mode, day)}</span>
        </div><div><div onClick={() => setShowChildren(!showChildren)} className="text-[#e81727] underline hover:brightness-75 hover:cursor-pointer">{text}</div></div>
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
                    {props.name}:<br />
                    <span className="italic text-xs">{getHours(props.name, props.mode, props.day)}</span>
                </div><div className="text-gray-700 animate-pulse dark:text-[#f9f9f9]" role="status">
                    <div className="h-2 bg-gray-200 rounded-full max-w-[450px] mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full max-w-[300px] mb-2.5"></div>
                </div>
            </>
        )
    }
    return (
        <>
            <div>{props.name}:<br />
                <span className="italic text-xs">{getHours(props.name, props.mode, props.day)}</span></div>
            <div className="text-gray-700 dark:text-[#f9f9f9]">{props.menu}</div>
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
        }, 1000 * 2 * 60); // every two minutes
    }, [swap]);


    if (props.loading) {
        return (
            <div className="p-5 text-gray-500">
                <div className="grid grid-cols-2 mx-auto gap-5">
                    <div className="col-span-2 text-black dark:text-white mx-auto">Breakfast</div>
                    <DayMenu name="Stevie" loading mode="breakfast" day={props.dayString} />

                    <div className="col-span-2 text-black dark:text-white  mx-auto">Lunch</div>
                    <DayMenu name="Clarity" loading mode="lunch" day={props.dayString} />
                    <DayMenu name="Heritage" loading mode="lunch" day={props.dayString} />
                    <DayMenu name="Lord Saunders" loading mode="lunch" day={props.dayString} />
                    <DayMenu name="Stevie" loading mode="lunch" day={props.dayString} />

                    <div className="col-span-2 text-black dark:text-white mx-auto">Dinner</div>
                    <DayMenu name="Clarity" loading mode="dinner" day={props.dayString} />
                    <DayMenu name="Heritage" loading mode="dinner" day={props.dayString} />
                    <DayMenu name="Lord Saunders" loading mode="dinner" day={props.dayString} />
                    <DayMenu name="Stevie" loading mode="dinner" day={props.dayString} />
                </div>
            </div>
        );
    }
    return (
        <div className="p-5 text-gray-500">
            <div className="grid grid-cols-2 mx-auto gap-5">
                <div className="col-span-2 text-black dark:text-white mx-auto">Breakfast</div>
                <StevieCollapse places={props.stevieMenus.breakfast!} mode="breakfast" day={props.dayString} />

                <div className="col-span-2 text-black dark:text-white  mx-auto">Lunch</div>
                <DayMenu name="Clarity" menu={props.day.lunch.clarity} mode="lunch" day={props.dayString} />
                <DayMenu name="Heritage" menu={props.day.lunch.heritage} mode="lunch" day={props.dayString} />
                <DayMenu name="Lord Saunders" menu={props.day.lunch.lord_saunders} mode="lunch" day={props.dayString} />
                <StevieCollapse places={props.stevieMenus.lunch} mode="lunch" day={props.dayString} />

                <div className="col-span-2 text-black dark:text-white mx-auto">Dinner</div>
                <DayMenu name="Clarity" menu={props.day.dinner.clarity} mode="dinner" day={props.dayString} />
                <DayMenu name="Heritage" menu={props.day.dinner.heritage} mode="dinner" day={props.dayString} />
                <DayMenu name="Lord Saunders" menu={props.day.dinner.lord_saunders} mode="dinner" day={props.dayString} />
                <StevieCollapse places={props.stevieMenus.dinner} mode="dinner" day={props.dayString} />
            </div>
        </div>
    );
}


interface LoadedCollapse {
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
    const header = (
        <AccordionItemHeading className="accordion__heading!border-none">
            <AccordionItemButton className="accordion__button !text-[#e81727] !bg-white dark:!bg-[#120C0B] font-serif uppercase !border-none">{props.dayString}
            </AccordionItemButton>
        </AccordionItemHeading>
    );
    if (props.loading) {
        return (<>
            {header}
            <AccordionItemPanel><Day loading dayString={props.dayString} /></AccordionItemPanel>
        </>);
    }
    return (
        <>
            {header}
            <AccordionItemPanel><Day dayString={props.dayString} day={props.day} stevieMenus={props.stevieMenus} /></AccordionItemPanel>
        </>
    );
}

interface AccordionProps {
    menu?: Menu
    currentDay: string
    stevie?: StevieMenu
    loading: boolean
}

function AccordionAlwaysOpen(props: AccordionProps) {
    const weeks = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return (
        <Accordion allowMultipleExpanded allowZeroExpanded preExpanded={[props.currentDay]} className="accordion !border-0">
            {weeks.map(x => (
                <AccordionItem uuid={x} key={x} className="accordion__item !border-t-2 !border-t-[#FFC72C] pt-2 !border-b-0 mt-3 !border-l-0 !border-r-0">
                    <DayCollapse loading={props.loading} day={
                        props.menu ? (props.menu as any)[x.toLowerCase()] : null
                    }
                        stevieMenus={
                            props.stevie ? (props.stevie as any)[x.toLowerCase()] : null
                        } dayString={x} />
                </AccordionItem>
            ))}
        </Accordion>
    )
}

const weeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


function Index() {
    "use client";
    const [menu, setMenu] = useState(null as MenuResponse | null);
    const [currentDay, setCurrentDay] = useState(null as string | null);
      useEffect(() => {
          fetch("/api/menus").then(x => {
            x.json().then(x => setMenu(x));
          });
      }, []);
    // useEffect(() => {
    //     setTimeout(() => setMenu(dummy), 1000);
    // }, []);
    useEffect(() => {
        setCurrentDay(weeks[(new Date()).getDay()]);
    });
    if (currentDay === null) {
        return <></>;
    }
    return (<>
        <AccordionAlwaysOpen menu={menu?.menu} currentDay={currentDay} stevie={menu?.stevie} loading={menu === null} />
        <Footer>
            This menu is currently showing dining options for week #{menu?.for_week || "unknown"}.
        </Footer>
    </>);
}



export default function f() {
    return (
        <>
            <NavbarDefault active="ObieEats" />
            <div className="lg:p-4">
                <Index />
            </div>
        </>
    )
}