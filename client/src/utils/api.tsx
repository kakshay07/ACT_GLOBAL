
import { APISuccessResponseInterface} from ".";
import { axios } from "./axios";
import { entityModel } from "../pages/Entity";
import { pagesModel } from "../pages/Pages";
import { branchModel } from "../pages/Branch";
import { rolesModel } from "../pages/Roles";
import { userModel } from "../pages/Users";
import { dsignationModel } from "../pages/Designation";
import { AxiosResponse } from "axios";
import { pincodeMasterModel } from "../pages/PincodeMaster";
import { CountryModel } from "../pages/CountryMaster";
import { StateModel } from "../pages/StateMaster";
import { CityModel } from "../pages/CityMaster";
import { BankMasterModel } from "../pages/BankMaster";
import { BankAccountMasterModel } from "../pages/BankAccountMaster";



export const requestHandler = async (
  api: () => Promise<AxiosResponse<APISuccessResponseInterface, any>>,
  onSuccess: (data: APISuccessResponseInterface) => void,
  onError: (error: string) => void
) => {
  try {
    const response = await api();

    if (response) {
      const { data } = response;
      if (data?.success) {
        onSuccess(data);
      } else {
        console.log("why something went wrong")
        onError(data?.message || "Something went wrong");
      }
    }
  } catch (error: any) {
    // Handle specific known errors
    if (error.message === 'globalEntity or globalBranch is null') {
      console.log("globalEntity error:", error.message);
    } else if (error.response?.data?.message) {
      console.log(error.response.data)
      // Display meaningful error message
      onError(error.response.data.message);
    }
  }
};


export const checkServerIndex = () => {
  return axios.get("/");
};
export const logout=(data:{user_name:string,entity_id:number})=>{
  console.log("data",data,"dsdsdsd")
  return axios.post('/user/logout',data);
}

export const login = (data: { user_name: string; password: string }) => {
  return axios.post("/user/login", data);
};
export const checkSession =(data:{user_name:string})=>{
  return axios.post('/user/check-active-session',data)
}
export const forceLogout =(data:{user_name:string})=>{
  return axios.post("/user/force-logout",data)
}

export const AddEntity = (data: entityModel) => {
  return axios.post("/entity", data);
};

export const GetEntity = () => {
  return axios.get("/entity");
};

export const UpdateEntity = ({
  entity_id,
  name,
  short_desc,
  address,
  reg_num,
  estab_date,
  expiry_date,
  email,
  bank_ac_num,
  bank_ifsc,
  bank_name,
  bank_location,
  gst_no,
  country,
  state,
  city,
  pincode,
  additional_info,
}: entityModel) => {
  return axios.put("/entity", {
    entity_id,
    name,
    short_desc,
    address,
    reg_num,
    estab_date,
    expiry_date,
    email,
    bank_ac_num,
    bank_ifsc,
    bank_name,
    bank_location,
    gst_no,
    country,
    state,
    city,
    pincode,
    additional_info
  });
};

export const GetRoles = () => {
  return axios.get("/role");
};

export const GetPages = () => {
  return axios.get("/page");
};

export const GetPagesForGivingAccess = () => {
  return axios.get("/page/toGiveAccess");
};

export const UpdatePage = ({
  page_id,
  page_name,
  name,
  description,
  superadmin_only,
  access_for_all
}: pagesModel) => {
  return axios.put("/page", {
    page_id,
    page_name,
    name,
    description,
    superadmin_only,
    access_for_all
  });
};

export const AddPage = ({ page_name, name, description, superadmin_only, access_for_all }: pagesModel) => {
  return axios.post("/page", {
    page_name,
    name,
    description,
    superadmin_only,
    access_for_all
  });
};

export const GetAllBranches = () => {
  return axios.get("/branch");
};
// Add roles 
export const addRoles = ({ role_name, page_access , is_admin , is_superadmin , is_staff}: rolesModel) => {
  return axios.post("/role", {role_name,page_access,is_admin , is_superadmin , is_staff});
};

export const UpdateBranch = ({ entity_id, branch_id, name,country,state,city }: branchModel) => {
  return axios.put("/branch", {
    entity_id,
    branch_id,
    name,
    country,
    state,
    city
  });
};

export const getBranchByEntity = () => {
  return axios.get("/branch/getBranchByEntity");
};

export const AddBranch = (data: branchModel) => {
  return axios.post("/branch", data
 );
};

export const GetAllUsers = (filters?:{page:number,limit:number,user_name:string|null,role_id:number| null}) => {
  return axios.get("/user",{
    params:filters
  });
};

