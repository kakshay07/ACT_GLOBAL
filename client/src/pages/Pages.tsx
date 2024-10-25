import { useEffect, useState } from "react"
import InputField, {  Checkbox } from "../components/Input/Input"
// import SelectField from "../components/Select/Select"
import useTable from "../components/Table/Table"
import Button, {ActionButtonGroup, AddButton} from "../components/Button/Button"
import Modal from "../components/Modal/Modal"
// import Tooltip from "../components/Tooltip/Tooltip"
import { useOnInputState, useOnSubmit, useValue } from "../hooks/form"
import ImportExportFile from "../components/ImportExportFile/ImportExportFile"
// import Swal from "sweetalert2"
import { toastError, toastSuccess } from "../utils/SweetAlert"
import {  AddPage,  GetPages,  UpdatePage, requestHandler } from "../utils/api"
// import { useAuth } from "../contexts/AuthContext"

export class pagesModel {
    page_id : number | null = null;
    page_name : string | null = null;
    name : string | null = null;
    description : string | null = null;
    superadmin_only : 1 | 0 = 0;
    access_for_all : 1 | 0 = 0;
}


const Pages = () => {
  const [data, setdata] = useState<pagesModel>(new pagesModel());
  const [dataArray, setdataArray] = useState<pagesModel[]>([]);
  const [action, setaction] = useState<'Add' |'Edit' | 'View' | ''>('');
  // const [uploadedFile, setuploadedFile] = useState<File>();
  const [importModalOpen, setimportModalOpen] = useState(false);
  const [importedFile, setimportedFile] = useState<File | undefined>()
  // state used to handle modal open state
  const [modalOpen, setmodalOpen] = useState(false)

  // Custom Hook - gives a "table" component and current page number and a function to change the current page
  const {Table } = useTable(()=>{});
  
  // custom Hook - sets the value of the state on input change
  const onInput = useOnInputState(data , setdata)

  // custom Hook - this is used to set attributes of input and select elements
  // this will set name , value and onChange
  const FieldAttributes = useValue(data , onInput)

  // function to get all entity 
  function getAllPages(){
    requestHandler(
      async () => {
          return await GetPages();
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
        async ()=>{ return await AddPage(data)},
        (data)=>{
          if(data.success){
            toastSuccess.fire({
              title : data.message 
            })
            getAllPages();
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
        ()=>{return UpdatePage(data)},
        (data)=>{
          toastSuccess.fire({
            title : data.message
          })
          getAllPages();
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
    setdata(new pagesModel());
  }

  // function to pass to the modal close button
  // this closes the modal and clears the "data" state
  function modalClose(){
    setmodalOpen(false);
    resetDatastate()
  }


  useEffect(() => {
    getAllPages()
  }, []);

  
  
  return (
    <div>

      {/* template header */}
      <div className="mx-3 my-3 shadow px-4 py-1 border rounded ">

        {/* ===== Head ===== */}
        <div className="flex items-center justify-between flex-wrap">
          <div><h2 className="text-2xl font-medium text-cyan-950 pl-2 mt-3 lg:mt-0 py-5">Pages Master</h2></div>
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
            <AddButton onClick={()=>{setaction('Add');resetDatastate();setmodalOpen(true)}}>Add Page</AddButton>
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
            <th>Path</th>
            <th>Name</th>
            <th>Description</th>
            <th>For super admin only</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>

          {
            dataArray.map((_ , index)=>{
              return (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>{_.page_id} - {_.page_name}</td>
                  <td>{_.name}</td>
                  <td>{_.description}</td>
                  <td>{
                  _.superadmin_only ? 
                    <span className="inline-flex items-center justify-center rounded-full bg-green-200 px-2.5 py-0.5 text-black-700" >
                        <p className="whitespace-nowrap text-sm">Yes</p>
                    </span> : 
                    <span
                        className="inline-flex items-center justify-center rounded-full bg-red-200 px-2.5 py-0.5 text-black-700"
                    >
                        <p className="whitespace-nowrap text-sm">No</p>
                    </span>
                }</td>
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
      <Modal heading={`${action} Page`} onClose={modalClose}>
        <form noValidate onSubmit={onFormSubmit}>
          <fieldset disabled={action === 'View'}>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
              
              <InputField required label="Path" placeholder="/profile" {...FieldAttributes('page_name')} />
              <InputField required label="Name" placeholder="Profile" {...FieldAttributes('name')} />
              <InputField required label="Description" placeholder="Profile Page" {...FieldAttributes('description')} styleClass="col-span-1 md:col-span-2" />
              <Checkbox onChange={()=>{setdata(prev => ( {...prev , superadmin_only : prev.superadmin_only  == 1 ? 0 : 1 , access_for_all : 0} ))}} checked={data.superadmin_only } label="For super admin only"  />
              <Checkbox onChange={()=>{setdata(prev => ( {...prev , access_for_all : prev.access_for_all  == 1 ? 0 : 1 , superadmin_only : 0} ))}} checked={data.access_for_all } label="Access for everyone (No permission required)"  />
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

export default Pages;