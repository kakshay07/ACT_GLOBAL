import { useEffect, useState } from "react"
import InputField from "../components/Input/Input"
// import SelectField from "../components/Select/Select"
import useTable from "../components/Table/Table"
import Button, {ActionButtonGroup, AddButton} from "../components/Button/Button"
import Modal from "../components/Modal/Modal"
// import Tooltip from "../components/Tooltip/Tooltip"
import { useOnInputState, useOnSubmit, useValue } from "../hooks/form"
// import Swal from "sweetalert2"
import { toastError, toastSuccess } from "../utils/SweetAlert"
import { addDesignation, getDesignations, requestHandler, updateDesignation } from "../utils/api"
// import { useAuth } from "../contexts/AuthContext"

export class dsignationModel {
    entity_id : number | null = null;
    desig_id : number | null = null;
    name : string | null = null;
}


const Designation = () => {
  const [data, setdata] = useState<dsignationModel>(new dsignationModel());
  const [dataArray, setdataArray] = useState<dsignationModel[]>([]);
  const [action, setaction] = useState<'Add' |'Edit' | 'View' | ''>('');
  const [modalOpen, setmodalOpen] = useState(false)

  // Custom Hook - gives a "table" component and current page number and a function to change the current page
  const {Table } = useTable(()=>{});
  
  // custom Hook - sets the value of the state on input change
  const onInput = useOnInputState(data , setdata)

  // custom Hook - this is used to set attributes of input and select elements
  // this will set name , value and onChange
  const FieldAttributes = useValue(data , onInput)

  // function to get all entity 
  function getAllDesignations(){
    requestHandler(
      async () => {
          return await getDesignations();
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
        async ()=>{ return await addDesignation(data)},
        (data)=>{
          if(data.success){
            toastSuccess.fire({
              title : data.message 
            })
            getAllDesignations();
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
        ()=>{return updateDesignation(data)},
        (data)=>{
          toastSuccess.fire({
            title : data.message
          })
          setmodalOpen(false)
          getAllDesignations();
       
        },
        (errorMessage)=>{
          toastError.fire({
            title : errorMessage
          })
        }
      )
    }
  }
);

  // function to empty the "data" state 
  function resetDatastate(){
    setdata(new dsignationModel());
  }

  // function to pass to the modal close button
  // this closes the modal and clears the "data" state
  function modalClose(){
    setmodalOpen(false);
    resetDatastate()
  }


  useEffect(() => {
    getAllDesignations()
  }, []);

  
  return (
    <div>

      {/* template header */}
      <div className="mx-3 my-3 shadow px-4 py-1 border rounded ">

        {/* ===== Head ===== */}
        <div className="flex items-center justify-between flex-wrap">
          <div><h2 className="text-2xl font-medium text-cyan-950 pl-2 mt-3 lg:mt-0 py-5">Designation</h2></div>
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
            <AddButton onClick={()=>{setaction('Add');resetDatastate();setmodalOpen(true)}}>Add Designation</AddButton>
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
            <th>Designation name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>

          {
            dataArray.map((_ , index)=>{
              return (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>{_.desig_id} - {_.name}</td>
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
      <Modal heading={`${action} Designation`} onClose={modalClose}>
        <form noValidate onSubmit={onFormSubmit}>
          <fieldset disabled={action === 'View'}>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
              <InputField required label="Designation name" placeholder="Eg. Security Officer" {...FieldAttributes('name')} />
            </div> 
          </fieldset>
          <hr className="mt-4 border-gray-300 " />
          <div className="flex justify-end">
            <Button onClick={modalClose} varient="light" type="button">Cancel</Button>
            <Button varient="blue">Submit</Button>
          </div>
        </form>
      </Modal>}
      {/* <ImportExportFile file={importedFile} onFileUpload={(data)=>{setimportedFile(data)}}  modalOpen={importModalOpen} onClose={()=>{setimportModalOpen(false)}} /> */}
    </div>
  )
}

export default Designation