export const updateRoleAccess=({entity_id,role_id,role_name,page_access , is_admin,is_superadmin,is_staff,cr_by,cr_on}:rolesModel)=>{
  return axios.put('/role',{
    entity_id,
    role_id,
    role_name,
    page_access,
    is_admin, 
    is_superadmin, 
    is_staff,cr_by,cr_on
  })
}
  
// eslint-disable-next-line react-refresh/only-export-components
export const changePassword = ({
user_password
}:{
  user_password : string
}) =>{
  return  axios.put("/user/changePassword",{
    user_password
  }
  )
}

export const addUSer = ({
  user_name,
  full_name,
  user_password,
  role_id,
  desig_id
}: userModel) => {
  return axios.post("/user", {
    user_name,
    full_name,
    user_password,
    role_id,
    desig_id
  });
};

export const UpdateUser = ({
  user_name,
  full_name,
  role_id,
  entity_id,
  user_id,
 user_active,
 user_password
}:userModel) => {
  return axios.put("/user",{
    user_name,
    full_name,
    role_id,
    entity_id,
    user_id,
    user_active,
    user_password
  })
}

export const getDesignations = () => {
  return axios.get("/designation");
};

export const addDesignation = (data : dsignationModel) => {
  return axios.post("/designation" , {
    name : data.name
  });
};

export const updateDesignation = (data : dsignationModel) => {
  return axios.put("/designation" , data);
};

export const getAllCountriesAPI = () => {
  return axios.get('/country')
}
export const getAllStatesAPI = (country_code : string) => {
  return axios.get('/state' , {
    params : {
      country_code
    }
  })
}
export const getAllCitiesAPI = (state_code : string) => {
  return axios.get('/city' , {
    params : {
      state_code
    }
  })
}
// bank master Api
export const getAllBankName = () => {
  return axios.get('/bank')
}
export const getBankAccountType = () => {
  return axios.get('/bank/accounttype')
}








// export const clientApi = {
//   addCustomerDetails : (data : clientModel) => {
//     return axios.post('/customer' , data)
//   },
//   getCustomerDetails : (data : {
//     limit : number,
//     page : number,
//     phone : number | null,
//   }) => {
//     return axios.get('/customer' , {params : {...data}})
//   },
//   updateCustomerDetials : (data : clientModel) => {
//     return axios.put('/customer' , data)
//   }
// }



//Pincode master api
export const getpincodes = (filter: {state_code: string, city_code: string; limit: number; page: number}) => {
  return axios.get("/pincode", {
    params: filter
  });
};

export const addPincodeMaster = (data : pincodeMasterModel) => {
  return axios.post("/pincode", data);
};

export const updatePincodeMaster = (data : pincodeMasterModel) => {
  return axios.put("/pincode", data);
};




export const CountryApi = {
  AddCountry: (data: CountryModel) => {
    return axios.post("/country", data);
  },
  getAllCountries:()=>{
  return axios.get('/country')
  },
  UpdateCountry:(data:CountryModel)=>{
  return axios.put('/country',data)

  }
};

export const StateApi={
  AddState: (data: StateModel) => {
    return axios.post("/state", data);
  },
  getAllStates:()=>{
  return axios.get('/state')
  },
  UpdateState:(data:StateModel)=>{
  return axios.put('/state',data)

  }
}

export const CityApi={
  AddCity: (data: CityModel) => {
    return axios.post("/state", data);
  },
  getAllCities:()=>{
  return axios.get('/city')
  },
  // getAllStates:()=>{
  //   return axios.get('/state')
  //   },
  UpdateCity:(data:CityModel)=>{
  return axios.put('/city',data)

  }
}



export const BankApi={
  AddBank: (data: BankMasterModel) => {
    return axios.post("/bank", data);
  },
  getAllBankNames:()=>{
  return axios.get('/bank')
  },
  // getAllStates:()=>{
  //   return axios.get('/state')
  //   },
  UpdateBank:(data:BankMasterModel)=>{
  return axios.put('/bank',data)
  }
}


//----- Bank Account Master  ------//

export const BankACapi = {
  AddBankAccountApi:(data:BankAccountMasterModel) => {
    return axios.post("/bank/account",  data)
  },
  getAllBanckAccountType:()=>{
    return axios.get('/bank/account')
    },
    updateBankAccount :(data:BankAccountMasterModel)=>{
      return axios.put('/bank/account',data)
    }
}
