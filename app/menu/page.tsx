"use client";
import { useState, useEffect } from "react";

export default function Index() {
    "use client";
    const [s, setS] = useState("" as any);
    useEffect(() => {
        fetch("https://www.austinrockwell.net/api/menus").then(x => {
            console.log(x);
            x.json().then(x => {
                setS(JSON.stringify(x));
                console.log("JSON:");
                console.log(x);
            })
            
        });
    }, [s]);
    return <>MENU: {s}</>
}
