"use client";
import NavbarDefault from "@/components/Navbar";
import { GoToLink } from "@/components/text";


export default function f() {
    return (<>
        <NavbarDefault active="Mark My Calendar" />
        <div className="ml-4">
            <p className="border-l-4 border-[#FFC72C] pl-2 mb-2">
                This project is currently under construction!  To learn more about this project,
                visit the <b className="text-[#e81727] font-serif">SOBIE</b> homepage to learn more!
            </p>
            <GoToLink href="/sobie" className="mt-2 text-[#FFC72C]">Take Me there!</GoToLink>
            <img className="mx-auto mt-10" src="https://pngimg.com/d/under_construction_PNG18.png" width="500"/>
        </div>
    </>
    )
}