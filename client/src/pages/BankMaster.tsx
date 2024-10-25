import { useEffect, useState } from "react";
import useTable from "../components/Table/Table";
import { useOnInputState } from "./PincodeMaster";
import { useOnSubmit, useValue } from "../hooks/form";
// import { requestHandler } from "../utils/api";
import Button, { ActionButtonGroup, AddButton } from "../components/Button/Button";
import Modal from "../components/Modal/Modal";
import InputField from "../components/Input/Input";
import { BankApi, requestHandler } from "../utils/api";
import { toastError, toastSuccess } from "../utils/SweetAlert";

export class BankMasterModel{
BANK_CODE:string | null = null;
BANK_DESC:string | null = null;
ORDER_SL:number | null= null
}

export const BankMaster = () => {
    const [data, setdata] = useState<BankMasterModel>(new BankMasterModel());
    const [dataArray, setdataArray] = useState<BankMasterModel[]>([]);
    const [action, setaction] = useState<'Add' |'Edit' | 'View' | ''>('');
    const {Table } = useTable(()=>{});
    const [modalOpen, setmodalOpen] = useState(false);
  
  const onInput = useOnInputState(data , setdata)
  const FieldAttributes = useValue(data , onInput)

  function modalClose(){
    setmodalOpen(false);
    setdata(new  BankMasterModel())
  }

  const onFormSubmit = useOnSubmit(()=>{
    if(action=='Add'){
        requestHandler(
            async ()=>{ return await BankApi.AddBank(data)},
            (data)=>{
              if(data.success){
                toastSuccess.fire({
                  title : data.message 
                })
              }
              setmodalOpen(false);
              GetAllBankData();
            },
            (errorMessage)=>{
              toastError.fire({
                title : errorMessage
              })
            }
          )
    }
    else if(action=='Edit'){
        requestHandler(
            async ()=>{ return await BankApi.UpdateBank(data)},
            (data)=>{
              if(data.success){
                toastSuccess.fire({
                  title : data.message 
                })
              }
              setmodalOpen(false);
              GetAllBankData();
            },
            (errorMessage)=>{
              toastError.fire({
                title : errorMessage
              })
            }
          )
    }
  });

  function GetAllBankData(){
    requestHandler(
        async () => {
            return await BankApi.getAllBankNames();
        },
        (data) => {
            setdataArray(data.data)
        },
        (errorMessage)=>{
          toastError.fire({
            title : errorMessage
          })
        }
    );
  }

  useEffect(() => {
    GetAllBankData();
  }, [])
  
  return (
    <div>
     <div className="mx-3 my-3 shadow px-4 py-1 border rounded ">
        {/* ===== Head ===== */}
        <div className="flex items-center justify-between flex-wrap">
          <div>
            <h2 className="text-2xl font-medium text-cyan-950 pl-2 mt-3 lg:mt-0 py-5">
              Bank Master
            </h2>
          </div>
          <div className="flex justify-start lg:justify-end flex-wrap">
            <AddButton
              onClick={() => {
                setaction("Add");
                setmodalOpen(true);
              }}
            >
              Add Bank
            </AddButton>
          </div>
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Sl</th>
            <th>Bank code</th>
            <th>Bank name </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dataArray.map((_, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{_.BANK_CODE}</td>
                <td>{_.ORDER_SL}-{_.BANK_DESC}</td>
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
        <Modal heading={`${action} Bank`} onClose={modalClose}>
          <form noValidate onSubmit={onFormSubmit}>
            <fieldset disabled={action === "View"}>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                {/* <InputField required label="Country code" placeholder="Eg. 12" {...FieldAttributes('country_code')} /> */}
               

                    <InputField
                        required
                        label="Bank code"
                        placeholder="B12"
                        {...FieldAttributes("BANK_CODE")}
                      />
                    <InputField
                        required
                        label="Bank description"
                        placeholder="Eg.udupi"
                        {...FieldAttributes("BANK_DESC")}
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
