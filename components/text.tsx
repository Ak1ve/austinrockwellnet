export function Title({ children }: { children: any }) {
    return (
        <div className="text-2xl text-center border-[#a6192e] border mx-auto lg:w-fit lg:px-96 px-0 w-full py-3 text-[#e81727] font-bold">{children}</div>
    );
}

export function ObieText({ children, title, image, flipped }: { children: any, title: any, image: any, flipped?: boolean }) {
    const childOrder = flipped ? "order-1 lg:order-2" : "order-1 lg:order-2";
    const imageOrder = flipped ? "order-1 lg:order-1" : "order-1 lg:order-2";
    return (
        <div className="font-semibold lg:px-64 py-10 w-full grid lg:grid-cols-2 grid-cols-1">
            <div className={childOrder}>
                <div className="text-2xl font-bold uppercase font-serif mb-10">{title}</div>
                {children}
            </div>
            <div className={imageOrder}>{image}</div>
        </div>
    )
}


export function CheckerImage({ src, width, height, side, className }: { src: string, width: string, height: string, side?: "left" | "right", className?: string }) {
    const cls = side === "left" ? "lg:-translate-x-20" : "lg:translate-x-20";
    return (
        <img className={side + " mx-auto lg:translate-y-[50%] my-5 lg:my-0 " + className} loading="lazy" src={src} width={width} height={height} />
    );
}

export function GoToLink({ href, className, children }: { href: string, className?: string, children: any }) {
    return (
        <a href={href} className={"lg:saturate-0 lg:hover:saturate-100 underline lg:no-underline " + className}>
            <div className="flex">
            <svg viewBox="0 0 24 24" width="24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="currentColor"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g strokeLinecap="round" strokeLinejoin="round"></g><g><g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g fill="currentColor" fillRule="nonzero"> <path d="M12.0007042,2.00070416 C17.5235517,2.00070416 22.0007042,6.47785666 22.0007042,12.0007042 C22.0007042,17.5235517 17.5235517,22.0007042 12.0007042,22.0007042 C6.47785666,22.0007042 2.00070416,17.5235517 2.00070416,12.0007042 C2.00070416,6.47785666 6.47785666,2.00070416 12.0007042,2.00070416 Z M12.0007042,3.50070416 C7.30628378,3.50070416 3.50070416,7.30628378 3.50070416,12.0007042 C3.50070416,16.6951245 7.30628378,20.5007042 12.0007042,20.5007042 C16.6951245,20.5007042 20.5007042,16.6951245 20.5007042,12.0007042 C20.5007042,7.30628378 16.6951245,3.50070416 12.0007042,3.50070416 Z M11.6477559,7.55378835 L11.7203741,7.46966991 C11.9866406,7.20340335 12.4033043,7.1791973 12.6969158,7.39705176 L12.7810342,7.46966991 L16.7818569,11.4704926 C17.0481594,11.736795 17.0723312,12.1535265 16.8543986,12.4471377 L16.7817557,12.5312539 L12.7802289,16.5312539 C12.4872798,16.8240912 12.0124061,16.8240006 11.7195687,16.5310515 C11.453353,16.2647342 11.4292264,15.8480659 11.6471369,15.5544959 L11.7197711,15.4703914 L14.4417042,12.7497042 L7.75,12.75 C7.37030423,12.75 7.05650904,12.4678461 7.00684662,12.1017706 L7,12 C7,11.6203042 7.28215388,11.306509 7.64822944,11.2568466 L7.75,11.25 L14.4397042,11.2497042 L11.7203741,8.53033009 C11.4541075,8.26406352 11.4299015,7.84739984 11.6477559,7.55378835 L11.7203741,7.46966991 L11.6477559,7.55378835 Z"> </path> </g> </g> </g></svg>
            <div className="ml-2">{children}</div>
            </div>
        </a>
    )
}