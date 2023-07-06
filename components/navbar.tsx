import React from "react";
import classNames from "classnames";
import Image from "next/image";

function Link({ active, href, children }: { active?: boolean, href?: string, children?: any }) {
    const className = classNames("px-3 py-2 self-center block rounded-md text-medium text-base",
        {
            "text-white hover:bg-red-800 hover:text-red-100": !active,
            "bg-red-950 text-white": active
        }
    );
    return (
        <a href={href} className={className}>{children}</a>
    );
}

export default function Navbar() {
    const links = [
        <Link href="#" active={true} key="Dashboard">Dashboard</Link>,
        <Link href="#" key="Team">Team</Link>,
        <Link href="#" key="Projects">Projects</Link>,
        <Link href="#" key="Calender">Calender</Link>
    ];

    return (
        <nav className="bg-primary-dark backdrop-blur-md fixed">
            <div className="mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button type="button" className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-red-800 hover:text-red-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                            <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-1 items-center justify-center h-10 sm:items-stretch sm:justify-start">
                        <div className="flex flex-shrink-0 items-center">
                            <Image width="50" height="50" className="block lg:hidden" src="/me.png" alt="Your Company" />
                            <Image width="50" height="50" className="hidden lg:block" src="/me.png" alt="Your Company" />
                            <div className="text-white text-xl ml-5">Austin Rockwell</div>
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {links}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="sm:hidden" id="mobile-menu">
                <div className="space-y-1 px-2 pb-3 pt-2">
                    {links}
                </div>
            </div>
        </nav>
    );
}
