import Navbar from "@/components/navbar";
import classNames from "classnames";
import Image from "next/image";


function getColor(color: string) {
    return {
        "border-red-800 text-red-800 outline-red-800/30": color==="red",
        "border-blue-800 text-blue-800 outline-blue-800/30": color==="blue",
        "border-purple-800 text-purple-800 outline-purple-800/30": color==="purple",
        "border-fuchsia-800 text-fuchsia-800 outline-fuchsia-800/30": color==="fuchsia",

    };
}

function Section({ children, className, color="red" }: any) {
    const clsName = classNames("border-2  shadow-lg rounded-2xl p-5 w-100 outline outline-offset-4", className,
            getColor(color)
        );
    return <div className={clsName}>
        {children}
    </div>
}

function ImageCard({color, src, alt, className}: {color: string, src: string, alt: string, className?: string}) {
    const clsName = classNames("rounded-full mx-auto border-2 outline outline-offset-4", getColor(color), className);
    return (
        <Image className={clsName} width="200" height="200" src={src} alt={alt} />
    )

}

function WorkCard({src, children}: {src: string, children: any}) {

}



export default function Index() {
    return (
        <div className="lg:grid lg:grid-cols-12 gap-10 container p-10 text-2xl">
            <Section className="lg:col-span-4">
            <h2>About Me</h2>
            <div className="container p-3 mt-8">
                <ImageCard src="/me.png" alt="A photo of me!" color="red" />
                <h3 className="text-red-800/60 text-center mt-3">he/they</h3>
            </div>
            </Section>
            <Section className="lg:col-span-8" color="purple">
                <h2 className="text-end">Experience</h2>
                <ImageCard alt="Summit" src="/summit.png" color="purple" />
                <ImageCard alt="Scene75" src="/scene75.png" color="purple" />
                <ImageCard alt="FTMC" src="/ftmc.jpg" color="purple" />
            </Section>
        </div>
    );
}