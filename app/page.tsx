import './globals.css';
import { EMAIl, INSTAGRAM, LINKEDIN, GITHUB, PHONE } from "@/components/assets";
import Image from "next/image";


/*

body {
  background-color: #100d0d;
  color: #fd0d4d;
  font-size: 500%;
  overflow-y: hidden;
}

a {
  all:unset;
  
}
a:hover {
  cursor: pointer;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 100vh;
  flex-wrap: wrap;
  cursor: default;
}

.photo {
  margin-left: -10%;
  border-radius: 100%;
  outline-style: solid;
  outline-color: #fd0d4d;
  outline-width: 3px;
}

.photo:hover {
  outline-offset: 5px;
  scale: 105%;
}

h3 {
  margin-left: 5%;
}

.flex-break {
  flex-basis: 100%;
  height: 0%; 
}

.socials {
  margin-top: -35%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5%;
  width: 100%;
}

.socials * :hover {
  color: white;
}
*/
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
                <a href="/sobie" className="text-5xl hover:text-white font-serif">SOBIE</a>
            </div>
        </div>
    );
}