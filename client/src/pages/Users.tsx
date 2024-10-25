import { useEffect, useState } from "react";
import SelectField from "../components/Select/Select";
import useTable from "../components/Table/Table";
import Button, {
  ActionButtonGroup,
  AddButton,
  FilterButton,
  FilterResetButton,
} from "../components/Button/Button";
import Modal from "../components/Modal/Modal";
import { useOnInputState, useOnSubmit, useValue } from "../hooks/form";
import { toastSuccess, toastError } from "../utils/SweetAlert";
import { addUSer, GetAllUsers, getDesignations, requestHandler } from "../utils/api";
import InputField from "../components/Input/Input";
import { GetRoles } from "../utils/api";
import { rolesModel } from "./Roles";
import { UpdateUser } from "../utils/api";
import { dsignationModel } from "./Designation";

class extras {
  desig_name : string = '';
  branch_name: string | null = null;
  role_name: string | null = null;
}

export class userModel extends extras{
  entity_id: number | null = null;
  user_id: number | null = null;
  user_name: string | null = null;
  user_password: string | null = null;
  role_id: number | null = null;
  full_name: string | null = null;
  branch_id: number | null = null;
  user_active: 1 | 0 = 0;
  desig_id : number | null = null;

  is_admin : 1 | 0 = 0; 
  is_superadmin : 1 | 0 = 0; 
  is_staff : 1 | 0 = 0; 
}

export class filterType {
  limit: number = 15;
  page: number = 0;
  // id: string | "" = "";
  user_name: string | null = "";
  role_id:number | null = null;
}
// class filterType {
 
//   offset: number = 0;
// }

