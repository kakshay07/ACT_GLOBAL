import { useEffect, useState, ReactNode, createContext, useContext, Dispatch, SetStateAction } from 'react';
import { LocalStorage } from '../utils';
import { setGlobalEntity, setglobalBranch } from '../utils/axios';
import { getBranchByEntity, requestHandler } from '../utils/api';

class userType {
  user_name: string = '';
  full_name: string = '';
  role_name: string = '';
  is_superadmin: 0 | 1 = 0;
  is_admin: 0 | 1 = 0;
  is_staff: 0 | 1 = 0;
  branch_id: number | null = null;
  branch_name: string = '';
  entity_id: number | null = null;
  additional_info: 0 | 1 = 0;
}

class branchModel {
  branch_id : number | null = null;
  branch_name : string = '';
}

interface AuthContextType {
  user: userType | null;
  signin: (user: userDetails, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
  pageAccess: pageAccessType[];
  branchAccess: branchAccessType[];
  token: string;
  currentBranch: branchModel;
  setcurrentBranch: Dispatch<SetStateAction<branchModel>>;
  currentEntity: number | null;
  setccurrentEntity: Dispatch<SetStateAction<number | null>>;
  setUser: Dispatch<SetStateAction<userType | null>>;
  setpageAccess: Dispatch<SetStateAction<pageAccessType[]>>;
  setbranchAccess: Dispatch<SetStateAction<branchAccessType[]>>;
  settoken: Dispatch<SetStateAction<string>>;
  handleRerender :  Dispatch<SetStateAction<boolean>>
}

class pageAccessType {
  url: string = '';
  access_to_add: 0 | 1 = 0;
  access_to_update: 0 | 1 = 0;
  access_to_delete: 0 | 1 = 0;
}

class branchAccessType {
  branch_id: number | null = null;
  name: string = '';
}

export class userDetails {
  user: userType = new userType();
  pageAccess: pageAccessType[] = [];
  branchAccess: branchAccessType[] = [];
  token: string = '';
}

let AuthContext = createContext<AuthContextType>({
  user: new userType(),
  signin: () => { },
  signout: () => { },
  pageAccess: [],
  branchAccess: [],
  token: '',
  currentBranch: new branchModel(),
  setcurrentBranch: () => { },
  currentEntity: null,
  setccurrentEntity: () => { },
  setUser: () => { },
  setpageAccess: () => { },
  setbranchAccess: () => { },
  settoken: () => { },
  handleRerender : () => { }
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<userType | null>(null);
  const [pageAccess, setpageAccess] = useState<pageAccessType[]>([]);
  const [branchAccess, setbranchAccess] = useState<branchAccessType[]>([]);
  const [token, settoken] = useState<string>('');
  const [currentBranch, setcurrentBranch] = useState<branchModel>(new branchModel())
  const [currentEntity, setccurrentEntity] = useState<number | null>(null)
  const [render, setrender] = useState(true)


  let signin = (userDetails: userDetails, callback: VoidFunction) => {
    setUser(userDetails.user);
    setpageAccess(userDetails.pageAccess);
    setbranchAccess(userDetails.branchAccess);
    settoken(userDetails.token);
    setcurrentBranch({
      branch_id : userDetails.user.branch_id,
      branch_name : userDetails.user.branch_name
    });
    setccurrentEntity(userDetails.user.entity_id)

    LocalStorage.clear();
    LocalStorage.set('users', userDetails.user);
    LocalStorage.set('pageAccess', userDetails.pageAccess);
    LocalStorage.set('branchAccess', userDetails.branchAccess);
    localStorage.setItem('token', userDetails.token);

    callback();
  };

  const signout = (callback: VoidFunction) => {
    // console.log('signout');
    LocalStorage.clear();
    setGlobalEntity(null);
    setglobalBranch(null);
    setUser(null);
    setpageAccess([]);
    setbranchAccess([]);
    setcurrentBranch(new branchModel())
    setccurrentEntity(null)
    settoken('');
    callback();
  };

  useEffect(() => {
    if (LocalStorage.get('users') && LocalStorage.get('pageAccess') && LocalStorage.get('branchAccess') && localStorage.getItem('token')) {
      setUser(LocalStorage.get('users'));
      setpageAccess(LocalStorage.get('pageAccess'));
      setbranchAccess(LocalStorage.get('branchAccess'));
      settoken(localStorage.getItem('token') || '');
      setcurrentBranch({branch_id : LocalStorage.get('users').branch_id , branch_name : LocalStorage.get('users').branch_name})
      setccurrentEntity(LocalStorage.get('users').entity_id)
    }
  }, [])


  const handleRerender = () => { 
    setrender(false);
    setTimeout(() => {
      setrender(true)
    }, 1);
  }

  useEffect(() => {
    handleRerender();
  }, [currentBranch, currentEntity]);

  useEffect(() => {
    setglobalBranch(currentBranch.branch_id);
  }, [currentBranch])

  useEffect(() => {
    setGlobalEntity(currentEntity);
  }, [currentEntity])

  useEffect(() => {
    requestHandler(
      async () => {
        return await getBranchByEntity();
      },
      (data) => {
        if (data.success) {
          setbranchAccess(data.data)
        }
      },
      (errorMessage) => {
        console.log(errorMessage);
        
      }
    );
  }, [currentEntity])

  useEffect(() => {
    if (user?.entity_id)
      setGlobalEntity(user.entity_id)
  }, [user])

  // useEffect(() => {
  //   if(user == null){
  //     signout(()=>{navigate('/login')})
  //   }
  // },[user])


  let value = { user, signin, signout, pageAccess, branchAccess, token, currentBranch, setcurrentBranch, currentEntity, setccurrentEntity, setUser, setpageAccess, setbranchAccess, settoken, handleRerender };

  return (
    <AuthContext.Provider value={value}>{render && children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// const fakeAuthProvider = {
//     isAuthenticated: false,

//     login(callback: VoidFunction) {
//         fakeAuthProvider.isAuthenticated = true;
//         setTimeout(callback, 100); // fake async
//     },

//     signout(callback: VoidFunction) {
//         fakeAuthProvider.isAuthenticated = false;
//         setTimeout(callback, 100);
//     },
// };

// export { fakeAuthProvider };


// data
// .filter((roles) => role.role_name !== 'super Admin')
// .map(role)=>
//   { return <option value={role.role_id}>{role.role_name}</option> }