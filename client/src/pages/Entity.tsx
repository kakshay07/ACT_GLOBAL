import { useEffect, useState } from "react"
import InputField from "../components/Input/Input"
import useTable from "../components/Table/Table"
import Button, {ActionButtonGroup, AddButton} from "../components/Button/Button"
import Modal from "../components/Modal/Modal"
import { useOnInputState, useOnSubmit, useValue } from "../hooks/form"
import ImportExportFile from "../components/ImportExportFile/ImportExportFile"

import {  toastError, toastSuccess } from "../utils/SweetAlert"
import { AddEntity, GetEntity, UpdateEntity, requestHandler } from "../utils/api"
import SelectField from "../components/Select/Select"
import { useMaster } from "../contexts/MasterContext"

export class entityModel {
  entity_id : string | null = null;
  name : string | null = null;
  short_desc : string | null = null;
  address : string | null = null;
  reg_num : string | null = null;
  estab_date : Date | null = null;
  expiry_date : Date | null = null;
  email : string | null = null;
  bank_ac_num : number | null = null;
  bank_ifsc : string | null = null;
  bank_name : string | null = null;
  bank_location : string | null = null;
  gst_no: string | null = null;
  country: string | null = null;
  state: string | null = null;
  city?: string | null = null;
  pincode?: string | null = null;
  additional_info?: string = "0";
}


