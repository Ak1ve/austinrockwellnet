"use client";
import { execSync } from "child_process";
import { useState, useEffect } from "react";

export default async function Index() {
    "use client";
    const [s, setS] = useState("" as any);
    useEffect(() => {
        fetch("https://www.austinrockwell.net/api/python").then(x => {
            console.log(x);
            x.text().then(x => {setS(x); console.log(x)});
        });
    }, []);
    return <>MENU: {s}</>
}
