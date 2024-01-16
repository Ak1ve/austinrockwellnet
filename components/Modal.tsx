export type ModalProps = {
    title?: string
    show?: boolean
    onExit?: () => any
    footer?: any
    children?: any
};
export default function Modal({title, show, onExit, footer, children}: ModalProps) {
    if (!show) {
        return <></>;
    }
    return (
        <div tabIndex={-1} aria-hidden="true" className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative p-4 w-full max-h-full flex justify-center">
                {/* <!-- Modal content --> */}
                <div className="relative max-w-4xl bg-white rounded-lg shadow-2xl dark:bg-[#120C0B] overflow-y-scroll">
                    {/* <!-- Modal header --> */}
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {title}
                        </h3>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={onExit}>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close</span>
                        </button>
                    </div>
                    {/* <!-- Modal body --> */}
                    <div className="p-4 md:p-5 space-y-4">
                        {children}
                    </div>
                    {/* <!-- Modal footer --> */}
                    {footer}
                </div>
            </div>
        </div>
    )
}