const Entity = () => {
  const [data, setdata] = useState<entityModel>(new entityModel());
  const [dataArray, setdataArray] = useState<entityModel[]>([]);
  const [action, setaction] = useState<'Add' |'Edit' | 'View' | ''>('');
  // const [uploadedFile, setuploadedFile] = useState<File>();
  const [importModalOpen, setimportModalOpen] = useState(false);
  const [importedFile, setimportedFile] = useState<File | undefined>()
  // state used to handle modal open state
  const [modalOpen, setmodalOpen] = useState(false)
  const {allCountries ,getStates , allStates, getCities , allCities} = useMaster();

  // Custom Hook - gives a "table" component and current page number and a function to change the current page
  const {Table } = useTable(()=>{});
  
  // custom Hook - sets the value of the state on input change
  const onInput = useOnInputState(data , setdata)

  // custom Hook - this is used to set attributes of input and select elements
  // this will set name , value and onChange
  const FieldAttributes = useValue(data , onInput)

  // function to get all entity 
  function getAllEntity(){
    return requestHandler(
      async () => {
          return await GetEntity();
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

  // custom Hook - handles form submission
  // we need to pass a callback function to "useOnSubmit" , 
  // that callback function will be called after validation of the form
  const onFormSubmit = useOnSubmit(()=>{
    if(action == 'Add'){
      requestHandler(
        async ()=>{ return await AddEntity(data)},
        (data)=>{
          if(data.success){
            toastSuccess.fire({
              title : data.message 
            })
            getAllEntity();
            setmodalOpen(false)
          } else {
            toastError.fire({
              title : data.message 
            })
          }
          
        },
        (errorMessage)=>{
          toastError.fire({
            title : errorMessage
          })
        }
      )
    } else if(action == 'Edit') { 
      requestHandler(
        ()=>{return UpdateEntity(data)},
        (data)=>{
          toastSuccess.fire({
            title : data.message
          })
          getAllEntity();
          setmodalOpen(false)
        },
        (errorMessage)=>{
          toastError.fire({
            title : errorMessage
          })
        }
      )
    }
  });

  // function to empty the "data" state 
  function resetDatastate(){
    setdata(new entityModel());
  }

  // function to pass to the modal close button
  // this closes the modal and clears the "data" state
  function modalClose(){
    setmodalOpen(false);
    resetDatastate()
  }


  useEffect(() => {
    getAllEntity()
  }, []);

  useEffect(() => {
    if (action === "Edit" || action === "View") {
      if (data.country) {
        getStates(data.country); // Load states based on the selected country
      }
      if (data.state) {
        getCities(data.state); // Load cities based on the selected state
      }
    }
  }, [action, data.country, data.state]);
  
  
  return (
    <div>

      {/* template header */}
      <div className="mx-3 my-3 shadow px-4 py-1 border rounded ">

        {/* ===== Head ===== */}
        <div className="flex items-center justify-between flex-wrap">
          <div><h2 className="text-2xl font-medium text-cyan-950 pl-2 mt-3 lg:mt-0">Entity Master</h2></div>
          <div className="flex justify-start lg:justify-end flex-wrap" >
            {/* <SearchInput name="" onChange={()=>{}} onSearch={()=>{}} placeholder="Search user by name" /> */}
            {/* <UploadExcell onClick={()=>{
              setimportedFile(undefined)
              setimportModalOpen(true)
              }}>
            </UploadExcell> */}
            {/* <ExportExcell
              urlPath="/file/download"
              filename="demo_csv_export"
            ></ExportExcell> */}
            <AddButton onClick={()=>{setaction('Add');resetDatastate();setmodalOpen(true)}}>Add Entity</AddButton>
          </div>
        </div>

        {/* <hr className ="my-3 border-gray-300 " /> */}

        {/* ===== filter ===== */}
        {/* <div >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            <SelectField name="" onChange={()=>{}}>
              <option value="">Select Country</option>
            </SelectField>
            <SelectField name="" onChange={()=>{}}>
              <option value="">Select State</option>
            </SelectField>
            <SelectField name="" onChange={()=>{}}>
              <option value="">Select Gender</option>
            </SelectField>
            <InputField required value=""   onChange={()=>{}} name="" placeholder="Limit" />
            <div className="flex">
              <FilterButton onClick={()=>{}}></FilterButton>
              <FilterResetButton onClick={()=>{}}></FilterResetButton>
            </div>
          </div>
        </div> */}

      </div>  

      {/* ===== Table ===== */}
      <Table>
        <thead>
          <tr>
            <th>Sl</th>
            {/* <th>Entity id</th> */}
            <th>Entity name</th>
            <th>Register number</th>
            <th>Address</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>

          {
            dataArray.map((_ , index)=>{
              return (
                <tr key={index}>
                  <td>{index+1}</td>
                  {/* <td>{_.entity_id}</td> */}
                  <td>{_.entity_id} - {_.name}</td>
                  <td>{_.reg_num}</td>
                  <td>{_.address}</td>
                  <td>{_.email}</td>
                  <td width={'15%'}>
                    <ActionButtonGroup
                      onView={()=>{
                          setaction('View');
                          setdata(_);
                          setmodalOpen(true);
                        }
                      }
                      onEdit={()=>{
                          setaction('Edit');
                          setdata(_);
                          setmodalOpen(true);
                        }
                      }
                      // onDelete={()=>{
                      //   DeleteConfirmation.fire().then((result) => {
                      //     if (result.isConfirmed) {
                      //       // setdataArray(dataArray.filter(a => (a.rollNo != _.rollNo)));
                      //       Swal.fire({
                      //         title: "Deleted!",
                      //         text: "Your file has been deleted.",
                      //         icon: "success"
                      //       });
                      //     }
                      //   });
                      // }}
                      view
                      edit
                      // deletee
                    />
                  </td>
                </tr>
              )
            })
          }
        </tbody>          
      </Table>


      {/* Modal for Add , Edit and View */}
      {modalOpen && 
      <Modal heading={`${action} Entity`} onClose={modalClose}>
        <form noValidate onSubmit={onFormSubmit}>
          <fieldset disabled={action === 'View'}>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
              
              <InputField required label="Name" placeholder="John Doe" {...FieldAttributes('name')} />
              <InputField required styleClass="col-span-1 md:col-span-3 "  label="Address"  {...FieldAttributes('address')} />
              <InputField label="Short Description" {...FieldAttributes('short_desc')} />
              <InputField label="Email" type="email" {...FieldAttributes('email')} />
              <InputField label="Register number"  {...FieldAttributes('reg_num')} />
              <InputField required label="Established date" type="date" {...FieldAttributes('estab_date')} />
              <InputField required label="Expiry date" type="date" {...FieldAttributes('expiry_date')} />
              <InputField label="Bank account number"  {...FieldAttributes('bank_ac_num')} />
              <InputField label="Bank IFSC"  {...FieldAttributes('bank_ifsc')} />
              <InputField label="Bank name"  {...FieldAttributes('bank_name')} />
              <InputField label=" Bank location"  {...FieldAttributes('bank_location')} />
              <InputField label="GST number"  {...FieldAttributes('gst_no')} />

              <div className="col-span-full my-7 flex items-center">
                       <hr className="flex-grow border-gray-400" />
                       <span className="px-4 text-gray-600">Location info</span>
                       <hr className="flex-grow border-gray-400" />
                      </div>

                    {/* Location Information */}
                    <SelectField
                      value={String(data.country || '')}
                      name="country"
                      required
                      label="Country"
                      onChange={(e) => {
                        setdata(prev => ({ ...prev, country: e.target.value, state: '', city:'' }));
                        getStates(e.currentTarget.value);
                      }}
                    >
                      <option value="">Select Country</option>
                      {allCountries.map((_) => (
                        <option key={_.COUNTRY_CODE} value={_.COUNTRY_CODE}>{_.COUNTRY_NAME}</option>
                      ))}
                    </SelectField>
                    <SelectField
                      value={String(data.state || '')}
                      name="state"
                      required
                      label="State"
                      onChange={(e) => {
                        setdata(prev => ({ ...prev, state: e.target.value, city: '' }));
                        getCities(e.currentTarget.value);
                      }}
                    >
                      <option value="">Select State</option>
                      {allStates.map((_) => (
                        <option key={_.STATE_CODE} value={_.STATE_CODE}>{_.STATE_NAME}</option>
                      ))}
                    </SelectField>
                    <SelectField
                      {...FieldAttributes("city")}
                      required
                      label="City"
                    >
                      <option value="">Select City</option>
                      {allCities.map((_) => (
                        <option key={_.CITY_CODE} value={_.CITY_CODE}>{_.CITY_NAME}</option>
                      ))}
                    </SelectField>
                    <InputField
                      required
                      placeholder="Eg:576217"
                      label="Pincode"
                      {...FieldAttributes("pincode")}
                    />
                      <SelectField
                        {...FieldAttributes("additional_info")}
                        label="Additional Information"
                      >
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                      </SelectField>
                    
            </div> 
          </fieldset>
          <hr className="mt-4 border-gray-300 " />
          <div className="flex justify-end">
            <Button onClick={modalClose} varient="light" type="button">Cancel</Button>
            <Button varient="blue">Submit</Button>
          </div>
        </form>
      </Modal>}
      <ImportExportFile file={importedFile} onFileUpload={(data)=>{setimportedFile(data)}}  modalOpen={importModalOpen} onClose={()=>{setimportModalOpen(false)}} />
    </div>
  )
}

export default Entity