import React, { useEffect, useState } from "react";
import ThemeSwitcher from "./switcher";
import { useRouter } from "next/router";


function NavItem(props: { link: string, title: string, active: boolean }) {
    const cls = props.active ? "text-[#FFC72C]" : "text-white";
    return (
        <li className="nav-item">
            <a
                className={cls + " px-3 py-2 flex items-center font-bold leading-snug hover:underline hover:decoration-[#FFC72C] underline-offset-8 decoration-[2px]"}
                href={props.link}
            >
                <span className="ml-2">{props.title}</span>
            </a>
        </li>
    );
}

function Notification(props: { body: string }) {
    const [show, setShow] = useState(true);
    useEffect(() => {
        setShow(true);
    }, [props.body]);
    if (props.body === null || props.body === undefined || !show || props.body === "") {
        return <></>;
    }
    const _ = "underline hover:underline";
    const mode = props.body.substring(0, 1);
    const colors = {
        i: "text-blue-800 border-blue-300 bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800",
        e: "text-red-800 border-red-300 bg-red-50 dark:bg-red-800 dark:text-red-400 dark:border-red-800",
        w: "text-yellow-800 border-yellow-300 bg-yellow-50 dark:bg-yellow-800 dark:text-yellow-400 dark:border-yellow-800",
        s: "text-green-800 border-green-300 bg-green-50 dark:bg-green-800 dark:text-green-400 dark:border-green-800",

    } as any;
    return (<>
        <div className="absolute h-fit left-[7.5%] z-10 w-[85%] bottom-6 lg:bottom-0 lg:top-20">
            <div className={"flex items-center p-4 mb-4 text-sm border rounded-lg " + colors[mode]} role="alert">
                <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <div dangerouslySetInnerHTML={{ __html: props.body.substring(2) }} />
                <div className="ml-auto hover:cursor-pointer hover:underline" onClick={x => setShow(false)}>x</div>
            </div>
        </div>
        <div className="lg:mb-20" />
    </>
    );
}

const navElements = [{
    title: "ObieEats",
    link: "/sobie/menu"
},
{
    title: "FlexSwipe",
    link: "/sobie/meal"
},
{
    title: "Mark My Calendar",
    link: "/sobie/mark-my-calendar",
},
];


export default function NavbarDefault({ active }: { active?: string }) {
    const [navbarOpen, setNavbarOpen] = React.useState(false);
    const [notification, setNotification] = useState(null as any);

    const notificationCenter = () => {
        const path = window.location.pathname;
        if (path === null) {
            return;
        }
        fetch("/api/notifications").then(x => x.json().then(y => setNotification(y[path] || null)));
        // setNotification({ "/sobie/notifications-austinrockwellnet": "s:<p>THIS MESSAGE IS SUPER IMPORTANT. PLEASE CLICK <a href='/sobie/menu'>this menu</a> to find out more</p>" }[path] || null);
    }

    useEffect(() => {
        notificationCenter();
        setInterval(notificationCenter, 60 * 1000 * 10);  // every 10 minutes
    }, [notification]);

    return (
        <>
            <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-[#a6192e] mb-3 font-serif border-b-4 border-b-[#FFC72C]">
                <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
                    <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
                        <a
                            className="font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap text-white"
                            href="/sobie"
                        >
                            <div className="flex hover:scale-105">
                                <div className="mr-5 uppercase text-2xl">SOBIE</div>
                                <div className="bg-[#FFC72C] w-1"></div>
                                <div className="ml-5 text-base self-center font-light">Oberlin Made Simple</div>
                            </div>
                        </a>
                        <button
                            className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
                            type="button"
                            onClick={() => setNavbarOpen(!navbarOpen)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0,0,256,256"><g fill="#ffffff" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none"><g transform="scale(5.12,5.12)"><path d="M0,9v2h50v-2zM0,24v2h50v-2zM0,39v2h50v-2z"></path></g></g></svg>
                        </button>
                    </div>
                    <div
                        className={
                            "lg:flex flex-grow items-center" +
                            (navbarOpen ? " flex" : " hidden")
                        }
                    >
                        <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
                            {navElements.map(x => <NavItem link={x.link} title={x.title} key={x.link} active={x.title === active} />)}
                            <ThemeSwitcher />
                        </ul>
                    </div>
                </div>
            </nav>
            <Notification body={notification} />
        </>
    );
}