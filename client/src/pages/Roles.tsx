import { useEffect, useState } from "react";
import InputField from "../components/Input/Input";
// import SelectField from "../components/Select/Select"
import useTable from "../components/Table/Table";
import Button from "../components/Button/Button";
import Modal from "../components/Modal/Modal";
// import Tooltip from "../components/Tooltip/Tooltip"
import { useOnSubmit, useValue, useOnInputState } from "../hooks/form";
import ImportExportFile from "../components/ImportExportFile/ImportExportFile";
import { Checkbox } from "../components/Input/Input";
// import Swal from "sweetalert2"
import { toastError, toastSuccess } from "../utils/SweetAlert";
import { AddButton, ActionButtonGroup } from "../components/Button/Button";
import {  GetPagesForGivingAccess, GetRoles, requestHandler } from "../utils/api";
import { addRoles } from "../utils/api";
import { updateRoleAccess } from "../utils/api";
import "../components/Input/Input.css";
import SelectField from "../components/Select/Select";
import { useAuth } from "../contexts/AuthContext";
// import { useAuth } from "../contexts/AuthContext"
interface PageAccess {
  page_id: number;
  access_to_add?: number;
  access_to_update?: number;
  access_to_delete?: number;
}

export class rolesModel {
  entity_id: string | null = null;
  entity_name: string | null = null;
  role_id: string | null = null;
  role_name: string | null = null;
  is_superadmin: 1 | 0 = 0;
  is_admin: 1 | 0 = 0;
  is_staff: 1 | 0 = 0;
  page_access: PageAccess[] = [];
  cr_by?:number;
  cr_on?:string;
}



export class pagesModel {
  page_id : number | null = null;
  page_name : string | null = null;
  name : string | null = null;
  description : string | null = null;
  superadmin_only : 1 | 0 = 0;
  access_for_all : 1 | 0 = 0;
  access_to_add?: number;
  access_to_update?: number;
  access_to_delete?: number;
  cr_by?:number; 
  cr_on?:string;

}


