import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/Login/Login';
import { RequireAuth } from './components/AuthMiddleware';
import MainLayout from './components/MainLayout/MainLayout';
import Demo from './pages/Demo';
import About from './pages/About';
import Profile from './pages/Profile';
import { useEffect, useRef, useState } from 'react';
import { axios } from './utils/axios';
import Loader from './components/Loader';
import Entity from './pages/Entity';
import Roles from './pages/Roles';
import Pages from './pages/Pages';
import Branch from './pages/Branch';
import NotFound from './pages/NotFound';
import Users from './pages/Users';
import UploadImage from './pages/UploadImage';
import ChangePassword from './pages/changePassword';
import Designation from './pages/Designation';
import { toastError } from './utils/SweetAlert';
import Home from './pages/Home';
import PincodeMaster from './pages/PincodeMaster';
import { CountryMaster } from './pages/CountryMaster';
import { StateMaster } from './pages/StateMaster';
import { CityMaster } from './pages/CityMaster';
import { BankMaster } from './pages/BankMaster';

// import { CustomerProfile } from './pages/CustomerProfile';
// import PincodeMaster from './pages/PincodeMaster';

// let interceptorsSet = false;

export default function App() {
    const [loading, setloading] = useState(0);
    const { signout } = useAuth();
    const navigate = useNavigate();
    const interceptorsSet = useRef(false);

    useEffect(() => {
        if (!interceptorsSet.current) {
            axios.interceptors.request.use(
                (config) => {
                    setloading(prev => (prev+1));
                    console.log('load');
                    
                    return config;
                },
                (error) => {
                    return Promise.reject(error);
                }
            );

            axios.interceptors.response.use(
                (res) => {
                    setloading(prev => (prev - 1));
                    // console.log(res, 'axios response');
                    return res;
                },
                (error) => {
                    setloading(prev => (prev - 1));
                    if (
                        error.response.status == 500 &&
                        error.response.data.code == 120 &&
                        window.location.pathname != '/login'
                    ) {
                        signout(() => {
                            navigate('/login');
                        });
                        toastError.fire({
                            title:  error.response.data.message,
                        });
                    }
                     else {
                        return Promise.reject(error);
                    }
                }
            );

            interceptorsSet.current = true;
        }
    }, []);

    useEffect(() => {
      console.log(loading , 'loading');
    }, [loading])
    

    return (
        <>
            {loading > 0 && <Loader></Loader>}
            {/* <Nav/> */}
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/about" element={<About />} />

                <Route element={<MainLayout />}>
                    <Route
                        path="/demo"
                        element={
                            <RequireAuth>
                                <Demo />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <RequireAuth>
                            <Home />
                            </RequireAuth> 
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <RequireAuth>
                                <div>settings</div>
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <RequireAuth>
                                <Profile />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/entity"
                        element={
                            <RequireAuth>
                                <Entity />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/roles"
                        element={
                            <RequireAuth>
                                <Roles />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/pages"
                        element={
                            <RequireAuth>
                                <Pages />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/branch"
                        element={
                            <RequireAuth>
                                <Branch />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/users"
                        element={
                            <RequireAuth>
                                <Users />
                            </RequireAuth>
                        }
                    />
                 

                    <Route path="/uploadImage" element={<UploadImage />} />
                   

                    <Route
                        path="/changePassword"
                        element={
                            <RequireAuth>
                            <ChangePassword />
                            </RequireAuth>
                        }
                    ></Route>

                    <Route
                        path="/designation"
                        element={
                            <RequireAuth>
                                <Designation />
                            </RequireAuth>
                        }
                    ></Route>

              

                    <Route
                        path="/pincodemaster"
                        element={
                            <RequireAuth>
                                <PincodeMaster />
                            </RequireAuth>
                        }
                    ></Route>
                   
                   <Route
                        path="/country"
                        element={
                            <RequireAuth>
                                <CountryMaster />
                            </RequireAuth>
                        }
                    ></Route>
                     <Route
                        path="/state"
                        element={
                            <RequireAuth>
                                <StateMaster />
                            </RequireAuth>
                        }
                    ></Route>
                      <Route
                        path="/city"
                        element={
                            <RequireAuth>
                                <CityMaster />
                            </RequireAuth>
                        }
                    ></Route>
                    
                           <Route
                        path="/bank"
                        element={
                            <RequireAuth>
                                <BankMaster />
                            </RequireAuth>
                        }
                    ></Route>

                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}
