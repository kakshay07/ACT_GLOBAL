import { useEffect, useState } from "react";
import { useOnInputState } from "./PincodeMaster";
import { useOnSubmit, useValue } from "../hooks/form";
import Button, { ActionButtonGroup, AddButton } from "../components/Button/Button";
import useTable from "../components/Table/Table";
import Modal from "../components/Modal/Modal";
import InputField from "../components/Input/Input";
import SelectField from "../components/Select/Select";
import { useMaster } from "../contexts/MasterContext";
import { requestHandler, StateApi } from "../utils/api";
import { toastError, toastSuccess } from "../utils/SweetAlert";

class extras{
    COUNTRY_NAME?:string
}
export class StateModel extends extras{
    STATE_CODE?:number | null = null;
    STATE_NAME : string | null = null;
    COUNTRY_CODE:number | null = null;
    // country_phone:number | null = null;
    TIN_CODE:number | null= null;
    STATE_GST_CODE:string | number | null =null;
    GST:number | string | null = null;
}
export const StateMaster = () => {
    const [data, setdata] = useState<StateModel>(new StateModel());
    const [dataArray, setdataArray] = useState<StateModel[]>([]);
    const [action, setaction] = useState<'Add' |'Edit' | 'View' | ''>('');
    const {Table } = useTable(()=>{});
    const [modalOpen, setmodalOpen] = useState(false);
    const {allCountries} = useMaster();
  
  const onInput = useOnInputState(data , setdata)
  const FieldAttributes = useValue(data , onInput)

  function modalClose(){
    setmodalOpen(false);
    setdata(new StateModel());
  }

  const onFormSubmit = useOnSubmit(()=>{
    if(action=='Add'){
        requestHandler(
            async ()=>{ return await StateApi.AddState(data)},
            (data)=>{
              if(data.success){
                toastSuccess.fire({
                  title : data.message 
                })
              }
              setmodalOpen(false);
              GetAllStateData();
            },
            (errorMessage)=>{
              toastError.fire({
                title : errorMessage
              })
            }
          )
    }else if(action=='Edit'){
        requestHandler(
            async ()=>{ return await StateApi.UpdateState(data)},
            (data)=>{
              if(data.success){
                toastSuccess.fire({
                  title : data.message 
                })
              }
              setmodalOpen(false);
              GetAllStateData();
            },
            (errorMessage)=>{
              toastError.fire({
                title : errorMessage
              })
            }
          )
    }
  });

  function GetAllStateData(){
    requestHandler(
        async () => {
            return await StateApi.getAllStates();
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
    GetAllStateData();
  }, [])
  
  return (
    <div>
     <div className="mx-3 my-3 shadow px-4 py-1 border rounded ">
        {/* ===== Head ===== */}
        <div className="flex items-center justify-between flex-wrap">
          <div>
            <h2 className="text-2xl font-medium text-cyan-950 pl-2 mt-3 lg:mt-0 py-5">
              State Master
            </h2>
          </div>
          <div className="flex justify-start lg:justify-end flex-wrap">
            <AddButton
              onClick={() => {
                setaction("Add");
                setmodalOpen(true);
              }}
            >
              Add State
            </AddButton>
          </div>
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Sl</th>
            <th>Country </th>
            <th>State name</th>
            <th>State GST code</th>
            <th>TIN code</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dataArray.map((_, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{_.COUNTRY_CODE}-{_.COUNTRY_NAME}</td>
                <td>{_.STATE_CODE}-{_.STATE_NAME}</td>
                <td>{_.STATE_GST_CODE}</td>
                <td>{_.TIN_CODE}</td>
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
        <Modal heading={`${action} State`} onClose={modalClose}>
          <form noValidate onSubmit={onFormSubmit}>
            <fieldset disabled={action === "View"}>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                {/* <InputField required label="Country code" placeholder="Eg. 12" {...FieldAttributes('country_code')} /> */}
               

                <SelectField
                      required
                      label="Country"
                    {...FieldAttributes('COUNTRY_CODE')}
                    >
                      <option value="">Select Country</option>
                      {allCountries.map((_) => (
                        <option key={_.COUNTRY_CODE} value={_.COUNTRY_CODE}>{_.COUNTRY_NAME}</option>
                      ))}
                    </SelectField>
                    <InputField
                        required
                        label="State name"
                        placeholder="Eg.karnataka"
                        {...FieldAttributes("STATE_NAME")}
                      />
                         <InputField
                        required
                        label="TIN code"
                        placeholder="Eg. 91d63"
                        {...FieldAttributes("TIN_CODE")}
                      />
                    <InputField
                      required
                      label="State GST code"
                      placeholder="Eg. 91HTGF454"
                      {...FieldAttributes("STATE_GST_CODE")}
                    />    
                      <InputField
                      required
                      label=" GST code"
                      placeholder="Eg. 91SDF5Rt"
                      {...FieldAttributes("GST")}
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
