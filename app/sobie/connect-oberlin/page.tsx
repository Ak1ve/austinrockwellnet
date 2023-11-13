"use client";
import NavbarDefault from "@/components/Navbar";
import { Scheduler } from "@aldabil/react-scheduler";


// https://www.npmjs.com/package/@aldabil/react-scheduler
export default function f() {
    return (<>
        <NavbarDefault active="Connect Oberlin" />
        <Scheduler
            view="month"
            events={[
                {
                    event_id: 1,
                    title: "Event 1",
                    start: new Date("2023/5/2 09:30"),
                    end: new Date("2023/5/2 10:30"),
                },
                {
                    event_id: 2,
                    title: "Event 2",
                    start: new Date("2023/11/11 10:00"),
                    end: new Date("2023/11/11 11:00"),
                },
                {
                    event_id: 3,
                    title: "Event 3",
                    start: new Date("2023/11/11 10:30"),
                    end: new Date("2023/11/11 11:30"),
                }
            ]}
        />
    </>);
}