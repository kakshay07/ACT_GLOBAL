import { useEffect, useState } from "react";
import useTable from "../components/Table/Table";
import { useOnInputState } from "./PincodeMaster";
import { useOnSubmit, useValue } from "../hooks/form";
import Button, { ActionButtonGroup, AddButton } from "../components/Button/Button";
import Modal from "../components/Modal/Modal";
import SelectField from "../components/Select/Select";
import InputField from "../components/Input/Input";
import { CityApi, requestHandler, StateApi } from "../utils/api";
import { StateModel } from "./StateMaster";
import { toastError, toastSuccess } from "../utils/SweetAlert";

class extras{
    COUNTRY_NAME?:string
    STATE_NAME?:string;
}
export class CityModel extends extras{
    STATE_CODE?:number | null ;
    CITY_NAME : string | null = null;
    CITY_CODE:number | null = null;
  
}

export const CityMaster = () => {
    const [data, setdata] = useState<CityModel>(new CityModel());
    const [dataArray, setdataArray] = useState<CityModel[]>([]);
    const [states, setStates] = useState<StateModel[]>([])
    const [action, setaction] = useState<'Add' |'Edit' | 'View' | ''>('');
    const {Table } = useTable(()=>{});
    const [modalOpen, setmodalOpen] = useState(false);
  
  const onInput = useOnInputState(data , setdata)
  const FieldAttributes = useValue(data , onInput)

  function modalClose(){
    setmodalOpen(false);
    setdata(new CityModel());
  }

  const onFormSubmit = useOnSubmit(()=>{
    if(action=='Add'){
        requestHandler(
            async ()=>{ return await CityApi.AddCity(data)},
            (data)=>{
              if(data.success){
                toastSuccess.fire({
                  title : data.message 
                })
              }
              setmodalOpen(false);
              GetAllCityData();
            },
            (errorMessage)=>{
              toastError.fire({
                title : errorMessage
              })
            }
          )
    }else if(action=='Edit'){
        requestHandler(
            async ()=>{ return await CityApi.UpdateCity(data)},
            (data)=>{
              if(data.success){
                toastSuccess.fire({
                  title : data.message 
                })
              }
              setmodalOpen(false);
              GetAllCityData();
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
            setStates(data.data)
        },
        (errorMessage)=>{
          toastError.fire({
            title : errorMessage
          })
        }
    );
  }
  function GetAllCityData(){
    requestHandler(
        async () => {
            return await CityApi.getAllCities();
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
    GetAllCityData();
  }, [])
  
  return (
    <div>
     <div className="mx-3 my-3 shadow px-4 py-1 border rounded ">
        {/* ===== Head ===== */}
        <div className="flex items-center justify-between flex-wrap">
          <div>
            <h2 className="text-2xl font-medium text-cyan-950 pl-2 mt-3 lg:mt-0 py-5">
              City Master
            </h2>
          </div>
          <div className="flex justify-start lg:justify-end flex-wrap">
            <AddButton
              onClick={() => {
                setaction("Add");
                setmodalOpen(true);
              }}
            >
              Add City
            </AddButton>
          </div>
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Sl</th>
            <th>State name</th>
            <th>City name </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dataArray.map((_, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{_.STATE_NAME}</td>
                <td>{_.CITY_CODE}-{_.CITY_NAME}</td>
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
                      label="State"
                    {...FieldAttributes('STATE_CODE')}
                    >
                      <option value="">Select state</option>
                      {states.map((_) => (
                        <option key={_.STATE_CODE} value={Number(_.STATE_CODE)}>{_.STATE_NAME}</option>
                      ))}
                    </SelectField>
                    <InputField
                        required
                        label="City name"
                        placeholder="Eg.udupi"
                        {...FieldAttributes("CITY_NAME")}
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
