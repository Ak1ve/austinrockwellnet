"use client";
import { execSync } from "child_process";
import { useState, useEffect } from "react";

export default async function Index() {
    "use client";
    const [s, setS] = useState("");
    useEffect(() => {
        fetch("https://www.austinrockwell.net/api/python").then(x => {
            x.text().then(x => setS(x));
        });
    });
    return <>{s}</>
}
