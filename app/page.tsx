import { EMAIl, INSTAGRAM, LINKEDIN, GITHUB, PHONE } from "@/components/assets";
import Image from "next/image";
import "./main.css"
function IconLink({ icon, children, href }: any) {
  return (
    <a className="hover:text-white hover:scale-105 flex items-center mt-5 lg:mt-0" href={href} target="_blank">
      <div className="mr-10">{icon}</div>
      <div className="underline lg:hidden text-3xl underline-offset-4">{children}</div>
    </a>
  )
}

// red: #fd0d4d
export default function Index() {
  return (
    <div className="mx-auto text-[#fd0d4d] lg:translate-y-[50%] mb-10 lg:mb-0">
      <div className="lg:flex justify-between w-fit mx-auto gap-10">
        <a href="/me.png" target="_blank">
          <Image height={200} width={200} src="/me.png" alt="A photo of me" className="mx-auto mt-10 lg:mt-0 rounded-3xl border-[#fd0d4d] border-2" />
        </a>
        <div className="font-bold text-4xl lg:text-7xl self-center">Autumn Rockwell</div>
      </div>
      <div className="lg:flex lg:justify-between lg:w-[60%] mt-10 mx-auto w-fit text-center">
        <IconLink href="https://www.instagram.com/magic.marinara/" icon={INSTAGRAM}>Instagram</IconLink>
        <IconLink href="https://www.linkedin.com/in/autumn-rockwell-0593b527b/" icon={LINKEDIN}>LinkedIn</IconLink>
        <IconLink href="mailto:autumnrockwell04@gmail.com" icon={EMAIl}>Email Me</IconLink>
        <IconLink href="https://github.com/Ak1ve" icon={GITHUB}>Github</IconLink>
        <IconLink href="tel:419-706-5906" icon={PHONE}>Text Me</IconLink>
        
        <div className="hover:text-white hover:scale-105 text-5xl font-serif mt-5 lg:mt-0">
          <a className="underline lg:no-underline underline-offset-4" href="/sobie">SOBIE</a>
        </div>
      </div>
    </div>
  );
}