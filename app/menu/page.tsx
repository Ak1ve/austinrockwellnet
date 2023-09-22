"use client";
import { useState, useEffect } from "react";
import React from "react";
import { TECollapse } from "tw-elements-react";


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
        <div className="rounded-t-lg border border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
            <h2 className="mb-0" id="headingOne">
                <button
                    className={`${show.collapse1 &&
                        `text-primary [box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:!text-primary-400 dark:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]`
                        } group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white`}
                    type="button"
                    onClick={() =>
                        hook[1](show)
                    }
                    aria-expanded="true"
                    aria-controls="collapseOne"
                >
                    {dayString}
                    <span
                        className={`${show.collapse1
                            ? `rotate-[-180deg] -mr-1`
                            : `rotate-0 fill-[#212529]  dark:fill-white`
                            } ml-auto h-5 w-5 shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out motion-reduce:transition-none dark:fill-blue-300`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-6 w-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                            />
                        </svg>
                    </span>
                </button>
            </h2>
            <TECollapse
                show={show.collapse1}
                className="!mt-0 !rounded-b-none !shadow-none"
            >
                <Day day={day} />
            </TECollapse>
        </div>
    );
}

function AccordionAlwaysOpen({ menu }: { menu: Menu }) {
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
        <>
            <DayCollapse hook={showHook} day={menu.monday} dayString="Monday" />
            <DayCollapse hook={showHook} day={menu.tuesday} dayString="Tuesday" />
            <DayCollapse hook={showHook} day={menu.wednesday} dayString="Wednesday" />
            <DayCollapse hook={showHook} day={menu.thursday} dayString="Thursday" />
            <DayCollapse hook={showHook} day={menu.friday} dayString="Friday" />
            <DayCollapse hook={showHook} day={menu.saturday} dayString="Satuday " />
            <DayCollapse hook={showHook} day={menu.sunday} dayString="Sunday" />
        </>
    );
}

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

    return <AccordionAlwaysOpen menu={menu}/>
}
