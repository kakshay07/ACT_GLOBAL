import { useEffect, useState } from 'react';
import InputField from '../components/Input/Input';
import useTable from '../components/Table/Table';
import Button, {
  ActionButtonGroup,
  AddButton,
  // FilterButton,
  // FilterResetButton,
} from '../components/Button/Button';
import Modal from '../components/Modal/Modal';
import { useOnSubmit, useValue } from '../hooks/form';
import { toastError, toastSuccess } from '../utils/SweetAlert';
import {
  addPincodeMaster,
  getpincodes,
  requestHandler,
  updatePincodeMaster,
} from '../utils/api';
import SelectField from '../components/Select/Select';
import { useMaster } from '../contexts/MasterContext';


class extras{
  country_name?:string
  state_name?:string
  city_name?:string
}
export class pincodeMasterModel extends extras {
  sl?: number ;
  pincode: number | null = null;
  country_code: string = '';
  state_code: string = '';
  city_code: string = '';
  district: string = '';
  area: string = '';
  is_active: string = '';
}

class Filter {
  state_code: string = '';
  city_code: string = '';
  limit: number = 15;
  page: number = 0;
}

export function useOnInputState<T>(data: T, setData: React.Dispatch<React.SetStateAction<T>>) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      if (e.currentTarget) {
        
        const name = e.target.name;
        const value = e.target.value;
  
        const type = e.target.type;
        if (type === 'number') {
          setData({ ...data, [name]: Number(value) });
        } else if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
          setData({ ...data, [name]: e.target.checked });
        } else {
          setData({ ...data, [name]: value.replace(/\b\w/g, char => char.toUpperCase()) });
        }
      }
    };
}

