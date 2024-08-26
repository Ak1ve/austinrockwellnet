"use client";
import PortfolioNav from "@/components/PortfolioNav";
import classNames from "classnames";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { forwardRef } from "react";


function Text({children}: any) {
    return (
        <div className="bg-gradient-to-tr from-[#cc494c] to-[#cc4998] inline-block text-transparent bg-clip-text font-semibold text-3xl">{children}</div>
    )
}

type HeaderProps = React.HTMLProps<HTMLDivElement>;
const Header = forwardRef((props: HeaderProps, ref) => {
    const {className, ...rest} = props;
    const clsName = classNames("mx-auto text-4xl underline font-bold text-[#fd0d4d] w-fit", className);
    return (
        <div className={clsName} ref={ref as any} {...rest}/>
    );
})

type Refs<T extends symbol | string> = {
    [K in T]: React.RefObject<HTMLDivElement | null>
}


function createRefs<E extends symbol | string, T extends E[]>(x: T): Refs<T[number]> {
    return Object.fromEntries(x.map(z => [z, React.createRef()])) as Refs<T[number]>;
}

function useHash() {
    const [state, setState] = useState(window.location.href.split("#")[1])
}

export default function portfolio() {
    const refs = createRefs(["about-me", "work-experience"]);
    const scrollTo = <K extends keyof typeof refs>(k: K) => {
        refs[k].current?.scrollIntoView();
    }
    
    useEffect(() => {
        console.log(location.href);
    }, []);
    return (
        <>
            <PortfolioNav active="About Me"/>
            <div className="mb-20"><br/></div>
            <Header ref={refs["about-me"]} id="about-me">About Me</Header>
        </>
    )
}