const Users = () => {
  const [roles, setRole] = useState<rolesModel[]>([]);
  const [data, setdata] = useState<userModel>(new userModel());
  const [dataArray, setdataArray] = useState<userModel[]>([]);
  const [designationMaster, setdesignationMaster] = useState<dsignationModel[]>([]);

  // const [entityArray, setEntityArray] = useState<entityModel[]>([]);
  const [action, setaction] = useState<"Add" | "Edit" | "View" | "">("");
  // const [uploadedFile, setuploadedFile] = useState<File>();
  const [modalOpen, setmodalOpen] = useState(false);
  const [filters ,setFilters]=useState<filterType>(new filterType())

  //  const limit : number = 15;
  // Custom Hook - gives a "table" component and current page number and a function to change the current page
  const { Table,page,setPage } = useTable(() => {getAllUsers(); });

  // custom Hook - sets the value of the state on input change
  const onInput = useOnInputState(data, setdata);

  // custom Hook - this is used to set attributes of input and select elements
  // this will set name , value and onChange
  const FieldAttributes = useValue(data, onInput);

  // function to get all entity
  function getAllUsers() {
    requestHandler(
      async () => {
        return await GetAllUsers({ ...filters, page: Number(page) });
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

  // function to get all entity
  function getAllRoles() {
    return requestHandler(
      async () => {
        return await GetRoles();
      },
      (data) => {
        setRole(data.data);
      },
      (errorMessage) => {
        toastError.fire({
          title: errorMessage,
        });
      }
    );
  }

  function getAllDesignations(){
    requestHandler(
      async () => {
          return await getDesignations();
      },
      (data) => {
        setdesignationMaster(data.data)
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
  const onFormSubmit = useOnSubmit(() => {
    if (action === "Add") {
      if(String(data?.user_password)?.length < 6){
      toastError.fire({
          title: 'Password should be atleast 6 character',
        });
        return false
      }
      requestHandler(
        async () => {
          return await addUSer(data);
        },
        (data) => {
          toastSuccess.fire({
            title: data.message,
          });
          getAllUsers();
          setmodalOpen(false);
          setaction('')
        },
        (errorMessage) => {
          toastError.fire({
            title: errorMessage,
          });
        }
      );
    } else if (action == "Edit") {
      if( data.user_password && String(data?.user_password)?.length < 6){
        toastError.fire({
            title: 'Password should be atleast 6 character',
          });
          return false
        }
      requestHandler(
        ()=>{return UpdateUser(data)},
        (data)=>{
          toastSuccess.fire({
            title : data.message
          })
          getAllUsers();
          setmodalOpen(false)
          setaction('')
        },
        (errorMessage) => {
          toastError.fire({
            title: errorMessage,
          });
        }
      )
    }
  });

  // function to empty the "data" state
  function resetDatastate() {
    setdata(new userModel());
    setFilters(new filterType());
  }

  // function to pass to the modal close button
  // this closes the modal and clears the "data" state
  function modalClose() {
    setmodalOpen(false);
    setaction('');
    resetDatastate();
  }
  useEffect(() => {
    if (JSON.stringify(filters) == JSON.stringify(new filterType())) {
      getAllUsers();
    }
  }, [filters]);

  useEffect(() => {
    getAllUsers();
    getAllRoles();
    getAllDesignations()
  }, []);

  useEffect(() => {
    if (action=='Edit') {
      console.log("edit");
      
      setdata((prev) => ({
        ...prev,
        user_password: '',
      }));
    }
  }, [action]);

  return (
    <div>
      {/* template header */}
      <div className="mx-3 my-3 shadow px-4 py-1 border rounded ">
        {/* ===== Head ===== */}
        <div className="flex items-center justify-between flex-wrap">
          <div>
            <h2 className="text-2xl font-medium text-cyan-950 pl-2 mt-3 lg:mt-0 py-5">
              Users
            </h2>
          </div>
          <div className="flex justify-start lg:justify-end flex-wrap">
            <AddButton
              onClick={() => {
                setaction("Add");
                resetDatastate();
                setmodalOpen(true);
              }}
            >
              Add User
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
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            setPage(0);
            getAllUsers();
            // ();
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-5 items-end">
            <InputField
              value={String(filters?.user_name)}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, user_name: e.target.value }));
              }}
              name="User name"
              label="Search by user name"
            />
            {/* <InputField
              value={filters?.role_id}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, role_id: e.target.value }));
              }}
              name="to_date"
              type="date"
              label="To date"
              min={filters.from_date}
            /> */}
            <SelectField
              name="Role"
              label="Roles"
              value={String(filters.role_id)}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  role_id: Number(e.target.value),
                }))
              }
            >
              <option value="">Select role</option>
              {roles.map((_, index) => (
                <option key={index} value={_.role_id?.toString()}>
                  {" "}
                  {_.role_name}
                </option>
              ))}{" "}
            </SelectField>

            <InputField
              value={filters?.limit.toString()}
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  limit: Number(e.target.value),
                }));
              }}
              label="Page limit"
              name="limit"
              type="number"
              placeholder="Limit"
              min={0}
            />
            <div className="flex ">
              {/* <FilterButton onClick={()=>{}}></FilterButton> */}
              <FilterResetButton
                type="button"
                onClick={() => {
                  resetDatastate();
                }}
              ></FilterResetButton>
              <FilterButton onClick={() => {}}></FilterButton>
            </div>
          </div>
        </form>
      </div>

      {/* ===== Table ===== */}
      <Table pagination>
        <thead>
          <tr>
            <th>Sl</th>
            <th>Full name</th>
            <th>User name</th>
            <th>Role</th>
            <th>Designation</th>
            <th>User active</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dataArray.map((_, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <b>
                    {_.user_id} - {_.full_name}
                  </b>
                </td>
                <td>
                  <b>{_.user_name}</b>
                </td>
                {/* <td>{_.user_id}</td> */}
                <td>{_.role_name}</td>
                <td>{_.desig_name}</td>
                <td>
                  {_.user_active ? (
                    <span className="inline-flex items-center justify-center rounded-full bg-green-300 px-2.5 py-0.5 text-black-700">
                      <p className="whitespace-nowrap text-sm">Yes</p>
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center rounded-full bg-orange-300 px-2.5 py-0.5 text-red-700">
                      <p className="whitespace-nowrap text-sm">No</p>
                    </span>
                  )}
                </td>
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
            );
          })}
        </tbody>
      </Table>

      {/* Modal for Add , Edit and View */}
      {modalOpen && (
        <Modal heading={`${action} User`} onClose={modalClose}>
          <form noValidate onSubmit={onFormSubmit}>
            <fieldset disabled={action === "View"}>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                {/* <SelectField {...FieldAttributes('entity_id')} required label="Entity" disabled={action != 'Add'}>
                <option value="">Select Branch</option>
                {
                  entityArray.map(entity =>{
                    if(entity.entity_id){
                      return <option value={entity.entity_id}>{entity.name}</option>
                    }
                  }
                 )
                }
              </SelectField> */}
                <InputField
                  required
                  label="Full name"
                  {...FieldAttributes("full_name")}
                />
                <InputField
                  required
                  label="User name (Used for login)"
                  {...FieldAttributes("user_name")}
                />

                {action !== "View" && (
                   <InputField
                   required={action === "Add"} // Password required only in 'Add' mode
                   label={`Password ${action === "Edit" ? "(If required)" : ""}`}
                   name="user_password"
                   value={data.user_password || ""} // Set field value from state
                   onChange={(e) => {
                     const pass = e.target.value || "";
                     setdata((prev) => ({
                       ...prev,
                       user_password: pass, // Update state with new input
                     }));
                   }}
                 />
                )}

                <SelectField
                  {...FieldAttributes("role_id")}
                  required
                  label="Role"
                  // disabled={action != "Add"}
                >
                  <option value="">Select role </option>
                  {roles.map((role, i) => (
                    <option value={Number(role.role_id)} key={i}>
                      {role.role_name}
                    </option>
                  ))}
                </SelectField>
                <SelectField
                  required
                  label="Designation"
                  {...FieldAttributes("desig_id")}
                >
                  <option value="">Select designation</option>
                  {designationMaster.map((_) => (
                    <option key={_.desig_id} value={_.desig_id?.toString()}>
                      {_.name}
                    </option>
                  ))}
                </SelectField>
                {action === "Edit" && (
                  <SelectField
                    {...FieldAttributes("user_active")}
                    required
                    label="Is active"
                  >
                    <option value="0">In active</option>
                    <option value="1">Active</option>
                  </SelectField>
                )}
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
};

export default Users;
