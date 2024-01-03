"use client";
import NavbarDefault from "@/components/Navbar";
import { WeekPicker } from "@/components/inputs";
import { GoToLink } from "@/components/text";
import { useState } from "react";
import { WeekData, daysOfWeek } from "../types";


// TODO maybe input CRN information :O
export default function f() {
    const [week, setWeek] = useState(Object.fromEntries(daysOfWeek.map(x => [x, false])) as WeekData<boolean>);
    return (<>
        <NavbarDefault active="Mark My Calendar" />
        <div className="mx-auto p-5">
            <WeekPicker onChange={setWeek} value={week}>Class Session</WeekPicker>
        </div>
    </>
    )
}