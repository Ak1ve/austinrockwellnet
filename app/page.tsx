import { EMAIl, INSTAGRAM, LINKEDIN, GITHUB, PHONE } from "@/components/assets";
import Image from "next/image";



export default function Index() {
    return (
        <div className="center">
            <a href="/me.png" target="_blank"><Image height={200} width={200} src="/me.png" alt="A photo of me" className="photo" /></a>
            <h3>Austin Rockwell</h3>
            <div className="flex-break" />
            <div className="socials">
                <a href="https://www.instagram.com/magic.marinara/" target="_blank">{INSTAGRAM}</a>
                <a href="https://www.linkedin.com/in/austin-rockwell-0593b527b/" target="_blank">{LINKEDIN}</a>
                <a href="mailto:rockwell.austin04@gmail.com" target="_blank">{EMAIl}</a>
                <a href="https://github.com/Ak1ve" target="_blank">{GITHUB}</a>
                <a href="tel:419-706-5906">{PHONE}</a>
            </div>
        </div>
    );
}