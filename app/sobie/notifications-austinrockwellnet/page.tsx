"use client";
import NavbarDefault from "@/components/Navbar";
import { useEffect, useState } from "react";


const labelClass = "block mb-2 text-sm text-[#e81727] font-bold font-serif";
const inputClass = "bg-gray-50 border dark:bg-gray-800 dark:text-white border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5";

const options = ["/sobie/meal", "/sobie/menu", "/sobie/mark-my-calendar",
    "/sobie/notifications-austinrockwellnet"];


function post(route: string, body: any) {
    return fetch(route, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(body),
      });
}

export default function f() {
    const [notifications, setNotifications] = useState(null as any);
    const [severity, setSeverity] = useState("i" as "i" | "e" | "s" | "w");
    const [body, setBody] = useState({
        raw_password: "",
        route: options[0],
        value: "",
    });
    const onSelect = (x: any) => {
        setBody({ ...body, route: x.target.value });
    }
    const clearAllNotifications = () => {
        options.forEach(x => {
            post("/api/notifications", {
                raw_password: body.raw_password,
                route: x,
                value: ""
            }).then(x => console.log(x));
        })
    }

    const setNotification = () => {
        post("/api/notifications", {...body, value: severity + ":" + body.value});
    }

    return (<>
        <NavbarDefault active="******" />
        <b>IF YOU ARE READING THIS, YOU SHOULD NOT BE HERE</b>
        <div className="mx-auto p-5 md:w-[50%]">
            <label className={labelClass}>Route To Set Notification</label>
            <select onChange={onSelect} value={body.route} className={inputClass}>
                {options.map((x) => (
                    <option key={x} value={x}>{x}</option>
                ))}
            </select>
            <div className="grid grid-cols-2 gap-4 items-center">
                <div>
                    <label className={labelClass}>Severity</label>
                    <select onChange={e => setSeverity(e.target.value as any)} value={severity} className={inputClass}>
                        {[["info", "i"], ["error", "e"], ["success", "s"], ["warning", "w"]].map((x) => (
                            <option key={x[0]} value={x[1]}>{x[0]}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className={labelClass} >Message</label>
                    <input className={inputClass} name="Message" type="text" value={body.value} onChange={e => setBody({ ...body, value: e.target.value })} />
                </div>
            </div>
            <label className={labelClass}>Password</label>
            <input className={inputClass} name="password" type="password" value={body.raw_password} onChange={e => setBody({...body, raw_password: e.target.value})}></input>
            <div className="lg:grid lg:grid-cols-2 gap-4 items-center mt-5">
                <button onClick={clearAllNotifications} className="bg-red-400 block font-bold rounded text-white hover:brightness-75 w-full">Clear All Notifications</button>
                <button onClick={setNotification} className="bg-green-400 mt-5 lg:mt-0 block font-bold rounded text-white hover:brightness-75 w-full">Submit</button>
            </div>
        </div>
    </>);
}
