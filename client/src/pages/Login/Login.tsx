import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';
import { useEffect, useState } from 'react';
import { toastError } from '../../utils/SweetAlert';
// import cms from '../../../public/cms.png';
import app from '../../../public/apple-touch-icon.png'
import logo from '../../../public/ar-logo1.png';
import axios from 'axios';
import { baseURL } from '../../utils/axios';
import Swal from 'sweetalert2';

class loginInputType {
    user_name: string = '';
    password: string = '';
}

export function LoginPage() {
    let navigate = useNavigate();
    let location = useLocation();
    let auth = useAuth();

    const [loginType, setloginType] = useState<'forAdmin' | 'forStudents'>('forAdmin');
    const [data, setdata] = useState<loginInputType>(new loginInputType());
    const [running, setRunning] = useState<boolean>(false);

    let from = location.state?.from?.pathname || '/';

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setRunning(true);
        
        // Check for active session before submitting login
        axios.post(baseURL + "/user/check-active-session", { user_name: data.user_name })
            .then(res => {
                if (res.data.hasActiveSession) {
                    // Show SweetAlert popup if there's an active session
                    Swal.fire({
                        title: 'Active Session Detected',
                        text: 'You are already logged in on another device. Do you wish to force logout and continue?',
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No',
                        reverseButtons: true,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            axios.post(baseURL + "/user/force-logout", { user_name: data.user_name })
                                .then(() => {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Logged Out',
                                        text: 'Successfully logged out from the other device.',
                                    }).then(() => {
                                        handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>);
                                    });
                                })
                                .catch(err => {
                                    toastError.fire({
                                        title: err.message
                                    });
                                    setRunning(false);
                                });
                        } else {
                            setRunning(false);
                        }
                    });
                } else {
                    // No active session, proceed to login
                    axios.post(baseURL + "/user/login", data).then(res => {
                        if (res.data.statusCode === 401) {
                            toastError.fire({
                                title: res.data.message
                            });
                            setRunning(false);
                            return;
                        }
                        auth.signin(res.data.data, () => {
                            navigate(from, { replace: true });
                        });
                        setRunning(false);
                    }).catch(err => {
                        toastError.fire({
                            title: err.message
                        });
                        setRunning(false);
                    });
                }
            }).catch(err => {
                toastError.fire({
                    title: err.message
                });
                setRunning(false);
            });
    }

    useEffect(() => {
        if (auth.user != null) {
            navigate(from, { replace: true });
        }
    }, [auth.user, from, navigate]);

    return (
        <div className="login_main_container">
            <div className={`login_container ${loginType === "forStudents" && "right-panel-active"}`} id="login_container">
                <div className={`form-container sign-in-container ${loginType}`}>
                    <form action="#" onSubmit={handleSubmit}>
                        <h1 className="login">User Login</h1>
                        <input
                            type="text"
                            placeholder="username"
                            name="user_name"
                            onChange={(e) => {
                                setdata(prev => ({ ...prev, user_name: e.target.value }));
                            }}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={(e) => {
                                setdata(prev => ({ ...prev, password: e.target.value }));
                            }}
                        />
                        <button className="mt-3" disabled={running}>
                            {running && (
                                <div className="container">
                                    <div className="loadingspinner">
                                        <div id="square1"></div>
                                        <div id="square2"></div>
                                        <div id="square3"></div>
                                        <div id="square4"></div>
                                        <div id="square5"></div>
                                    </div>
                                </div>
                            )}
                            {!running ? "Login" : ""}
                        </button>
                    </form>
                </div>
                <div className={`form-container sign-up-container ${loginType}`}>
                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1 className="brand">Campus Meal Management</h1>
                            <p>Efficient Meal Management For Campus Communities</p>
                            <button onClick={() => setloginType("forAdmin")} className="ghost" id="signIn">
                                Login as admin
                            </button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <div>
                                <img className="w-[25%] mx-auto rounded logoo" src={logo} alt="" />
                                <h1 className="brand"> Masters management</h1>
                                {/* <p>Streamlined Operation For Optimal Efficiency</p> */}
                            </div>
                            <img src={app} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
