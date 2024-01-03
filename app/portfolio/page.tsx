import PortfolioNav from "@/components/PortfolioNav";


function Text({children}: any) {
    return (
        <div className="bg-gradient-to-tr from-[#cc494c] to-[#cc4998] inline-block text-transparent bg-clip-text font-semibold text-3xl">{children}</div>
    )
}

export default function portfolio() {
    return (
        <>
            <PortfolioNav active="About Me"/>
            <div className="mt-10"></div>
            <Text>About Me</Text>
        </>
    )
}