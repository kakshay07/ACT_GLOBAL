import { useEffect, useState } from "react";
import Button, { ActionButtonGroup, AddButton } from "../components/Button/Button";
import InputField from "../components/Input/Input";
import Modal from "../components/Modal/Modal";
import useTable from "../components/Table/Table";
import { useOnInputState } from "./PincodeMaster";
import { useOnSubmit, useValue } from "../hooks/form";
import { BankACapi, requestHandler } from "../utils/api";
import { toastError, toastSuccess } from "../utils/SweetAlert";


export class BankAccountMasterModel{
    ACNT_TYPE:string | null = null;
    ACNT_DESC:string | null = null;
    }

const BankAccountMaster = () => {
    const [data,setdata] = useState<BankAccountMasterModel>(new BankAccountMasterModel());
    const [dataArray,setdataArray] = useState<BankAccountMasterModel[]>([]);
    const [action,setaction] = useState<"Add" | "Edit" | "View" | '' >('');
    const{Table} = useTable(() => {});
    const [modalOpen,setmodalOpen] = useState(false);

    const onInput = useOnInputState(data, setdata)
    const FieldAttributes = useValue(data, onInput)

    function modalClose() {
        setmodalOpen(false)
        setdata(new BankAccountMasterModel() )
    }

    function GetAllBankAccountType()  {
        requestHandler(
            async () => {return await BankACapi.getAllBanckAccountType()},
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

    // function onFormSubmit() {
    //   if (action == "Add") {
    //     requestHandler(
    //       async () => {
    //         return await BankACapi.AddBanckAccountApi(data);
    //       },
    //       (data) => {
    //           toastSuccess.fire({
    //             title: data.message,
    //           });
           
    //         setmodalOpen(false);
    //         GetAllBankAccountType();
    //       },
    //       (errorMessage) => {
    //         toastError.fire({
    //           title: errorMessage,
    //         });
    //       }
    //     );
    //   }
    // }

    const onFormSubmit = useOnSubmit(async () => {
        if (action === 'Add') {
          await requestHandler(
            async () => {
              return await BankACapi.AddBankAccountApi(data);
            },
            async (data) => {
              if (data.success) {
                toastSuccess.fire({
                  title: data.message,
                });
                setmodalOpen(false); // Close the modal first
                await GetAllBankAccountType(); // Then fetch updated data
              }
            },
            (errorMessage) => {
              toastError.fire({
                title: errorMessage,
              });
            }
          );
        }else if(action=='Edit'){
          requestHandler(
              async ()=>{ return await BankACapi.updateBankAccount(data)},
              (data)=>{
                if(data.success){
                  toastSuccess.fire({
                    title : data.message 
                  })
                }
                setmodalOpen(false);
                GetAllBankAccountType();
              },
              (errorMessage)=>{
                toastError.fire({
                  title : errorMessage
                })
              }
            )
      }
      });
      

    useEffect(() => {
        GetAllBankAccountType()
    },[])
 
    

  return (
    <div>
    <div className="mx-3 my-3 shadow px-4 py-1 border rounded ">
       {/* ===== Head ===== */}
       <div className="flex items-center justify-between flex-wrap">
         <div>
           <h2 className="text-2xl font-medium text-cyan-950 pl-2 mt-3 lg:mt-0 py-5">
             Bank Account Master
           </h2>
         </div>
         <div className="flex justify-start lg:justify-end flex-wrap">
           <AddButton
             onClick={() => {
               setaction("Add");
               setmodalOpen(true);
             }}
           >
             Add Bank Account
           </AddButton>
         </div>
       </div>
     </div>
     <Table>
       <thead>
         <tr>
           <th>Sl</th>
           <th>Account Type</th>
           <th>Account Description </th>
           <th>Action</th>
         </tr>
       </thead>
       <tbody>
         {dataArray.map((_, index) => {
           return (
             <tr key={index}>
               <td>{index + 1}</td>
               <td>{_.ACNT_TYPE}</td>
               <td>{_.ACNT_DESC}</td>
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
       <Modal heading={`${action} Bank Account`} onClose={modalClose}>
         <form noValidate onSubmit={onFormSubmit}>
           <fieldset disabled={action === "View"}>
             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
               {/* <InputField required label="Country code" placeholder="Eg. 12" {...FieldAttributes('country_code')} /> */}
              

                   <InputField
                       required
                       disabled={action=='Edit'}
                       label="Account type"
                       placeholder="CAA"
                       {...FieldAttributes("ACNT_TYPE")}
                     />
                   <InputField
                       required
                       label="Account description"
                       placeholder="Eg.Crrent account"
                       {...FieldAttributes("ACNT_DESC")}
                     />
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

export default BankAccountMaster