const PincodeMaster = () => {
  const [pincodeMaster, setPincodeMaster] = useState<pincodeMasterModel[]>([
    new pincodeMasterModel(),
  ]);
  const [action, setaction] = useState<'Add' | 'Edit' | 'View' | ''>('');
  const [data, setData] = useState<pincodeMasterModel>(
    new pincodeMasterModel()
  );
  const [filter, setFilter] = useState(new Filter());
  const [modalOpen, setmodalOpen] = useState(false);
  const {allCountries ,getStates , allStates, getCities , allCities} = useMaster();
  // Custom Hook - gives a "table" component and current page number and a function to change the current page
  const { Table, page, setPage } = useTable(() => {
    getAllPincodes();
  });

  // custom Hook - sets the value of the state on input change
  const onInput = useOnInputState(data, setData);

  // custom Hook - this is used to set attributes of input and select elements
  // this will set name , value and onChange
  const FieldAttributes = useValue(data, onInput);


  // function to get all entity
  function getAllPincodes() {
    requestHandler(
      async () => {
        return await getpincodes({ ...filter, page: Number(page) });
      },
      (data) => {
        setPincodeMaster(data.data);
      },
      (errorMessage) => {
        toastError.fire({
          title: errorMessage,
        });
      }
    );
  }




useEffect(() => {
  if (action === "Edit" || action === "View") {
    if (data.country_code) {
      getStates(data.country_code); // Load states based on the selected country
    }
    if (data.state_code) {
      getCities(data.state_code); // Load cities based on the selected state
    }
  }
}, [action, data.country_code, data.state_code]);


  const onFormSubmit = useOnSubmit(() => {
    if (action == 'Add') {
      requestHandler(
        async () => {
          return await addPincodeMaster(data);
        },
        (data) => {
          if (data.success) {
            toastSuccess.fire({
              title: data.message,
            });
            getAllPincodes();
            setmodalOpen(false);
          }
        },
        (errorMessage) => {
          toastError.fire({
            title: errorMessage,
          });
        }
      );
    } else if (action == 'Edit') {
      requestHandler(
        async () => {
          return updatePincodeMaster(data);
        },
        (data) => {
          toastSuccess.fire({
            title: data.message,
          });
          getAllPincodes();
          setmodalOpen(false);
        },
        (errorMessage) => {
          toastError.fire({
            title: errorMessage,
          });
        }
      );
    }
  });

  // function to empty the "data" state
  function resetDatastate() {
    setData(new pincodeMasterModel());
    setFilter(new Filter());
  }

  // function to pass to the modal close button
  // this closes the modal and clears the "data" state
  function modalClose() {
    setmodalOpen(false);
    setData(new pincodeMasterModel());
  }

  useEffect(() => {
    if (JSON.stringify(filter) == JSON.stringify(new Filter())) {
        setPage(0);
        getAllPincodes();
    }
  }, [filter]);

  useEffect(() => {
    getAllPincodes();
  }, []);

  return (
    <div>
      {/* template header */}
      <div className="mx-3 my-3 shadow px-4 py-1 border rounded ">
        {/* ===== Head ===== */}
        <div className="flex items-center justify-between flex-wrap">
          <div>
            <h2 className="text-2xl font-medium text-cyan-950 pl-2 mt-3 lg:mt-0 py-5">
              Pincode Master
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
                setaction('Add');
                resetDatastate();
                setmodalOpen(true);
              }}>
              Add pincode
            </AddButton>
          </div>
        </div>

        {/* <hr className ="my-3 border-gray-300 " /> */}

        {/* ===== filter ===== */}
        {/* <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            setPage(0);
            getAllPincodes();
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-5 items-end">
            <InputField
              value={filter.state}
              onChange = {(e) => {
                setFilter((prev) => ({ ...prev, state: e.target.value.replace(/\b\w/g, char => char.toUpperCase()) }));
              }}
              name="state"
              label="Search By State Name"
            />
            <InputField
              value={filter.city}
              onChange = {(e) => {
                setFilter((prev) => ({ ...prev, city: e.target.value.replace(/\b\w/g, char => char.toUpperCase()) }));
              }}
              name="city"
              label="Search By City Name"
            />

            <InputField
              value={filter.limit.toString()}
              onChange={(e) => {
                setFilter((prev) => ({ ...prev, limit: Number(e.target.value) }));
              }}
              label="Page limit"
              name="limit"
              type="number"
              placeholder="Limit"
              min={0}
            />
            <div className="flex ">
                <FilterResetButton
                    type="button"
                    onClick={() => {
                        resetDatastate();
                    }}
                ></FilterResetButton>
                <FilterButton onClick={() => {}}></FilterButton>
            </div>
          </div>
        </form> */}
      </div>

      {/* ===== Table ===== */}
      <Table pagination>
        <thead>
          <tr>
            <th>Sl</th>
            <th>Pincode</th>
            <th>Country</th>
            <th>State</th>
            <th>City</th>
            <th>District</th>
            <th>Area</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pincodeMaster && pincodeMaster.map((_, index) => {
            return (
                <tr key={index}>
                    <td>{page * filter.limit + (index + 1)}</td>
                    <td>{_.pincode}</td>
                    <td>{_.country_code}-{_.country_name}</td>
                    <td>{_.state_code}-{_.state_name}</td>
                    <td>{_.city_code}-{_.city_name}</td>
                    <td>{_.district}</td>
                    <td>{_.area}</td>
                    <td width={'15%'}>
                    <ActionButtonGroup
                        onView={() => {
                            setaction('View');
                            setData(_);
                            setmodalOpen(true);
                        }}
                        onEdit={() => {
                            setaction('Edit');
                            setData(_);
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
        <Modal
          heading={`${action} Pincode`}
          onClose={modalClose}>
          <form
            noValidate
            onSubmit={onFormSubmit}>
            <fieldset disabled={action === 'View'}>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                <InputField
                  required
                  label="Pincode"
                  type='number'
                  {...FieldAttributes('pincode')}
                />
                 <SelectField
                      value={String(data.country_code || '')}
                      name="country"
                      required
                      label="Country"
                      onChange={(e) => {
                        setData(prev => ({ ...prev, country_code: e.target.value, state_code: '', city_code:'' }));
                        getStates(e.currentTarget.value);
                      }}
                    >
                      <option value="">Select Country</option>
                      {allCountries.map((_) => (
                        <option key={_.COUNTRY_CODE} value={_.COUNTRY_CODE}>{_.COUNTRY_NAME}</option>
                      ))}
                    </SelectField>
                    <SelectField
                      value={String(data.state_code || '')}
                      name="state"
                      required
                      label="State"
                      onChange={(e) => {
                        setData(prev => ({ ...prev, state_code: e.target.value, city_code: '' }));
                        getCities(e.currentTarget.value);
                      }}
                    >
                      <option value="">Select State</option>
                      {allStates.map((_) => (
                        <option key={_.STATE_CODE} value={_.STATE_CODE}>{_.STATE_NAME}</option>
                      ))}
                    </SelectField>
                    <SelectField
                      {...FieldAttributes("city_code")}
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
                  label="District"
                  {...FieldAttributes('district')}
                />
                <InputField
                  required
                  label="Area"
                  {...FieldAttributes('area')}
                />
                {action === "Edit" && (
                    <SelectField
                        {...FieldAttributes("is_active")}
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
              <Button
                onClick={modalClose}
                varient="light"
                type="button">
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

export default PincodeMaster;
