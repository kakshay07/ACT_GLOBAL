import { useEffect, useState } from "react"
import SelectField from "../components/Select/Select"
import useTable from "../components/Table/Table"
import Button, {ActionButtonGroup, AddButton,} from "../components/Button/Button"
import Modal from "../components/Modal/Modal"
import { useOnInputState, useOnSubmit, useValue } from "../hooks/form"
import ImportExportFile from "../components/ImportExportFile/ImportExportFile"
import {  toastError, toastSuccess } from "../utils/SweetAlert"
import { AddBranch, GetAllBranches, GetEntity,  UpdateBranch, getBranchByEntity, requestHandler } from "../utils/api"
import { entityModel } from "./Entity"
import InputField from "../components/Input/Input"
import { useMaster } from "../contexts/MasterContext"
import { useAuth } from "../contexts/AuthContext"

export class branchModel {
    entity_id : number | null = null;
    branch_id : number | null = null;
    name :string | null = null;
    country : string | null = null;
    state : string | null =null;
    city: string | null = null;
}


const Branch = () => {
  const [data, setdata] = useState<branchModel>(new branchModel());
  const [dataArray, setdataArray] = useState<branchModel[]>([]);
  const [dataArray1, setdataArray1] = useState<branchModel[]>([]);

  const [entityArray, setEntityArray] = useState<entityModel[]>([]);
  const [action, setaction] = useState<'Add' |'Edit' | 'View' | ''>('');
  // const [uploadedFile, setuploadedFile] = useState<File>();
  const [importModalOpen, setimportModalOpen] = useState(false);
  const [importedFile, setimportedFile] = useState<File | undefined>()
  // state used to handle modal open state
  const [modalOpen, setmodalOpen] = useState(false)

  // Custom Hook - gives a "table" component and current page number and a function to change the current page
  const {Table } = useTable(()=>{});
  const {allCountries ,getStates , allStates, getCities , allCities  } = useMaster();
 const {user}=useAuth()
  
  // custom Hook - sets the value of the state on input change
  const onInput = useOnInputState(data , setdata)

  // custom Hook - this is used to set attributes of input and select elements
  // this will set name , value and onChange
  const FieldAttributes = useValue(data , onInput)

  // function to get all entity 
  function getAllBranches(){
    requestHandler(
      async () => {
          return await GetAllBranches();
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

  function getAllBranchesByEntity(){
    requestHandler(
      async () => {
          return await getBranchByEntity();
      },
      (data) => {
        setdataArray1(data.data)
      },
      (errorMessage)=>{
        toastError.fire({
          title : errorMessage
        })
      }
  );
  }

   // function to get all entity 
   function getAllEntity(){
    return requestHandler(
      async () => {
          return await GetEntity();
      },
      (data) => {
        setEntityArray(data.data)
      },
      (errorMessage)=>{
        toastError.fire({
          title : errorMessage
        })
      }
  );
  }

  useEffect(() => {
    getAllBranchesByEntity()
  }, [])
  

  // custom Hook - handles form submission
  // we need to pass a callback function to "useOnSubmit" , 
  // that callback function will be called after validation of the form
  const onFormSubmit = useOnSubmit(()=>{
    if(action == 'Add'){
      requestHandler(
        async ()=>{ return await AddBranch(data)},
        (data)=>{
          if(data.success){
            toastSuccess.fire({
              title : data.message 
            })
            getAllBranches();
            getAllBranchesByEntity();
            setmodalOpen(false)
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
        ()=>{return UpdateBranch(data)},
        (data)=>{
          toastSuccess.fire({
            title : data.message
          })
          getAllBranches();
          setmodalOpen(false);
          getAllBranchesByEntity();
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
    setdata(new branchModel());
  }

  // function to pass to the modal close button
  // this closes the modal and clears the "data" state
  function modalClose(){
    setmodalOpen(false);
    resetDatastate()
  }


  useEffect(() => {
    getAllBranches();
    getAllEntity();
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
          <div><h2 className="text-2xl font-medium text-cyan-950 pl-2 mt-3 lg:mt-0 py-5">Branch Master</h2></div>
          <div className="flex justify-start lg:justify-end flex-wrap" >
      
            <AddButton onClick={()=>{setaction('Add');resetDatastate();setmodalOpen(true)}}>Add Branch</AddButton>
          </div>
        </div>

     
  

      </div>  

      {/* ===== Table ===== */}
      <Table>
        <thead>
          <tr>
            <td>Sl</td>
            <th>Branch name</th>
            <th>Entity name</th>
            {/* <th>Branch id</th> */}
            {/* <th>Country/State/City</th> */}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>

          { 
            (user?.is_admin ? dataArray1 : dataArray).map((_ , index)=>{
              // const countryName = allCountries.filter(ac => ac.COUNTRY_CODE == String(_.country))[0]?.COUNTRY_NAME || 'Unknown Country';
              // const cityName = allCities.filter(as => as.CITY_CODE == String(_.city))[0]?.CITY_NAME || 'Unknown City';
              return (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>{_.branch_id} - {_.name}</td>
                  <td>{entityArray.filter(ea=>ea.entity_id==_.entity_id)[0]?.name}</td>
                  {/* <td>{countryName}{cityName}</td> */}
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
      <Modal heading={`${action} Branch`} onClose={modalClose}>
        <form noValidate onSubmit={onFormSubmit}>
          <fieldset disabled={action === 'View'}>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
              <SelectField {...FieldAttributes('entity_id')} required label="Entity" disabled={action != 'Add'}>
                <option value="">Select entity</option>
                {(user?.is_superadmin != 1 ? entityArray.filter(_=>Number(_.entity_id) == user?.entity_id) : entityArray).map(entity =>{
                    if(entity.entity_id){
                      return <option key={entity.entity_id} value={entity.entity_id}>{entity.name}</option>
                    }
                  }
                 )
                }
              </SelectField>
              <InputField required label="Branch name" {...FieldAttributes('name')} />

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

export default Branch