const Roles = () => {
  const {user} = useAuth();
  const [data, setdata] = useState<rolesModel>(new rolesModel());
  const [pages, setpages] = useState<pagesModel[]>([]);
  // const [selectedPages, setSelectedPages] = useState([]);
  const [dataArray, setdataArray] = useState<rolesModel[]>([]);
  const [action, setaction] = useState<"Add" | "Edit" | "View" | "">("");
  // const [uploadedFile, setuploadedFile] = useState<File>();
  const [importModalOpen, setimportModalOpen] = useState(false);
  const [importedFile, setimportedFile] = useState<File | undefined>();
  // state used to handle modal open state
  const [modalOpen, setmodalOpen] = useState(false);

  // Custom Hook - gives a "table" component and current page number and a function to change the current page
  const { Table } = useTable(() => {});

  // custom Hook - sets the value of the state on input change
  const onInput = useOnInputState(data, setdata);

  // custom Hook - this is used to set attributes of input and select elements
  // this will set name , value and onChange
  const FieldAttributes = useValue(data, onInput);

  // function to get all entity
  function getAllRoles() {
    requestHandler(
      async () => {
        return await GetRoles();
      },
      (data) => {
        setdataArray(data.data);
      },
      (errorMessage) => {
        toastError.fire({
          title: errorMessage,
        });
      }
    );
  }

  // custom Hook - handles form submission
  // we need to pass a callback function to "useOnSubmit" ,
  // that callback function will be called after validation of the form
  const onFormSubmit = useOnSubmit(() => {
    if(user?.is_superadmin == 0){
      data.is_staff = 1;
      data.is_superadmin = 0;
      data.is_admin = 0;
    }
    if((Number(data.is_admin) + Number(data.is_staff) + Number(data.is_superadmin)) > 1){
      toastError.fire('A role can either be superadmin , admin or staff.')
    }else{
      if (action == "Add") {
        requestHandler(
          async () => {
            return await addRoles(data);
          },
          (data) => {
            if (data.success) {
              toastSuccess.fire({
                title: data.message,
              });
              getAllRoles();
              setmodalOpen(false);
            } else {
              toastError.fire({
                title: data.message,
              });
            }
          },
          (errorMessage) => {
            toastError.fire({
              title: errorMessage,
            });
          }
        );
      } else if (action == "Edit") {
        requestHandler(
          async () => {
            return await updateRoleAccess(data);
          },
          (data) => {
            if (data.success) {
              toastSuccess.fire({
                title: data.message,
              });
              getAllRoles();
              setmodalOpen(false);
            }
          },
          (errorMessage) => {
            toastError.fire({
              title: errorMessage,
            });
          }
        );
      }
    }
    
  });

  // function to empty the "data" state
  function resetDatastate() {
    setdata(new rolesModel());
  }

  // function to pass to the modal close button
  // this closes the modal and clears the "data" state
  function modalClose() {
    setmodalOpen(false);
    resetDatastate();
  }

  function getAllPages() {
    requestHandler(
      async () => {
        return await GetPagesForGivingAccess();
      },
      (data) => {
        setpages(data.data);
      },
      (errorMessage) => {
        toastError.fire({
          title: errorMessage,
        });
      }
    );
  }
  useEffect(() => {
    getAllPages();
  }, []);

  useEffect(() => {
    getAllRoles();
    setaction("");
  }, []);

  const handlePageAccessCheckboxChange = (pageId: number) => {
    setdata((prevState) => {
      const pageIndex = prevState.page_access.findIndex((access) => access.page_id === pageId);
  
      let updatedPageAccess;
      if (pageIndex !== -1) {
        // If the page exists, remove it and reset all access fields
        updatedPageAccess = [...prevState.page_access];
        updatedPageAccess.splice(pageIndex, 1);
      } else {
        const page = pages.find(pag => pag.page_id === pageId);
        updatedPageAccess = [
          ...prevState.page_access,
          { 
            page_id: pageId, 
            access_to_add: page?.access_to_add === 1 ? 1 : 0,
            access_to_update: page?.access_to_update === 1 ? 1 : 0,
            access_to_delete: page?.access_to_delete === 1 ? 1 : 0
          }
        ];
      }
  
      return { ...prevState, page_access: updatedPageAccess };
    });
  };

  const handleCheckboxChange = (pageId: number, field: keyof PageAccess) => {
    setdata((prevState) => {
      const pageIndex = prevState.page_access.findIndex(
        (access) => access.page_id === pageId
      );

      let updatedPageAccess;
      if (pageIndex !== -1) {
        updatedPageAccess = [...prevState.page_access];
        updatedPageAccess[pageIndex] = {
          ...updatedPageAccess[pageIndex],
          [field]: updatedPageAccess[pageIndex][field] === 1 ? 0 : 1,
        };
      } else {
        updatedPageAccess = [
          ...prevState.page_access,
          { page_id: pageId, [field]: 1 },
        ];
      }
      return { ...prevState, page_access: updatedPageAccess };
    });
  };

  return (
    <div>
      {/* template header */}
      <div className="mx-3 my-3 shadow px-4 py-1 border rounded ">
        {/* ===== Head ===== */}
        <div className="flex items-center justify-between flex-wrap">
          <div>
            <h2 className="text-2xl font-medium text-cyan-950 pl-2 mt-3 lg:mt-0 py-5">
              Roles 
            </h2>
          </div>
          <div className="flex justify-start lg:justify-end flex-wrap">
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
            <AddButton
              onClick={() => {
                setaction("Add");
                resetDatastate();
                setmodalOpen(true);
              }}
            >
              Add Roles
            </AddButton>
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
      <Table >
        <thead>
          <tr>
            <th>Sl</th>
            <th>Role name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dataArray.filter(_ => user?.is_superadmin == 0 ? _.is_staff == 1 : true).map((_, index) => {
            // const pageIds = _.page_access
            //   .map((access) => access.page_id)
            //   .join(",");
            return (
              <tr key={index}>
                <td>{index+1}</td>
                <td>{_.role_id} - {_.role_name}</td>
                <td width={"15%"} >
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
                      window.scrollTo(0, 100);
                    }}
                    onDuplicate={() => {
                      setaction("Add");
                      setdata({..._ ,role_name:""});
                      setmodalOpen(true);
                    }}
                    view
                    edit
                    duplicate
                  />
                 {/* <button className="inline-flex items-center gap-2 rounded border border-black-1000 bg-black-900 px-4 py-3 text-grey hover:text-indigo-900 focus:outline-none focus:ring active:text-indigo-500  mx-2 h-full"
                    onClick={() => {
                      setaction("Add");
                      setdata({..._ ,role_name:""});
                      setmodalOpen(true);
                    }}
                    title="duplicate"
                  >
                  <i className="fa-solid fa-copy text-gray-500 "></i> 
                </button> */}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Modal for Add , Edit and View */}
      {modalOpen && (
        <Modal heading={`${action === 'Edit' ? `${action} ${data.role_name?.includes('role') ? data.role_name.replace(/role/i, '') : `${data.role_name}`}` : `${action} Role`}`}  onClose={modalClose}>
          <form noValidate onSubmit={onFormSubmit}>
            <fieldset disabled={action == "View"}>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                <InputField
                  required
                  label="Role name"
                  placeholder="Admin"
                  {...FieldAttributes("role_name")}
                />
                {user?.is_superadmin == 1 && <><SelectField 
                  required
                  label="Is super admin"
                  {...FieldAttributes("is_superadmin")}
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </SelectField>
                <SelectField 
                  required
                  label="Is admin"
                  {...FieldAttributes("is_admin")}
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </SelectField>
                <SelectField 
                  required
                  label="Is staff"
                  {...FieldAttributes("is_staff")}
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </SelectField></>}
              </div>

              {/* <Checkbox onChange={()=>{setdata(prev => ( {...prev , superadmin_only : prev.superadmin_only  == 1 ? 0 : 1} ))}} checked={data.superadmin_only }   />
              <InputField required label="page Names" placeholder="/profile" {...FieldAttributes('page_name')} /> */}
              {/* {<label className='w-full' htmlFor="app-input-field"><span style={{color:'red'}}>*</span></label> } */}
              <label
                className=" grid mb-9 ml-3 mr-4 "
                style={{ fontSize: "14.5px" }}
              >
                Pages to access
              </label>

              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    {user?.is_superadmin == 1 && <th>Description</th>}
                    <th>Page access(y/n)</th>
                    <th>Access to add(y/n)</th>
                    <th>Access to update(y/n)</th>
                    <th>Access to delete(y/n)</th>
                  </tr>
                </thead>
                <tbody>
                  {pages
                    .filter((pag) => pag.superadmin_only == 0)
                    .map((page) => (
                      <tr className="" key={page.page_id}>
                        <td>
                          <label className="ml-2">{page.name}</label>
                        </td>
                        {user?.is_superadmin == 1 && <td>
                          <label className="ml-2">{page.description ? page.description : '-'}</label>
                        </td>}
                        <td>
                          <div className="grid ml-7">
                            <Checkbox
                              onChange={() =>
                                handlePageAccessCheckboxChange(page.page_id!)
                              }
                              checked={
                                data.page_access.filter(
                                  (_) => _.page_id == page.page_id
                                ).length > 0
                                  ? 1
                                  : 0
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div className="grid ml-7">
                            {
                              page.access_to_add == 1 &&
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    page.page_id!,
                                    "access_to_add"
                                  )
                                }
                                checked={
                                  data.page_access.filter(
                                    (access) =>
                                      access.page_id === page.page_id &&
                                      access.access_to_add === 1
                                  ).length > 0
                                    ? 1
                                    : 0
                                }
                              />
                            }
                          </div>
                        </td>
                        <td>
                          <div className="grid ml-7">
                            {
                              page.access_to_update == 1 && 
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(
                                    page.page_id!,
                                    "access_to_update"
                                  )
                                }
                                checked={
                                  data.page_access.filter(
                                    (access) =>
                                      access.page_id === page.page_id &&
                                      access.access_to_update === 1
                                  ).length > 0
                                    ? 1
                                    : 0
                                }
                              />
                            }
                          </div>
                        </td>
                        <td>
                          <div className="grid ml-7">
                          {
                            page.access_to_delete == 1 && 
                            <Checkbox
                              onChange={() =>
                                handleCheckboxChange(
                                  page.page_id!,
                                  "access_to_delete"
                                )
                              }
                              checked={
                                data.page_access.filter(
                                  (access) =>
                                    access.page_id === page.page_id &&
                                    access.access_to_delete === 1
                                ).length > 0
                                  ? 1
                                  : 0
                              }
                            />
                          }
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
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
      <ImportExportFile
        file={importedFile}
        onFileUpload={(data) => {
          setimportedFile(data);
        }}
        modalOpen={importModalOpen}
        onClose={() => {
          setimportModalOpen(false);
        }}
      />
    </div>
  );
};

export default Roles;
