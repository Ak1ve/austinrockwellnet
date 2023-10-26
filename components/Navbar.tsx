import React from "react";


function NavItem(props: { link: string, title: string, active: boolean }) {
    const cls = props.active ? "text-[#FFC72C]" : "";
    return (
        <li className="nav-item">
            <a
                className={cls + " px-3 py-2 flex items-center font-bold leading-snug text-white hover:underline hover:decoration-[#FFC72C] underline-offset-8 decoration-[2px]"}
                href={props.link}
            >
                <span className="ml-2">{props.title}</span>
            </a>
        </li>
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


export default function NavbarDefault({active}: {active?: string}) {
    const [navbarOpen, setNavbarOpen] = React.useState(false);
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
                            {navElements.map(x => <NavItem link={x.link} title={x.title} key={x.link} active={x.title === active}/>)}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}
