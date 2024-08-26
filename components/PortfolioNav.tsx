"use client";
import { useState } from "react";
import Image from "next/image";


function NavItem(props: { link: string, title: string, active: boolean }) {
    const cls = props.active ? "text-[#fd0d4d]" : "text-white";
    return (
        <li className="nav-item">
            <a
                className={cls + " px-3 py-2 flex items-center font-bold leading-snug hover:underline hover:decoration-[#fd0d4d] underline-offset-8 decoration-[2px]"}
                href={props.link}
            >
                <span className="ml-2">{props.title}</span>
            </a>
        </li>
    );
}

const navElements = [
    { link: "#about-me", title: "About Me" },
    { link: "#work-experience", title: "Work Experience" }
];

export default function PortfolioNav({ active }: { active?: string }) {
    const [navbarOpen, setNavbarOpen] = useState(false);
    return (
        <>
            <div className="fixed top-0 w-full">
                <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 mb-3 font-serif border-b-4 border-b-[#fd0d4d] bg-[#120C0B]">
                    <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
                        <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
                            <a
                                className="font-bold leading-relaxed inline-block mr-4 text-3xl text-[#fd0d4d] whitespace-nowrap"
                                href="/"
                            >
                                Austin Rockwell
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
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
}