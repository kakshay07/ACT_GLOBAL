// import axios from "axios";
import axios from "axios";
import { downloadCSV } from "../../utils";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation } from "react-router-dom";

export const ActionButtonGroup = ({
    onView ,
    onEdit ,
    onDelete,
    onDuplicate,
    view,
    edit,
    deletee,
    duplicate
}:{
    onView ?: () => void,
    onEdit ?: () => void,
    onDelete ?: () => void,
    onDuplicate ?: () => void,
    view ?: boolean,
    edit ?: boolean,
    deletee ?: boolean,
    duplicate ?: boolean,
}) => {
    const { pageAccess} = useAuth();
    const location = useLocation();
    // const [active,setActive]=useState(false);

    // useEffect(() => {
    //    const acessObj = pageAccess.filter(_ => (_.url == location.pathname))[0]
    //     if(acessObj && (acessObj.access_to_delete==1 || acessObj.access_to_update==1)){
    //         setActive(true)
    //     }else {
    //         setActive(false)
    //     }
    // }, [])
    // const accessObj = pageAccess.find(_ => _.url === location.pathname) ;
    const [state, setState] = useState({
        active: false,
        EditActive: false,
        DeleteActive: false,
      });
      const accessObj = pageAccess.find((obj) => obj.url === location.pathname);
   
      useEffect(() => {
        const accessObj = pageAccess.find((obj) => obj.url === location.pathname);
        const newState = {
          active: accessObj?.access_to_update === 1 || accessObj?.access_to_delete === 1,
          EditActive: accessObj?.access_to_update === 1,
          DeleteActive: accessObj?.access_to_delete === 1,
        };
    
        setState((prevState) => {
          if (JSON.stringify(prevState) !== JSON.stringify(newState)) {
            return newState;
          }
          return prevState;
        });
      }, [pageAccess, location.pathname]);
    return (
        <>
            <span className=" inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
                {view && (
                    <button
                        type="button"
                        onClick={() => {
                            onView && onView();
                        }}
                        className="inline-block border-e py-3 px-3 text-gray-700 hover:bg-gray-50 focus:relative"
                        title="View"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-4 w-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                    </button>
                )}
                {edit && (
                    <button
                    type="button"
                    title='Edit'
                    disabled={!accessObj?.access_to_update}
                    onClick={() =>{ if(state.EditActive) onEdit && onEdit()}}
                    className={`inline-block border-e py-3 px-3 focus:relative ${accessObj?.access_to_update ? 'text-cyan-700 hover:bg-gray-50' : 'bg-gray-300 text-gray-400 border-gray-300'}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-4 w-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                        </svg>
                    </button>
                )}

                {deletee && (
                    <button
                        type="button"
                        disabled={!accessObj?.access_to_delete }
                        onClick={() => {
                            if (state.DeleteActive) onDelete && onDelete();
                        }}
                        // className="inline-block p-3 text-red-700 hover:bg-gray-50 focus:relative disabled:bg-gray-300 disabled:text-gray-400 disabled:border-gray-300"
                        title="Delete"
                        className={`inline-block p-3 focus:relative ${accessObj?.access_to_delete ? 'text-red-700 hover:bg-gray-50' : 'bg-gray-300 text-gray-400 border-gray-300'}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-4 w-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                        </svg>
                    </button>
                )}

                {duplicate && (
                    <button
                        type="button"
                        onClick={() => {
                            onDuplicate && onDuplicate();
                        }}
                        className="inline-block p-3 text-red-700 hover:bg-gray-50 focus:relative"
                        title="Duplicate"
                    >
                        <svg style={{opacity : '.7'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" id="IconChangeColor" height="20" width="20"><rect width="256" height="256" fill="none"></rect><polyline points="168 168 216 168 216 40 88 40 88 88" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"></polyline><rect x="40" y="88" width="128" height="128" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"></rect>
                        </svg>
                    </button>
                )}
            </span>
        </>
    );
};

export const AddButton = ({
    children,
    onClick,
    varient
}: {
    children: string;
    onClick?: () => void;
    varient?: 'blue' | 'light' | 'red' | 'green';
}) => {
    const { pageAccess} = useAuth();
    const location = useLocation();
    const [active,setActive]=useState(()=>{
        const acessObj=pageAccess.find(_=>_.url==location.pathname);
        return acessObj && (acessObj.access_to_add==1)
    });
    useEffect(() => {
       const acessObj = pageAccess.filter(_ => (_.url == location.pathname))[0]
        if(acessObj && acessObj.access_to_add && acessObj.access_to_add == 1){
            setActive(true);
        }else {
            setActive(false);
        }
    }, [pageAccess,location.pathname])
    
    return (
      <>
        <button
          disabled={!active}
          onClick={onClick}
          className={`${
            varient === "green"
              ? `inline-flex items-center gap-2 rounded border border-green-900 bg-green-900 px-6 py-3 text-white hover:bg-transparent hover:text-green-900 focus:outline-none focus:ring active:text-green-500 mx-2 my-3 disabled:bg-gray-300 disabled:text-gray-400 disabled:border-gray-300`
              : `inline-flex items-center gap-2 rounded border border-indigo-900 bg-indigo-900 px-6 py-3 text-white hover:bg-transparent hover:text-indigo-900 focus:outline-none focus:ring active:text-indigo-500 mx-2 my-3 disabled:bg-gray-300 disabled:text-gray-400 disabled:border-gray-300`
          }
    `}
        >
          <span className="text-sm font-medium">{children}</span>
          <i className="fa-solid fa-plus"></i>
        </button>
      </>
    );
};

export const FilterButton = ({
    onClick,
}: {
    onClick?: () => void;
}) => {
    return (
        <>
            <button
                onClick={onClick}
                className="inline-flex items-center gap-2 rounded border border-indigo-700 bg-indigo-700 px-6 py-3 text-white hover:bg-transparent hover:text-indigo-700 focus:outline-none focus:ring active:text-indigo-500 mx-2 my-3"
            >
                <span className="text-sm font-medium">Filter</span>
                <i className="fa-solid fa-filter"></i>
            </button>
        </>
    );
};

export const FilterResetButton = ({
    onClick,
    type
}: {
    onClick?: () => void;
    type ?: "button" | "submit" | "reset" | undefined;
}) => {
    return (
        <>
            <button
                onClick={onClick}
                type = {type}
                className="inline-flex items-center gap-2 rounded border border-gray-700 bg-gray-700 px-6 py-3 text-white hover:bg-transparent hover:text-gray-700 focus:outline-none focus:ring active:text-indigo-500 mx-2 my-3"
            >
                <span className="text-sm font-medium">Reset</span>
                <i className="fa-solid fa-filter-circle-xmark"></i>
            </button>
        </>
    );
};

export const UploadExcell = ({ onClick }: { onClick?: () => void }) => {
    return (
        <>
            <button
                onClick={onClick}
                className="inline-flex items-center gap-2 rounded border border-green-600 px-6 py-3 text-green-600 hover:bg-green-600 hover:text-white focus:outline-none focus:ring active:bg-green-500 mx-2 my-3"
            >
                <span className="text-sm font-medium"> Upload Excell </span>
                <i className="fa-solid fa-file-csv"></i>
            </button>
        </>
    );
};

export const ExportExcell = ({filename , urlPath}:{filename : string; urlPath : string;}) => {
    return (
        <>
            <button
                onClick={async ()=>{
                    const data = await axios.get('http://localhost:5000' + urlPath);
                    downloadCSV(data.data , filename);
                  }}
                className="inline-flex items-center gap-2 rounded border border-blue-700 px-6 py-3 text-blue-700 hover:bg-blue-700 hover:text-white focus:outline-none focus:ring active:bg-blue-700 mx-2 my-3"
            >
                <span className="text-sm font-medium"> Export Excell </span>
                <i className="fa-solid fa-file-csv"></i>
            </button>
        </>
    );
};

export const DownloadExcell = ({ link }: { link : string }) => {
    return (
        <>
            <a  
                href={link}
                download = 'asdas'
                className="cursor-pointer inline-flex items-center gap-2 rounded border border-blue-700 px-6 py-3 text-blue-700 hover:bg-blue-700 hover:text-white focus:outline-none focus:ring active:bg-blue-700 mx-2 my-3"
            >
                <span className="text-sm font-medium">Download Template</span>
                <i className="fa-solid fa-download"></i>
            </a>
        </>
    );
};

const Button = ({
    children,
    varient,
    loading,
    onClick,
    type,
    disabled
}: {
    children: React.ReactNode;
    varient: 'blue' | 'light' | 'red' | 'green';
    loading?: boolean;
    onClick?: () => void;
    type?: "button" | "submit" | "reset" | undefined;
    disabled? : boolean
}) => {
    return (
        <button 
                type = {type}
                disabled = {loading || disabled}
                onClick={onClick}
                className={
                    varient === 'blue' ? 
                    `inline-block w-fulll rounded  px-5 py-3 text-center text-sm font-semibold text-white sm:w-auto bg-blue-500 hover:bg-blue-600 hover:text-white disabled:bg-blue-400  mx-2 my-3`
                    : varient === 'light' ?
                    `inline-block w-fulll rounded px-5 py-3 text-center text-sm font-semibold text-gray-500  bg-gray-200 hover:bg-gray-300 hover:text-gray-500 sm:w-auto disabled:text-gray-400 disabled:hover:bg-gray-200 mx-2 my-3`
                    : varient === 'red' ?
                    `inline-block w-fulll rounded px-5 py-3 text-center text-sm font-semibold text-red-800  bg-red-400 hover:bg-red-500 hover:text-red-800 sm:w-auto disabled:text-red-500 disabled:hover:bg-red-400 mx-2 my-3`
                    : varient =='green' ?
                    `inline-block w-fulll rounded px-5 py-3 text-center text-sm font-semibold text-white  bg-green-700 hover:bg-green-800 hover:text-white-800 sm:w-auto disabled:bg-gray-300 mx-2 my-3`
                     :''
                }
            >
                <div className="flex">
                    {
                        loading && 
                        <svg
                            className={`animate-spin -ml-1 mr-3 h-5 w-5 
                            ${varient === 'blue' ? 'text-white' 
                            : varient === 'light' ? 'text-gray'
                            : varient === 'red' ? 'text-white' : 'text-white'} `}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    }
                    {children}
                </div>
            </button>
    )
    
    
};

export default Button;
