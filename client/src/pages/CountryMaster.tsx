import React, { useEffect, useState } from 'react'
import Button, { ActionButtonGroup, AddButton } from '../components/Button/Button';
import useTable from '../components/Table/Table';
import Modal from '../components/Modal/Modal';
import InputField from '../components/Input/Input';
import { useOnInputState } from './PincodeMaster';
import { useOnSubmit, useValue } from '../hooks/form';
import { CountryApi, requestHandler } from '../utils/api';
import { toastError, toastSuccess } from '../utils/SweetAlert';


class extras{
    COUNTRY_CODE?:number
    COUNTRY_ISO?:string;
    COUNTRY_NAME?:string;
    COUNTRY_PHONE?:number
}
export class CountryModel extends extras{
    country_code?:number | null = null;
    country_iso : string | null = null;
    country_name:string | null = null;
    country_phone:number | null = null
}

export const CountryMaster = () => {
    const [data, setdata] = useState<CountryModel>(new CountryModel());
    const [dataArray, setdataArray] = useState<CountryModel[]>([]);
    const [action, setaction] = useState<'Add' |'Edit' | 'View' | ''>('');
    const {Table } = useTable(()=>{});
    const [modalOpen, setmodalOpen] = useState(false);
  
  const onInput = useOnInputState(data , setdata)
  const FieldAttributes = useValue(data , onInput)
  const onFormSubmit = useOnSubmit(()=>{

    if(action=='Add'){
        requestHandler(
            async ()=>{ return await CountryApi.AddCountry(data)},
            (data)=>{
              if(data.success){
                toastSuccess.fire({
                  title : data.message 
                })
              }
              setmodalOpen(false)
              GetAllCountryData();
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
            return await CountryApi.UpdateCountry({
              country_code: data.COUNTRY_CODE,
              country_name:String( data.COUNTRY_NAME),
              country_iso:String( data.COUNTRY_ISO),
              country_phone: Number(data.COUNTRY_PHONE),
            });
          },
          (data) => {
            if (data.success) {
              toastSuccess.fire({
                title: data.message,
              });
          
            }
            setmodalOpen(false);
            GetAllCountryData();
          },
          (errorMessage) => {
            toastError.fire({
              title: errorMessage,
            });
          }
        );  
    }
  });

  function GetAllCountryData(){
    requestHandler(
        async () => {
            return await CountryApi.getAllCountries();
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

  function modalClose() {
    setmodalOpen(false);
    setdata(new CountryModel());
  }
  useEffect(() => {
    GetAllCountryData()
  }, [])
  

  return (
    <div>
      <div className="mx-3 my-3 shadow px-4 py-1 border rounded ">
        {/* ===== Head ===== */}
        <div className="flex items-center justify-between flex-wrap">
          <div>
            <h2 className="text-2xl font-medium text-cyan-950 pl-2 mt-3 lg:mt-0 py-5">
              Country Master
            </h2>
          </div>
          <div className="flex justify-start lg:justify-end flex-wrap">
            <AddButton
              onClick={() => {
                setaction("Add");
                setmodalOpen(true);
              }}
            >
              Add Country
            </AddButton>
          </div>
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Sl</th>
            <th>Country code</th>
            <th>Country ISO</th>
            <th>Country name</th>
            <th>Country phone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dataArray.map((_, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{_.COUNTRY_CODE}</td>
                <td>{_.COUNTRY_ISO}</td>
                <td>{_.COUNTRY_NAME}</td>
                <td>{_.COUNTRY_PHONE}</td>
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
        <Modal heading={`${action} Country`} onClose={modalClose}>
          <form noValidate onSubmit={onFormSubmit}>
            <fieldset disabled={action === "View"}>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                {/* <InputField required label="Country code" placeholder="Eg. 12" {...FieldAttributes('country_code')} /> */}
                {action == "Add" && (
                  <>
                    <InputField
                      required
                      label="Country ISO"
                      placeholder="Eg. bd"
                      {...FieldAttributes("country_iso")}
                    />
                    <InputField
                      required
                      label="Country name"
                      placeholder="Eg. India"
                      {...FieldAttributes("country_name")}
                    />
                    <InputField
                      required
                      label="Country phone"
                      placeholder="Eg. 91"
                      {...FieldAttributes("country_phone")}
                    />
                  </>
                )}

                {action == "View" ||
                  (action == "Edit" && (
                    <>
                      {" "}
                      <InputField
                        required
                        disabled
                        label="Country code"
                        placeholder="Eg. 12"
                        {...FieldAttributes("COUNTRY_CODE")}
                      />
                      <InputField
                        required
                        label="Country ISO"
                        placeholder="Eg. bd"
                        {...FieldAttributes("COUNTRY_ISO")}
                      />
                      <InputField
                        required
                        label="Country name"
                        placeholder="Eg. India"
                        {...FieldAttributes("COUNTRY_NAME")}
                      />
                      <InputField
                        required
                        label="Country phone"
                        placeholder="Eg. 91"
                        {...FieldAttributes("COUNTRY_PHONE")}
                      />
                    </>
                  ))}
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
  );
}
