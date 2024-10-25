import './Modal.css'

const Modal = ({heading , onClose , children} : {heading ?: string | React.ReactNode; onClose : ()=>void;children:React.ReactNode}) => {
    return (
        <>
            <div className="opacity-0 z-40 customModel_wrapper w-[100%] h-[100vh] fixed top-[0] flex items-start pt-[4%] justify-center   bg-opacity-30 bg-black overflow-y-auto" >
                <div
                    className="relative   max-h-[800px] customModel  rounded-2xl border border-blue-100 bg-white p-4 shadow-lg sm:p-6 lg:px-10 lg:py-7 min-w-[85%] max-w-[98%] lg:min-w-[80%] lg:max-w-[90%]"
                    role="alert"
                >
                    <div className="flex items-center justify-between gap-4">
                        <p className="font-medium sm:text-lg">{heading}</p>
                        <button onClick={onClose} className="bg-gray-100 px-2 py-1 rounded-lg">
                            <i className="fa fa-x text-gray-500"></i>
                        </button>
                    </div>
                    <hr className="mt-2"/>

                    <div className="p-6 overflow-y-auto max-h-[500px] sm:p-5 lg:px-10 lg:py-3" >
                        {children}
                    {/* <hr className="mt-2"/> */}

                    </div>
                   
                </div>
            </div>
        </>
    );
};

export default Modal;