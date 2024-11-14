import { useEffect, useState } from "react";
import Button, { ActionButtonGroup, AddButton } from "../components/Button/Button";
import InputField from "../components/Input/Input";
import Modal from "../components/Modal/Modal";
import useTable from "../components/Table/Table";
import { useOnInputState } from "./PincodeMaster";
import { useOnSubmit, useValue } from "../hooks/form";
import {  CurrencyApi, requestHandler } from "../utils/api";
import { toastError, toastSuccess } from "../utils/SweetAlert";


export class CurrencyMasterModel{
    CURR_CODE:string | null = null;
    CURR_NAME:string | null = null;
    CURR_SHORT_NOTATION:string | null = null;
    // CURR_SUB_CURR_NAME:string | null = null;
    // CURR_SHORT_SUB_NOTIFICATION:string | null = null;
    // CURR_NOOF_SUB_UNITS :string | null = null;
    // CURR_ISO_CODE:string | null = null;
    // CURR_WEEK_HOL1:string | null = null;
    // CURR_WEEK_HOL2:string | null = null;
    // CURR_CUTOFF_SWIFT_GEN:string | null = null;
    // CURR_UNITS_RATE_QUOT:string | null = null;
    // CURR_WITHHOLD_TAX_REQD:string | null = null;
    // CURR_ENTD_BY:string | null = null;
    // CURR_ENTD_ON:string | null = null;
    // CURR_LAST_MOD_BY:string | null = null;
    // CURR_LAST_MOD_ON:string | null = null;
    // CURR_AUTH_BY:string | null = null;
    // CURR_AUTH_ON:string | null = null;
    // TBA_MAIN_KEY:string | null = null;
    }

const CurrencyMaster = () => {
    const [data,setdata] = useState<CurrencyMasterModel>(new CurrencyMasterModel());
    const [dataArray,setdataArray] = useState<CurrencyMasterModel[]>([]);
    const [action,setaction] = useState<"Add" | "Edit" | "View" | '' >('');
    const{Table} = useTable(() => {});
    const [modalOpen,setmodalOpen] = useState(false);

    const onInput = useOnInputState(data, setdata)
    const FieldAttributes = useValue(data, onInput)

    function modalClose() {
        setmodalOpen(false)
        setdata(new CurrencyMasterModel() )
    }

    function GetAllCurrency()  {
        requestHandler(
            async () => {return await CurrencyApi.getAllCurrencyApi()},
            (data) => {
                setdataArray(data.data)
            },
            (errorMessage) => {
                toastError.fire({
                    title:errorMessage
                })
            }
        )
    }

    const onFormSubmit = useOnSubmit(()=>{

      if(action=='Add'){
          requestHandler(
              async ()=>{ return await CurrencyApi.AddCuurencyApi(data);},
              (data)=>{
                if(data.success){
                  toastSuccess.fire({
                    title : data.message 
                  })
                }
                setmodalOpen(false)
                GetAllCurrency()
              
              },
              (errorMessage)=>{
                toastError.fire({
                  title : errorMessage
                })
              }
            )
      }else if(action=='Edit'){
          requestHandler(
            async () => {
              return await CurrencyApi.updatecurrencyApi({
                CURR_CODE : data.CURR_CODE,
                CURR_NAME: data.CURR_NAME,
                CURR_SHORT_NOTATION: data.CURR_SHORT_NOTATION,
              });
            },
            (data) => {
              if (data.success) {
                toastSuccess.fire({
                  title: data.message,
                });
            
              }
              setmodalOpen(false);
              GetAllCurrency()
            },
            (errorMessage) => {
              toastError.fire({
                title: errorMessage,
              });
            }
          );  
      }
    });

    useEffect(() => {
      GetAllCurrency()
    },[])
 
    

  return (
    <div>
    <div className="px-4 py-1 mx-3 my-3 border rounded shadow ">
       {/* ===== Head ===== */}
       <div className="flex flex-wrap items-center justify-between">
         <div>
           <h2 className="py-5 pl-2 mt-3 text-2xl font-medium text-cyan-950 lg:mt-0">
             Currency Master
           </h2>
         </div>
         <div className="flex flex-wrap justify-start lg:justify-end">
           <AddButton
             onClick={() => {
               setaction("Add");
               setmodalOpen(true);
             }}
           >
             Add Currency 
           </AddButton>
         </div>
       </div>
     </div>
     <Table>
       <thead>
         <tr>
           <th>Sl</th>
           <th>Currency name</th>
           <th>Currency short notation</th>
           <th>Action</th>
         </tr>
       </thead>
       <tbody>
         {dataArray.map((_, index) => {
           return (
             <tr key={index}>
               <td>{index + 1}</td>
               <td>{_.CURR_NAME}</td>
                   <td>{_.CURR_SHORT_NOTATION}</td>
               <td width={"15%"}>
                 <ActionButtonGroup
                   onView={() => {
                       setaction("View");
                       setdata(_);
                       setmodalOpen(true);
                    }}
                   onEdit={() => {
                     setaction("Edit");
                     setdata(_);
                     setmodalOpen(true);
                   }}
                   view
                   edit
                   // deletee
                 />
               </td>
             </tr>
           );
         })}
       </tbody>
     </Table>
     {modalOpen && (
       <Modal heading={`${action} Currency`} onClose={modalClose}>
         <form noValidate onSubmit={onFormSubmit}>
           <fieldset disabled={action === "View"}>
             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
               {/* <InputField required label="Country code" placeholder="Eg. 12" {...FieldAttributes('country_code')} /> */}
                    <InputField
                       required
                        disabled = {action == 'Edit'}
                       label="Currency code"
                       placeholder="INR"
                       {...FieldAttributes("CURR_CODE")}
                     />     
                   <InputField
                       required
                       label="Currency name"
                       placeholder="Indian Rupees"
                       {...FieldAttributes("CURR_NAME")}
                     />
                   <InputField
                       required
                       label="Currency short notation"
                       placeholder="Eg.Rs"
                       {...FieldAttributes("CURR_SHORT_NOTATION")}
                     />
                     {/* <InputField
                       required
                       label="Account description"
                       placeholder="Eg.Crrent account"
                       {...FieldAttributes("CURR_SUB_CURR_NAME")}
                     />
                     <InputField
                       required
                       label="Account description"
                       placeholder="Eg.Crrent account"
                       {...FieldAttributes("CURR_SHORT_SUB_NOTIFICATION")}
                     /> */}
             </div>
           </fieldset>
           <hr className="mt-4 border-gray-300 " />
           <div className="flex justify-end">
             <Button onClick={modalClose} varient="light" type="button">
               Cancel
             </Button>
             <Button varient="blue">Submit</Button>
           </div>
         </form>
       </Modal>
     )}
   </div>
  )
}

export default CurrencyMaster